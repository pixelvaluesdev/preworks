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
import { useSelector } from 'react-redux';
import ApiManager from '../../apis/ApiManager';
import { useSnackbar } from '../../hooks/SnackbarProvider';

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');

  const navigation = useNavigation();

  const showSnackbar = useSnackbar();

  const userType = useSelector((state: any) => state.auth.userType);

  const handleGetOtp = async () => {
    const trimmedMobile = mobile.trim();

    if (trimmedMobile.length !== 10) {
      showSnackbar('Phone number must be exactly 10 digits', 'error');
      return;
    }

    try {
      const body = {
        phone: trimmedMobile,
        userType: userType,
      };

      console.log(body, 'In proffessional ligu');

      const response = await ApiManager.phoneSignin(body);

      console.log(response);

      if (response.data.status === 'success') {
        showSnackbar(response.data.message, 'success');
        navigation.navigate('OtpVeri', { phone: trimmedMobile });
      }
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || 'Something went wrong';

      showSnackbar(serverMessage, 'error');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg2.png')}
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
          prefix="+91-"
          placeholder="Mobile number"
          keyboardType="number-pad"
          maxLength={10}
          value={mobile}
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setMobile(numericText);
          }}
        />

        <SecondaryButton title="Get OTP" onPress={handleGetOtp} />

        {/* <SecondaryButton
          title="Dummy Home"
          onPress={() => navigation.navigate('CustmTabNav')}
        /> */}
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
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_SEMIBOLD,
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
    fontSize: 14,
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
