import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export function NextScreen({ navigation }) {
  const handleGoToDashboard = () => {
    navigation.navigate('Dashboard');
  };
  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };
  const handleGoToSignIn = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t1.15752-9/364409165_298245242765459_1939857550581027986_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeGH8ceYN0OHIYcmDG7ZPRrgbO7D2w_v0Fds7sPbD-_QV4P_uFjgu3QI2_YGKamA-1PwUOPMWVoEcFSM2q3jFaWo&_nc_ohc=yzRgVQ2QvdUAX90hfND&_nc_ht=scontent.fceb2-1.fna&oh=03_AdSsZ8kD8a0pAH3cUE5zmTWuBKi3fAOrdz-39PExaEWJQg&oe=64EEF0DB',
        }}
        style={styles.image}
      />
       <TouchableOpacity style={styles.button} onPress={handleGoToLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGoToSignIn}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <Text style={styles.startText}>or log in</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
          <Image
            source={{
              uri: 'https://img.freepik.com/premium-vector/vinnitsyaukrainejanuary-24-2021facebook-vector-image-flat-icon-with-letter-f-blue-color-button-with-letter-isolated-white-background_736051-65.jpg', 
            }}
            style={styles.logo}
          />Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { marginLeft: 10}]}>
          <Text style={styles.buttonText}>
          <Image
            source={{
              uri: 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png', 
            }}
            style={styles.logo}
          />Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  startText: {
    color: 'white',
    fontSize: 15,
    marginTop: 40,
    fontFamily:'Courier New',
    textAlign:'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3b89ac',
    borderRadius: 5,
    marginTop: 10,
  },
  logo: {
    width: 15,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    alignItems:'left',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Courier New',
    textAlign:'center',
  },
});

export default NextScreen;
