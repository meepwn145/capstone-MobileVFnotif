import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Notifications() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Notifications</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Read Message</Text>
        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={3}
          placeholder="You have successfully paid 30php on Country Mall Gaisano Parking Lot."
        />
        <Text style={styles.label}>Unread Message</Text>
        <TextInput
          style={[styles.textarea, { color: 'blue' }]}
          multiline
          numberOfLines={3}
          placeholder="Your parking session has expired. Move your vehicle outside the parking area to avoid penalties."
          placeholderTextColor="blue" 
        />
        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={3}
          placeholder="Don't forget where you parked! Your car is in Zone A, Level 2, Slot 15."
          placeholderTextColor="blue" 
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  content: {
    marginTop: 20, 
    flex: 1,
  },
  label: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textarea: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20, 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
