import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
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

const ProfileScreen = ({ navigation }: any) => {
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
          <Image style={styles.coverImage} />

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
              source={require('../../../assets/pngs/BannerImg.png')}
              style={styles.profileImage}
            />

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('EditProfileScreen')}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Pratik Shah</Text>
          <Text style={styles.id}>#P484864</Text>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MobileIcon />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>Mobile number</Text>
                <Text style={styles.value}>+91 9595965161</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <EmailIcon />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>ron@gmail.com</Text>
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
                  <Text style={styles.value}>Mumbai</Text>
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
                  <Text style={styles.value}>440024</Text>
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
                <Text style={styles.value}>Maharashtra</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Address />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>ueeu, wuewiu</Text>
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
