import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import { db, storage, auth} from "./config/firebase";
import * as ImagePicker from 'expo-image-picker';
import { updateDoc, doc,getDoc } from 'firebase/firestore';
import { Button } from 'react-native-elements';
import UserContext from './UserContext';
import {ref, uploadBytes, getDownloadURL, listAll, list  } from "firebase/storage"
import { Platform } from 'react-native';
import {v4} from "uuid"; 
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
    const [isEditMode, setIsEditMode] = useState(false);
  
    const userDocRef = auth.currentUser ? doc(db, 'establishments', auth.currentUser.uid) : null;

    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    const saveProfileImageUrl = async (url) => {
      if (userDocRef) {
        await updateDoc(userDocRef, {
          profileImageUrl: url,
        });
      }
    };    
   
    const imagesListRef = ref(storage, "images/");
    const uploadFile = async (uri) => {
      if (uri && auth.currentUser) {
        const imageName = `${v4()}.jpg`; // Generate a new UUID for the image
        const imageRef = ref(storage, `images/${imageName}`);
        const response = await fetch(uri);
        const blob = await response.blob();
  
        // Start the upload process
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef); // Corrected the promise handling here
        console.log('Uploaded a blob or file!');
        console.log('File available at', url); // Log the URL
        setProfileImageUrl(url); // Update the state to show the new image
        saveProfileImageUrl(url); // Save the image URL to Firestore
      }
    };
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.cancelled) {
        setImageUpload(result.uri);
        // Upload the file after the image is picked
        uploadFile(result.uri);
      }
    };
  
    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

   


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

    const handleSave = async () => {
      // Log the current user (for debugging purposes)
      console.log(auth.currentUser);
    
      // Save the updated user data to Firestore
      updateUserData();
    
      // Check if there's a new image uploaded that hasn't been saved yet
      if (imageUpload) {
        // Save the image URL to Firestore and wait for it to finish
        await saveProfileImageUrl(profileImageUrl);
        // Reset the imageUpload state to indicate the image has been saved
        setImageUpload(null);
      }
    };

const toggleEditMode = () => {
  if (isEditMode) {
    handleSave();
  }
  setIsEditMode(!isEditMode);
};
const uploadImage = async (imageUri) => {
  // Assuming you have a function that handles the upload and returns the URL
  const uploadUrl = await uploadFileToServer(imageUri); // Replace with your actual upload function

  console.log(uploadUrl); // Log the URL to check if it's correct
  setProfileImageUrl(uploadUrl); // Update the state with the new URL
};
  

  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Image
        style={styles.coverPhoto}
        source={require('./images/background.jpg')}
      />
    </View>
    <View style={styles.nameWithImageContainer}>
    <TouchableOpacity onPress={pickImage}>
<Image
key={profileImageUrl} // This will force the Image to rerender when profileImageUrl changes

style={styles.profilePicture}
source={profileImageUrl ? { uri: `${profileImageUrl}?${new Date()}` } : require('./images/defualt.png')}
/>
{isEditMode && (
  <Button title="Upload Image" onPress={pickImage}/>
)}
</TouchableOpacity>
      {isEditMode ? (
        <TextInput 
          style={[
            styles.profileName, 
            styles.infoInput,
            isEditMode && styles.editModeInput
          ]}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Name"
        />
      ) : (
        <Text style={styles.profileName}>{name}</Text>
      )}
    </View>
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
    width: 100,
    height: 100,
    borderRadius: 70,
    borderColor: '#fff',
    borderWidth: 3,
    position: 'absolute',
    bottom: 10,
  },
  profileName: {
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 100
    // any other styles you need
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
nameWithImageContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 30,
  marginLeft: 30, // adjust this as needed to align with other elements on the page
},
sideImage: {
  width: 50,
  height: 50,
},
});

export default Profs;