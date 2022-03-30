import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

export class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <LottieView 
                    autoPlay 
                    loop={false}
                    style={{
                        width: 400,
                        height: 400,
                    }}
                    speed = {0.9}
                    source={require('../assets/splash.json')}
                    onAnimationFinish = {() => {
                        setTimeout(() => this.props.navigation.navigate('Home'))
                    }}
                />
            </View>
        )
    }
}