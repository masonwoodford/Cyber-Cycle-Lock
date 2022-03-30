import { StyleSheet, Text, View, TouchableOpacity, Alert, Button } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import MapView from 'react-native-maps';

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      buttonBackgroundColor: "red",
      buttonText: "Lock",
      token: null,
    }
  }

  toggle = () => {
    this.setState({
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
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

  onRegionChange = (region) => {
    this.setState({ region });
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
          onRegionChange={this.onRegionChange}
        >
          <MapView.Marker
            coordinate={{        
              latitude: region.latitude,
              longitude: region.longitude
            }}>
              <View style={styles.radius}>
                <View style={styles.marker} />
              </View>
          </MapView.Marker>
        </MapView>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
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
          <Button title="testButton" onPress={this.alarmNotify} color="red"/>
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
    left: 15,
    right: 15,
    top: 90,
    bottom: 145,
    position: 'absolute',
  },
  lockbutton: {
    alignItems: 'center',
    marginTop: 625,
    paddingVertical: 25,
    borderRadius: 10,
    width: 125,
    height: 70,
    marginHorizontal: 20
  },
  locksbutton: {
    alignItems: 'center',
    marginTop: 625,
    paddingVertical: 25,
    borderRadius: 10,
    width: 125,
    height: 70,
    backgroundColor: 'grey',
    marginHorizontal: 20
  },
});
