import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { FONTSIZE } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';

import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Architect from '../../assets/svgs/Architect.svg';
const ProfessionalWelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/pngs/BGImg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          Please select your Professional Role.
        </Text>

        <PrimaryButton
          title="Contractor"
          Icon={Architect}
          //   onPress={() => navigation.navigate('BuilderRegister')}
          onPress={() => navigation.navigate('ProfTabNav')}
        />

        <PrimaryButton
          title="Architect"
          Icon={Architect}
          //   onPress={() => navigation.navigate('ArchitectRegister')}
        />

        <PrimaryButton
          title="Interior Designer"
          Icon={Architect}
          //   onPress={() => navigation.navigate('DesignerRegister')}
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
    fontSize: FONTSIZE(3.2),
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
