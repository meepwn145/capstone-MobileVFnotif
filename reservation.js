import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from './config/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import Swiper from 'react-native-swiper';
import UserContext from './UserContext';
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SLOT_PRICE = 30; // Assuming this is constant

export default function ReservationScreen({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState(user?.email || '');
  const [plateNumber, setPlateNumber] = useState(user?.carPlateNumber || '');
  const [slotSets, setSlotSets] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSlotReserved, setIsSlotReserved] = useState(false);

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Create a reference to the "reservations" collection in Firestore
    const reservationsRef = collection(db, 'reservations');

    // Set up a real-time listener for the "reservations" collection
    const unsubscribe = onSnapshot(reservationsRef, (snapshot) => {
      const reservationData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(reservationData);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const loadReservedSlots = async () => {
      try {
        const storedReservedSlots = await AsyncStorage.getItem('reservedSlots');
        if (storedReservedSlots) {
          setReservedSlots(JSON.parse(storedReservedSlots));
        }
      } catch (error) {
        console.error('Error loading reserved slots from AsyncStorage:', error);
      }
    };

    loadReservedSlots();
  }, []);

  useEffect(() => {
    const saveReservedSlots = async () => {
      try {
        await AsyncStorage.setItem('reservedSlots', JSON.stringify(reservedSlots));
      } catch (error) {
        console.error('Error saving reserved slots to AsyncStorage:', error);
      }
    };

    saveReservedSlots();
  }, [reservedSlots]);

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
      const auth = getAuth();
      const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
              setEmail(firebaseUser.email);
              // Replace 'carPlateNumber' with the correct field name if different
              setPlateNumber(firebaseUser.carPlateNumber); 
          } else {
              console.log("User is not logged in");
              // navigation.navigate('LoginScreen');
          }
      });

      const establishmentQuery = query(collection(db, 'establishments'), where('managementName', '==', item.managementName));
      const unsubscribeSlots = onSnapshot(establishmentQuery, (snapshot) => {
        if (!snapshot.empty) {
          const establishmentData = snapshot.docs[0].data();
          console.log("Establishment data:", establishmentData); // Check fetched data
          setSlotSets(processEstablishmentData(establishmentData));
        } else {
          console.log('Establishment data not found');
        }
        setIsLoading(false);
      }, (error) => {
        console.error('Error fetching real-time data:', error);
        setIsLoading(false);
        
      });
    
      return () => {
        unsubscribeSlots();
      };
    }, [item.managementName]);

  
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
                setSelectedSlot();
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


    const handleReservation = () => {
      if (selectedSlot !== null && !reservedSlots.includes(selectedSlot)) {
        // Show a confirmation alert before making the reservation
        Alert.alert(
          'Confirm Reservation',
          `Are you sure you want to reserve Slot ${selectedSlot}?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                const updatedReservedSlots = [...reservedSlots, selectedSlot];
                setReservedSlots(updatedReservedSlots);
                setSelectedSlot(null);
    
                // Show a success alert after making the reservation
                Alert.alert(
                  'Reservation Successful',
                  `Slot ${selectedSlot} reserved successfully!`,
                  [
                    {
                      text: 'OK',
                      style: 'default',
                    },
                  ]
                );
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Invalid Reservation', 'Please select a valid slot before reserving.', [
          {
            text: 'OK',
            style: 'default',
          },
        ]);
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
      occupied: true,
    };
  
    try {
      // Call the sendReservationToServer function to send reservation data
      await sendReservationToServer(reservationData);
  
      setReservedSlots([...reservedSlots, slotId]);
      setSelectedSlot(slotId);
      Alert.alert(
        'Reservation Successful',
        `Slot ${slotId} reserved successfully!`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error saving reservation:', error);
      Alert.alert(
        'Reservation Failed',
        'Could not save your reservation. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
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
                    slot.occupied && styles.reservedSlotButton, // Apply red color if slot is reserved
                    // other conditional styles
                    selectedSlot === slot.slotNumber && styles.clickedSlotButton,
                    reservedSlots.includes(slot.slotNumber) && styles.reservedSlotButton,
                    slot.occupied && reservedSlots.includes(slot.slotNumber) && styles.usedSlotButton,
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

        {isSlotReserved && (
          <View>
            <Text>Reserved Slot: {selectedSlot}</Text>
            {/* Display any other reservation details here */}
          </View>
        )}

        {/* Reserve Button */}
        <Button
          title="Reserve Slot"
          onPress={handleReservation}
          color="#2ecc71"
          accessibilityLabel="Reserve your selected parking slot"
        />

        {/* Display the total amount if there are reserved slots */}
        {reservedSlots.length > 0 && (
          <View>
            <Text style={styles.reservedSlotsText}>Slot Reservation Request:</Text>
            <Text>STATUS: Pending.....</Text>
              {reservedSlots.map((reservedSlot) => (
                <View key={reservedSlot} style={styles.reservedSlotButton}>
                  <Text style={styles.slotButtonText}>{reservedSlot}</Text>
                </View>
              ))}
               <View style={styles.slotContainer}>
            </View>
          </View>
        )}

        {/* Display the total amount if there are reserved slots */}
        {reservedSlots.length > 0 && (
          <Text style={styles.totalAmountText}>
            Total Amount: PHP{totalAmount}
          </Text>
        )}
      </View>
    </ScrollView>
);
}


const styles = StyleSheet.create({

  vacantSlotButton: {
    backgroundColor: '#3498db',
  },
  occupiedSlotButton: {
    backgroundColor: '#95a5a6',
  },
  clickedSlotButton: {
    backgroundColor: '#27ae60',
  },
  reservedSlotButton: {
    backgroundColor: '#FF0000', // Red color for reserved slots
  },
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