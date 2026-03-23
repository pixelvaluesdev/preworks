import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';
import SearchHeader from '../../components/SearchHeader';
import ToggleTabs from '../../components/ProfessionalUI/ToggleTabs';
import ProjectCard from '../../components/ProfessionalUI/ProjectCard';
import ApiManager from '../../apis/ApiManager';
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

  const [banners, setBanners] = useState(aa);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('project');

  // useEffect(() => {
  //   fetchBanners();
  // }, []);

  const fetchBanners = async () => {
    try {
      const res = await ApiManager.getBanners(token);
      if (res?.data?.status === 'success') {
        setBanners(res.data.data);
      }
    } catch (err) {
      console.log('Banner error', err);
    }
  };

  // ✅ memoized list data
  const listData = useMemo(() => {
    return selectedTab === 'project' ? projectList : enquiryList;
  }, [selectedTab]);

  // ✅ banner render
  const renderBanner = useCallback(({ item }) => {
    return (
      <Image
        source={item.image}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    );
  }, []);

  // ✅ project render
  const renderProject = useCallback(
    ({ item }) => {
      return (
        <ProjectCard
          title={item.title}
          location={item.location}
          image={item.image}
          selectedTab={selectedTab}
          item={item}
        />
      );
    },
    [selectedTab],
  );

  useBackExit();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.banner}>
        <FlatList
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={renderBanner}
          onMomentumScrollEnd={e => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / WIDTH(100),
            );
            setCurrentIndex(index);
          }}
        />

        {/* Search Header */}
        <SearchHeader containerStyle={styles.searchHeader} />

        {/* Banner Text */}
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
      </View>

      {/* Tabs */}
      <ToggleTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* List */}
      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={renderProject}
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
    width: WIDTH(100),
  },

  bannerImage: {
    width: WIDTH(100),
    height: 360,
  },

  bannerTextContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
  },

  bannerSmall: {
    color: '#FFF',
    fontSize: FONTSIZE(2),
    fontFamily: FONT.POPPINS_REGULAR,
  },

  bannerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: FONT.POPPINS_MEDIUM,
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
