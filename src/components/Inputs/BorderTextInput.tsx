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
}) => {
  const [inputHeight, setInputHeight] = useState(height || HEIGHT(6));
  return (
    <View style={[styles.inputWrapper, containerStyle]}>
      <Text style={styles.floatingLabel}>
        {label}
        <Text style={styles.asterisk}> *</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#a6a6a6"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          outlineColor="#757575"
          activeOutlineColor={Colors.primary}
          textColor={'#474747'}
          editable={editable}
          onContentSizeChange={e => {
            if (multiline) {
              setInputHeight(e.nativeEvent.contentSize.height);
            }
          }}
          style={[
            styles.input,

            {
              height: multiline
                ? Math.max(height || HEIGHT(6), inputHeight)
                : height || HEIGHT(6),
              paddingRight: 0,
              fontSize: 14,
              fontFamily: FONT.POPPINS_REGULAR,
              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
          outlineStyle={styles.outline}
          keyboardType={keyboardType}
          theme={{
            fonts: {
              bodyLarge: {
                fontFamily: FONT.POPPINS_REGULAR,
                fontSize: 5,
                color: 'red',
              },
            },
          }}
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
    borderRadius: 10,
    borderWidth: 0.75,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
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
});
