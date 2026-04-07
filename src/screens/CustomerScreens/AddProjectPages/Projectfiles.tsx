import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FONT } from '../../../theme/fonts';
import UploadIcon from '../../../assets/svgs/UploadIcon.svg';
import { Switch } from 'react-native';
import Colors from '../../../constants/colors';
import CheckBox from '@react-native-community/checkbox';
import { launchImageLibrary } from 'react-native-image-picker';
import CloseIcon from '../../../assets/svgs/Delete.svg';

const Projectfile = ({ data, handleChange }: any) => {
  const hasDrawing = data?.hasDrawing ?? false;
  const services = data?.services || [];

  const toggleService = service => {
    let updated = [...services];

    if (updated.includes(service)) {
      updated = updated.filter(item => item !== service);
    } else {
      updated.push(service);
    }

    handleChange('services', updated);
  };

  const pickImage = key => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;

        if (uri) {
          handleChange(key, uri); // store image
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <UploadBox
        label="Upload Site image (Required)"
        value={data.siteImage}
        onPress={() => pickImage('siteImage')}
        rightComponent={<UploadIcon />}
      />

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          Do you already have architectural drawings?
          <Text style={styles.asterisk}> *</Text>
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
          onPress={() => pickImage('archDrawing')}
          textStyle={{ fontSize: 10 }}
          rightComponent={<UploadIcon />}
          onRemove={() => handleChange('siteImage', '')}
        />
      )}
      {!hasDrawing && (
        <>
          {/* SERVICES */}
          <View>
            <Text style={styles.questionText}>
              What services do you need? <Text style={styles.asterisk}> *</Text>
            </Text>

            {[
              'Architectural Design',
              'Plan Sanctioning',
              'Structural Design',
              'Construction',
              'Interior Design',
              'Renovation',
            ].map((item, index) => {
              const isSelected = services.includes(item);

              return (
                <View key={item} style={styles.checkboxRow}>
                  <CheckBox
                    value={isSelected}
                    onValueChange={() => toggleService(item)}
                    tintColors={{ true: Colors.primary, false: '#999' }}
                  />
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </View>
              );
            })}
          </View>

          {/* HIDE NUMBER */}
          <View style={styles.toggleContainer}>
            <Text style={styles.questionText}>
              Do you want to hide your number?{' '}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <Switch
              value={data?.hideNumber || false}
              onValueChange={val => handleChange('hideNumber', val)}
              trackColor={{ false: '#ccc', true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <Text style={styles.note}>
            <Text style={styles.noteLabel}>Note: </Text>
            IF you choose to hide you will not receive any calls from
            professional.
          </Text>
        </>
      )}
    </View>
  );
};

export default Projectfile;

const UploadBox = ({
  label,
  style,
  value,
  onPress,
  rightComponent,
  textStyle,
  onRemove,
}: any) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.label, textStyle]}>
        {label} <Text style={styles.asterisk}> *</Text>
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
        {rightComponent && <View>{rightComponent}</View>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 50,
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
    color: '#757575',
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
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: FONT.POPPINS_REGULAR,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // always white
  },

  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  checkboxLabel: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  toggleContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  toggle: {
    width: 40,
    height: 22,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },

  note: {
    fontSize: 14,
    color: '#757575',
    marginTop: 10,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  noteLabel: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
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
});
