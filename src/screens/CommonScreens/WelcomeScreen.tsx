import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { FONT } from '../../theme/fonts';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Customer from '../../assets/svgs/Customer.svg';
import Professional from '../../assets/svgs/Professional.svg';
import { useNavigation } from '@react-navigation/native';
import { WIDTH } from '../../utils/responsive';
import Logo from '../../assets/svgs/PreworksLogo.svg';
import { setUserType } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { triggerHaptic } from '../../utils/hapticks';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const hasSeenOnboarding = useSelector(
    (state: any) => state.auth.hasSeenOnboarding,
  );

  const hasSeenProfessionalOnboarding = useSelector(
    (state: any) => state.auth.hasSeenProfessionalOnboarding,
  );

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Logo width={200} />

        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please Select Your User Type</Text>

        <PrimaryButton
          title="Customer"
          width={WIDTH(50)}
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

        <PrimaryButton
          title="Professional"
          Icon={Professional}
          width={WIDTH(50)}
          onPress={() => {
            triggerHaptic('impactHeavy');
            dispatch(setUserType('professional'));

            navigation.navigate('ProfWelc');
          }}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(4),
    //backgroundColor: 'rgba(0,0,0,0.45)',
    shadowColor: 'black',
  },

  title: {
    fontSize: 32,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: FONT.POPPINS_BOLD,
  },

  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
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
});
