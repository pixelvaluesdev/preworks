import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import UploadIcon from '../../assets/svgs/UploadIcon.svg';
import CloseIcon from '../../assets/svgs/Delete.svg';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';

const UploadBox = ({ label, value, onPress, onRemove, required = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.asterisk}>*</Text>}
      </Text>

      <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        {value ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: value }} style={styles.previewImage} />

            <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
              <CloseIcon width={16} height={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.placeholder}>Browse image</Text>
        )}

        <UploadIcon />
      </TouchableOpacity>
    </View>
  );
};

export default UploadBox;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    position: 'absolute',
    top: -8,
    left: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    zIndex: 1,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  uploadBox: {
    borderWidth: 0.75,
    borderColor: '#757575',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  previewContainer: {
    position: 'relative',
  },

  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    elevation: 3,
  },

  placeholder: {
    color: '#a6a6a6',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
