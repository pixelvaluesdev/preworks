import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { FONT } from '../../theme/fonts';
import { WIDTH } from '../../utils/responsive';

const PrimaryButton = ({ title, Icon, onPress, disabled = false }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.blurContainer}>
        {Icon && <Icon width={40} height={40} />}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  container: {
    width: WIDTH(60),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  blurContainer: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontWeight: '600',
  },
});
