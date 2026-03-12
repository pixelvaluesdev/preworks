import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import CustomTextInput from '../../components/Inputs/CustomTextInput';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import { useNavigation } from '@react-navigation/native';
import { useSelector, UseSelector } from 'react-redux';
import ApiManager from '../../apis/ApiManager';

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');

  const navigation = useNavigation();

  const userType = useSelector(state => state.auth.userType);

  const handleGetOtp = async () => {
    try {
      const body = {
        phone: mobile,
        userType: userType,
      };

      const response = await ApiManager.phoneSignin(body);

      console.log('Get Otp resp', response.data);
      console.log('OTP :', response.data.data.otp);
      if (mobile.length !== 10) {
        Alert.alert('Please enter valid mobile number');
        return;
      }

      if (response.data.status === 'success') {
        navigation.navigate('OtpVeri', { phone: mobile });
      }
    } catch (error) {
      console.log('Full error', error);

      if (error.response) {
        console.log('Server response', error.response.data);
        console.log('Status code', error.response.status);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.subtitle}>
          Please enter your details to sign in
        </Text>

        <CustomTextInput
          label="Mobile number"
          prefix="+91"
          placeholder="Mobile number"
          keyboardType="number-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <SecondaryButton title="Get OTP" onPress={handleGetOtp} />

        <SecondaryButton
          title="Dummy Home"
          onPress={() => navigation.navigate('CustmTabNav')}
        />
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: WIDTH(6),
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  title: {
    fontSize: FONTSIZE(3.2),
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_REGULAR,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 25,
  },

  countryCode: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  button: {
    backgroundColor: '#3BA56A',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontWeight: '600',
  },
});
