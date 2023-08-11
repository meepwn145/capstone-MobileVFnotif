import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { color } from 'react-native-elements/dist/helpers';


const Profs = () => {
  const [name, setName] = useState('Gilbert Canete');
  const [email, setEmail] = useState('jasonzzz@gmail.com');
  const [location, setLocation] = useState('Labangon');
  const [phone, setPhone] = useState('0912345789');
  const [age, setAge] = useState('21');
  const [gender, setGender] = useState('Male');
  const [vehicle, setVehicle] = useState('Fortuner');
  const [plateNumber, setPlateNumber] = useState('ABC-123');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleLogout = () => {
    console.log('Logout pressed');
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = () => {
    setIsEditMode(false);
  };

  const renderInputWithIcon = (iconName, value, onChangeText, placeholder) => (
    <View style={styles.inputContainer}>
      <AntDesign name={iconName} size={20} color="black" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={isEditMode}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={require('./images/gilbert.jpg')}
            style={styles.profileImage}
          />
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
      {renderInputWithIcon('user', name, setName, 'Name')}
      {renderInputWithIcon('enviroment', location, setLocation, 'Location')}
      {renderInputWithIcon('phone', phone, setPhone, 'Phone')}
      {renderInputWithIcon('', age, setAge, 'Age')}
      {renderInputWithIcon('', gender, setGender, 'gender')}
      {renderInputWithIcon('car', vehicle, setVehicle, 'Vehicle')}
      {renderInputWithIcon('dashboard', plateNumber, setPlateNumber, 'Plate')}
      {isEditMode ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={!isEditMode}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontFamily:'Georgina',
    fontWeight:'bold',
    marginTop: 5,
    color: 'black'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    fontFamily:'Georgina',
    color:'black',
    fontWeight:'bold'
  },
  icon: {
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#3b89ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3b89ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#3b89ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor:'red'
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profs;