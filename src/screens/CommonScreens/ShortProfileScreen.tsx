import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomTextInput from '../../components/Inputs/CustomTextInput';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';

import ApiManager from '../../apis/ApiManager';
import { FONT } from '../../theme/fonts';
import { WIDTH } from '../../utils/responsive';
import { setUser } from '../../redux/slices/authSlice';

const ShortProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.userToken);

  const userId = user?._id;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const fName = firstName.trim();
    const lName = lastName.trim();

    if (!fName || !lName) {
      Alert.alert('Error', 'Please enter both first and last name');
      return;
    }

    try {
      setLoading(true);

      const body = {
        firstName: fName,
        lastName: lName,
      };

      const response = await ApiManager.shortProfile(userId, body, token);

      if (response.data?.status === 'success') {
        Alert.alert(
          'Success',
          response.data.message || 'Profile updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('CustmTabNav'),
            },
          ],
        );
        const updatedUser = {
          ...user,
          firstName: fName,
          lastName: lName,
        };

        dispatch(setUser(updatedUser));
      } else {
        Alert.alert('Error', response.data?.message || 'Something went wrong');
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;

      Alert.alert('Error', serverMessage || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg3.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <CustomTextInput
          label="First Name"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <CustomTextInput
          label="Last Name"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <SecondaryButton
          title={loading ? 'Saving...' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </ImageBackground>
  );
};

export default ShortProfileScreen;

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
});
