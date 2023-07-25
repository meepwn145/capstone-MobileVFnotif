import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Avatar, Input, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Manage() {
  const [userData, setUserData] = useState(null);
  const [fName, setFname] = useState('');
  const [lName, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Add isEditing state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the server using axios
        const loggedInUser = localStorage.getItem('user');
  
        if (loggedInUser) {
          const response = await axios.get(`http://localhost:8000/user/${loggedInUser}`);
  
          if (response.data) {
            setUserData(response.data);
            setFname(response.data.fName);
            setLname(response.data.lName);
            setEmail(response.data.email);
            setVehicle(response.data.vehicle);
            setPlateNumber(response.data.plate);
            setAddress(response.data.address);
            setContact(response.data.contact);
            setBirthday(response.data.birthday);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchUserData();
  }, []);

  function handleEditProfile() {
    setIsEditing(true);
    // Fetch user data from the server
    const loggedInUser = localStorage.getItem('user');
    axios.get(`http://localhost:8000/user/${loggedInUser}`)
      .then((response) => {
        if (response.data) {
          setUserData(response.data);
          setFname(response.data.fName);
          setLname(response.data.lName);
          setEmail(response.data.email);
          setVehicle(response.data.vehicle);
          setPlateNumber(response.data.plate);
          setAddress(response.data.address);
          setContact(response.data.contact);
          setBirthday(response.data.birthday);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function handleSaveProfile() {
    // Add code to update user data on the server
  }

  const handleLogOut = () => {
    // Add code to handle logout
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={styles.scrollContainer}>
        <Avatar
          rounded
          size="large"
          source={{
            uri:
              'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp',
          }}
          containerStyle={styles.avatarContainer}
        />
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <Button
              title="Save Profile"
              onPress={handleSaveProfile}
              containerStyle={styles.button}
            />
          ) : (
            <Button
              title="Edit Profile"
              onPress={handleEditProfile}
              containerStyle={styles.button}
            />
          )}
          <Button title="Message" containerStyle={styles.button} type="outline" />
        </View>
        <Card containerStyle={styles.card}>
          <View style={styles.infoContainer}>
            <Icon name="user" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="First Name"
                value={fName}
                onChangeText={setFname}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.fName || ''}</Text>
            )}
            {isEditing ? (
              <Input
                placeholder="Last Name"
                value={lName}
                onChangeText={setLname}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.lName || ''}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Icon name="envelope" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.email || ''}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Icon name="car" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="Vehicle"
                value={vehicle}
                onChangeText={setVehicle}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.vehicle || ''}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Icon name="car" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="Plate Number"
                value={plateNumber}
                onChangeText={setPlateNumber}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.plate || ''}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Icon name="location-arrow" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.address || ''}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Icon name="phone" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="Contact"
                value={contact}
                onChangeText={setContact}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.contact || ''}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Icon name="birthday-cake" size={20} color="#000" />
            {isEditing ? (
              <Input
                placeholder="Birthday"
                value={birthday}
                onChangeText={setBirthday}
                inputContainerStyle={styles.inputContainer}
              />
            ) : (
              <Text style={styles.infoText}>{userData?.birthday || ''}</Text>
            )}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b89ac',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    minHeight: windowHeight, // Set minimum height to ensure it fits the screen
  },
  avatarContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  card: {
    width: windowWidth * 0.9,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    borderBottomWidth: 0,
    marginLeft: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Manage;
