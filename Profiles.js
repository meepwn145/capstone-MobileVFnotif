import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import { db } from "./config/firebase";


const Profs = ({ route }) => {
    const { user } = route.params;
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address ||'');
    const [phone, setPhone] = useState(user?.contactNumber||'');
    const [age, setAge] = useState(user?.age || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [vehicle, setVehicle] = useState(user?.car||'');
    const [plateNumber, setPlateNumber] = useState(user?.carPlateNumber || '');
    const [isEditMode, setIsEditMode] = useState(false);
    const [users, setUser] = useState(null);

    const handleSave = async () => {
      try {
          // Check if the user or the UID is not defined.
          if (!user || !user.uid) {
              throw new Error("User or UID is undefined.");
          }
  
          // Update the user's document in Firestore.
          await db.collection('user')
                  .doc(user.uid)
                  .update({
                      name: name,
                      email: email,
                      address: address,
                      contactNumber: phone,
                      age: age,
                      gender: gender,
                      car: vehicle,
                      carPlateNumber: plateNumber,
                  });
  
          // Notify the user that the profile was updated.
          alert('Profile updated successfully!');
          
      } catch (error) {
          // Log and display any errors.
          console.error("Error updating profile: ", error.message);
          alert(`Failed to update profile: ${error.message}`);
      }
  };
  

  const toggleEditMode = () => {
    console.log("Toggling Edit Mode...");
    if (isEditMode) {
      console.log("Currently in Edit Mode...");
      handleSave();
    }
    setIsEditMode(!isEditMode);
 };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.coverPhoto}
          source={require('./images/coverD.jpg')}
        />
        <Image
          style={styles.profilePicture}
          source={require('./images/defualt.png')}
        />
       
      </View>
        {isEditMode ? 
            <TextInput 
                style={[styles.profileName, styles.infoInput]} 
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
            <View style={styles.othersContainer}>
                <Image style={styles.others} source={require('./images/address.png')} />
                {isEditMode ? 
                    <TextInput 
                        style={styles.infoInput} 
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
                            style={styles.infoInput} 
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
                            style={styles.infoInput} 
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
                            style={styles.infoInput} 
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
                            style={styles.infoInput} 
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
                            style={styles.infoInput} 
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
    backgroundColor: '#f0f2f5',
  },
  header: {
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: 220,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#fff',
    borderWidth: 3,
    position: 'absolute',
    bottom: -60,
    left: 20,
  },
  profileName: {
    marginTop: 70,
    marginLeft: 160,
    fontSize: 22,
    fontWeight: 'bold',
  },
  editProfileButton: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#1877f2',
    alignItems: 'center',
  },
  editProfileText: {
    color: '#fff',
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
    fontSize: 14,
    color: '#666',
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
