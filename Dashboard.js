import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import UserContext from "./UserContext";
import { LocationStore } from "./store";
import * as Location from "expo-location";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/firebase";

export default function Dashboard() {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);

    const goToProfile = () => {
        navigation.navigate("Profiles", { user });
    };

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [recommended, setRecommended] = useState([]);
    const carouselImages = [
        { image: { uri: 'https://www.saifulbouquet.com/wp-content/uploads/2020/04/featured-DSC00889.jpg' }, text: "Oakridge Parking Lot" },
        { image:  { uri: 'https://media-cdn.tripadvisor.com/media/photo-s/10/08/e5/a6/mall-exterior.jpg' }, text: "Country Mall" },
        { image:  { uri: 'https://static-ph.lamudi.com/static/media/bm9uZS9ub25l/2x2x5x880x396/b82c78f8faadef.jpg' }, text: "Crossroads Carpark" },
        { image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfMENYcdscVVk9zQdRBXEnelebDd04UbZ9KW36V9wwLw&s' }, text: "Banilad Town Centre" },
        { image:  { uri: 'https://i.pinimg.com/736x/5d/e2/c5/5de2c5ef0e446ddb39f0d090dcf2c033.jpg' }, text: "Pacific Mall" },
    ];


    const handleCarouselCard = (text) => {
        setSidebarVisible(false);
        for (const r of recommended) {
            if (text === r.managementName) {
                navigation.navigate("Map", { from: r });
            }
        }
    };

    const handleCardClick = (screenName) => {
        setSidebarVisible(false);
        navigation.navigate(screenName);
    };

    const handleBarsClick = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const flatListRef = useRef(null);
    const scrollInterval = useRef(null);

    useEffect(() => {
        scrollInterval.current = setInterval(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: (currentIndex + 1) % carouselImages.length,
                    animated: true,
                });
            }
        }, 1000);

        return () => clearInterval(scrollInterval.current);
    }, []);

    const handleViewRecentParked = () => {
        navigation.navigate("Search");
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            currentIndex = viewableItems[0].index;
        }
    }).current;

    let currentIndex = 0;

    useEffect(() => {
        const getCurrentLoc = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Please grant location permissions");
                return;
            }

            let currentLocation;

            // Keep trying to get the location until it's available
            while (!currentLocation) {
                currentLocation = await Location.getCurrentPositionAsync({});
                if (!currentLocation) {
                    // Wait for a short period before trying again
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }

            if (currentLocation) {
                updateLoc(currentLocation);
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

        getCurrentLoc();
    }, []);

    const renderCarouselItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleCarouselCard(item.text)}>
                <View style={styles.carouselItemContainer}>
                    <Image source={item.image} style={styles.carouselImage} />
                    <Text style={styles.carouselText}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderParkedHistoryItem = ({ item }) => {
        return (
            <View style={styles.historyItemContainer}>
                <Image source={item} style={styles.historyItemImage} />
            </View>
        );
    };

    const renderParkedItem = ({ item }) => {
        return (
            <View style={styles.parkedItemContainer}>
                <Image source={item} style={styles.parkedItemImage} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Image  source={{ uri: 'https://i.imgur.com/Y6azwpB.png' }} style={styles.backgroundImage} />

            <View style={styles.container}>
                <Image style={styles.navbar} />
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Explore more available Parking Lots</Text>
                    <Text style={styles.logoSubText}>Find and Reserve Parking Spaces</Text>
                </View>
                <View style={styles.container}>
                    <View>
                        <FlatList
                            ref={flatListRef}
                            data={carouselImages}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderCarouselItem}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={{
                                itemVisiblePercentThreshold: 50,
                            }}
                        />
                    </View>
                    <View style={{ maxWidth: 350, marginBottom: 20 }}>
                        <View style={{ flexDirection: "row", marginBottom: 0 }}>
                            <View style={{ flex: 1, marginLeft: "5%" }}>
                                <Image
                                    source={require("./images/ayala.jpg")}
                                    style={{ width: "100%", marginTop: "30%", borderBottomLeftRadius: 20, borderWidth: 1, borderColor: "#FFD700" }}
                                />
                            </View>
                            <View style={{ flex: 1.5, paddingTop: "25.5%" }}>
                                <View style={{ backgroundColor: "white", opacity: 0.8, padding: "6%", borderBottomRightRadius: 20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>AyalaMall Cebu Center</Text>
                                    <Text style={{ fontSize: 14, color: "#888" }}>Last updated 3 mins ago</Text>
                                    <TouchableOpacity
                                        onPress={handleViewRecentParked}
                                        style={{ marginTop: 13.4, backgroundColor: "#FFD700", padding: 1, borderRadius: 2 }}
                                    >
                                        <Text style={{ color: "white", textAlign: "center" }}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.tabBarContainer}>
                    <View style={[styles.tabBar, { opacity: 0.8 }]}>
                        <TouchableOpacity style={styles.tabBarButton} onPress={goToProfile}>
                            <AntDesign name="user" size={24} color="#A08C5B" />
                            <Text style={styles.tabBarText}>Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleCardClick("Search")}>
                            <AntDesign name="earth" size={24} color="#A08C5B" />
                            <Text style={styles.tabBarText}>Search</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabBarButton} onPress={() => handleCardClick("Notifications")}>
                            <AntDesign name="bells" size={24} color="#A08C5B" />
                            <Text style={styles.tabBarText}>Notifications</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabBarButton} onPress={handleBarsClick}>
                            <AntDesign name="bars" size={24} color="#A08C5B" />
                            <Text style={styles.tabBarText}>Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal animationType="fade" transparent={true} visible={isSidebarVisible}>
                    <View style={styles.sidebarContainer}>
                        <TouchableWithoutFeedback onPress={handleBarsClick}>
                            <View style={styles.sidebar}>
                                <TouchableOpacity style={styles.sidebarButton} onPress={() => handleCardClick("Feedback")}>
                                    <Image source={{ uri: 'https://i.imgur.com/c4io4vB.jpeg' }} style={styles.sidebarIcon} />
                                    <Text style={styles.sidebarButtonText}>Feedback</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.sidebarButton} onPress={() => handleCardClick("Transaction")}>
                                    <Image   source={{ uri: 'https://i.imgur.com/MeRPAqt.png' }} style={styles.sidebarIcon} />
                                    <Text style={styles.sidebarButtonText}>Transaction</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.sidebarButton} onPress={() => handleCardClick("Park")}>
                                    <Image   source={{ uri: 'https://i.imgur.com/vetauvM.png' }} style={styles.sidebarIcon} />
                                    <Text style={styles.sidebarButtonText}>Parking</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.sidebarButton} onPress={() => handleCardClick("Start")}>
                                    <Image   source={{ uri: 'https://i.imgur.com/YzzzEXD.png' }} style={styles.sidebarIcon} />
                                    <Text style={styles.sidebarButtonText}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        marginHorizontal: 10,
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden",
        elevation: 5,
        backgroundColor: "white",
    },
    formContainer: {
        padding: 40,
        marginTop: "20%",
        fontFamily: "Courier New",
    },
    navbar: {
        width: "100%",
        height: "7%",
        resizeMode: "contain",
        marginBottom: 15,
        marginTop: 40,
    },
    logoContainer: {
        alignItems: "center",
    },
    logoText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        marginBottom: 50,
    },
    logoSubText: {
        fontSize: 12,
        color: "#f5f5f5",
        marginTop: -30,
        marginBottom: 10,
        fontWeight: "bold",
    },
    carouselContainer: {
        height: 200,
    },
    carouselItemContainer: {
        width: 360,
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
        marginHorizontal: 10,
        elevation: 5,
        borderWidth: 2,
        borderColor: "#FFD700",
        position: "relative",
    },
    carouselImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    carouselText: {
        position: "absolute",
        bottom: 10, // Adjust this value as needed to position the text
        left: 10, // Adjust this value as needed to position the text
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    tabBarContainer: {
        marginTop: "60%",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 10,
        elevation: 3,
    },
    tabBarButton: {
        alignItems: "center",
    },
    tabBarText: {
        color: "#A08C5B",
        marginTop: 5,
    },
    sidebarContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    sidebar: {
        width: "80%",
        backgroundColor: "white",
        padding: 25,
        borderRadius: 10,
    },
    sidebarButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    sidebarIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
        marginRight: 10,
    },
    sidebarButtonText: {
        fontSize: 16,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    parkedHistoryContainer: {
        overflow: "hidden",
        marginHorizontal: 10,

        position: "relative",
        marginTop: 20,
    },
    overflow: "hidden",
    marginHorizontal: 10,

    position: "relative",
    marginTop: 20,

    historyItemImage: {
        width: 150,
        height: 100,
        resizeMode: "cover",
        borderRadius: 10,
    },
});
