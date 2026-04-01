import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import OTPInput from '../../components/Inputs/OtpInput';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import ApiManager from '../../apis/ApiManager';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const VerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const route = useRoute();
  const { phone } = route.params;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userType = useSelector((state: any) => state.auth.userType);
  console.log(userType, 'user type from selector');

  const handleVerifyOtp = async () => {
    try {
      if (otp.length !== 5) {
        Alert.alert('Please enter valid OTP');
        return;
      }

      const body = {
        phone: phone,
        otp: otp,
      };

      const response = await ApiManager.verifyOtp(body);

      if (response.data.status === 'success') {
        const user = response.data.data;
        const token = response.data.token;

        dispatch(setUser(user));
        console.log('User in verification', user);
        console.log('Token in verification', token);
        dispatch(setUserToken(token));

        if (!user.firstName || !user.lastName) {
          navigation.replace('ShortProfile');
          return;
        }

        if (
          userType === 'contractor' ||
          userType === 'architect' ||
          userType === 'designer'
        ) {
          navigation.replace('ProfTabNav');
        } else {
          navigation.replace('CustmTabNav');
        }
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;

      if (serverMessage === 'Invalid OTP') {
        setOtp('');
      }

      if (serverMessage) {
        Alert.alert(serverMessage);
      } else {
        Alert.alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg2.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Verification OTP</Text>

        <Text style={styles.subtitle}>
          Enter the OTP sent to your mobile number
        </Text>
        <View style={{ marginTop: 5 }}>
          <OTPInput length={5} onChangeOTP={value => setOtp(value)} />
        </View>

        <SecondaryButton title="Verify" onPress={handleVerifyOtp} />
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontFamily: FONT.POPPINS_REGULAR,
              fontSize: 16,
            }}
          >
            Didn't receive the OTP?
          </Text>
        </View>

        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default VerificationScreen;

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
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 4,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  resendContainer: {
    marginTop: 10,
    alignItems: 'center',
  },

  resendText: {
    color: '#3AA171',
    fontSize: 18,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
