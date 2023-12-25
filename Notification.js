import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot, deleteDoc, doc} from 'firebase/firestore';
import { db, auth } from './config/firebase';
import { Button } from 'react-native-elements';


export default function Notifications() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [parkingLogs, setParkingLogs] = useState([]);
  const [reserveLogs, setReserveLogs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const toggleSelection = (id) => {
    setSelectedId(selectedId === id ? null : id); // Toggle selection
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.email;
        // Construct the query for all parking logs for the user
        const q = query(collection(db, 'logs'), where('email', '==', userID), orderBy('timestamp', 'desc'));
  
        const unsubscribeLogs = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const logs = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                managementName: data.managementName,
                paymentStatus: data.paymentStatus,
                timestamp: data.timestamp, 
                timeIn: data.timeIn,
                timeOut: data.timeOut,
              };
            });
            setParkingLogs(logs);
          } else {
            setParkingLogs([]);
          }
          setLoading(false);
        }, (err) => {
          console.error(`Encountered error: ${err}`);
          setLoading(false);
        });
  
        return () => unsubscribeLogs();
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.email;
        // Construct the query for all parking logs for the user
        const q = query(collection(db, 'reservations'), where('email', '==', userID), orderBy('timestamp', 'desc'));
  
        const unsubscribeLogs = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const logs = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                managementName: data.managementName, 
                timestamp: data.timestamp, 
                slotId: data.slotId,
              };
            });
            setReserveLogs(logs);
          } else {
            setReserveLogs([]);
          }
          setLoading(false);
        }, (err) => {
          console.error(`Encountered error: ${err}`);
          setLoading(false);
        });
  
        return () => unsubscribeLogs();
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribeAuth();
  }, []);


  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const formatDuration = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return 'N/A';
  
    const start = new Date(timeIn.seconds * 1000);
    const end = new Date(timeOut.seconds * 1000);
    const duration = end - start;
  
    // Convert milliseconds to minutes
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    return `${hours}h ${remainingMinutes}m`;
  };

  const deleteNotification = async (id) => {
    try {
      // Delete the notification from the database
      await deleteDoc(doc(db, 'logs', id));
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteNotification2 = async (id) => {
    try {
      // Delete the notification from the database
      await deleteDoc(doc(db, 'reservations', id));
      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Parking Notification</Text>
      </View>
      <View style={styles.content}>
        {parkingLogs.length > 0 ? (
          parkingLogs.map((log) => (
            <TouchableOpacity
              key={log.id}
              style={styles.notification}
              onPress={() => toggleSelection(log.id)}
            >
              <Text style={styles.notificationText}>
                Parked at: {log.managementName}
              </Text>
              <Text style={styles.notificationText}>
                Payment Status: {log.paymentStatus}
              </Text>
              <Text style={styles.notificationText}>
                Duration: {formatDuration(log.timeIn, log.timeOut)}
              </Text>
              <Text style={styles.notificationDate}>
                Date: {new Date(log.timestamp.seconds * 1000).toLocaleDateString()} 
                {'\ '} {log.timeIn ? new Date(log.timeIn.seconds * 1000).toLocaleTimeString() : 'N/A'} {'\ '}
                {log.timeOut ? new Date(log.timeOut.seconds * 1000).toLocaleTimeString() : 'N/A'}
              </Text>
              {selectedId === log.id && (
                <TouchableOpacity
                  onPress={() => deleteNotification(log.id)}
                  style={styles.deleteButton}
                >
                    <Image 
                      source={require('./images/del.png')}
                      style={styles.deleteButtonImage}
                    />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.notificationText}>No new parking notification</Text>
        )}
      </View>

      <View style={styles.content}>
        {reserveLogs.length > 0 ? (
          reserveLogs.map((log) => (
            <TouchableOpacity
              key={log.id}
              style={styles.notification}
              onPress={() => toggleSelection(log.id)}
            >
              <Text style={styles.notificationText}>
              Reserved at: {log.managementName}
              </Text>
              <Text style={styles.notificationText}>
                Slot Number: {log.slotId}
              </Text>
              <Text style={styles.notificationDate}>
                Date: {new Date(log.timestamp.seconds * 1000).toLocaleDateString()} 
              </Text>
              {selectedId === log.id && (
                <TouchableOpacity
                  onPress={() => deleteNotification2(log.id)}
                  style={styles.deleteButton}
                >
                    <Image 
                      source={require('./images/del.png')}
                      style={styles.deleteButtonImage}
                    />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.notificationText}>No new reservation notification</Text>
        )}
      </View>
      
      <View>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
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
  notification: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', // or any other color for non-clicked notification
  },
  notificationText: {
    fontSize: 16,
    padding: 10,
  },
  notificationDate: {
    fontSize: 14,
    padding: 10,
    color: 'gray', // style for the date text
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    position: 'center',
    bottom: 0,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationClicked: {
    backgroundColor: 'gray', 
  },
  deleteButton: {
    position: 'absolute',
    top: 120,
    right: 10,
    
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonImage: {
    width: 30, 
    height: 30,
    resizeMode: 'contain', 
  },
});