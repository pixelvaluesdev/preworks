import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { FONTSIZE, WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';

import CallIcon from '../../../assets/svgs/Call.svg';
import ChatIcon from '../../../assets/svgs/Chat.svg';
import LinkIcon from '../../../assets/svgs/Links.svg';
import Back from '../../../assets/svgs/whiteBackIcon.svg';
import { useSelector } from 'react-redux';
import BackArrow from '../../../assets/svgs/LeftArrow.svg';
import MultiImg from '../../../assets/svgs/MultiImgIcon.svg';
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';
import Clipboard from '@react-native-clipboard/clipboard';
import Redirect from '../../../assets/svgs/RedirectIcon.svg';
import Copy from '../../../assets/svgs/CopyIcon.svg';

const ProfessionalProfileScreen = () => {
  const route = useRoute();
  const { userId } = route.params;

  const token = useSelector((state: any) => state.auth.userToken);
  console.log('ProfessionalProfileScreen token:', token);
  const navigation = useNavigation();
  const userType = useSelector((state: any) => state.auth.userType);
  const isProffesional = userType !== 'customer';

  const [showComingSoon, setShowComingSoon] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const workList = profile?.workList || [];
  const [showLinks, setShowLinks] = useState(false);

  const [loading, setLoading] = useState(false);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showComingSoon) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Hide after 3 sec
      setTimeout(() => {
        setShowComingSoon(false);
      }, 3000);
    }
  }, [showComingSoon]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProfile(userId, token);

      if (res?.data?.status === 'success') {
        setProfile(res.data.data);
        console.log('Profile data:', res.data.data);
      }
    } catch (error) {
      console.log('Profile Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    const phone = profile?.user?.phone;

    if (!phone) {
      Alert.alert('No Phone Number', 'Phone number not available');
      return;
    }

    Linking.openURL(`tel:${phone}`);
  };
  const handleLinks = () => {
    const links = profile?.user?.links;

    console.log('Links:', links);

    if (!links || links.length === 0) {
      Alert.alert('No Links', 'No links available');
      return;
    }

    setShowLinks(true);
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  const openLink = (url: string) => {
    let fixedUrl = url;

    if (url.startsWith('https:/') && !url.startsWith('https://')) {
      fixedUrl = url.replace('https:/', 'https://');
    }

    if (!fixedUrl.startsWith('http')) {
      fixedUrl = `https://${fixedUrl}`;
    }

    Linking.openURL(fixedUrl);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={
            profile?.user?.userBanner
              ? { uri: IMG_URL + profile.user.userBanner }
              : require('../../../assets/pngs/Placeholder.png')
          }
          style={styles.banner}
        />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <BackArrow width={25} height={25} />
        </TouchableOpacity>

        {/* Profile Card */}
        <View style={styles.card}>
          {/* Profile Image */}
          <Image
            source={
              profile?.user?.image
                ? { uri: `${IMG_URL}${profile.user.image}` }
                : require('../../../assets/pngs/Placeholder.png')
            }
            style={styles.profileImage}
          />

          {isProffesional && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate('EditProfileScreen', {
                  userId: profile?.user?._id,
                })
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.name}>
            {profile?.user?.firstName} {profile?.user?.lastName}
          </Text>
          <Text style={styles.role}>
            {profile?.user?.userType || 'Not specified'}
          </Text>
          <Text style={styles.phone}>
            {profile?.user?.city && profile?.user?.pincode
              ? `${profile.user.city}, ${profile.user.pincode}`
              : 'Location not specified'}
          </Text>

          <Text style={styles.description}>
            {profile?.user?.bio || 'No description available'}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionItem} onPress={handleCall}>
              <View style={styles.iconCircle}>
                <CallIcon width={40} height={40} />
              </View>
              <Text style={styles.actionText}>Enquire now</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setShowComingSoon(true)}
            >
              <View style={styles.iconCircle}>
                <ChatIcon width={40} height={40} />
              </View>
              <Text style={styles.actionText}>Chat now</Text>

              {showComingSoon && (
                <Animated.Text
                  style={[styles.comingSoonText, { opacity: blinkAnim }]}
                >
                  Coming Soon
                </Animated.Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionItem} onPress={handleLinks}>
              <View style={styles.iconCircle}>
                <LinkIcon width={40} height={40} />
              </View>
              <Text style={styles.actionText}>links</Text>
            </TouchableOpacity>
          </View>

          {showLinks && (
            <View style={styles.linksPopup}>
              {profile?.user?.links.map((link: string, index: number) => (
                <View key={index} style={styles.linkRow}>
                  {/* White box (ONLY text) */}
                  <View style={styles.linkBox}>
                    <Text numberOfLines={1} style={styles.linkText}>
                      {link}
                    </Text>
                  </View>

                  {/* Icons OUTSIDE */}
                  <View style={styles.iconRow}>
                    <TouchableOpacity onPress={() => copyToClipboard(link)}>
                      <Text style={styles.icon}>
                        <Copy />
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openLink(link)}>
                      <Text style={styles.icon}>
                        <Redirect />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Portfolio */}
        <View style={styles.portfolioContainer}>
          <Text style={styles.portfolioTitle}>My Portfolio</Text>

          <View style={styles.grid}>
            {workList.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Work Available</Text>
              </View>
            ) : (
              workList.map((item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridItem}
                  onPress={() =>
                    navigation.navigate('ProfessionalsProject', {
                      project: item,
                    })
                  }
                >
                  <View>
                    <Image
                      source={{
                        uri: IMG_URL + item.images[0],
                      }}
                      style={styles.gridImage}
                    />

                    {/* MULTI IMAGE ICON */}
                    {item.images?.length > 1 && (
                      <View style={styles.multiIcon}>
                        <MultiImg width={14} height={14} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfessionalProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  linksContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },

  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  banner: {
    width: '100%',
    height: HEIGHT(25),
  },

  card: {
    backgroundColor: '#fff',
    marginTop: HEIGHT(-2),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: HEIGHT(6),
    paddingHorizontal: WIDTH(5),
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: '#fff',
    position: 'absolute',
    top: -55,
  },

  name: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  role: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#777',
  },

  phone: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: Colors.primary,
  },

  description: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    marginTop: 10,
    lineHeight: 20,
    color: 'black',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',

    justifyContent: 'space-around',
  },

  actionItem: {
    width: WIDTH(30),
    alignItems: 'center',
    paddingHorizontal: 15,
    alignSelf: 'center',
    alignContent: 'center',
    verticalAlign: 'middle',
  },

  iconCircle: {
    backgroundColor: '#3BA56A',
    width: 28,
    height: 28,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  actionText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  divider: {
    width: 1,
    height: HEIGHT(6),
    backgroundColor: '#ddd',
  },

  portfolioContainer: {
    paddingHorizontal: WIDTH(4),
    marginTop: 20,
  },

  portfolioTitle: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  gridItem: {
    width: '31%',
    marginBottom: 10,
  },
  editBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },

  editText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 14,
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
  comingSoonText: {
    marginTop: 5,
    fontSize: 8,
    color: Colors.primary,
    fontFamily: FONT.POPPINS_MEDIUM,
    alignSelf: 'center',
  },
  multiIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(36, 36, 36, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },

  multiText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONT.POPPINS_MEDIUM,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linksPopup: {
    position: 'absolute',
    right: 10,
    top: 220, // adjust based on placement
    backgroundColor: '#c0c0c0',
    padding: 10,
    borderRadius: 10,
    width: WIDTH(55),
    zIndex: 100,
  },
  linkBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  linkText: {
    color: '#007AFF',
    fontSize: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  iconRow: {
    flexDirection: 'row',
    marginLeft: 8,
  },

  icon: {
    fontSize: 16,
    marginLeft: 10,
  },
});
