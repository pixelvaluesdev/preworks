import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ServiceCard from './ServiceCard';

import ContractorIcon from '../../assets/svgs/ContractorIcon.svg';
import ArchitectIcon from '../../assets/svgs/ArchitectIcon.svg';
import InteriorIcon from '../../assets/svgs/InteriorIcon.svg';

import { WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import { FONTSIZE } from '../../utils/responsive';

const services = [
  {
    title: 'Contractor',
    Icon: ContractorIcon,
    type: 'contractor',
    subtitle: 'Hire Professional',
  },
  {
    title: 'Architect',
    Icon: ArchitectIcon,
    type: 'architect',
    subtitle: 'Plan your Project',
  },
  {
    title: 'Interior Designer',
    Icon: InteriorIcon,
    type: 'designer',
    subtitle: 'Design Your Space',
  },
];

const WhatWeDoSection = () => {
  const navigation = useNavigation();

  const handlePress = (type: string) => {
    navigation.navigate('ProfessionalList', { type });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What We Do</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {services.map((item, index) => (
          <ServiceCard
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            Icon={item.Icon}
            onPress={() => handlePress(item.type)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default WhatWeDoSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: WIDTH(4),
  },

  title: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 2,
  },
});
