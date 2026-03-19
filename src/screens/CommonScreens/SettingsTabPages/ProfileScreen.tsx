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

          <TouchableOpacity style={styles.backBtn}>
            {/* <Ionicons name="arrow-back" size={22} color="#fff" /> */}
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
            <View>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>+91 9595965161</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>Ron19@gmail.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View style={styles.col}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.value}>Mumbai</Text>
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Pin Code</Text>
              <Text style={styles.value}>400050</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>State</Text>
              <Text style={styles.value}>Maharashtra</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>
                302, Sea View Apartments, Bandra West, Mumbai - 400050
              </Text>
            </View>
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
    // backgroundColor: '#F4F6F8',
  },

  header: {
    height: HEIGHT(24),
    backgroundColor: '#3BA56A',
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
    right: -10,
    backgroundColor: '#3BA56A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  editText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 12,
  },

  name: {
    marginTop: 12,
    fontSize: 20,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#222',
  },

  id: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },

  card: {
    borderRadius: 12,
    padding: WIDTH(5),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  row: {
    paddingVertical: 4,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 13,
    color: '#888',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  value: {
    fontSize: 16,
    color: '#222',
    fontFamily: FONT.POPPINS_MEDIUM,
    marginTop: 2,
  },

  col: {
    width: '48%',
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: '#c3c3c3',
    marginVertical: 12,
  },
});
