import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import ProfileScreen from './Profile';
import SettingsScreen from './Setting';
import NotificationsScreen from './Notification';
import SearchScreen from './Search';
import MapsScreen from './Map';

const Stack = createNativeStackNavigator();

function DashboardScreen({ navigation }) {
  const handleCardClick = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>
          SpotWise Parking Management System
        </Text>
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}></Text>
        </View>
      </View>

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
          style={[styles.footerButton, { backgroundColor: '#ACC8E5',  }]}
          onPress={() => handleCardClick('Search')}
        >
          <AntDesign name="search1" size={20} color="#002535" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#ACC8E5',  }]}
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Map" component={MapsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b89ac',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003851',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: '10px',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Courier New'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    color: '#fff',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    aspectRatio: 8/7,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: '10px',
  },
  cardText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});