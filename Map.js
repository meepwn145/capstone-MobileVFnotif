import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Map = () => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [center, setCenter] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const containerStyle = {
    flex: 1,
    display: 'flex',
  };

  const mapStyle = {
    height: '100%',
    width: '100%',
  };

  const searchContainerStyle = {
    height: 60,
    position: 'absolute',
    top: Constants.statusBarHeight + 10, 
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    elevation: 3,
  };

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const onPlaceChanged = () => {
  
  };

  useEffect(() => {
    const savedRecentSearches = [];
    setRecentSearches(savedRecentSearches);
  }, []);

  useEffect(() => {

  }, [recentSearches]);

  return (
    <SafeAreaView style={containerStyle}>
      <View style={mapStyle}>
        <MapView style={{ height: '100%', width: '100%' }} region={center} onRegionChangeComplete={setCenter}>
          {selectedPlace && (
            <Marker coordinate={{ latitude: selectedPlace.lat, longitude: selectedPlace.lng }} />
          )}
        </MapView>
        <View style={searchContainerStyle}>
          <TextInput
            placeholder="Search for a place"
            style={{
              width: '100%',
              height: 40,
              marginBottom: 10,
              borderRadius: 3,
              backgroundColor: '#f2f2f2',
              fontSize: 14,
              paddingHorizontal: 10,
            }}
          />
        </View>
      </View>
      <View style={styles.menuBarStyle}>
        <Text>Recent places</Text>
        {recentSearches.map((search, index) => (
          <View key={index}>
            <Text>{search.name}</Text>
            <Text>{search.address}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menuBarStyle: {
    width: 240,
    height: '100%',
    backgroundColor: '#f2f2f2',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
  },
});

export default Map;
