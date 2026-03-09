import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { WIDTH } from '../../utils/responsive';
import Colors from '../../constants/colors';

interface OTPInputProps {
  length?: number;
  onChangeOTP: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 5, onChangeOTP }) => {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    onChangeOTP(otp);
  }, [otp]);

  return (
    <View style={styles.container}>
      <OTPTextInput
        inputCount={length}
        handleTextChange={(code: string) => setOtp(code)}
        containerStyle={styles.row}
        textInputStyle={styles.input}
        tintColor={Colors.primary}
        offTintColor="#ccc"
      />
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },

  row: {
    flexDirection: 'row',
  },

  input: {
    width: WIDTH(11),
    height: WIDTH(12),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 6,
    backgroundColor: '#FFFFFF',
  },
});
