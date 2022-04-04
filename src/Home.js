import { StyleSheet, Text, View, TouchableOpacity, Alert, Button } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import MapView, {Callout, Marker } from 'react-native-maps';

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 14.058324,
        longitude: 108.277199,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      buttonBackgroundColor: "red",
      buttonText: "Lock",
      token: null,
    }
  }

  getDataFromServer = () => {
    fetch(
      'https://cyber-cycle-lock-server.herokuapp.com/', {
    })
    .then(response => {
      //console.log('Success: ', JSON.stringify(response));
      //this.setState({
      //  region: {
      //    latitude: response.latitude,
      //    longitude: response.longitude,
      //    latitudeDelta: 0.0922,
      //    longitudeDelta: 0.0421,
       // }
      //})
    })
    .catch ((error) => {
      console.error('Error: ', error);
    });
  };

  toggle = () => {
    this.setState({
      buttonBackgroundColor: this.state.buttonBackgroundColor === "red" ? "green" : "red",
      buttonText: this.state.buttonText === "Unlock" ? "Lock" : "Unlock"
    });
  }

  componentDidMount() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    this.registerForPushNotificationsAsync();
    setInterval(() => {
      this.getDataFromServer();
    }, 3000);
  }

  registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.setState({ expoPushToken: token });
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

  alarmNotify = async () =>{
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ALERT",
        body: 'Bike has been tampered with. Tap to locate.',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 1 },
    }).catch(err => console.log(err));
  }

  navigate = () => {
    this.props.navigation.navigate('Devices')
  }

  createAlarm = () =>
  Alert.alert(
    "ALERT",
    "Lock has been tampered with",
    [
      { text: "Locate" }
    ]
  );

  render() {
    const {region, buttonBackgroundColor, buttonText} = this.state
    const colorStyles = {
      backgroundColor: buttonBackgroundColor
    }
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          region={region}
        >
          <Marker
            coordinate={{        
              latitude: region.latitude,
              longitude: region.longitude
            }}
            onSelect={(e) => console.log("Marker selected")}
            onPress={(e) => console.log("Marker selected")}
            image={require('../assets/map_marker.png')}
            >
              <Callout>
                <View>
                  <View style={styles.bubble}>
                    <Text>Description</Text>
                  </View>
                </View>
              </Callout>
          </Marker>
        </MapView>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
          <TouchableOpacity 
            style={[styles.lockbutton, colorStyles]}
            onPress={this.toggle}
          >
            <Text style={{color: "white"}}>{buttonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.locksbutton}
            onPress={this.navigate}
          >
            <Text style={{color: "white"}}>Devices</Text>
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
  radius: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#007AFF'
  },
  map: {
    alignItems: 'center',
    left: 15,
    right: 15,
    bottom: 145,
    height: 600,
    position: 'absolute',
  },
  lockbutton: {
    alignItems: 'center',
    paddingVertical: 25,
    borderRadius: 10,
    top: 325,
    width: 125,
    height: 70,
    marginHorizontal: 20
  },
  locksbutton: {
    alignItems: 'center',
    paddingVertical: 25,
    top: 325,
    borderRadius: 10,
    width: 125,
    height: 70,
    backgroundColor: 'grey',
    marginHorizontal: 20
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
  },
});
