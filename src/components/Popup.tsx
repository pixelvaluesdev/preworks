import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Colors from '../constants/colors';
import { FONT } from '../theme/fonts';
import { FONTSIZE, HEIGHT } from '../utils/responsive';
import SecondaryButton from './Buttons/SecondaryBtn';
import BorderTextInput from './Inputs/BorderTextInput';

const Popup = ({ title, visible, onClose, showQuotation = true }) => {
  const [quotation, setQuotation] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          {/* Quotation Input */}
          {showQuotation && (
            <BorderTextInput
              label="Quotation"
              value={quotation}
              onChangeText={setQuotation}
            />
          )}

          {/* Message Input */}
          <BorderTextInput
            label="Any Message"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <SecondaryButton
            title="Submit"
            style={styles.submitBtn}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 20,
    fontWeight: '600',
  },

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

  inputMessage: {
    backgroundColor: '#fff',
    height: HEIGHT(10),
  },

  outline: {
    borderRadius: 14, // increased radius
    borderWidth: 0.75,
  },

  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
});
