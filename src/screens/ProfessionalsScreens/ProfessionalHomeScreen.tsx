import React, { useState } from 'react';
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

const ProfessionalHomeScreen = () => {
  const navigation = useNavigation();

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
    fontSize: FONTSIZE(1.2),
    fontFamily: FONT.POPPINS_REGULAR,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  proLocation: {
    fontWeight: '300',
    fontSize: FONTSIZE(1.2),
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
});
