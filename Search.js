import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const data = [
  { id: '1', name: 'Oakridge Parking Lot', address: '880 A. S. Fortuna St, Mandaue City, 6014 Cebu',imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/dd/3b/9a/getlstd-property-photo.jpg?w=1200&h=-1&s=1', space: '27'},
  { id: '2', name: 'CSGI Parking Lot', address: 'Light Site, A. S. Fortuna St, Mandaue City, Cebu', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaR-K35gwLVxcYumYF-BXijxj3uhI1lplD_CXrgbxXfg&s', space: '35' },
  { id: '3', name: 'Mandaue City Parking Building', address: '8WGV+H5P, 6014 P. Gomez, Mandaue, Lalawigan ng Cebu', imageUrl: 'https://149361674.v2.pressablecdn.com/wp-content/uploads/2017/08/MANDAUE-CITY-PARKING-BUILDING.jpg', space: '28' },
  { id: '4', name: 'Metro Supermarket Carpark', address: 'A. S. Fortuna St, Mandaue City, Cebu', imageUrl: 'https://i.prcdn.co/img?regionKey=Fu%2FxpATbN14yiyXrg6pzKA%3D%3D', space: '42'},
  { id: '5', name: 'Viking Parking Lot', address: 'North Wing, SM City Cebu, 2nd, Juan Luna Ext, Cebu City, 6000 Cebu', imageUrl: 'https://lh4.ggpht.com/-FL3f1l0PbKA/Tl3bdc55pJI/AAAAAAAAUUc/HK6n1MPnP_k/Vikings%252520Luxury%252520Buffet%252520MOA001%25255B3%25255D.jpg?imgmax=800', space: '15' },
];

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const navigation = useNavigation();

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredItems = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
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
        <Text style={styles.itemName}>{item.name}</Text>
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
