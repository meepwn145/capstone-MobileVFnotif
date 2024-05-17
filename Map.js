import React, { useState, useEffect, useRef} from "react";
import { View, Text, TextInput, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import { Button } from "react-native-elements";
import Constants from "expo-constants";
import { useStoreState } from "pullstate";
import { LocationStore } from "./store";
import { collection, getDocs, query, orderBy, startAt, endAt } from "firebase/firestore";
import { db } from "./config/firebase";
import MapViewDirections from "react-native-maps-directions";
import * as geofire from "geofire-common";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const API_KEY = "AIzaSyBR5rRsw0Z-1hcxMWFz56mo4yJjlaELprg";

const Map = ({ route }) => {
    const item = route?.params?.from || null;
    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const navigation = useNavigation();
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    // const [destination, setDestination] = useState({});
    const [selectedPlaceName, setSelectedPlaceName] = useState("");
    const [showDirections, setShowDirections] = useState(false);
    const location = useStoreState(LocationStore);
    const [state, setState] = useState({
        current: {
            latitude: location.lat,
            longitude: location.lng,
        },
        destination: {},
        coordinate: new AnimatedRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }),
    });

    const { current, destination, coordinate } = state;

    const mapRef = useRef();
    const markerRef = useRef();

    useEffect(() => {
        fetchNearbyParking();

        const savedRecentSearches = [];
        setRecentSearches(savedRecentSearches);
    }, []);

    useEffect(() => {
        if (item && recommendedPlaces.length > 0) {
            const found = recommendedPlaces.find((place) => place.id === item.id);
            if (!found) {
                setRecommendedPlaces((prev) => [
                    ...prev,
                    {
                        id: item.id,
                        managementName: item.managementName,
                        latitude: item.coordinates.lat,
                        longitude: item.coordinates.lng,
                    },
                ]);
            }
            setState((prevstate) => ({
                ...prevstate,
                destination: { latitude: item.coordinates.lat, longitude: item.coordinates.lng },
            }));
            setShowDirections(true);
        }
    }, [recommendedPlaces]);

    // Fetch location every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getCurrentLoc();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNearbyParking = async () => {
        console.log("location", location);
        const center = [location.lat, location.lng];
        // Change this to preferred radius, 50 * 1000 is 50km
        const radiusInM = 100 * 1000;

        // Fetch establishments order by nearest
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        for (const b of bounds) {
            const q = query(collection(db, "establishments"), orderBy("geohash"), startAt(b[0]), endAt(b[1]));

            promises.push(getDocs(q));
        }

        // Collect all the query results together into a single list
        const snapshots = await Promise.all(promises);

        const matchingDocs = [];
        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const establishment = doc.data();
                const lat = establishment.coordinates.lat;
                const lng = establishment.coordinates.lng;

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = geofire.distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                    // Can add more needed info
                    matchingDocs.push({
                        id: doc.id,
                        managementName: establishment.managementName,
                        latitude: establishment.coordinates.lat,
                        longitude: establishment.coordinates.lng,
                    });
                }
            }
        }
        setRecommendedPlaces(matchingDocs);
    };

    const getCurrentLoc = async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});

        if (currentLocation) {
            const latitude = currentLocation.coords.latitude;
            const longitude = currentLocation.coords.longitude;

            console.log("Getting location...", latitude, longitude);
            animate(latitude, longitude);
            updateLoc(currentLocation);
            setState((prevstate) => ({
                ...prevstate,
                current: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }),
            }));
        }
    };

    const updateLoc = async (location) => {
        if (location) {
            LocationStore.update((store) => {
                store.lat = location.coords.latitude;
                store.lng = location.coords.longitude;
            });
        } else {
            console.log("Location update failed!");
        }
    };

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (markerRef.current) {
            markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
        }
    };

    const handleMarkerClick = (coordinates, name) => {
        setState((prevstate) => ({
            ...prevstate,
            destination: coordinates,
        }));
        setSelectedPlaceName(name);
        setShowDirections(true);
        console.log("Button clicked!", name);
    };

    const handleSelectLocation = (managementName) => {
        navigation.navigate("reservation", { item: { managementName: selectedPlaceName } });
        console.log("Navigating with place:", selectedPlaceName);
    };

    return (
        <SafeAreaView style={styles.containerStyle}>
            <View style={styles.mapStyle}>
                <MapView
                    ref={mapRef}
                    style={{ height: "100%", width: "100%" }}
                    initialRegion={{
                        ...current,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    {/* User Current Location Marker */}
                    <Marker.Animated coordinate={coordinate} title="YOU" pinColor="blue"></Marker.Animated>
                    {/* Destination Markers */}
                    {recommendedPlaces &&
                        recommendedPlaces.map((place) => {
                            return (
                                <Marker
                                    key={place.id}
                                    identifier={place.id}
                                    coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                                    title={place.managementName}
                                    pinColor="red"
                                    onPress={() => handleMarkerClick({ latitude: place.latitude, longitude: place.longitude }, place.managementName)}
                                ></Marker>
                            );
                        })}
                    {showDirections && (
                        <MapViewDirections origin={current} destination={destination} apikey={API_KEY} strokeWidth={3} strokeColor="hotpink" />
                    )}
                </MapView>
                <View style={styles.searchContainerStyle}>
                    <TextInput
                        placeholder="Search for a place"
                        style={{
                            width: "100%",
                            height: 40,
                            marginBottom: 10,
                            borderRadius: 3,
                            backgroundColor: "#f2f2f2",
                            fontSize: 14,
                            paddingHorizontal: 10,
                        }}
                    />
                </View>
            </View>
            <Button title="Select Location" containerStyle={styles.buttonContainer} onPress={handleSelectLocation} />
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
        height: "100%",
        backgroundColor: "#f2f2f2",
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 16,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
    },
    containerStyle: {
        flex: 1,
        display: "flex",
    },

    mapStyle: {
        height: "100%",
        width: "100%",
    },
    searchContainerStyle: {
        height: 60,
        position: "absolute",
        top: Constants.statusBarHeight + 10,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        backgroundColor: "black",
        paddingHorizontal: 16,
        paddingTop: 10,
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        elevation: 3,
    },
});

export default Map;
