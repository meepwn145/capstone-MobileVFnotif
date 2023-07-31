import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const handleCardClick = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
        <Image
        source={{
          uri: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t1.15752-9/364409165_298245242765459_1939857550581027986_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeGH8ceYN0OHIYcmDG7ZPRrgbO7D2w_v0Fds7sPbD-_QV4P_uFjgu3QI2_YGKamA-1PwUOPMWVoEcFSM2q3jFaWo&_nc_ohc=yzRgVQ2QvdUAX90hfND&_nc_ht=scontent.fceb2-1.fna&oh=03_AdSsZ8kD8a0pAH3cUE5zmTWuBKi3fAOrdz-39PExaEWJQg&oe=64EEF0DB',
        }}
        style={styles.image}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#ACC8E5' }]}
          onPress={() => handleCardClick('Settings')}
        >
          <AntDesign name="setting" size={20} color="#002535" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#ACC8E5' }]}
          onPress={() => handleCardClick('Profile')}
        >
          <AntDesign name="user" size={20} color="#002535" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#ACC8E5' }]}
          onPress={() => handleCardClick('Search')}
        >
          <AntDesign name="search1" size={20} color="#002535" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#ACC8E5' }]}
          onPress={() => handleCardClick('Map')}
        >
          <AntDesign name="enviroment" size={20} color="#002535" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#ACC8E5' }]}
          onPress={() => handleCardClick('Notifications')}
        >
          <AntDesign name="notification" size={20} color="#002535" />
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
    padding: 20,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3b89ac',
  },
  footerButton: {
    marginTop: 10,
    flex: 1,
    aspectRatio: 8 / 7,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: 10,
  },
  cardText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});