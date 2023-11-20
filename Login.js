import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoToDashboard = (user) => {
    navigation.navigate('Profiles', { user });
};

  const handleForgotPassword = () => {
    navigation.navigate('Forgot');
  };

  const handleLogin = async () => {
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Safety check to ensure user exists in the userCredential
      if (!userCredential || !userCredential.user) {
        console.error('User not found in userCredential');
        return;
      }
  
      const { user } = userCredential;
      console.log('Authentication successful for UID:', user.uid);
  
  
      const userDocRef = doc(db, "user", user.uid);
  
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
    
        navigation.navigate('Dashboard', { user: userData });
      } else {
        console.error(`No user data found in Firestore for user: ${user.uid}`);
      }
    } catch (error) {
      
      console.error('Error logging in:', error.message || error);
  
    }
  };

  const handleGoToSignIn = () => {
    navigation.navigate('SignUp');
  };
  
  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Image
           source={require('./images/login2-background.jpg')}
           style={styles.backgroundImage}
           />
    <View style={styles.formContainer}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={handleRememberMe} style={styles.checkbox}>
          {rememberMe && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Remember me</Text>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button2} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGoToSignIn}>
      <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
        <Text style={styles.socialButtonText}>
        <Image
       source={require('./images/facebook.png')}
        style={styles.logo}
        />
          Continue with Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.socialButton,{ backgroundColor: '#1DA1F2' }]}>
        <Text style={styles.socialButtonText}>
        <Image
           source={require('./images/google.png')}
           style={styles.logo2}
           />
          Continue with Google</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
    marginTop: 100,
    fontFamily: 'Courier New',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 20,
    borderWidth: 1, 
    borderColor: '#c0c0c0', 
    fontFamily: 'Courier New',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#3b89ac',
  },
  rememberMeText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Courier New',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#96DED1',
    fontFamily: 'Courier New',
    
  },
  button: {
    backgroundColor: '#3b89ac',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  button2: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Courier New',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  orText: {
    marginHorizontal: 10,
    color: '#fff',
    marginBottom: 20,
  },
  socialButton: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Courier New',
  },
  logo: {
    width: 15,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    alignItems:'left',
  },
  logo2: {
    width: 15,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    alignItems:'left',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // Makes the background fill the entire screen
    width: '100%',
    height: '100%',
    resizeMode: 'cover' // Ensures that the background image covers the entire screen
  },
});

export default LoginScreen;