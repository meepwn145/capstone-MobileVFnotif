import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

const Background = ({ children }) => {

    return (
        <View>
            <ImageBackground source={require("./images/parking2.jpg")} style ={{height: '100%'}}/>
        <View>
            {children}
            </View>
        </View>
    )
}
export default Background;