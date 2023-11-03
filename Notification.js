import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from './config/firebase';


export default function Notifications() {
  const navigation = useNavigation();
  const [parkingLocation, setParkingLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [parkingStatus, setParkingStatus] = useState('');

  useEffect(() => {
    // Attach the auth state change listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.email;
        // Construct the query for the latest parking location
        const q = query(collection(db, 'logs'), where('email', '==', userID), orderBy('timestamp', 'desc'), limit(1));
  
        // Listen for changes on the latest parking location
        const unsubscribeLogs = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setParkingLocation(data.managementName);
            setParkingStatus(data.paymentStatus);
            
            // Check the payment status and notify the user if pending
            if (data.paymentStatus === 'Pending') {
              // Notify the user
              
            }
            else if (data.paymentStatus === 'Paid'){
                alert("Please disregard the notification since your payment has already settled.")
            }
          } else {
            setParkingLocation('No parking record found.');
          }
          setLoading(false);
        }, (err) => {
          console.error(`Encountered error: ${err}`);
          setLoading(false);
        });
  
        // Detach the logs listener when the component unmounts or auth state changes
        return () => unsubscribeLogs();
      } else {
        setParkingLocation('User is not logged in.');
        setLoading(false);
      }
    });
  
    // Detach the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

   return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Notifications</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.notificationText}>
          {parkingLocation
            ? `You have parked at ${parkingLocation}.`
            : "You don't have any parking records."}
        </Text>
        <Text style={styles.notificationText}>
          {parkingLocation
            ? `You have a ${parkingStatus} payment status at ${parkingLocation} Parking Establishment.`
            : "You don't have any parking records."}
        </Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  notificationText: {
    fontSize: 16,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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