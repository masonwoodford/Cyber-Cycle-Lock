import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export class Devices extends React.Component {
    constructor(props) {
        super(props);
    }

    scanDevices = () => {

    }
    
    render() {
        return (
            <View style={styles.body}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Current Devices</Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Button title="Scan devices" onPress={this.scanDevices} />
                </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        marginTop: 30,
        backgroundColor: Colors.red
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
})