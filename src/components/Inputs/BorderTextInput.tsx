import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, HEIGHT } from '../../utils/responsive';

interface BorderTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  height?: number;
}

const BorderTextInput: React.FC<BorderTextInputProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
  height,
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.floatingLabel}>{label}</Text>

      <TextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        outlineColor="#757575"
        activeOutlineColor={Colors.primary}
        style={[styles.input, multiline && { height: height || HEIGHT(10) }]}
        outlineStyle={styles.outline}
      />
    </View>
  );
};

export default BorderTextInput;

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },

  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    fontSize: 14,
    color: '#333',
    zIndex: 1,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  input: {
    backgroundColor: '#fff',
  },

  outline: {
    borderRadius: 14,
    borderWidth: 0.75,
  },
});
