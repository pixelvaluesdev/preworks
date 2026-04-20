import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';
import SearchHeader from '../../components/SearchHeader';
import ToggleTabs from '../../components/ProfessionalUI/ToggleTabs';
import ProjectCard from '../../components/ProfessionalUI/ProjectCard';
import ApiManager, { IMG_URL } from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { useBackExit } from '../../hooks/useBackExit';

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

const aa = [
  {
    id: '1',
    title: 'House Renovation',
    image: require('../../assets/pngs/BannerImg.png'),
  },
  {
    id: '2',
    title: 'Interior Work',
    image: require('../../assets/pngs/BannerImg.png'),
  },
];

const ProfessionalHomeScreen = () => {
  const token = useSelector(state => state.auth.userToken);

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('project');
  const [projects, setProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const listData = selectedTab === 'project' ? projects : enquiries;

  const renderProject = useCallback(
    ({ item }) => {
      return (
        <ProjectCard
          title={item.projectName}
          location={item.plotAddress}
          image={{
            uri: `${IMG_URL}${item.image?.[0]}`,
          }}
          selectedTab={selectedTab}
          item={item}
        />
      );
    },
    [selectedTab],
  );

  useBackExit();

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await ApiManager.getProjectsForProfessional(token);

      if (response?.data?.status === 'success') {
        setProjects(response.data.data.projects);
        setEnquiries(response.data.data.enquiries || []);
        console.log('Projects for professional', response.data.data.projects);
      }
    } catch (error) {
      console.log('Project error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.banner}>
        <FlatList
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
                source={{ uri: item?.image }}
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

        {/* Search Bar (keep if already exists) */}
        <SearchHeader containerStyle={styles.searchHeader} />

        {/* Dots */}
        <View style={styles.dotContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Tabs */}
      <ToggleTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          renderItem={renderProject}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No Data Found
            </Text>
          }
        />
      )}
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
    height: 360,
    width: WIDTH(100),
    position: 'relative',
  },

  bannerImage: {
    width: WIDTH(100),
    height: 360,
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
    backgroundColor: '#FFF',
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
    zIndex: 10,
  },
});
