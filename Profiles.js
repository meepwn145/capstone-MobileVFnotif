import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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
      <AntDesign name={iconName} size={20} color="white" style={styles.icon} />
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
    <View style={styles.container}>
          <Text style={styles.text}>Profile Information</Text>
      {renderInputWithIcon('user', name, setName, 'Name')}
      {renderInputWithIcon('mail', email, setEmail, 'Email')}
      {renderInputWithIcon('enviroment', location, setLocation, 'Location')}
      {renderInputWithIcon('phone', phone, setPhone, 'Phone')}
      <Text style={styles.text}>Additional Information</Text>
      {renderInputWithIcon('', age, setAge, 'Age')}
      {renderInputWithIcon('', gender, setGender, 'gender')}
      <Text style={styles.text}>Vehicle Information</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontFamily:'Courier New',
    fontWeight:'bold',
    marginTop: 5,
    color: 'white'
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
    fontFamily:'Courier New',
    color:'white',
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
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profs;
