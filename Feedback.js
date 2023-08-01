import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FeedbackScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Feedback</Text>
      </View>
        <Text style={styles.para}>Your feedback will help us to operate better. Please let us know what went wrong</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="name@example.com"
        keyboardType="email-address"
      />
      <Text>Message</Text>
      <TextInput
        style={styles.input}
        placeholder="Message"
        keyboardType="default"
        multiline
        numberOfLines={5} 
      />

      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.para}>The best praise you can give us it to share your experiences.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  para: {
    marginTop: 10,
    color: '#C0C0C0',
    marginBottom: 10,
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
});

export default FeedbackScreen;
