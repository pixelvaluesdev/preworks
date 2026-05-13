import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';
import { triggerHaptic } from '../../utils/hapticks';

const CustomPopup = ({
  visible,
  message,
  buttons = [],
  onClose,
  disableOutsideClick = false,
}) => {
  const isObject = typeof message === 'object';

  const title = isObject ? message?.title : message;
  const subtitle = isObject ? message?.subtitle : null;
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (!disableOutsideClick) {
            onClose?.();
          }
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.title}>{title}</Text>

            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {/*  FIX: Handle 3 buttons separately */}
            {buttons.length === 3 ? (
              <>
                {/* Top row (first 2 buttons) */}
                <View style={styles.buttonRow}>
                  {buttons.slice(0, 2).map((btn, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        btn.type === 'primary' && styles.primaryBtn,
                      ]}
                      onPress={() => {
                        triggerHaptic('impactHeavy');
                        btn.onPress?.();
                      }}
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

                {/* Bottom centered button (Cancel) */}
                <View style={styles.bottomButtonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.singleButton]}
                    onPress={() => {
                      triggerHaptic('impactHeavy');
                      buttons[2].onPress?.();
                    }}
                  >
                    <Text style={styles.buttonText}>{buttons[2].label}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
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
                      buttons.length === 1 && styles.singleButton,
                      btn.type === 'primary' && styles.primaryBtn,
                    ]}
                    onPress={() => {
                      triggerHaptic('impactHeavy');
                      btn.onPress?.();
                    }}
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
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
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

  singleButton: {
    flex: 0,
    minWidth: 120,
    paddingHorizontal: 20,
  },

  bottomButtonContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    textAlign: 'center',
    color: Colors.primary,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    textAlign: 'center',
    color: '#777',
    marginTop: 6,
    lineHeight: 20,
  },
});
