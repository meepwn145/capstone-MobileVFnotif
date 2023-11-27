import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import the useRoute hook as well
import { db} from './config/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc} from 'firebase/firestore';
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
        console.log(item);
      const fetchData = async () => {
        if (!item || !item.managementName) {
          console.log('Item or managementName is missing');
          return;
        }
    
        setIsLoading(true);
        try {
          const collectionRef = collection(db, 'establishments');
          const q = query(collectionRef, where('managementName', '==', item.managementName));
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const establishmentData = querySnapshot.docs[0].data();
            let newSlotSets = [];
  
            if (Array.isArray(establishmentData.floorDetails) && establishmentData.floorDetails.length > 0) {
              newSlotSets = establishmentData.floorDetails.map(floor => ({
                title: floor.floorName,
                slots: Array.from({ length: parseInt(floor.parkingLots) }, (_, i) => ({
                  id: `${floor.floorName}-${i + 1}`,
                  floor: floor.floorName,
                  slotNumber: i + 1,
                  occupied: false // Assuming you have a way to determine this
                })),
              }));
            } else if (establishmentData.totalSlots) {
              newSlotSets = [{
                title: 'General Parking',
                slots: Array.from({ length: parseInt(establishmentData.totalSlots) }, (_, i) => ({
                  id: `General-${i + 1}`,
                  floor: 'General',
                  slotNumber: i + 1,
                  occupied: false
                })),
              }];
            }
  
            setSlotSets(newSlotSets);
          } else {
            setSlotSets([]);
          }
        } catch (error) {
          console.error('Error fetching establishment data:', error);
          setSlotSets([]);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchData();
    }, [item]);

  
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
      Alert.alert(
        'Slot Already Reserved',
        `Slot ${slotId} is already reserved. Please select a different slot.`,
        [{ text: 'OK', style: 'default' }]
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
      timestamp: new Date() // Current date and time of the reservation
    };
  
    try {
      // Assuming you have a 'reservations' collection in Firestore
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
  
  

  const cancelReservation = (cancelledSlot) => {
    setReservedSlots((prevSlots) => prevSlots.filter((slot) => slot !== cancelledSlot));
  };


  const totalAmount = reservedSlots.length * SLOT_PRICE;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {slotSets.map(slotSet => (
          <View key={slotSet.title}>
            <Text>Floor</Text>
            <Text style={styles.floorTitle}>{slotSet.title}</Text>
            <View style={styles.slotContainer}>
              {slotSet.slots.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotButton,
                    reservedSlots.includes(slot.id) && styles.reservedSlotButton
                  ]}
                  onPress={() => handleReservation(slot.id)}
                  disabled={slot.occupied}
                >
                  <Text style={styles.slotButtonText}>
                    {`${slot.slotNumber}${slot.occupied ? ' (Occupied)' : ''}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        {slotSets.length === 0 && !isLoading && <Text>No slots available</Text>}
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