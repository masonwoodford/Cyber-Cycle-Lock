import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    }
  }

  onRegionChange = (region) => {
    this.setState({ region });
  } 

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          <MapView.Marker
            coordinate={{        
              latitude: 37.78825,
              longitude: -122.4324
            }}>
              <View style={styles.radius}>
                <View style={styles.marker} />
              </View>
          </MapView.Marker>
        </MapView>
        <TouchableOpacity 
          style={styles.lockbutton}
        >
          <Text style={{color: "white"}}>Lock</Text>
        </TouchableOpacity>
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
    top: 175,
    bottom: 145,
    position: 'absolute',
  },
  lockbutton: {
    alignItems: 'center',
    marginTop: 625,
    backgroundColor: '#FF0000',
    paddingVertical: 25,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
});
