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
import LinearGradient from 'react-native-linear-gradient';
import Camera from '../../../assets/svgs/CameraSvg.svg';
import Back from '../../../assets/svgs/whiteBackIcon.svg';

const EditProfileScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');

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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Back />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraCvrBtn}>
            <Camera width={35} />
          </TouchableOpacity>
        </LinearGradient>

        {/* PROFILE IMAGE */}
        <View style={styles.profileWrapper}>
          <View style={styles.profileSection}>
            <Image
              style={styles.profileImage}
              source={require('../../../assets/pngs/BannerImg.png')}
            />

            <TouchableOpacity style={styles.cameraBtn}>
              <Camera width={35} />
            </TouchableOpacity>
          </View>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
          <BorderTextInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <BorderTextInput
            label="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            placeholder="Enter your mobile number"
          />

          <BorderTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />

          {/* ROW */}
          <View style={styles.row}>
            <View style={styles.col}>
              <BorderTextInput
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="City"
              />
            </View>

            <View style={styles.col}>
              <BorderTextInput
                label="Pin code"
                value={pin}
                onChangeText={setPin}
                placeholder="Pincode"
              />
            </View>
          </View>

          <BorderTextInput
            label="State"
            value={state}
            onChangeText={setState}
            placeholder="Enter your State"
          />

          <BorderTextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            //multiline
            placeholder="Enter your Address"
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
    backgroundColor: '#ffffff',
  },

  header: {
    height: HEIGHT(24),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  backBtn: {
    position: 'absolute',
    top: HEIGHT(6),
    left: WIDTH(5),
  },

  profileWrapper: {
    alignItems: 'center',
    marginTop: -60,
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

  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -20,

    padding: 8,
    borderRadius: 20,
  },

  card: {
    padding: WIDTH(5),
    borderRadius: 14,
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  col: {
    width: '48%',
  },

  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },
  cameraCvrBtn: {
    position: 'absolute',
    top: 110,
    right: 10,

    padding: 8,
    borderRadius: 20,
  },
});
