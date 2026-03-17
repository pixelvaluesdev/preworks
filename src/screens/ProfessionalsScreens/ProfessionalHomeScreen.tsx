import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FONTSIZE, HEIGHT, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchHeader from '../../components/SearchHeader';
import WhatWeDoSection from '../../components/CustomerUI/WhatWeDoSection';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import { useNavigation } from '@react-navigation/native';
import PlusIcon from '../../assets/svgs/PlusIcon.svg';
import ToggleTabs from '../../components/ProfessionalUI/ToggleTabs';
import ProjectCard from '../../components/ProfessionalUI/ProjectCard';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';

const ProfessionalHomeScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.userToken);

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (token) {
      fetchBanners();
    }
  }, [token]);

  const fetchBanners = async () => {
    try {
      const response = await ApiManager.getBanners(token);

      if (response?.data?.status === 'success') {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.log('Banner error', error);
    }
  };

  const projectList = [
    {
      id: '1',
      title: 'ABC Complex',
      location: '202, C.G. Road Nagpur',
      image: require('../../assets/pngs/BannerImg.png'),
    },
    {
      id: '2',
      title: 'XYZ Villa',
      location: 'Manish Nagar Nagpur',
      image: require('../../assets/pngs/BannerImg.png'),
    },
  ];

  const enquiryList = [
    {
      id: '1',
      title: 'House Renovation',
      location: 'Trimurti Nagar Nagpur',
      image: require('../../assets/pngs/BannerImg.png'),
    },
    {
      id: '2',
      title: 'Interior Work',
      location: 'Dharampeth Nagpur',
      image: require('../../assets/pngs/BannerImg.png'),
    },
  ];

  const [selectedTab, setSelectedTab] = useState('project');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner Section */}

      <View style={styles.banner}>
        <FlatList
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          onMomentumScrollEnd={e => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / WIDTH(100),
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
        />

        {/* Search Bar */}
        <SearchHeader containerStyle={styles.searchHeader} />

        {/* Text */}
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerSmall}>Your Trusted</Text>
          <Text style={styles.bannerTitle}>Construction</Text>
          <Text style={styles.bannerSmall}>Make Your Dream House</Text>
        </View>

        {/* Dots */}
        <View style={styles.dotContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerSmall}>Your Trusted</Text>
          <Text style={styles.bannerTitle}>Construction</Text>
          <Text style={styles.bannerSmall}>Make Your Dream House</Text>
        </View>
      </View>

      <ToggleTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <FlatList
        data={selectedTab === 'project' ? projectList : enquiryList}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <ProjectCard
            title={item.title}
            location={item.location}
            image={item.image}
            selectedTab={selectedTab}
            item={item}
          />
        )}
      />
    </ScrollView>
  );
};

export default ProfessionalHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    borderRadius: 25,
    height: 45,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
  },

  bannerSmall: {
    color: '#FFFFFF',
    fontSize: FONTSIZE(2.0),
    fontWeight: '400',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  cardRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#D8F2DF',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  seeAll: {
    color: '#3BA56A',
  },

  proCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
    marginTop: 15,
  },

  proImage: {
    width: '100%',
    height: 90,
    borderRadius: 10,
  },

  proName: {
    fontWeight: '400',
    marginTop: 5,
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  proExp: {
    fontWeight: '400',
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  proLocation: {
    fontWeight: '300',
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  addButton: {
    backgroundColor: '#3BA56A',
    marginHorizontal: 20,
    marginVertical: 30,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  banner: {
    height: 300,
    width: WIDTH(100),
    position: 'relative',
  },

  bannerImage: {
    width: WIDTH(100),
    height: 300,
  },

  bannerTextContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    zIndex: 10,
  },

  dotContainer: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: Colors.primary,
  },

  searchHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
