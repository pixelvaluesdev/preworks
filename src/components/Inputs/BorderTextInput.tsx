import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, HEIGHT } from '../../utils/responsive';

interface BorderTextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  height?: number;
  containerStyle?: any;
  rightComponent?: React.ReactNode;
  editable?: boolean;
  keyboardType?: any;
  maxLength?: number;
  mandotory?: boolean;
  leftComponent?: React.ReactNode;
}

const BorderTextInput: React.FC<BorderTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  height,
  containerStyle,
  rightComponent,
  editable = true,
  keyboardType = 'default',
  maxLength,
  mandotory = true,
  leftComponent,
}) => {
  const [inputHeight, setInputHeight] = useState(height || HEIGHT(6));
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, containerStyle]}>
      <Text style={styles.floatingLabel}>
        {label}
        {mandotory ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>

      <View
        style={[styles.inputContainer, isFocused && styles.focusedContainer]}
      >
        {leftComponent && (
          <View style={styles.leftComponent}>{leftComponent}</View>
        )}
        <TextInput
          mode="outlined"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#a6a6a6"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          outlineColor="#757575"
          activeOutlineColor={Colors.primary}
          textColor={'#474747'}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          contentStyle={{
            fontSize: 16,
            fontFamily: FONT.POPPINS_REGULAR,
            paddingTop: multiline ? 14 : 0,
            paddingBottom: multiline ? 14 : 0,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          style={[
            styles.input,
            {
              minHeight: multiline ? HEIGHT(14) : HEIGHT(6),

              paddingLeft: leftComponent ? 90 : 0,
              paddingRight: rightComponent ? 40 : 0,

              fontSize: 14,
              fontFamily: FONT.POPPINS_REGULAR,

              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
          outlineStyle={styles.outline}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />

        {rightComponent && (
          <View style={styles.rightComponent}>{rightComponent}</View>
        )}
      </View>
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
    top: -10,
    left: 16,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    zIndex: 1,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  input: {
    backgroundColor: 'white',
    color: 'black',
  },

  outline: {
    borderRadius: 12,
    borderWidth: 0,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'white',

    borderColor: '#E2E2E2',
    borderWidth: 1.2,

    // soft base shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },

  rightComponent: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
  focusedContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,

    // 3D Shadow
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,

    elevation: 10,

    // subtle raised look
    backgroundColor: '#FFFFFF',
  },
  leftComponent: {
    position: 'absolute',
    left: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
