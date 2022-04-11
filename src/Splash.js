import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

export class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasRetrievedLockValue: false,
            lockedStatus: null
        };
        this.fetchInterval = null;
    }

    componentDidMount() {
        this.fetchLockStatus();
    }

    componentWillUnmount() {
        clearInterval(this.fetchInterval);
    }   

    fetchLockStatus = async () => {
        fetch('https://cyber-cycle-lock-server.herokuapp.com/api/locked-status')
        .then(response => response.json())
        .then(data => {
            this.setState({
                hasRetrievedLockValue: true,
                lockedStatus: data["locked-status"]
            });
        })
      }
    
    navigateHome = () => {
        if (this.state.hasRetrievedLockValue) {
            this.props.navigation.navigate('Home', {lockedStatus: this.state.lockedStatus});
        }
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
                        this.fetchInterval = setInterval(this.navigateHome, 1000);
                    }}
                />
            </View>
        )
    }
}