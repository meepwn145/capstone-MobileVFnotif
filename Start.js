import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export function Start({ navigation }) {
  const handleGoToDashboard = () => {
    navigation.navigate('Next');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t1.15752-9/364235122_799619608294146_8800638788154199028_n.png?_nc_cat=108&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeEN7A4FQHKIlj_q8ph_TiR2QOuJ28FYsANA64nbwViwA-HBc72N6oZbdjqI2xfpdD1OkoWpeWTmZWeETXZgiYuh&_nc_ohc=VypliUW_Cu0AX9APtQm&_nc_ht=scontent.fmnl4-3.fna&oh=03_AdQiYvLOqInboduwGQcrA52OopREtkVjw6w68iH43V1uUQ&oe=64EEECA4',
        }}
        style={styles.image}
      />
      <Text style={styles.startText}>Find a suitable parking area near your location</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoToDashboard}>
        <Text style={styles.buttonText}>Get Started</Text>
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
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3b89ac',
    borderRadius: 5,
    marginTop: 40
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Courier New',
    textAlign:'center',
  },
});

export default Start;
