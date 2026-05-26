import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import UploadIcon from '../../assets/svgs/UploadIcon.svg';
import CloseIcon from '../../assets/svgs/Delete.svg';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';

const UploadBox = ({
  label,
  value,
  onPress,
  onRemove,
  required = true,
  showPreview = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.asterisk}>*</Text>}
      </Text>

      <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        {/* Upload Icon */}
        <View style={styles.uploadIcon}>
          <UploadIcon />
        </View>

        {/* Content */}
        {showPreview && Array.isArray(value) && value.length > 0 ? (
          <View style={styles.previewWrapper}>
            {value.map((file, index) => (
              <View key={index} style={styles.previewContainer}>
                <Image source={{ uri: file.uri }} style={styles.previewImage} />

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => {
                    const updated = value.filter((_, i) => i !== index);
                    onRemove(updated);
                  }}
                >
                  <CloseIcon width={14} height={14} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.placeholder}>Browse image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadBox;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
    paddingTop: 22,
    justifyContent: 'center',
  },

  uploadIcon: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  previewWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
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
    top: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    elevation: 3,
  },

  placeholder: {
    color: '#a6a6a6',
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 16,
  },
  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
