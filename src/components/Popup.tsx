import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '../constants/colors';
import { FONT } from '../theme/fonts';
import SecondaryButton from './Buttons/SecondaryBtn';
import BorderTextInput from './Inputs/BorderTextInput';
import UploadIcon from '../assets/svgs/UploadIcon.svg';
import ApiManager from '../apis/ApiManager';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';

const Popup = ({
  title,
  visible,
  onClose,
  showQuotation = true,
  projectId,
  userId,
  token,
}) => {
  const [quotation, setQuotation] = useState('');
  const [message, setMessage] = useState('');
  const [quotationFiles, setQuotationFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const removeFile = index => {
    setQuotationFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!message) {
        Alert.alert('Error', 'Please enter message');
        return;
      }

      if (showQuotation && quotationFiles.length === 0) {
        Alert.alert('Error', 'Please upload file');
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append('projectId', projectId);
      formData.append('desc', message);
      formData.append('type', showQuotation ? 'quotation' : 'enquiry');
      formData.append('userId', userId);

      quotationFiles.forEach(file => {
        formData.append('files', {
          uri: file.uri,
          name: file.name || 'file.jpg',
          type: file.type || 'image/jpeg',
        });
      });

      const res = await ApiManager.projectEnquiry(formData, token);

      console.log('Enquiry Response:', res?.data);

      if (res?.data?.status === 'success') {
        const selectedType = showQuotation ? 'quotation' : 'enquiry';

        setMessage('');
        setQuotation('');
        setQuotationFiles([]);

        onClose();

        navigation.navigate('ProjectDetails', {
          projectId,
          selectedTab: selectedType,
        });
      }
    } catch (error) {
      console.log('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  // IMAGE PICKER
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, response => {
      if (response.didCancel || response.errorCode) return;

      const files =
        response.assets?.map(item => ({
          uri: item.uri,
          type: item.type,
          name: item.fileName,
        })) || [];

      if (files.length) {
        setQuotationFiles(prev => [...prev, ...files]);
      }
    });
  };

  // PDF PICKER
  const pickDocument = async () => {
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

      setQuotationFiles(prev => [...prev, ...files]);
    } catch (err) {
      console.log(err);
    }
  };

  // PICK OPTION
  const pickMedia = () => {
    Alert.alert('Upload File', 'Choose file type', [
      { text: 'Images', onPress: pickImage },
      { text: 'PDF', onPress: pickDocument },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} //  Android back button
    >
      {/*  OUTSIDE CLICK HANDLER */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/*  INSIDE CLICK BLOCK */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>

              {/* Quotation Input */}
              {showQuotation && (
                <TouchableOpacity onPress={pickMedia}>
                  <BorderTextInput
                    label="Quotation"
                    value={
                      quotationFiles.length > 0
                        ? `${quotationFiles.length} file(s) selected`
                        : quotation
                    }
                    onChangeText={setQuotation}
                    placeholder="Select"
                    editable={false}
                    rightComponent={
                      <TouchableOpacity onPress={pickMedia}>
                        <UploadIcon />
                      </TouchableOpacity>
                    }
                  />
                </TouchableOpacity>
              )}

              {quotationFiles.length > 0 && (
                <View style={styles.filesContainer}>
                  {quotationFiles.map((file, index) => (
                    <View key={index} style={styles.fileChip}>
                      <Text
                        style={styles.fileText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {file.name}
                      </Text>

                      <TouchableOpacity onPress={() => removeFile(index)}>
                        <Text style={styles.cross}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Message Input */}
              <BorderTextInput
                label="Why choose you?"
                value={message}
                onChangeText={setMessage}
                multiline
                placeholder="Mention your expertise, team  & nearby sites"
              />

              <SecondaryButton
                title={loading ? 'Submitting...' : 'Submit'}
                style={styles.submitBtn}
                onPress={handleSubmit}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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

  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  filesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -10,
    marginBottom: 10,
  },

  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
    maxWidth: '45%',
  },

  fileText: {
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  cross: {
    marginLeft: 6,
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
