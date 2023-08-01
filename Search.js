import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';

const data = [
  { id: '1', name: 'Oakridge Parking Lot' },
  { id: '2', name: 'CSGI Parking Lot' },
  { id: '3', name: 'Mandaue City Parking Building' },
  { id: '4', name: 'Metro Supermarket Carpark' },
  { id: '5', name: 'Viking Parking Lot' },
];

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredItems = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

  const handleItemClick = (item) => {
    // You can do something with the clicked item here
    console.log('Clicked item:', item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.item}>
        <Text>{item.name}</Text>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
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
