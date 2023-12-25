import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {db} from "./config/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';



export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'establishments'));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredItems = allData.filter((item) =>
      (item.companyAddress?.toLowerCase() || "" ).includes(text.toLowerCase())
    );
    setFilteredData(filteredItems);
  };
  

  const handleItemClick = (item) => {
    navigation.navigate('Details', { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.item}>
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        <View style={{flex:1}}>
        <Text style={styles.itemName}>{item.companyAddress}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainerStyle}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={handleSearch}
          value={searchText}
          placeholderTextColor="white"
        />
      </View>
      <Text style={styles.search}>Parking Lot Near You</Text>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text>No results found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  search: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'white',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 16,
  },
  searchContainerStyle: {
    height: 100,
    backgroundColor: 'black',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    elevation: 3,
    marginBottom: 20,
  },
});