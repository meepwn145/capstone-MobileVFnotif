import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function PaypalForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    // For example, you can perform some validation or submit the form data to a server
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.header}>Payment Confirmation</Text>
      <Text style={styles.label}>Payment to:</Text>
      <Text style={styles.merchant}>Example Merchant</Text>
      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.amount}>$100.00</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.emailText}>johndoe@example.com</Text>
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.passwordInput}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  merchant: {
    fontSize: 18,
    marginBottom: 20,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
    textDecorationLine: 'underline',
    color: 'blue',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
