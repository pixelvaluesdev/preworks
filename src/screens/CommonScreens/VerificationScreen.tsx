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

const VerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const route = useRoute();
  const { phone } = route.params;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleVerifyOtp = async () => {
    try {
      if (otp.length !== 6) {
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
        console.log('12112', user);

        dispatch(setUser(user));
        dispatch(setUserToken(token));

        if (!user.firstName) {
          navigation.replace('ShortProfile');
        } else {
          navigation.replace('CustmTabNav');
        }
      }
    } catch (error) {
      const status = error?.response?.status;
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
      source={require('../../assets/pngs/BGImg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Verification</Text>

        <Text style={styles.subtitle}>
          Enter the OTP sent to your mobile number
        </Text>
        <View style={{ marginTop: 10 }}>
          <OTPInput length={6} onChangeOTP={value => setOtp(value)} />
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
            Didn't recive the OTP?
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
    fontFamily: FONT.POPPINS_BOLD,
    marginBottom: 5,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  resendContainer: {
    marginTop: 10,
    alignItems: 'center',
  },

  resendText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: FONT.POPPINS_BOLD,
  },
});
