import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';

const CustomPopup = ({ visible, message, buttons = [], onClose }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.message}>{message}</Text>

          <View
            style={[
              styles.buttonRow,
              buttons.length === 1 && styles.singleButtonRow,
            ]}
          >
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn.type === 'primary' && styles.primaryBtn,
                ]}
                onPress={btn.onPress}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.type === 'primary' && styles.primaryBtnText,
                  ]}
                >
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupContainer: {
    width: WIDTH(90),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },

  message: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',

    gap: 12,
    marginTop: 10,
  },

  singleButtonRow: {
    justifyContent: 'center',
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    minWidth: 100,
    alignItems: 'center',
  },

  primaryBtn: {
    backgroundColor: Colors.primary,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#333',
  },

  primaryBtnText: {
    color: '#FFFFFF',
  },
});
