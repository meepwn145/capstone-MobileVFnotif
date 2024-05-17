import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"; // Added Image import
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";

export default function DetailsScreen({ route }) {
    const { item } = route.params;
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image   source={{ uri: 'https://i.imgur.com/WwPGlNh.png' }} style={styles.backgroundImage} />
      <Image source={{ uri: 'https://i.imgur.com/Tap1nZy.png' }} style={[styles.backgroundImage, { borderTopLeftRadius: 80, marginTop: 100, borderTopRightRadius: 80 }]} />

            <Text style={styles.titleText}>Details</Text>

            <Card containerStyle={styles.cardContainer}>
                <View>
                    <Text style={styles.headerName}>{item.managementName}</Text>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    <Text style={styles.para1}>Operation</Text>
                    <Text style={styles.para1}>Open Now: 10:00AM - 11:30PM</Text>
                    <Text style={styles.para}>Located at</Text>
                    <Text style={styles.address}>{item.companyAddress}</Text>
                    <Text style={styles.para}>Available Parking Space: {item.totalSlots}</Text>
                </View>
            </Card>

            <TouchableOpacity onPress={() => navigation.navigate("reservation", { item: item })} style={styles.buttonReserve}>
                <Text style={styles.buttonText1}>Reserve</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Map", { from: item })} style={styles.button}>
                <Text style={styles.buttonText}>Direction</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        color: "white",
        fontSize: 50,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    para1: {
        fontSize: 14,
        marginTop: 10,
        color: "gray",
    },
    para: {
        fontSize: 14,
        marginTop: 10,
    },
    address: {
        color: "gray",
        fontSize: 15,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "cover",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#39e75f",
        paddingVertical: 15,
        borderRadius: 100,
        alignItems: "center",
        paddingHorizontal: 24, // Removed duplicate property
        marginTop: -20, // Adjusted marginTop
        marginBottom: 80, // Adjusted marginBottom
        width: "90%",
        alignSelf: "center",
    },
    buttonReserve: {
        borderColor: "#87CEEB",
        backgroundColor: "white",
        paddingVertical: 15,
        borderRadius: 100,
        alignItems: "center",
        borderWidth: 2,
        marginTop: 30, // Adjusted marginTop
        marginBottom: 30, // Adjusted marginBottom
        width: "90%",
        alignSelf: "center",
    },
    cardContainer: {
        marginTop: "20%",
        borderWidth: 1,
        borderColor: "#FFD700",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginHorizontal: 20,
        elevation: 3, // Shadow
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonText1: {
        color: "#87CEEB",
        fontSize: 16,
        fontWeight: "bold",
    },
    headerName: {
        fontSize: 16,
        marginTop: 10,
        color: "#87CEEB",
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
