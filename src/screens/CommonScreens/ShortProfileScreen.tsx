import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';

import CustomTextInput from '../../components/Inputs/CustomTextInput';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';

import ApiManager from '../../apis/ApiManager';
import { FONT } from '../../theme/fonts';
import { WIDTH } from '../../utils/responsive';
import { setUser } from '../../redux/slices/authSlice';
import CustomPopup from '../../components/Popups/CustomPopup';

const ShortProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useAppSelector(state => state.auth.user);
  console.log(user);
  const token = useAppSelector(state => state.auth.userToken);
  const userType = useAppSelector(state => state.auth.userType);
  const isCustomer = userType === 'customer';

  const userId = user?._id;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleNext = async () => {
    if (loading) {
      return;
    }

    if (!userId || !token) {
      setPopupMessage('Session expired. Please login again.');
      setPopupVisible(true);
      return;
    }
    const fName = firstName.trim();
    const lName = lastName.trim();

    if (!fName || !lName) {
      setPopupMessage('Please enter both first and last name');
      setPopupVisible(true);

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
        // setPopupMessage(response.data.message || 'Profile added successfully');
        // setPopupVisible(true);

        const updatedUser = {
          ...user,
          firstName: fName,
          lastName: lName,
        };

        dispatch(setUser(updatedUser));

        const isProfessional =
          userType === 'contractor' ||
          userType === 'architect' ||
          userType === 'designer';

        if (isCustomer) {
          navigation.replace('CustmTabNav');
        } else if (isProfessional && !updatedUser.image) {
          navigation.replace('EditProfileScreen', {
            userId,
          });
        } else {
          navigation.replace('ProfTabNav');
        }
      } else {
        setPopupMessage(response.data?.message || 'Something went wrong');
        setPopupVisible(true);
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;

      setPopupMessage(serverMessage || 'Network error');
      setPopupVisible(true);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            title="Next"
            loading={loading}
            disabled={loading}
            onPress={handleNext}
          />
        </View>

        <CustomPopup
          visible={popupVisible}
          message={popupMessage}
          onClose={() => setPopupVisible(false)}
          buttons={[
            {
              label: 'OK',
              type: 'primary',
              onPress: () => {
                setPopupVisible(false);
              },
            },
          ]}
        />
      </KeyboardAvoidingView>
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
    // backgroundColor: 'rgba(0,0,0,0.45)',
  },
});
