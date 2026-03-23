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
          <TouchableOpacity style={styles.backBtn}>
            {/* Back Icon */}
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
              {/* Camera Icon */}
            </TouchableOpacity>
          </View>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
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

          {/* ROW */}
          <View style={styles.row}>
            <View style={styles.col}>
              <BorderTextInput
                label="City"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.col}>
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
    bottom: 5,
    right: -5,
    backgroundColor: Colors.primary,
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },
});
