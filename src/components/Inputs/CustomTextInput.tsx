import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FONT } from '../../theme/fonts';
import { FONTSIZE } from '../../utils/responsive';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  maxLength,
  prefix,
}: any) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#757575"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 14,
  },

  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },

  prefix: {
    marginRight: 2,
    color: '#757575',
    fontFamily: FONT.POPPINS_REGULAR,
    justifyContent: 'center',
    fontSize: 16,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
    textAlignVertical: 'center',
    fontFamily: FONT.POPPINS_REGULAR,
  },
});
