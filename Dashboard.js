import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import UserContext from './UserContext';


export default function Dashboard() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  const goToProfile = () => {
    navigation.navigate('Profiles', { user });
  };
  
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const carouselImages = [
    require('./images/parking1.jpg'),
    require('./images/parking2.jpg'),
    require('./images/parking3.png'),
    require('./images/parking4.jpg'),
  ];

  const handleCardClick = (screenName) => {
    setSidebarVisible(false);
    navigation.navigate(screenName);
  };

  const handleBarsClick = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Automatic carousel
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
    }, 3000);

    return () => clearInterval(scrollInterval.current);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      currentIndex = viewableItems[0].index;
    }
  }).current;

  let currentIndex = 0;

  const renderCarouselItem = ({ item }) => {
    return <Image source={item} style={styles.carouselImage} />;
  };

  return (
    <View style={styles.container}>
      <Image source={require('./images/Parking.png')} style={styles.navbar} />

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Explore more available Parking Lots</Text>
        <Text style={styles.logoSubText}>Find and Reserve Parking Spaces</Text>
      </View>

      <View style={styles.carouselContainer}>
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


      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: 'white' }]}
          onPress={goToProfile}
        >
          <AntDesign name="user" size={20} color="#002535" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: 'white' }]}
          onPress={() => handleCardClick('Search')}
        >
          <AntDesign name="earth" size={20} color="#002535" />
        </TouchableOpacity>

      

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: 'white' }]}
          onPress={() => handleCardClick('Notifications')}
        >
          <AntDesign name="bells" size={20} color="#002535" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: 'white' }]}
          onPress={handleBarsClick}
        >
          <AntDesign name="bars" size={20} color="#002535" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSidebarVisible}
      >
        <View style={styles.sidebarContainer}>
          <TouchableWithoutFeedback onPress={handleBarsClick}>
            <View style={styles.sidebar}>
             
              <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => handleCardClick('Feedback')}
              >
                <View style={styles.buttonContent}>
                  <Image
                    source={require('./images/like.jpg')}
                    style={styles.logo}
                  />
                  <Text style={styles.sidebarButtonText}>Feedback</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => handleCardClick('Transaction')}
              >
                <View style={styles.buttonContent}>
                  <Image
                    source={require('./images/transaction.png')}
                    style={styles.logo}
                  />
                  <Text style={styles.sidebarButtonText}>Transaction</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => handleCardClick('Park')}
              >
                <View style={styles.buttonContent}>
                  <Image
                    source={require('./images/p.png')}
                    style={styles.logo}
                  />
                  <Text style={styles.sidebarButtonText}>Parking</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => handleCardClick('Start')}
              >
                <View style={styles.buttonContent}>
                  <Image
                    source={require('./images/logout.png')}
                    style={styles.logo}
                  />
                  <Text style={styles.sidebarButtonText}>Log Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  navbar: {
    width: '100%',
    height: '30%',
    resizeMode: 'stretch',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  footerButton: {
    marginTop: 10,
    flex: 1,
    aspectRatio: 8 / 7,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: 10,
  },
  cardText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '80%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
  },
  sidebarButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarButtonText: {
    fontSize: 15,
    marginLeft: 25,
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  carouselContainer: {
    height: 300,
  },
  carouselImage: {
    width: 300, 
    height: 300,
    resizeMode: 'cover',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  logoSubText: {
    fontSize: 12,
    color: '#f5f5f5',
    marginBottom: 10,
  },
});