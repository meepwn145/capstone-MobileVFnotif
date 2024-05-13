import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function ParkScreen() {
  const navigation = useNavigation();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const timerDuration = 30  ;
    let currentTime = 0;

    const interval = setInterval(() => {
      currentTime++;
      const percentage = (currentTime / timerDuration) * 100;
      setLoadingPercentage(percentage);

      if (currentTime >= timerDuration) {
        clearInterval(interval);
        setLoadingComplete(true);
      }
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const handleTimeUpButtonClick = () => {
    navigation.navigate('Transaction');
  };

  const renderTimeUpButton = () => {
    if (loadingComplete) {
      return (
        <View>
          <Text style={styles.timeUpText}>Time is up!</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      
    <Image
  
  source={{ uri: 'https://i.imgur.com/WwPGlNh.png' }}
    style={styles.backgroundImage}
  />
  <Image
     source={{ uri: 'https://i.imgur.com/Tap1nZy.png' }}
    style={[styles.backgroundImage, { borderTopLeftRadius: 130, marginTop: 100}]}
  />

      <Text style={styles.para}>Parking Fee: 30 PHP</Text>
      <View style={styles.imageContainer}>
  {loadingComplete && renderTimeUpButton()}
  <Image   source={{ uri: 'https://i.imgur.com/9rK5Pk2.gif' }} style={styles.image} />
        <View 
        style={[styles.loadingLine, { width: `${loadingPercentage}%` }]} />
      </View>
      <Text style={styles.prog}>Parking Progress</Text>
      {loadingComplete && (
        <TouchableOpacity
          style={[styles.button, styles.buttonTimeUp]}
          onPress={handleTimeUpButtonClick}
        >
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prog: {
    marginBottom: '5%',
    textAlign: 'center',
    fontSize: 18,
  },
  para: {
    marginTop: '40%',
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
    fontSize: 24,
    fontWeight:'bold',
  },
  navbarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    marginTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#003851',
    padding: 10,
    borderRadius: 100,
    width: '50%',
    marginBottom: '20%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    marginTop: '-35%', // Adjust the position as needed
    width: '90%', // Adjust the width as needed
    height: '70%', // Adjust the height as needed
    alignSelf: 'center', // Center the image horizontally
    resizeMode: 'contain', // Maintain aspect ratio without stretching
    borderRadius: 10, // Apply a border radius
    borderWidth: 1, // Add a border for better visibility
    borderColor: '#ddd', // Border color
  },
  loadingLine: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    height: 5,
    backgroundColor: 'green',
  },
  timeUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeUpText: {
    marginBottom: '40%',
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonTimeUp: {
    backgroundColor: 'red',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, 
    width: '100%',
    height: '100%',
    resizeMode: 'cover' 
  },
  cardContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});


export default ParkScreen;
