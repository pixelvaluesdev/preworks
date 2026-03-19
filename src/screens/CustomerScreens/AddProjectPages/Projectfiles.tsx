import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT } from '../../../theme/fonts';

const Projectfile = ({ data, handleChange }: any) => {
  const hasDrawing = data?.hasDrawing ?? false;

  return (
    <View style={styles.container}>
      <UploadBox
        label="Upload Site image (Required)"
        value={data.siteImage}
        onPress={() => {}}
      />

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          Do you already have architectural drawings?
        </Text>

        <View style={styles.radioRow}>
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => handleChange('hasDrawing', true)}
          >
            <View style={styles.radioOuter}>
              {hasDrawing && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>YES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => handleChange('hasDrawing', false)}
          >
            <View style={styles.radioOuter}>
              {!hasDrawing && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasDrawing && (
        <UploadBox
          label="Upload architectural drawing (Preferred PDF)"
          value={data.archDrawing}
          onPress={() => {}}
        />
      )}
    </View>
  );
};

export default Projectfile;

const UploadBox = ({ label, value, onPress }: any) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        <Text style={{ color: value ? '#000' : '#a6a6a6' }}>
          {value || 'Browse image'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  inputWrapper: {
    position: 'relative',
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

  questionContainer: {
    marginTop: 10,
  },

  questionText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  radioRow: {
    flexDirection: 'row',
    gap: 20,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2DBE7F',
  },

  radioLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: FONT.POPPINS_REGULAR,
  },
});
