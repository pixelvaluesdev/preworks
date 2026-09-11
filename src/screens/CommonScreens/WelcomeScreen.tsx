import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { FONT } from '../../theme/fonts';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Customer from '../../assets/svgs/Customer.svg';
import Professional from '../../assets/svgs/Professional.svg';
import { useNavigation } from '@react-navigation/native';
import { WIDTH } from '../../utils/responsive';
import Logo from '../../assets/svgs/PreworksLogo.svg';
import { setUserType } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import { triggerHaptic } from '../../utils/hapticks';
import UserTypeButton from '../../components/Buttons/UserTypeButton';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const hasSeenOnboarding = useAppSelector(
    state => state.auth.hasSeenOnboarding,
  );

  const hasSeenProfessionalOnboarding = useAppSelector(
    state => state.auth.hasSeenProfessionalOnboarding,
  );

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg1.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../../assets/pngs/PWLogo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please Select Your Role</Text>

        <View style={styles.buttonContainer}>
          <UserTypeButton
            title="Customer"
            Icon={Customer}
            onPress={() => {
              triggerHaptic('impactHeavy');
              dispatch(setUserType('customer'));

              if (!hasSeenOnboarding) {
                navigation.navigate('Onboarding');
              } else {
                navigation.navigate('Login');
              }
            }}
          />

          <UserTypeButton
            title="Professional"
            Icon={Professional}
            onPress={() => {
              triggerHaptic('impactHeavy');
              dispatch(setUserType('professional'));
              navigation.navigate('ProfWelc');
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: WIDTH(6),
  },

  title: {
    fontSize: 22,
    color: '#4c4c4c',
    marginTop: -20,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  subtitle: {
    fontSize: 14,
    color: '#787575',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoImage: {
    width: 210,
    height: 145,
    //marginBottom: -66,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
