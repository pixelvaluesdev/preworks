import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FONTSIZE, HEIGHT, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';
import SearchHeader from '../../components/SearchHeader';
import WhatWeDoSection from '../../components/CustomerUI/WhatWeDoSection';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import { useNavigation } from '@react-navigation/native';
import PlusIcon from '../../assets/svgs/PlusIcon.svg';
import CustomPopup from '../../components/Popups/CustomPopup';
import { useEffect } from 'react';
import ApiManager, { IMG_URL } from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import HelpIcon from '../../assets/svgs/HelpUs.svg';
import { useBackExit } from '../../hooks/useBackExit';
import LocationIcon from '../../assets/svgs/LocationIcon.svg';

const CustomerHomeScreen = () => {
  const navigation = useNavigation();
  const token = useSelector((state: any) => state.auth.userToken);
  const user = useSelector(state => state.auth.user);

  const [helpPopupVisible, setHelpPopupVisible] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    console.log(token, 'Tokennnn here');
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

  useBackExit();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);

      const response = await ApiManager.getProfessionals('all', token);

      if (response?.data?.status === 'success') {
        setProfessionals(response?.data?.data);
        console.log('Professionals fetched:', response.data.data);
      }
    } catch (error) {
      console.log('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;

      if (nextIndex >= banners.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 2000); // change time here (3 sec)

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner Section */}
      <View style={styles.banner}>
        <FlatList
          ref={flatListRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: any) => item._id}
          onMomentumScrollEnd={e => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / WIDTH(100),
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }: any) => (
            <>
              <Image
                source={{ uri: `${IMG_URL}${item?.image}` }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerSmall}>Your Trusted</Text>
                <Text style={styles.bannerTitle}>Construction</Text>
                <Text style={styles.bannerSmall}>Make Your Dream House</Text>
              </View>
            </>
          )}
        />
        {/* Search Bar */}
        <SearchHeader
          value={search}
          onChangeText={setSearch}
          onFocus={() => {
            navigation.navigate('ProfessionalList');
          }}
          containerStyle={styles.searchHeader}
          onProfilePress={() =>
            navigation.navigate('ProfileScreen', { userId: user?._id })
          }
        />

        <View style={styles.dotContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => setHelpPopupVisible(true)}
      >
        <View style={styles.helpIconCircle}>
          {/* Replace with your SVG if available */}
          <Text style={{ fontSize: 16 }}>
            <HelpIcon />
          </Text>
        </View>

        <Text style={styles.helpText}>Help Us</Text>
      </TouchableOpacity>

      {/* What We Do */}
      <WhatWeDoSection />

      {/* Professionals */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Professionals List</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfessionalList', {
                type: 'all',
              })
            }
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={professionals?.slice(0, 5) || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => {
            const hasValidImage =
              item.image &&
              item.image.length > 0 &&
              typeof item.image[0] === 'string' &&
              item.image[0].trim() !== '';

            const fullName =
              item.name ||
              `${item.firstName || ''} ${item.lastName || ''}`.trim() ||
              'No Name';

            return (
              <TouchableOpacity
                style={styles.proCard}
                onPress={() =>
                  navigation.navigate('ProfessionalProfile', {
                    userId: item._id,
                  })
                }
              >
                <Image
                  source={
                    hasValidImage
                      ? { uri: `${IMG_URL}${item.image[0]}` }
                      : require('../../assets/pngs/Placeholder.png')
                  }
                  style={styles.proImage}
                />

                <Text style={styles.proName}>{fullName}</Text>

                <Text style={styles.proExp}>
                  {item.userType?.toUpperCase()}
                </Text>

                <View style={styles.locationRow}>
                  <LocationIcon width={12} height={12} />
                  <Text style={styles.proLocation}>
                    {item.city || 'No City'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Add Project Button */}
      <SecondaryButton
        title="Add Project Details"
        style={{ marginHorizontal: WIDTH(4), marginVertical: HEIGHT(2) }}
        textStyle={{ fontSize: 18 }}
        icon={<PlusIcon height={20} width={20} />}
        onPress={() => navigation.navigate('AddProjectInformation')}
      />

      <CustomPopup
        visible={helpPopupVisible}
        message="Are you sure you want to create a help request?"
        buttons={[
          {
            label: 'No, leave it.',
            onPress: () => setHelpPopupVisible(false),
          },
          {
            label: 'Yes, Create',
            type: 'primary',
            onPress: () => {
              setHelpPopupVisible(false);
              navigation.navigate('HelpRequestSuccess');
            },
          },
        ]}
      />
    </ScrollView>
  );
};

export default CustomerHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  banner: {
    height: 360,
    width: WIDTH(100),
    position: 'relative',
  },

  bannerImage: {
    width: WIDTH(100),
    height: 360,
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

  bannerTextContainer: {
    position: 'absolute',
    top: 200,
    left: 20,
    zIndex: 10,
  },

  bannerSmall: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: FONT.POPPINS_BOLD,
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  proCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
    marginTop: 8,
    //borderWidth: 0.5,
    borderColor: '#c7c7c7',
  },

  proImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },

  proName: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  proExp: {
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -2,
  },

  proLocation: {
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
  helpButton: {
    position: 'absolute',
    right: 20,
    top: 105,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    zIndex: 10,
  },

  helpIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5F6EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  helpText: {
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
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
    width: 8,
  },
  searchHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
