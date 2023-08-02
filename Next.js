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
       source={require('./images/SpotLogo.png')}
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
       source={require('./images/facebook.png')}
        style={styles.logo}
        />
         Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { marginLeft: 10}]}>
          <Text style={styles.buttonText}>
          <Image
           source={require('./images/google.png')}
           style={styles.logo}
           />
         Google</Text>
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
