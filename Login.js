import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

const handleGoToDashboard = () => {
    navigation.navigate('Dashboard');
  };
export function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = () => {
      console.log('Email:', email);
      console.log('Password:', password);
    };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t1.15752-9/364409165_298245242765459_1939857550581027986_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeGH8ceYN0OHIYcmDG7ZPRrgbO7D2w_v0Fds7sPbD-_QV4P_uFjgu3QI2_YGKamA-1PwUOPMWVoEcFSM2q3jFaWo&_nc_ohc=yzRgVQ2QvdUAX90hfND&_nc_ht=scontent.fceb2-1.fna&oh=03_AdSsZ8kD8a0pAH3cUE5zmTWuBKi3fAOrdz-39PExaEWJQg&oe=64EEF0DB',
        }}
        style={styles.image}
      />
       <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText} onPress={handleGoToDashboard}>Login</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
    fontFamily:'Courier New'
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily:'Courier New',
    backgroundColor:'#FFFFFF'
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

export default LoginScreen;
