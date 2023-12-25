import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {db} from "./config/firebase";
import { collection, query, where, getDocs, addDoc} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import style from 'react-native-modal-picker/style';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


function FeedbackScreen() {
  const [managementName, setManagementName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [matchingManagementNames, setMatchingManagementNames] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const [user, setUser] = useState(null);

useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe();
}, []);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit feedback.');
      return;
    }
    try {
      await addDoc(collection(db, 'feedback'), {
        managementName,
        companyAddress,
        email,
        message,
        createdAt: new Date()
      });
      Alert.alert('Success', 'Your feedback has been submitted.');
      setManagementName('');
      setCompanyAddress('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error adding document:', error);
      Alert.alert('Error', 'There was an issue submitting your feedback. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const fetchMatchingNames = async (partialName) => {
    try {
      const q = query(collection(db, 'establishments'), where('managementName', '>=', partialName));
      const querySnapshot = await getDocs(q);
      const matchingNames = querySnapshot.docs.map(doc => doc.data().managementName);
      setMatchingManagementNames(matchingNames);
    } catch (error) {
      console.error('Error searching management names:', error);
    }
  };

  const handleManagementNameChange = (text) => {
    setManagementName(text);
    if (text) {
      fetchMatchingNames(text);
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };
  
  const handleSuggestionPress = async (name) => {
    setManagementName(name);
    try {
      const q = query(collection(db, 'establishments'), where('managementName', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setCompanyAddress(data.companyAddress || '');
      } else {
        setCompanyAddress('');
        Alert.alert('No match found', 'The management name you entered does not match our records.');
      }
    } catch (error) {
      console.error('Error searching management name:', error);
      Alert.alert('Error', 'An error occurred while searching. Please try again.');
    }
    setMatchingManagementNames([]);
    setModalVisible(false);
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
      <View style={styles.suggestionItem}>
        <Text style={styles.para2}>{item}</Text>
      </View>
    </TouchableOpacity>
  );
    
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Feedback</Text>
      </View>
        <Text style={styles.para}>Your feedback will help us to operate better. Please let us know what went wrong</Text>
      <Text style={styles.label}>Management Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Management Name"
        onChangeText={handleManagementNameChange}
        value={managementName}
      />
       <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!isModalVisible);
          }}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => {
              setModalVisible(false);
            }}>
            <View style={styles.modalView}>
              <FlatList
                data={matchingManagementNames}
                renderItem={renderItem}
                keyExtractor={(item) => item}
              />
            </View>
          </TouchableOpacity>
      </Modal>

      <Text>Company Address</Text>
      <TextInput
      style={styles.input}
      placeholder="Company Address"
      value={companyAddress} 
      onChangeText={setCompanyAddress}
      editable={false} 
    />
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="your_email@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail} 
        editable={false}
      />
      <Text>Message</Text>
      <TextInput
        style={styles.input}
        placeholder="Message"
        keyboardType="default"
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.para}>The best praise you can give us it to share your experiences.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  para2: {
    marginTop: 10,
    color: 'black',
    marginBottom: 10,
  },
  para: {
    marginTop: 10,
    color: '#C0C0C0',
    marginBottom: 10,
  },
  navbar: {
    backgroundColor: 'black',
    padding: 10,
    height: 80,
  },
  navbarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    marginTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#003851',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '80%', // Limit the height of the modal
    width: '80%' // Set the width of the modal
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
});

export default FeedbackScreen;
