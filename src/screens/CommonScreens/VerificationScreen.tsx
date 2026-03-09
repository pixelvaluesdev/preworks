import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import OTPInput from '../../components/Inputs/OtpInput';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
const VerificationScreen = () => {
  const [otp, setOtp] = useState('');

  const navigation = useNavigation();

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

        <OTPInput length={6} onChangeOTP={value => setOtp(value)} />

        <SecondaryButton
          title="Verify"
          onPress={() => navigation.navigate('CustmTabNav')}
        />
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
              fontSize: FONTSIZE(1.6),
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
    fontSize: FONTSIZE(3.2),
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_REGULAR,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: FONTSIZE(1.6),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  resendText: {
    color: Colors.primary,
    fontSize: FONTSIZE(1.6),
  },
});
