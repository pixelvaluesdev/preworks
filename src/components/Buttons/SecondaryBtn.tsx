import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE } from '../../utils/responsive';
import { triggerHaptic } from '../../utils/hapticks';

interface SecondaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: any;
  loading?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  icon,
  loading = false,
}) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (disabled || loading) {
      return;
    }

    triggerHaptic('impactHeavy');
    onPress(event);
  };
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}

          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  disabled: {
    opacity: 0.5,
  },
});
