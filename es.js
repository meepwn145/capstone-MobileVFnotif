import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import the useRoute hook as well
import { db} from './config/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc} from 'firebase/firestore';
import Swiper from 'react-native-swiper';
import UserContext from './UserContext';
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const loadReservedSlots = async () => {
        try {
          const storedReservedSlots = await AsyncStorage.getItem('reservedSlots');
          if (storedReservedSlots !== null) {
            // We have data!!
            const slots = JSON.parse(storedReservedSlots);
            setReservedSlots(slots);
          } else {
            console.log('No reserved slots found in AsyncStorage.');
          }
        } catch (error) {
          console.error('AsyncStorage error: ', error.message);
        }
      };
    
      loadReservedSlots();
    }, []);
    
    
    useEffect(() => {
      const saveReservedSlots = async () => {
        try {
          await AsyncStorage.setItem('reservedSlots', JSON.stringify(reservedSlots));
          console.log('Reserved slots saved to AsyncStorage:', reservedSlots);
        } catch (error) {
          console.error('AsyncStorage error: ', error.message);
        }
      };
    
      // Only save to AsyncStorage if reservedSlots is an array
      if (Array.isArray(reservedSlots)) {
        saveReservedSlots();
      }
    }, [reservedSlots]);
      

    useEffect(() => {
        if (!user) {
          console.log("Waiting for user data to load or user is not logged in");
    
        } else {
          setEmail(user.email);
          setPlateNumber(user.carPlate);
      
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
                  occupied: false
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
      if (reservedSlots.length >= 1) {
        Alert.alert(
          'Reservation Limit',
          'You can only reserve one slot at a time.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
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
        setSelectedSlot(slotId);
        setReservedSlots([slotId]);
    }
  };

  const collectUserInfo = (slotId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
      const userEmail = user.email;
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
      timestamp: new Date() 
    };
  
    try {
      
      const docRef = await addDoc(collection(db, 'reservations'), reservationData);
      console.log('Reservation ID: ', docRef.id);
  
      
      const newReservation = {
        id: slotId,
        managementName: item.managementName
      };
      setReservedSlots(currentSlots => [...currentSlots, newReservation]);
      setSelectedSlot(slotId);
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
        
        await updateDoc(doc.ref, { occupied: false });
  
        
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

        {reservedSlots.length > 0 && (
          <View>
            <Text style={styles.reservedSlotsText}>Slot Reservation Request:</Text>
            <Text>STATUS: Pending.....</Text>
              {reservedSlots.map((reservedSlot) => (
                <View key={reservedSlot} style={styles.reservedSlotButton}>
                  <Text style={styles.slotButtonText}>{reservedSlot.id}</Text>
                  <Text style={styles.slotButtonText}>{reservedSlot.managementName}</Text>
                </View>
              ))}
  </View>
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
    backgroundColor: '#e74c3c', 
  },
  selectedSlotButton: {
    backgroundColor: '#f39c12', 
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