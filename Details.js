import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetailsScreen({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Parking Information</Text>
      </View>
      <View style={styles.containerUnderNavbar}>
      <Text style={styles.para}>{item.name}</Text>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style= {styles.para}>Located at</Text>
        <Text style={styles.address}>{item.companyAddress}</Text>
        <Text style={styles.para2}>Available Parking Space: {item.numberOfParkingLots}</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.button}>
        <Text style={styles.buttonText}>Direction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  containerUnderNavbar: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  para2: {
    marginTop: 30,
    fontSize: 18,
  },
  para: {
    marginTop: 10,
    fontSize: 18,
    marginBottom: 30,
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
  address: {
    color: 'gray',
    fontSize: 15,
  },
});
