import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function ParkScreen() {
  const navigation = useNavigation();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const timerDuration = 30;
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
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Parking</Text>
      </View>
      <Text style={styles.para}>Parking Fee: 30 PHP</Text>
      <View style={styles.imageContainer}>
        {loadingComplete && renderTimeUpButton()}
        <Image source={require('./images/car.png')} style={styles.image} />
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
    padding: 20,
    alignItems: 'stretch',
  },
  prog: {
    textAlign: 'center',
    fontSize: 18,
  },
  para: {
    marginTop: 25,
    color: 'black',
    marginBottom: 10,
    fontSize: 24,
    fontWeight:'bold',
  },
  navbar: {
    backgroundColor: 'black',
    padding: 10,
    height: 80,
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
    borderRadius: 10,
    marginTop: 10,
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
    width: 300,
    height: 300,
    resizeMode: 'contain',
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
    marginTop: 30,
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 5,
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonTimeUp: {
    backgroundColor: 'red',
  },
});

export default ParkScreen;
