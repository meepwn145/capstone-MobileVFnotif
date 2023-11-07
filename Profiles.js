import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import { db, storage, auth} from "./config/firebase";
import * as ImagePicker from 'expo-image-picker';
import { updateDoc, doc,getDoc } from 'firebase/firestore';
import { Button } from 'react-native-elements';
import UserContext from './UserContext';


const Profs = () => {
  const { user } = useContext(UserContext);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address ||'');
    const [phone, setPhone] = useState(user?.contactNumber||'');
    const [age, setAge] = useState(user?.age || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [vehicle, setVehicle] = useState(user?.car||'');
    const [plateNumber, setPlateNumber] = useState(user?.carPlateNumber || '');
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState('./images/defualt.png');

    const [isInfoVisible, setIsInfoVisible] = useState(false);

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

    const updateUserData = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userDocRef = doc(db, 'user', userId);
          const updatedData = {
            name: name,
            address: address,
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

  const handleSave = () => {
    console.log(auth.currentUser);
    updateUserData();
};

const toggleEditMode = () => {
  if (isEditMode) {
    handleSave();
  }
  setIsEditMode(!isEditMode);
};
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.coverPhoto}
          source={require('./images/background.jpg')}
        />  
      </View>
        {isEditMode ? 
            <TextInput 
            style={[
              styles.profileName, 
              styles.infoInput,
              isEditMode && styles.editModeInput
          ]} 
                value={name} 
                onChangeText={(text) => setName(text)}
                placeholder="Name"  
            /> :
            <Text style={styles.profileName}>{name}</Text>
        }
      <TouchableOpacity style={styles.editProfileButton} onPress={toggleEditMode}>
                <Text style={styles.editProfileText}>{isEditMode ? "Save" : "Edit Profile"}</Text>
                  </TouchableOpacity>
                  <View style={styles.infoSection}>
        <TouchableOpacity onPress={() => setIsInfoVisible(!isInfoVisible)}>
        <Text style={{ fontWeight: 'bold', marginTop: 25, left: 10, fontSize:18 }}>User Information</Text>
        </TouchableOpacity>

      
            <View style={styles.othersContainer}>
              <Image style={styles.others} source={require('./images/address.png')} />
              {isEditMode ? 
                  <TextInput 
                      style={[styles.infoLabel, isEditMode && styles.editModeInput]} 
                      value={address} 
                      onChangeText={(text) => setAddress(text)}
                      placeholder="Address"
                  /> :
                  <Text style={styles.info}>{address}</Text>
              }
            </View>

            <View style={styles.othersContainer}>
              <Image style={styles.others} source={require('./images/contact.png')} />
              {isEditMode ? 
                  <TextInput 
                  style={[styles.infoLabel, isEditMode && styles.editModeInput]} 
                      value={phone} 
                      onChangeText={(text) => setPhone(text)}
                      placeholder="Contact Number"
                  /> :
                  <Text style={styles.info}>{phone}</Text>
              }
            </View>

            <View style={styles.othersContainer}>
              <Image style={styles.others} source={require('./images/age.png')} />
              {isEditMode ? 
                  <TextInput 
                  style={[styles.infoLabel, isEditMode && styles.editModeInput]} 
                      value={age} 
                      onChangeText={(text) => setAge(text)}
                      placeholder="Age"
                  /> :
                  <Text style={styles.info}>{age}</Text>
              }
            </View>

            <View style={styles.othersContainer}>
              <Image style={styles.others} source={require('./images/gender.png')} />
              {isEditMode ? 
                  <TextInput 
                  style={[styles.infoLabel, isEditMode && styles.editModeInput]} 
                      value={gender} 
                      onChangeText={(text) => setGender(text)}
                      placeholder="Gender"
                  /> :
                  <Text style={styles.info}>{gender}</Text>
              }
            </View>

            <View style={styles.othersContainer}>
              <Image style={styles.others} source={require('./images/vehicle.png')} />
              {isEditMode ? 
                  <TextInput 
                  style={[styles.infoLabel, isEditMode && styles.editModeInput]} 
                      value={vehicle} 
                      onChangeText={(text) => setVehicle(text)}
                      placeholder="Vehicle"
                  /> :
                  <Text style={styles.info}>{vehicle}</Text>
              }
            </View>

            <View style={styles.othersContainer}>
              <Image style={styles.others} source={require('./images/plate.png')} />
              {isEditMode ? 
                  <TextInput 
                  style={[styles.infoLabel, isEditMode && styles.editModeInput]} 
                      value={plateNumber} 
                      onChangeText={(text) => setPlateNumber(text)}
                      placeholder="Plate Number"
                  /> :
                  <Text style={styles.info}>{plateNumber}</Text>
              }
            </View>
      </View>  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9DBBD',
  },
  header: {
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: 220,
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 70,
    borderColor: '#fff',
    borderWidth: 3,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center'
  },
  profileName: {
    marginTop: 30,
    alignSelf:'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  editModeInput: {
    borderBottomWidth: 2, 
    borderColor: 'red',
},
  editProfileButton: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#A08C5B',
    alignItems: 'center',
  },
  editProfileText: {
    color: '#181510',
    fontWeight: 'bold',
  },
  bio: {
    margin: 20,
    fontSize: 16,
  },
  infoSection: {
    marginHorizontal: 20,
  },
  infoLabel: {
    fontSize: 18,
    color: 'black',
    marginTop: 10,
  },
  info: {
    marginTop: 20,
    fontSize: 16,
  },
  othersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
},
others: {
    marginTop: 20,
    width: 30,
    height: 30, 
    marginRight: 10,
},
});

export default Profs;