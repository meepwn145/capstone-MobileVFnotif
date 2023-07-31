import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Start } from './Start';
import DashboardScreen from './Dashboard';
import ProfileScreen from './Profile';
import SettingsScreen from './Setting';
import NotificationsScreen from './Notification';
import SearchScreen from './Search';
import MapsScreen from './Map';
import NextScreen from './Next';
import LoginScreen from './Login';
import SignUpScreen from './SignUp';
import Profs from './Profiles'
import FeedbackScreen from './Feedback'

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Map" component={MapsScreen} />
        <Stack.Screen name="Next" component={NextScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profiles" component={Profs} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
