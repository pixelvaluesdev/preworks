import React from 'react';
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
const professionals = [
  {
    id: '1',
    name: 'Mayur Mishra',
    exp: '5 yrs exp',
    location: 'Indore, India',
    //image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Mayur Mishra',
    exp: '8 yrs exp',
    location: 'Indore, India',
    //image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '3',
    name: 'Mayur Mishra',
    exp: '1 yrs exp',
    location: 'Indore, India',
    // image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
];

const CustomerHomeScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner Section */}
      <View style={styles.banner}>
        <Image
          source={require('../../assets/pngs/BannerImg.png')}
          style={styles.bannerImage}
        />

        {/* Search Bar */}
        <SearchHeader />

        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerSmall}>Your Trusted</Text>
          <Text style={styles.bannerTitle}>Construction</Text>
          <Text style={styles.bannerSmall}>Make Your Dream House</Text>
        </View>
      </View>

      {/* What We Do */}
      <WhatWeDoSection />

      {/* Professionals */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Professionals List</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfessionalList', { type: 'All' })
            }
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={professionals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.proCard}>
              <Image source={{ uri: item.image }} style={styles.proImage} />

              <Text style={styles.proName}>{item.name}</Text>
              <Text style={styles.proExp}>{item.exp}</Text>

              <View style={styles.locationRow}>
                {/* <LocationIcon width={14} height={14} /> */}
                <Text style={styles.proLocation}>{item.location}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Add Project Button */}
      <SecondaryButton
        title="Add Project Details"
        style={{ marginHorizontal: WIDTH(2), marginVertical: HEIGHT(2) }}
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
    height: 300,
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
    marginTop: 80,
    marginLeft: 20,
  },

  bannerSmall: {
    color: '#FFFFFF',
    fontSize: FONTSIZE(2.0),
    fontWeight: '400',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: FONTSIZE(2.8),
    fontWeight: '700',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: FONTSIZE(1.8),
    fontWeight: '600',
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
    fontWeight: '600',
    marginTop: 5,
  },

  proExp: {
    fontSize: 12,
    color: '#666',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  proLocation: {
    fontSize: 12,
    marginLeft: 4,
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
});
