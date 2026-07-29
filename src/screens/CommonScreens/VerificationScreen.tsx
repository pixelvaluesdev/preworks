import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
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
import CustomPopup from '../../components/Popups/CustomPopup';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import { getFCMToken } from '../../utils/firebaseNotifications';

const VerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const showSnackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    message: '',
    buttons: [],
  });
  const route = useRoute();
  const { phone } = route.params;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userType = useSelector((state: any) => state.auth.userType);
  console.log(userType, 'user type from selector');

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      if (otp.length !== 5) {
        showPopup('Please enter valid OTP', [
          {
            label: 'OK',
            type: 'primary',
            onPress: () => setPopupVisible(false),
          },
        ]);
        return;
      }

      const body = {
        phone: phone,
        otp: otp,
      };

      const response = await ApiManager.verifyOtp(body);
      console.log(response, 'Verificationnn resp');

      if (response.data.status === 'success') {
        const user = response.data.data;

        // Check if account is deactivated
        if (!user.status) {
          showPopup(
            'Your account has been deactivated. Please contact the administrator.',
            [
              {
                label: 'OK',
                type: 'primary',
                onPress: () => {
                  setPopupVisible(false);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                  });
                },
              },
            ],
          );

          return;
        }
        const token = response.data.token;

        dispatch(setUser(user));
        console.log('User in verification', user);
        console.log('Token in verification', token);
        dispatch(setUserToken(token));

        try {
          const fcmToken = await getFCMToken();

          if (fcmToken) {
            const fcmBody = {
              userId: user._id,
              fcmToken: fcmToken,
            };

            const fcmResponse = await ApiManager.registerFcmToken(
              fcmBody,
              token,
            );

            console.log('FCM REGISTER RESPONSE:', fcmResponse.data);
          }
        } catch (error) {
          console.log('FCM REGISTER ERROR:', error);
        }

        const isProfessional =
          userType === 'contractor' ||
          userType === 'architect' ||
          userType === 'designer';

        // STEP 1 → Name check
        if (!user.firstName || !user.lastName) {
          navigation.replace('ShortProfile');
          return;
        }

        // STEP 2 → Professional image check
        if (isProfessional && !user.image) {
          navigation.replace('EditProfileScreen', { userId: user._id });

          return;
        }

        // STEP 3 → Final navigation
        if (isProfessional) {
          navigation.replace('ProfTabNav');
        } else {
          navigation.replace('CustmTabNav');
        }
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      console.log('OTP verification error:', error);

      if (serverMessage === 'Invalid OTP') {
        setOtp('');
      }

      if (serverMessage) {
        showPopup(serverMessage, [
          {
            label: 'OK',
            type: 'primary',
            onPress: () => setPopupVisible(false),
          },
        ]);
      } else {
        showPopup('Something went wrong. Please try again.', [
          {
            label: 'OK',
            type: 'primary',
            onPress: () => setPopupVisible(false),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtp = async () => {
    const trimmedMobile = phone.trim();

    if (trimmedMobile.length !== 10) {
      showSnackbar('Phone number must be exactly 10 digits', 'error');
      return;
    }

    try {
      setLoading2(true);
      const body = {
        phone: trimmedMobile,
        userType: userType,
      };

      console.log(body, 'In proffessional ligu');

      const response = await ApiManager.phoneSignin(body);

      console.log(response);

      if (response.data.status === 'success') {
        showSnackbar(response.data.message, 'success');
        // navigation.navigate('OtpVeri', { phone: trimmedMobile });
      }
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || 'Something went wrong';
      console.log('OTP resend error:', error);

      showSnackbar(serverMessage, 'error');
    } finally {
      setLoading2(false);
    }
  };

  const showPopup = (message, buttons = []) => {
    setPopupConfig({ message, buttons });
    setPopupVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/pngs/BGImg2.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>Verification OTP</Text>

            <Text style={styles.subtitle}>
              Enter the OTP sent to your mobile number
            </Text>
            <View style={{ marginTop: 5 }}>
              <OTPInput length={5} onChangeOTP={value => setOtp(value)} />
            </View>

            <SecondaryButton
              title={loading ? <ActivityIndicator color="#fff" /> : 'Verify'}
              onPress={handleVerifyOtp}
              disabled={loading}
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
                  fontSize: 16,
                }}
              >
                Didn't receive the OTP?
              </Text>
            </View>

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleGetOtp}
            >
              <Text style={styles.resendText}>
                {loading2 ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  'Resend OTP'
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <CustomPopup
            visible={popupVisible}
            message={popupConfig.message}
            buttons={popupConfig.buttons}
            onClose={() => setPopupVisible(false)}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
    // backgroundColor: 'rgba(0,0,0,0.45)',
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
