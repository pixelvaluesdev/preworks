import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
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
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import ScreenWrapper from '../../utils/screenWrapper';

const ProfessionalHomeScreen = () => {
  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;

  const navigation = useNavigation();

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('project');
  const [projects, setProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    if (!user?.image) {
      navigation.replace('EditProfileScreen', { userId: user._id });
    }
  }, []);

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
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

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

  const handleSearch = text => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredResults([]);
      setShowSuggestions(false);
      return;
    }

    const lowerText = text.toLowerCase();

    const projectResults = projects
      .filter(item => {
        return (
          item?.projectName?.toLowerCase()?.includes(lowerText) ||
          item?.plotAddress?.toLowerCase()?.includes(lowerText)
        );
      })
      .map(item => ({
        ...item,
        type: 'project',
      }));

    const enquiryResults = enquiries
      .filter(item => {
        return (
          item?.projectName?.toLowerCase()?.includes(lowerText) ||
          item?.plotAddress?.toLowerCase()?.includes(lowerText)
        );
      })
      .map(item => ({
        ...item,
        type: 'enquiry',
      }));

    const finalResults =
      selectedTab === 'project' ? projectResults : enquiryResults;

    setFilteredResults(finalResults);
    setShowSuggestions(true);
  };

  const handleSuggestionPress = item => {
    console.log('Pressed item', item);

    setShowSuggestions(false);
    setSearchText('');

    setTimeout(() => {
      if (item.type === 'project') {
        navigation.navigate('CommonProjectDetails', {
          projectId: item._id,
        });
      } else {
        navigation.navigate('GeneralEnquiry', {
          projectId: item._id,
        });
      }
    }, 100);
  };

  const listData = selectedTab === 'project' ? projects : enquiries;

  const renderProject = useCallback(
    ({ item }) => {
      return (
        <ProjectCard
          title={item.projectName}
          location={`${item?.plotAddress || ''}, ${item?.city || ''}, ${
            item?.pinCode || ''
          }`}
          image={
            item.image && item.image.length > 0
              ? `${IMG_URL}${item.image[0]}`
              : null
          }
          selectedTab={selectedTab}
          item={item}
          time={moment(item.createdAt).fromNow()}
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
    <ScreenWrapper style={styles.container}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={event => {
          const offsetY = event.nativeEvent.contentOffset.y;

          if (offsetY > 400) {
            setShowScrollTop(true);
          } else {
            setShowScrollTop(false);
          }
        }}
        scrollEventThrottle={16}
      >
        {/* Banner */}
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

          {showSuggestions && searchText.length > 0 && (
            <View style={styles.suggestionContainer}>
              <View>
                {filteredResults.length > 0 ? (
                  filteredResults.slice(0, 5).map(item => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.suggestionCard}
                      onPress={() => handleSuggestionPress(item)}
                    >
                      <Text style={styles.suggestionTitle}>
                        {item.projectName}
                      </Text>

                      <Text style={styles.suggestionLocation}>
                        {item.plotAddress}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noResultText}>No Results Found</Text>
                )}
              </View>
            </View>
          )}

          {/* Search Bar (keep if already exists) */}
          <SearchHeader
            value={searchText}
            onChangeText={handleSearch}
            containerStyle={styles.searchHeader}
            onFocus={() => setShowSuggestions(true)}
            onProfilePress={() =>
              navigation.navigate('ProfessionalProfile', { userId: userId })
            }
          />

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
              <View style={styles.emptyContainer}>
                <Image
                  source={require('../../assets/pngs/no_data.jpeg')}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
              </View>
            }
          />
        )}
      </ScrollView>

      {showScrollTop && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.scrollTopButton}
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}
        >
          <Text style={styles.scrollTopText}>Scroll to Top</Text>
        </TouchableOpacity>
      )}
    </ScreenWrapper>
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
  suggestionContainer: {
    position: 'absolute',
    top: 110,
    left: 15,
    right: 15,

    backgroundColor: 'rgba(255,255,255,0.96)',

    borderRadius: 14,
    zIndex: 999,

    maxHeight: 250,

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    overflow: 'hidden',
  },

  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    fontSize: FONTSIZE(14),
    color: 'black',
  },

  noResultText: {
    textAlign: 'center',
    fontSize: 14,
    padding: 15,
    color: 'grey',
  },
  suggestionCard: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  suggestionTitle: {
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 14,
    color: 'black',
  },

  suggestionLocation: {
    marginTop: 1,
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 12,
    color: 'grey',
  },

  scrollTopButton: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',

    backgroundColor: 'rgba(78, 77, 77, 0.78)',

    paddingHorizontal: 18,
    height: 42,
    borderRadius: 25,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  scrollTopText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: FONT.POPPINS_MEDIUM,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 10,
  },

  emptyImage: {
    width: 220,
    height: 220,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: FONT.POPPINS_MEDIUM,
  },
});
