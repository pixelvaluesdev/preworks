import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';

const AppButton = ({
  title,
  onPress,
  type = 'primary', // 'primary' | 'outline'
  style,
}: any) => {
  const isOutline = type === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isOutline ? styles.outlineBtn : styles.primaryBtn,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isOutline ? styles.outlineText : styles.primaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryBtn: {
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },

  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },

  text: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  primaryText: {
    color: '#fff',
  },

  outlineText: {
    color: '#2DBE7F',
  },
});
