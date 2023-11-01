import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export function Start({ navigation }) {
  const handleGoToDashboard = () => {
    navigation.navigate('Next');
  };

  return (
    <View style={styles.container}>
      <Image
       source={require('./images/Start.png')}
        style={styles.image}
      />
      <Text style={styles.startText}>Find a suitable parking area near your location</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoToDashboard}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  startText: {
    color: '#E9DBBD',
    fontSize: 15,
    marginTop: 40,
    fontFamily:'Courier New',
    textAlign:'center'
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A08C5B',
    borderRadius: 5,
    marginTop: 40
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Courier New',
    textAlign:'center',
  },
});

export default Start;
