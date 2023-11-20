import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

export function Start({ navigation }) {
  const handleGoToDashboard = () => {
    navigation.navigate('Next');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./images/busy.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          
          <Text style={styles.startText}>Find a suitable parking area near your location</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoToDashboard}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  startText: {
    color: '#E9DBBD',
    fontSize: 20, 
    marginTop: 20,
    fontFamily: 'Courier New',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A08C5B',
    borderRadius: 5,
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Courier New',
    textAlign: 'center',
  },
});

export default Start;