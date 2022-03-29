import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
      buttonText: "Lock"
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

  navigate = () => {
    this.props.navigation.navigate('Devices')
  }

  onRegionChange = (region) => {
    this.setState({ region });
  } 

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
    borderRadius: 50/2,
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
    borderRadius: 20/2,
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
    height: 75,
    marginHorizontal: 20
  },
  locksbutton: {
    alignItems: 'center',
    marginTop: 625,
    paddingVertical: 25,
    borderRadius: 10,
    width: 125,
    height: 75,
    backgroundColor: 'grey',
    marginHorizontal: 20
  },
});
