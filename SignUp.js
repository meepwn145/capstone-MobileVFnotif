import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

export function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    console.log('Name:', name);
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
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
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
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor:'#FFFFFF',
    fontFamily:'Courier New'
  },
  button: {
    backgroundColor: '#3b89ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop:20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily:'Courier New'
  },
});
export default SignupScreen;