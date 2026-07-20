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
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { Image as Compressor } from 'react-native-compressor';

const Projectfile = ({ data, handleChange, loading }: any) => {
  const token = useSelector(state => state.auth.userToken);

  const hasDrawing = data?.hasDrawing ?? true;
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

  const compressImage = async uri => {
    try {
      const result = await Compressor.compress(uri, {
        quality: 0.6, // 0 to 1
        maxWidth: 1000,
        maxHeight: 1000,
      });

      return result;
    } catch (err) {
      console.log('Compression error', err);
      return uri;
    }
  };
  const MAX_FILES = 5;

  const pickImage = key => {
    const existingCount = (data[key] || []).length;

    if (existingCount >= MAX_FILES) {
      Alert.alert('Limit reached', 'You can upload max 5 images');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: MAX_FILES - existingCount, //  remaining
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) return;

      let files = [];

      for (let item of response.assets || []) {
        const compressedUri = await compressImage(item.uri);

        files.push({
          uri: compressedUri,
          type: item.type,
          name: item.fileName,
        });
      }

      handleChange(key, [...(data[key] || []), ...files]);
    });
  };

  const pickDocument = async key => {
    const existingCount = (data[key] || []).length;

    if (existingCount >= MAX_FILES) {
      Alert.alert('Limit reached', 'You can upload max 5 files');
      return;
    }

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

      const total = existingCount + files.length;

      if (total > MAX_FILES) {
        Alert.alert('Limit exceeded', 'Max 5 files allowed');
        return;
      }

      handleChange(key, [...(data[key] || []), ...files]);
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

  const handleRemove = async (file, index, type) => {
    // NEW FILE (local)
    if (file.uri) {
      const key = type === 'image' ? 'siteImage' : 'archDrawing';
      const updated = data[key].filter((_, i) => i !== index);
      handleChange(key, updated);
      return;
    }

    // EXISTING FILE
    try {
      await ApiManager.deleteFile(
        {
          projectId: data.projectId,
          fileUrl: file,
          field: type === 'image' ? 'image' : 'drawing',
        },
        token,
      );

      if (type === 'image') {
        const updated = data.existingImages.filter(item => item !== file);
        handleChange('existingImages', updated);
      } else {
        const updated = data.existingDrawings.filter(item => item !== file);
        handleChange('existingDrawings', updated);
      }
    } catch (err) {
      console.log('Delete error', err);
    }
  };

  if (loading) {
    return (
      <View style={{ paddingTop: 40 }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => pickImage('siteImage')}>
        <UploadBox
          label="Site Images & Elevation"
          value={[...(data.existingImages || []), ...(data.siteImage || [])]}
          onPress={() => pickImage('siteImage')}
          rightComponent={<UploadIcon />}
          onRemove={(file, index) => handleRemove(file, index, 'image')}
          required={false}
        />
      </TouchableOpacity>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          Do you already have architectural drawings?
          <Text style={styles.asterisk}>*</Text>
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
        <TouchableOpacity onPress={() => openPickerPopup('archDrawing')}>
          <UploadBox
            label="Upload architectural drawings (Preferred PDF)"
            value={[
              ...(data.existingDrawings || []),
              ...(data.archDrawing || []),
            ]}
            onRemove={(file, index) => handleRemove(file, index, 'drawing')}
            onPress={() => openPickerPopup('archDrawing')}
            rightComponent={<UploadIcon />}
            textStyle={{ fontSize: 12 }}
          />
        </TouchableOpacity>
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
              'On-Site Consultation',
            ].map(item => {
              const isSelected = services.includes(item);

              return (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  activeOpacity={0.7}
                  onPress={() => toggleService(item)}
                >
                  <CheckBox
                    value={isSelected}
                    onValueChange={() => toggleService(item)}
                    tintColors={{ true: Colors.primary, false: '#999' }}
                  />

                  <Text style={styles.checkboxLabel}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* ALWAYS VISIBLE */}
      <View style={styles.toggleContainer}>
        <Text style={styles.questionText}>
          Display your number to receive calls.{' '}
          {/* <Text style={styles.asterisk}> *</Text> */}
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
        Recommended for faster responses. You can hide your number anytime
        later.
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
  required,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    setIsFocused(true);

    onPress?.();

    // remove focus after picker opens
    setTimeout(() => {
      setIsFocused(false);
    }, 1000);
  };
  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.label, textStyle]}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>

      <TouchableOpacity
        style={[styles.uploadBox, value?.length > 0 && styles.focusedUploadBox]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {rightComponent && (
          <View style={styles.uploadIcon}>{rightComponent}</View>
        )}

        {/* Content */}
        {Array.isArray(value) && value.length > 0 ? (
          <View style={styles.previewWrapper}>
            {value.map((file, index) => {
              const isExisting = typeof file === 'string';

              const isImage = isExisting
                ? file.match(/\.(jpg|jpeg|png)$/)
                : file?.type?.includes('image');

              const isPDF = isExisting
                ? file.endsWith('.pdf')
                : file?.type?.includes('pdf');

              const uri = isExisting ? `${IMG_URL}${file}` : file.uri;
              return (
                <View key={index} style={styles.previewContainer}>
                  {/* IMAGE */}
                  {isImage && (
                    <Image source={{ uri }} style={styles.previewImage} />
                  )}

                  {/* PDF */}
                  {isPDF && (
                    <View style={styles.pdfBox}>
                      <Text style={{ fontSize: 22 }}>📄</Text>
                      <Text numberOfLines={1} style={styles.pdfText}>
                        {isExisting ? file.split('/').pop() : file.name}
                      </Text>
                    </View>
                  )}

                  {/* REMOVE BUTTON */}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => onRemove(file, index)}
                  >
                    <CloseIcon width={14} height={14} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.placeholder}>Browse image</Text>
          </View>
        )}
        {/* {rightComponent && <View>{rightComponent}</View>} */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: 'center',
    paddingTop: 22,

    backgroundColor: '#fff',

    borderColor: '#E2E2E2',
    borderWidth: 1.2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },
  focusedUploadBox: {
    borderColor: Colors.primary,
    borderWidth: 1,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,

    elevation: 10,

    backgroundColor: '#FFFFFF',
  },

  questionContainer: {
    marginTop: 10,
  },

  questionText: {
    flex: 1,
    fontSize: 14,
    color: '#757575',
    fontFamily: FONT.POPPINS_REGULAR,
    marginBottom: 0,
    marginRight: 10,
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
    backgroundColor: '#fff',
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
});
