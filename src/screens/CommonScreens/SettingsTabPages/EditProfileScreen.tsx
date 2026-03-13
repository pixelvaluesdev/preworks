import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';

const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* HEADER */}
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

          <TouchableOpacity style={styles.cameraBtn}>
            {/* <Ionicons name="camera" size={18} color="#fff" /> */}
          </TouchableOpacity>
        </View>

        {/* FORM */}

        <View style={styles.formContainer}>
          <BorderTextInput label="Name" value={name} onChangeText={setName} />

          <BorderTextInput
            label="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
          />

          <BorderTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.row}>
            <View style={{ width: '48%' }}>
              <BorderTextInput
                label="City"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={{ width: '48%' }}>
              <BorderTextInput
                label="Pin code"
                value={pin}
                onChangeText={setPin}
              />
            </View>
          </View>

          <BorderTextInput
            label="State"
            value={state}
            onChangeText={setState}
          />

          <BorderTextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          {/* SAVE BUTTON */}

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    marginTop: -60,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#fff',
  },

  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: WIDTH(38),
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 20,
  },

  formContainer: {
    padding: WIDTH(6),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  saveText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },
});
