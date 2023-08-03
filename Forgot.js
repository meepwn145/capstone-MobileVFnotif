import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const ForgotScreen = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(null);
  
    const handleResetPassword = () => {
      if (!isEmailValid(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
  
      const code = generateVerificationCode();
      setVerificationCode(code);
      Alert.alert('Verification Code Sent', `A verification code has been sent to ${email}`);
    };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Reset Password</Text>
      </View>
      <Text style={styles.label}>Enter your email address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send verification code" onPress={handleResetPassword} />
      {verificationCode && (
        <View style={styles.codeForm}>
          <Text style={styles.codeLabel}>Enter the 6-digit code:</Text>
          <TextInput
            style={styles.codeInput}
            placeholder="Verification Code"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
},
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    marginTop: 50,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
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
  codeForm: {
    marginTop: 20,
    alignItems: 'center',
  },
  codeLabel: {
    marginBottom: 5,
    fontSize: 16,
  },
  codeInput: {
    width: 120,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ForgotScreen;
