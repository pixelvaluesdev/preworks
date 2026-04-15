import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { FONT } from '../../../theme/fonts';
import UploadIcon from '../../../assets/svgs/UploadIcon.svg';
import { Switch } from 'react-native';
import Colors from '../../../constants/colors';
import CheckBox from '@react-native-community/checkbox';
import { launchImageLibrary } from 'react-native-image-picker';
import CloseIcon from '../../../assets/svgs/Delete.svg';
import { pick } from '@react-native-documents/picker';
import CustomPopup from '../../../components/Popups/CustomPopup';

const Projectfile = ({ data, handleChange }: any) => {
  const hasDrawing = data?.hasDrawing ?? false;
  const services = data?.services || [];

  const [popupVisible, setPopupVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState('');

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
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log(response.errorMessage);
        return;
      }

      const files =
        response.assets?.map(item => ({
          uri: item.uri,
          type: item.type,
          name: item.fileName,
        })) || [];

      if (files.length) {
        handleChange(key, [...(data[key] || []), ...files]);
      }
    });
  };

  const pickDocument = async key => {
    try {
      const res = await pick({
        type: ['application/pdf'],
        allowMultiSelection: true,
      });

      const files = res.map(item => ({
        uri: item.uri,
        type: item.type,
        name: item.name,
      }));

      if (files.length) {
        handleChange(key, [...(data[key] || []), ...files]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pickMedia = key => {
    Alert.alert('Upload File', 'Choose file type', [
      {
        text: 'Images',
        onPress: () => pickImage(key),
      },
      {
        text: 'PDF',
        onPress: () => pickDocument(key),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const openPickerPopup = key => {
    setCurrentKey(key);
    setPopupVisible(true);
  };

  return (
    <View style={styles.container}>
      <UploadBox
        label="Upload Site images (Required)"
        value={data.siteImage}
        onPress={() => pickImage('siteImage')}
        rightComponent={<UploadIcon />}
        onRemove={updatedArray => handleChange('siteImage', updatedArray)}
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
          label="Upload architectural drawings (Preferred PDF)"
          value={data.archDrawing}
          onPress={() => openPickerPopup('archDrawing')}
          rightComponent={<UploadIcon />}
          onRemove={updatedArray => handleChange('archDrawing', updatedArray)}
          textStyle={{ fontSize: 12 }}
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
            ].map(item => {
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
        </>
      )}

      {/* ✅ ALWAYS VISIBLE */}
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
        IF you choose to hide you will not receive any calls from professional.
      </Text>

      <CustomPopup
        visible={popupVisible}
        message="Choose file type"
        onClose={() => setPopupVisible(false)}
        buttons={[
          {
            label: 'Images',
            type: 'primary',
            onPress: () => {
              setPopupVisible(false);
              pickImage(currentKey);
            },
          },
          {
            label: 'PDF',
            onPress: () => {
              setPopupVisible(false);
              pickDocument(currentKey);
            },
          },
          {
            label: 'Cancel',
            onPress: () => setPopupVisible(false),
          },
        ]}
      />
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
        {Array.isArray(value) && value.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {value.map((file, index) => {
              const isImage = file?.type?.includes('image');
              const isPDF = file?.type?.includes('pdf');

              return (
                <View key={index} style={styles.previewContainer}>
                  {/* IMAGE */}
                  {isImage && (
                    <Image
                      source={{ uri: file.uri }}
                      style={styles.previewImage}
                    />
                  )}

                  {/* PDF */}
                  {isPDF && (
                    <View style={styles.pdfBox}>
                      <Text style={{ fontSize: 22 }}>📄</Text>
                      <Text numberOfLines={1} style={styles.pdfText}>
                        {file.name}
                      </Text>
                    </View>
                  )}

                  {/* REMOVE BUTTON */}
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
              );
            })}
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
  pdfBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },

  pdfText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});
