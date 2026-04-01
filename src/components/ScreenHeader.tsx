import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/colors';
import { FONT } from '../theme/fonts';
import { FONTSIZE, WIDTH, HEIGHT } from '../utils/responsive';
import BackIcon from '../assets/svgs/LeftArrow.svg';

const ScreenHeader = ({ title, showBack = false, onBackPress }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={22} height={22} />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>

      {showBack && <View style={{ width: 22 }} />}
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTH(4),
    paddingVertical: 12,
    marginTop: 20,
  },

  title: {
    fontSize: 18,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#000',
  },
});
