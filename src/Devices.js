import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export class Devices extends React.Component {
    constructor(props) {
        super(props);
    }

    scanDevices = () => {

    }

    navigateBack = () => {
        this.props.navigation.navigate('Home')
    }

    render() {
        return (
            <View style={styles.body}>
                <View style={styles.headerContainer}>
                    <Button title="Back" onPress={this.navigateBack}></Button>
                </View>
                <View style={styles.mainContainer}>
                    <Button title="Scan Devices" onPress={this.scanDevices} />
                </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        marginTop: 30,
        backgroundColor: Colors.red,
        flex: 1,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        paddingHorizontal: 24,
    },
    mainContainer: {
        bottom: 370,
    }
})