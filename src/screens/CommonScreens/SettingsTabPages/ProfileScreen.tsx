import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { WIDTH, HEIGHT } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import LinearGradient from 'react-native-linear-gradient';
import MobileIcon from '../../../assets/svgs/PhoneIcon.svg';
import City from '../../../assets/svgs/CityIcon.svg';
import EmailIcon from '../../../assets/svgs/MailIcon.svg';
import Pincode from '../../../assets/svgs/GreenLocation.svg';
import Building from '../../../assets/svgs/BuildingIcon.svg';
import Address from '../../../assets/svgs/AddressIcon.svg';
import Back from '../../../assets/svgs/whiteBackIcon.svg';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';

const ProfileScreen = ({ navigation }: any) => {
  const route = useRoute();
  const userId = route?.params?.userId;
  console.log('Received userId:', userId);

  const token = useSelector((state: any) => state.auth.userToken);
  console.log('Token from Redux:', token);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await ApiManager.getProfile(userId, token);

      if (response?.data?.status === 'success') {
        setProfile(response.data.data);
        console.log('Profile data:', response.data.data);
      }
    } catch (error) {
      console.log('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient
          colors={['#53d78e', '#166850']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <Image
            style={styles.coverImage}
            source={
              profile?.userBanner
                ? { uri: `${IMG_URL}${profile.userBanner}` }
                : require('../../../assets/pngs/BannerImg.png')
            }
          />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Back />
          </TouchableOpacity>
        </LinearGradient>

        {/* PROFILE SECTION */}
        <View style={styles.profileWrapper}>
          <View style={styles.profileSection}>
            <Image
              style={styles.profileImage}
              source={
                profile?.image
                  ? { uri: `${IMG_URL}${profile.image}` }
                  : require('../../../assets/pngs/BannerImg.png')
              }
            />

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate('EditProfileScreen', { userId })
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={styles.id}>#{profile?._id?.slice(-6)}</Text>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MobileIcon />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>Mobile number</Text>
                <Text style={styles.value}>+91 {profile?.phone ?? 'NA'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <EmailIcon />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>
                  {' '}
                  {profile?.email?.trim() ? profile.email : 'NA'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            {/* City */}
            <View style={styles.col}>
              <View style={styles.rowLeft}>
                <City />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.label}>City</Text>
                  <Text style={styles.value}>
                    {' '}
                    {profile?.city?.trim() ? profile.city : 'NA'}
                  </Text>
                </View>
              </View>

              {/* Divider for City only */}
              <View style={styles.halfDivider} />
            </View>

            {/* Pincode */}
            <View style={styles.col}>
              <View style={styles.rowLeft}>
                <Pincode />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.label}>Pincode</Text>
                  <Text style={styles.value}>{profile?.pin ?? 'NA'}</Text>
                </View>
              </View>

              {/* Divider for Pincode only */}
              <View style={styles.halfDivider} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Building />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>State</Text>
                <Text style={styles.value}>
                  {profile?.state?.trim() ? profile.state : 'NA'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Address />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                  {' '}
                  {profile?.address?.trim() ? profile.address : 'NA'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  header: {
    height: HEIGHT(24),
    backgroundColor: '#3BA56A',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  coverImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },

  backBtn: {
    position: 'absolute',
    top: HEIGHT(6),
    left: WIDTH(5),
  },

  profileWrapper: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 10,
  },

  profileSection: {
    position: 'relative',
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },

  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: -100,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 5,
  },

  editText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 14,
  },

  name: {
    marginTop: 12,
    fontSize: 20,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#222',
  },

  id: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  card: {
    borderRadius: 12,
    padding: WIDTH(5),
    // shadowColor: '#000',
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 4,
  },

  row: {
    paddingVertical: 4,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },

  label: {
    fontSize: 13,

    fontFamily: FONT.POPPINS_REGULAR,
  },

  value: {
    fontSize: 15,
    color: '#757575',
    fontFamily: FONT.POPPINS_REGULAR,
    marginTop: 2,
  },

  col: {
    flex: 1,
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: '#c3c3c3',
    marginVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  halfDivider: {
    borderBottomWidth: 1,
    borderColor: '#c3c3c3',
    marginTop: 12,
  },
});
