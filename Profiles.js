import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import { db, storage, auth} from "./config/firebase";
import { updateDoc, doc,getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import UserContext from './UserContext';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Profs = () => {

  const { user } = useContext(UserContext);
  const [profileImageUrl, setProfileImageUrl] = useState("");
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address ||'');
    const [phone, setPhone] = useState(user?.contactNumber||'');
    const [age, setAge] = useState(user?.age || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [vehicle, setVehicle] = useState(user?.car||'');
    const [plateNumber, setPlateNumber] = useState(user?.carPlateNumber || '');
    const [editingField, setEditingField] = useState(null);
    const [managementNames, setManagementNames] = useState([]);


    useEffect(() => {
      const fetchUserData = async () => {
        try {
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, 'user', userId);
            const userDocSnapshot = await getDoc(userDocRef);
  
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              setName(userData.name || "");
              setAddress(userData.address || "");
              setEmail (userData.email || "");
              setPhone(userData.contactNumber || "");
              setAge(userData.age || "");
              setGender(userData.gender || "");
              setVehicle(userData.car || "");
              setPlateNumber(userData.carPlateNumber || "");
            } else {
              console.log("No user data found!");
            }
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };
  
      fetchUserData();
    }, [user]);
    const formatDate = (timestamp) => {
      if (timestamp && timestamp.toDate) {
        return timestamp.toDate().toLocaleString(); // Adjust the format as needed
      }
      return '';
    };

    const updateUserData = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userDocRef = doc(db, 'user', userId);
          const updatedData = {
            name: name,
            address: address,
            email: email,
            contactNumber: phone,
            age: age,
            gender: gender,
            car: vehicle,
            carPlateNumber: plateNumber,
          };
          await updateDoc(userDocRef, updatedData);
          console.log("User data updated/created successfully!");
        } else {
          console.error("User not authenticated");
        }
      } catch (error) {
        console.error("Error updating user data: ", error);
      }
    };

    const handleUpdate = async () => {
      // Call the existing updateUserData function
      await updateUserData();
      // Clear the editing state
      setEditingField(null);
    };
  
    const renderEditableView = (field, value, setValue) => {
      return editingField === field ? (
        <TextInput
          value={value}
          onChangeText={setValue}
          style={styles.editableText}
          onBlur={handleUpdate} // Save on blur or you can use a button to save
        />
      ) : (
        <Text style={styles.itemSubtitle} onPress={() => setEditingField(field)}>
          {value}
        </Text>
      );
    };
    useEffect(() => {
      let isMounted = true;
    
      const fetchManagementNames = async () => {
        if (!auth.currentUser) {
          console.log("User not authenticated.");
          return;
        }
    
        const userEmail = auth.currentUser.email;
        console.log("Fetching management names for user email:", userEmail);
    
        try {
          const logsQuery = query(collection(db, 'logs'), where('email', '==', userEmail));
          const querySnapshot = await getDocs(logsQuery);
    
          if (querySnapshot.empty) {
            console.log("No matching documents found.");
            return;
          }
    
          const fetchedManagementNames = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              name: data.managementName,
              time: formatDate(data.timeIn)
            };
          });
    
          if (isMounted) {
            setManagementNames(fetchedManagementNames);
          }
        } catch (error) {
          console.error("Error fetching management names: ", error);
        }
      };
    
      fetchManagementNames();
    
      return () => {
        isMounted = false;
      };
    }, [user?.email]);
    

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./images/gilbert.jpg')} // Replace with your local image
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.occupation}>{email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.subSection}>
        <Text style={styles.subHeader}>Basic Information</Text>
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Address</Text>
            {renderEditableView('address', address, setAddress)}
            <Text style={styles.itemTitle}>Age</Text>
              {renderEditableView('age', age, setAge)}
              <Text style={styles.itemTitle}>Gender </Text>
              {renderEditableView('gender', gender, setGender)}
            </View>
            <TouchableOpacity onPress={() => setEditingField('address')}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
             </View>
             <View style={styles.divider}></View>
             <Text style={styles.subHeader}>Contact Information</Text>
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Phone Number</Text>
              {renderEditableView('phoneNumber', phone, setPhone)}
              <Text style={styles.itemTitle}>Email</Text>
              {renderEditableView('email', email, setEmail)}
            </View>
            <TouchableOpacity onPress={() => { /* handle edit */ }}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
             </View>
             <View style={styles.divider}></View>
             <Text style={styles.subHeader}>Other Information</Text>
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Vehicle </Text>
            {renderEditableView('vehicle', vehicle, setVehicle)}
            <Text style={styles.itemTitle}>Vehicle Plate Number </Text>
            {renderEditableView('carPlateNumber', plateNumber, setPlateNumber)}
            </View>
            <TouchableOpacity onPress={() => { /* handle edit */ }}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
             </View>
             <View style={styles.divider}></View>
             <Text style={styles.sectionTitle}>Recent Parking History</Text>
              <View style={styles.managementContainer}>
              {managementNames.length > 0 ? (
              managementNames.map((item, index) => (
                <Text key={index} style={styles.skill}>{item.name} - {item.time}</Text>
              ))
            ) : (
              <Text>No management names found</Text>
            )}
        </View>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F8F8FF',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  occupation: {
    fontSize: 16,
    color: '#666',
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomColor: '#D3D3D3',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    marginTop: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 16,
    color: '#666',
  },
  managementContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    margin: 4,
    backgroundColor: '#20B2AA', 
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#F7F7F7',
    padding: 16,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#CDCDCD',
    paddingBottom: 4,
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subSection: {
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold'
  },

  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editText: {
    fontSize: 14,
    color: '#1E90FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#CDCDCD', // Make sure this color contrasts with the section background color
    marginTop: 16, // You can adjust this value as needed
    marginBottom: 16, // You can adjust this value as needed
  },
  editableText: {
    backgroundColor: '#e8f0fe', // Light blue background
    borderColor: '#4a90e2', // Blue border
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
  },
});

export default Profs;
