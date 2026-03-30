import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { FONT } from '../../theme/fonts';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Architect from '../../assets/svgs/Architect.svg';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, UseDispatch } from 'react-redux';
import { setUserType } from '../../redux/slices/authSlice';
import Architect2 from '../../assets/svgs/Architect2 (2).svg';
import Interior from '../../assets/svgs/Interior2.svg';

const ProfessionalWelcomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please select a Professional Role.</Text>

        <PrimaryButton
          title="Contractor"
          Icon={Architect}
          onPress={() => {
            dispatch(setUserType('contractor'));
            navigation.navigate('Login');
          }}
        />

        <PrimaryButton
          title="Architect"
          Icon={Architect2}
          onPress={() => {
            dispatch(setUserType('architect'));
            navigation.navigate('Login');
          }}
        />

        <PrimaryButton
          title="Interior Designer"
          Icon={Interior}
          onPress={() => {
            dispatch(setUserType('designer'));
            navigation.navigate('Login');
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default ProfessionalWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 10,
    fontFamily: FONT.POPPINS_BOLD,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontWeight: '500',
  },
});
