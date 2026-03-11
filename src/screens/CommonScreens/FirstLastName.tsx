import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CustomTextInput from '../../components/Inputs/CustomTextInput';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';

import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { useSelector, UseSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import ApiManager from '../../apis/ApiManager';
import { useNavigation } from '@react-navigation/native';

const FirstLastName = () => {
  const navigation = useNavigation();

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.userToken);
  console.log('USerttttttt Token', token);
  const userId = user?.id;

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleNext = async () => {
    try {
      if (!name || !lastName) {
        alert('Please enter your name');
        return;
      }

      const body = {
        firstName: name,
        lastName: lastName,
      };

      const response = await ApiManager.shortProfile(userId, body, token);

      console.log('Profile response:', response.data);

      if (response.data.status === 'success') {
        navigation.replace('CustmTabNav');
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;

      Alert.alert(serverMessage || 'Something went wrong');
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <CustomTextInput
          label="First Name"
          //prefix="
          placeholder="First Name"
          keyboardType="number-pad"
          value={name}
          onChangeText={setName}
        />
        <CustomTextInput
          label="Last Name"
          //prefix="
          placeholder="Last Name"
          keyboardType="number-pad"
          value={lastName}
          onChangeText={setLastName}
        />

        <SecondaryButton title="Next" onPress={handleNext} />
      </View>
    </ImageBackground>
  );
};

export default FirstLastName;

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
    marginBottom: 30,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: FONTSIZE(1.6),
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
    fontSize: FONTSIZE(1.6),
    marginRight: 10,
    color: '#333',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  input: {
    flex: 1,
    fontSize: FONTSIZE(1.6),
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
    fontSize: FONTSIZE(1.6),
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontWeight: '600',
  },
});
