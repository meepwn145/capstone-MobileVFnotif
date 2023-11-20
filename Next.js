import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AnimatedCarScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigate to another page after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
        <Image
           source={require('./images/next-background.jpg')}
           style={styles.backgroundImage}
           />
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // or any color that matches your design
  },
  text: {
    marginTop: 20,
    fontSize: 15,
    color: 'black', // You can change the color to match your design
    fontFamily: 'Courier New',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // Makes the background fill the entire screen
    width: '100%',
    height: '100%',
    resizeMode: 'cover' // Ensures that the background image covers the entire screen
  },
});
