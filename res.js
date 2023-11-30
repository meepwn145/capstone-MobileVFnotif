import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import the useRoute hook as well
import { db} from './config/firebase';
import { collection, query, where, getDocs, docs, getDoc, addDoc, deleteDoc, querySnapshot, onSnapshot, doc} from 'firebase/firestore';
import Swiper from 'react-native-swiper';
import UserContext from './UserContext';
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SLOT_PRICE = 30; // Assuming this is constant

export default function ReservationScreen({ route }) { // 'item' prop is used here
    const { item } = route.params;
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const [email, setEmail] = useState(user?.email || '');
    const [plateNumber, setPlateNumber] = useState(user?.carPlateNumber || '');
    const [slotSets, setSlotSets] = useState([]);
    const [reservedSlots, setReservedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) {
          // Show a loading state or redirect to login if user is not logged in
          console.log("Waiting for user data to load or user is not logged in");
          // Optionally navigate to login screen
          // navigation.navigate('LoginScreen');
        } else {
          setEmail(user.email);
          setPlateNumber(user.carPlate);
          // ...rest of your code
        }
      }, [user, navigation]);
      
  
      useEffect(() => {
        if (!user) {
          console.log("Waiting for user data to load or user is not logged in");
        } else {
          setEmail(user.email);
          setPlateNumber(user.carPlate);
        }
    }, [user]);

    
    useEffect(() => {
      let unsubscribeFromEstablishments;
      let unsubscribeFromLogs;
    
      const fetchSlotsAndOccupancy = async () => {
        if (!user) {
          console.log("Waiting for user data to load or user is not logged in");
          return;
        }
    
        // Fetch and listen to changes in slot data from the establishments collection
        unsubscribeFromEstablishments = onSnapshot(
          query(collection(db, 'establishments'), where('managementName', '==', item.managementName)),
          (snapshot) => {
            if (!snapshot.empty) {
              const establishmentData = snapshot.docs[0].data();
              const newSlotSets = processEstablishmentData(establishmentData);
              setSlotSets(newSlotSets);
            } else {
              console.log('Establishment data not found');
            }
          },
          (error) => {
            console.error('Error fetching establishment data:', error);
          }
        );
    
        // Listen for real-time updates on occupied slots from the logs collection
        unsubscribeFromLogs = onSnapshot(
          query(collection(db, 'logs'), where('managementName', '==', item.managementName)),
          (snapshot) => {
            const occupiedSlots = snapshot.docs.map(doc => doc.data().slotId);
    
            setSlotSets(currentSlotSets => {
              return currentSlotSets.map(floor => ({
                ...floor,
                slots: floor.slots.map(slot => ({
                  ...slot,
                  occupied: occupiedSlots.includes(slot.id)
                }))
              }));
            });
          },
          (error) => {
            console.error('Error fetching logs data:', error);
          }
        );
      };
    
      fetchSlotsAndOccupancy();
    
      return () => {
        unsubscribeFromEstablishments && unsubscribeFromEstablishments();
        unsubscribeFromLogs && unsubscribeFromLogs();
      };
    }, [user, item.managementName]);
  
    const processEstablishmentData = (establishmentData) => {
      let newSlotSets = [];
    
      if (Array.isArray(establishmentData.floorDetails) && establishmentData.floorDetails.length > 0) {
        // Process floor details
        newSlotSets = establishmentData.floorDetails.map(floor => ({
          title: floor.floorName,
          slots: Array.from({ length: parseInt(floor.parkingLots) }, (_, i) => ({
            id: `${floor.floorName}-${i + 1}`,
            floor: floor.floorName,
            slotNumber: i + 1,
            occupied: false // Default to not occupied
          })),
        }));
      }
    
      if (establishmentData.totalSlots) {
        // Process general parking if totalSlots is available
        const generalParkingSet = {
          title: 'Total Parking Slots',
          slots: Array.from({ length: parseInt(establishmentData.totalSlots) }, (_, i) => ({
            id: `General-${i + 1}`,
            floor: 'General',
            slotNumber: i + 1,
            occupied: false // Default to not occupied
          })),
        };
    
        newSlotSets.push(generalParkingSet);
      }
    
      return newSlotSets;
    };

    
   

  
  const reserveSlot = (slotNumber) => {
    if (reservedSlots.includes(slotNumber)) {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to cancel the reservation for Slot ${slotNumber}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              setReservedSlots((prevSlots) => prevSlots.filter((slot) => slot !== slotNumber));
              setSelectedSlot(null);
              Alert.alert('Reservation Canceled', `Reservation for Slot ${slotNumber} canceled successfully!`);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // Check if the user has already reserved a slot
      if (reservedSlots.length > 0) {
        Alert.alert('Reservation Limit', 'You can only reserve one slot at a time.', [
          {
            text: 'OK',
            style: 'default',
          },
        ]);
      } else {
        setSelectedSlot(slotNumber);
      }
    }
  };

  const handleReservation = (slotId) => {
    if (reservedSlots.includes(slotId)) {
      // The slot is already reserved - offer to cancel the reservation
      Alert.alert(
        'Cancel Reservation',
        `Are you sure you want to cancel the reservation for Slot ${slotId}?`,
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => cancelReservation(slotId),
          },
        ],
        { cancelable: false }
      );
    } else {
      // Check if the user is trying to reserve more than one slot
      if (reservedSlots.length >= 1) {
        Alert.alert(
          'Reservation Limit',
          'You can only reserve one slot at a time.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        // Confirm the reservation
        Alert.alert(
            'Confirm Reservation',
            `Are you sure you want to reserve Slot ${slotId}?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => collectUserInfo(slotId),
              },
            ],
            { cancelable: false }
          );
        }
    }
  };
  const collectUserInfo = (slotId) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user !== null) {
      const userEmail = user.email;
  
      // Prompt for car plate number
      Alert.prompt(
        'Confirm your plate number',
        '',
        (userCarPlate) => {
          confirmReservation(slotId, userEmail, userCarPlate);
        }
      );
    } else {
      Alert.alert('Not Logged In', 'You need to be logged in to make a reservation.', [{ text: 'OK', style: 'default' }]);
    }
  };
  
  const confirmReservation = async (slotId, userEmail, userCarPlate) => {
    const reservationData = {
      email: userEmail,
      carPlate: userCarPlate,
      slotId: slotId,
      managementName: item.managementName,
      timestamp: new Date(),
      occupied: true, // Update the occupied field
    };
  
    try {
      const docRef = await addDoc(collection(db, 'reservations'), reservationData);
      console.log('Reservation ID: ', docRef.id);
  
      setReservedSlots([...reservedSlots, slotId]);
      setSelectedSlot(slotId);
      Alert.alert(
        'Reservation Successful',
        `Slot ${slotId} reserved successfully! Reservation ID: ${docRef.id}`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error saving reservation:', error);
      Alert.alert('Reservation Failed', 'Could not save your reservation. Please try again.', [{ text: 'OK', style: 'default' }]);
    }
  };
  
  
  

  const cancelReservation = async (cancelledSlot) => {
    const userEmail = user?.email;
  
    if (!userEmail) {
      Alert.alert('Error', 'User email is not available. Cannot proceed with cancellation.', [{ text: 'OK', style: 'default' }]);
      return;
    }
  
    try {
      const q = query(collection(db, 'reservations'), where('slotId', '==', cancelledSlot), where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        // Update the document to mark the slot as unoccupied
        await updateDoc(doc.ref, { occupied: false });
  
        // Delete the document
        await deleteDoc(doc.ref);
      });
  
      setReservedSlots((prevSlots) => prevSlots.filter((slot) => slot !== cancelledSlot));
      setSelectedSlot(null);
      Alert.alert('Reservation Canceled', `Reservation for Slot ${cancelledSlot} canceled successfully!`);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      Alert.alert('Cancellation Failed', 'Could not cancel your reservation. Please try again.', [{ text: 'OK', style: 'default' }]);
    }
  };
  
  


  const totalAmount = reservedSlots.length * SLOT_PRICE;
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading slots...</Text>
      ) : (
        slotSets.map((floor, index) => (
          <View key={index} style={styles.floorContainer}>
            <Text style={styles.floorTitle}>{floor.title}</Text>
            <View style={styles.slotContainer}>
              {floor.slots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotButton,
                    slot.occupied && styles.occupiedSlotButton,
                  ]}
                  onPress={() => reserveSlot(slot.slotNumber)}
                  disabled={slot.occupied}
                >
                  <Text style={styles.slotButtonText}>{slot.slotNumber}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  </ScrollView>
);
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  zoneTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  floorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  slotButton: {
    backgroundColor: '#3498db',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: 80,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reservedSlotButton: {
    backgroundColor: '#e74c3c', // Change color for reserved slots
  },
  selectedSlotButton: {
    backgroundColor: '#f39c12', // Change color for the selected slot
  },
  slotButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  reserveButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  totalAmountText: {
    fontSize: 16,
    marginTop: 10,
  },
  reservedSlotsText: {
    fontSize: 16,
    marginTop: 20,
  },
});