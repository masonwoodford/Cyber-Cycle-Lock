import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import MapView, {Callout, Marker} from 'react-native-maps';

const fullBattery = require('../assets/full-battery.png');
const midBattery = require('../assets/mid-battery.png');
const lowBattery = require('../assets/low-battery.png');
const axios = require('axios');

const server_address = 'https://cyber-cycle-lock-server.herokuapp.com/api/';
// const server_address = 'http://localhost:8080/api/';

let shouldUpdateLockState = true;
let waitForLockStateToBe = '';
let sendOnce = true;

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.markers = [];
    this.state = {
      region: {
        latitude: 14.058324,
        longitude: 108.277199,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      token: null,
      batteryLevel: '100%',
      batteryImage: fullBattery,
      buttonBackgroundColor: 'grey',
      buttonText: this.props.route.params.lockedStatus ? 'Unlock' : 'Lock',
      lockState: null,
    };
    this.dataInterval = null;
  }

  getDataFromServer = () => {
    fetch(`${server_address}location/`)
      .then((response) => response.json())
      .then((data) => {
        console.log('location: ', data.latitude, data.longitude);
        this.setState({
          region: {
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
          },
        });
      })
      .catch((error) => console.log('Error 1: ', error));

    axios
      .get(`${server_address}alarm/`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        if (data['alarm'] == 'true') {
          //console.log('ALARM TRIGGERED');
          if (sendOnce) {
            this.alarmNotify();
            sendOnce = false;
          }
        } else if (data['alarm'] == 'false') {
          sendOnce = true;
        }
      })
      .catch((error) => console.log('error 2:', error));

    axios
      .get(`${server_address}lock-status/`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        // TODO
        // if (shouldUpdateLockState == false) {
        //   if (data['lock-status'] == waitForLockStateToBe) {
        //     shouldUpdateLockState = true;
        //   } else {
        //     return;
        //   }
        // }

        if (data['lock-status'] == 'locked') {
          this.setState({
            buttonBackgroundColor: 'red',
          });
        }
        if (data['lock-status'] == 'unlocked') {
          this.setState({
            buttonBackgroundColor: 'green',
          });
        }

        this.setState(
          {
            lockState: data['lock-status'],
          },
          () => {
            console.log('lock status set to: ', data['lock-status']);
          }
        );
      })
      .catch((error) => console.log('error 2:', error));
  };

  //console.log('Success: ', JSON.stringify(response));
  //this.setState({
  //  region: {
  //    latitude: response.latitude,
  //    longitude: response.longitude,
  //    latitudeDelta: 0.0922,
  //    longitudeDelta: 0.0421,
  //  batteryLevel: response.batteryLevel,
  // }
  //})
  /*
      if (batteryLevel < 33) {
        this.setState({
          batteryImage: lowBattery,
        })
      } else if (batteryLevel < 66) {
        this.setState({
          batteryImage: midBattery,
        })
      } else {
        this.setState({
          batteryImage: lowBattery,
        })
      }
      */

  toggle = () => {
    console.log('recent queried lockState: ', this.state.lockState);

    let data;
    if (this.state.lockState == 'request-lock') {
      return;
    } else if (this.state.lockState == 'request-unlock') {
      return;
    } else if (this.state.lockState == 'unlocked') {
      this.setState({
        buttonBackgroundColor: 'grey',
        lockState: 'request-lock',
      });
      data = {'lock-status': 'request-lock'};
      waitForLockStateToBe = 'locked';
    } else if (this.state.lockState == 'locked') {
      this.setState({
        buttonBackgroundColor: 'grey',
        lockState: 'request-unlock',
      });
      data = {'lock-status': 'request-unlock'};
      waitForLockStateToBe = 'unlocked';
    } else {
      return;
    }

    shouldUpdateLockState = false;

    const config = {
      method: 'post',
      url: `${server_address}lock-status/`,
      headers: {},
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  componentDidMount() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    this.registerForPushNotificationsAsync();
    this.dataInterval = setInterval(() => {
      this.getDataFromServer();
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.dataInterval);
  }

  registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const {status: existingStatus} =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.setState({expoPushToken: token});
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  alarmNotify = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ALERT',
        body: 'Bike has been tampered with. Tap to locate.',
        data: {data: 'goes here'},
      },
      trigger: {seconds: 1},
    }).catch((err) => console.log(err));
  };

  navigate = () => {
    this.props.navigation.navigate('Devices');
  };

  createAlarm = () =>
    Alert.alert('ALERT', 'Lock has been tampered with', [{text: 'Locate'}]);

  render() {
    const {region, buttonBackgroundColor, token, batteryLevel, batteryImage} =
      this.state;

    let buttonText;
    if (this.state.lockState == 'request-lock') {
      buttonText = 'Locking...';
    } else if (this.state.lockState == 'request-unlock') {
      buttonText = 'Unlocking...';
    } else if (this.state.lockState == 'unlocked') {
      buttonText = 'Lock';
    } else if (this.state.lockState == 'locked') {
      buttonText = 'Unlock';
    } else {
      buttonText = 'Getting status...';
    }

    const colorStyles = {
      backgroundColor: buttonBackgroundColor,
    };
    return (
      <View style={styles.container}>
        <MapView style={styles.map} region={region}>
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            ref={(ref) => {
              this.markers[0] = ref;
            }}
            image={require('../assets/map_marker.png')}
          >
            <Callout onPress={() => this.markers[0].hideCallout()}>
              <View>
                <View style={styles.bubble}>
                  <Text style={{marginRight: 5}}>{batteryLevel}</Text>
                  <Image
                    source={batteryImage}
                    style={{width: 35, height: 35}}
                  />
                </View>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={[styles.lockbutton, colorStyles]}
            onPress={this.toggle}
          >
            <Text style={{color: 'white'}}>{buttonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.locksbutton} onPress={this.navigate}>
            <Text style={{color: 'white'}}>Devices</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    alignItems: 'center',
    left: 15,
    right: 15,
    bottom: 145,
    height: 595,
    position: 'absolute',
  },
  lockbutton: {
    alignItems: 'center',
    paddingVertical: 25,
    borderRadius: 10,
    top: 325,
    width: 125,
    height: 70,
    marginHorizontal: 20,
  },
  locksbutton: {
    alignItems: 'center',
    paddingVertical: 25,
    top: 325,
    borderRadius: 10,
    width: 125,
    height: 70,
    backgroundColor: 'grey',
    marginHorizontal: 20,
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    alignItems: 'center',
  },
});
