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

const ProfileScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* COVER IMAGE */}
        <View style={styles.header}>
          <Image
            // source={require('../../assets/pngs/profileBanner.png')}
            style={styles.coverImage}
          />

          <TouchableOpacity style={styles.backBtn}>
            {/* <Ionicons name="arrow-back" size={22} color="#fff" /> */}
          </TouchableOpacity>
        </View>

        {/* PROFILE IMAGE */}
        <View style={styles.profileSection}>
          <Image
            // source={require('../../assets/pngs/profile.png')}
            style={styles.profileImage}
          />

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <Text style={styles.name}>Pratik Shah</Text>
          <Text style={styles.id}>#P484864</Text>
        </View>

        {/* DETAILS */}

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            {/* <Ionicons name="call" size={18} color="#3BA56A" /> */}
            <View style={styles.textWrap}>
              <Text style={styles.label}>Mobile number</Text>
              <Text style={styles.value}>+91 9595965161</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            {/* <Ionicons name="mail" size={18} color="#3BA56A" /> */}
            <View style={styles.textWrap}>
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
              <Text style={styles.label}>Pin code</Text>
              <Text style={styles.value}>400050</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            {/* <Ionicons name="business" size={18} color="#3BA56A" /> */}
            <View style={styles.textWrap}>
              <Text style={styles.label}>State</Text>
              <Text style={styles.value}>Maharashtra</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            {/* <Ionicons name="location" size={18} color="#3BA56A" /> */}
            <View style={styles.textWrap}>
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
    backgroundColor: '#F6F6F6',
  },

  header: {
    height: HEIGHT(22),
  },

  coverImage: {
    width: '100%',
    height: '100%',
  },

  backBtn: {
    position: 'absolute',
    top: HEIGHT(5),
    left: WIDTH(5),
  },

  profileSection: {
    alignItems: 'center',
    marginTop: -50,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#fff',
  },

  editBtn: {
    position: 'absolute',
    right: WIDTH(6),
    top: 10,
    backgroundColor: '#3BA56A',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 6,
  },

  editText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },

  name: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  id: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  detailsContainer: {
    padding: WIDTH(6),
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textWrap: {
    marginLeft: 10,
  },

  label: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  value: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    color: '#757575',
  },

  col: {
    width: '45%',
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    marginVertical: 14,
  },
});
