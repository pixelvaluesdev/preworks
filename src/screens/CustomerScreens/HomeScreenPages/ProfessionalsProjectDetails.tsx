//Professional's Project Details Screen when click on Project from Professional Profile

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { FONTSIZE, WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import LocationIcon from '../../../assets/svgs/LocationIcon.svg';
import BackArrow from '../../../assets/svgs/LeftArrow.svg';
import OptionIcon from '../../../assets/svgs/ThreeDotsIcon.svg';
import CustomPopup from '../../../components/Popups/CustomPopup';
import { useSelector } from 'react-redux';
import { IMG_URL } from '../../../apis/ApiManager';
import ApiManager from '../../../apis/ApiManager';
import ScreenWrapper from '../../../utils/screenWrapper';

const ProjectDetailsScreen = () => {
  const route = useRoute();
  const { project } = route.params;
  const token = useSelector(state => state.auth.userToken);
  console.log('Received project data:', project);
  const images = project?.images || [];

  const navigation = useNavigation();
  const userType = useSelector(state => state.auth.userType);
  const isCustomer = userType === 'customer';

  const [activeIndex, setActiveIndex] = React.useState(0);

  const [loading, setLoading] = React.useState(false);
  const [successModal, setSuccessModal] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const [showMenu, setShowMenu] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleDeleteWork = async () => {
    try {
      setShowDeleteModal(false); // close confirm popup
      setLoading(true); // show loader

      const response = await ApiManager.deleteWork(project?._id, token);

      if (response?.data?.status === 'success') {
        setMessage('Work deleted successfully');
      } else {
        setMessage('Failed to delete work');
      }
      setSuccessModal(true);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Something went wrong');
      setSuccessModal(true);
      console.log('Delete error:', error?.response);

      setSuccessModal(true); // reuse popup for error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <ScrollView style={styles.container}>
        <View style={styles.imageWrapper}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onMomentumScrollEnd={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / WIDTH(92),
              );
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: IMG_URL + item }}
                style={styles.projectImage}
              />
            )}
          />
          {!isCustomer && (
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => setShowMenu(!showMenu)}
            >
              <OptionIcon width={20} height={20} />
            </TouchableOpacity>
          )}

          {showMenu && (
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate('ProfTabNav', {
                    screen: 'AddWork',
                    params: {
                      isEdit: true,
                      workId: project._id,
                      workData: project,
                    },
                  });
                }}
              >
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  setShowDeleteModal(true);
                }}
              >
                <Text style={[styles.menuText, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* DOT INDICATOR (only if multiple images) */}
          {images.length > 1 && (
            <View style={styles.dotContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <BackArrow width={25} height={25} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{project?.projectName}</Text>

          <View style={{ flexDirection: 'row' }}>
            <LocationIcon width={20} height={20} />
            <Text style={styles.location}> {project?.siteAddress}</Text>
          </View>

          <Text style={styles.budget}>
            Project Budget :{' '}
            <Text style={{ fontWeight: '600' }}>{project?.budget}</Text>
          </Text>

          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : 3}
          >
            {project?.caption || 'No description available'}
          </Text>

          {project?.caption?.length > 80 && (
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={toggleExpand}
            >
              <Text style={styles.showMore}>
                {expanded ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          )}

          <CustomPopup
            visible={showDeleteModal}
            message="Are you sure you want to delete this project?"
            onClose={() => setShowDeleteModal(false)}
            buttons={[
              {
                label: 'Cancel',
                onPress: () => setShowDeleteModal(false),
              },
              {
                label: 'Yes, Delete',
                type: 'primary',
                onPress: handleDeleteWork,
              },
            ]}
          />

          <CustomPopup
            visible={successModal}
            message={message}
            onClose={() => setSuccessModal(false)}
            buttons={[
              {
                label: 'OK',
                type: 'primary',
                onPress: () => {
                  setSuccessModal(false);
                  if (message === 'Work deleted successfully') {
                    navigation.goBack();
                  }
                },
              },
            ]}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProjectDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  imageWrapper: {
    paddingHorizontal: WIDTH(4),
    marginTop: HEIGHT(2),
  },

  projectImage: {
    width: WIDTH(92),
    height: HEIGHT(50),
    borderRadius: 12,
  },

  content: {
    padding: WIDTH(5),
  },

  title: {
    fontSize: 24,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 8,
    fontWeight: '600',
  },

  location: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    color: 'black',
    marginBottom: 8,
  },

  budget: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    lineHeight: 22,
    color: '#444',
    fontWeight: '400',
  },

  showMore: {
    color: Colors.primary,
    marginTop: 10,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(222, 221, 221, 0.88)',
    padding: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: Colors.primary,
  },
  menuBox: {
    position: 'absolute',
    top: 70,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 10,
    zIndex: 200,
    paddingVertical: 5,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  menuText: {
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 14,
  },
  optionBtn: {
    position: 'absolute',
    top: 30,
    right: 30, // adjust slightly (because of padding)
    zIndex: 100,
    elevation: 10,
    backgroundColor: 'rgba(75, 75, 75, 0.4)',
    padding: 6,
    borderRadius: 20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
});
