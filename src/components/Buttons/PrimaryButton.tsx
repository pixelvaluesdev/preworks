import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FONT } from '../../theme/fonts';
import { WIDTH } from '../../utils/responsive';
import Colors from '../../constants/colors';

const PrimaryButton = ({
  title,
  Icon,
  onPress,
  disabled = false,
  width,
}: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        width && { width },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.innerContainer}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={35} height={35} />
          </View>
        )}

        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  container: {
    width: WIDTH(70), // 🔥 increase width (60 → 75)
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'white',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },

  disabled: {
    opacity: 0.5,
  },

  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2, // 🔥 better height
    paddingHorizontal: 14,
  },

  iconContainer: {
    marginRight: 12,
  },

  text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_BOLD,
    // ❌ remove flex: 1
    flexShrink: 1, // 🔥 allows proper text shrink instead of pushing space
  },
});
