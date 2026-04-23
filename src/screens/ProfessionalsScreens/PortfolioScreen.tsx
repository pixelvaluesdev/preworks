import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import BorderTextInput from '../../components/Inputs/BorderTextInput';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import AppButton from '../../components/Buttons/AppButton';
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../constants/colors';
import { WIDTH, HEIGHT } from '../../utils/responsive';
import UploadIcon from '../../assets/svgs/UploadIcon.svg';
import UploadBox from '../../components/Inputs/UploadBox';
import CloseIcon from '../../assets/svgs/Delete.svg';
import { useSelector } from 'react-redux';
import ApiManager, { IMG_URL } from '../../apis/ApiManager';
import CustomPopup from '../../components/Popups/CustomPopup';

const PortfolioScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isEdit, workId, workData } = route.params || {};
  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;

  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [isStepTwo, setIsStepTwo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  const prefillForm = data => {
    setForm({
      projectName: data?.projectName || '',
      siteName: data?.siteAddress || '',
      budget: data?.budget || '',
      caption: data?.caption || '',

      image:
        data?.images?.map(img => ({
          uri: IMG_URL + img, // important
          name: img,
          type: 'image/jpeg',
          isOld: true, // mark old images
        })) || [],
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isEdit) {
        setForm({
          projectName: '',
          siteName: '',
          budget: '',
          image: [],
          caption: '',
        });
        setIsStepTwo(false);
      }
    }, [isEdit]),
  );

  useEffect(() => {
    if (isEdit && workData) {
      prefillForm(workData);
    } else {
      // RESET FORM for fresh Add Work
      setForm({
        projectName: '',
        siteName: '',
        budget: '',
        image: [],
        caption: '',
      });
    }

    setInitialLoading(false);
  }, [isEdit, workData]);

  useEffect(() => {
    if (!isEdit) {
      setIsStepTwo(false);
    }
  }, [isEdit]);

  const [form, setForm] = useState({
    projectName: '',
    siteName: '',
    budget: '',
    image: [],
    caption: '',
  });

  const submitPortfolio = async () => {
    try {
      setLoading(true);
      setIsSuccess(false);

      const formData = new FormData();

      formData.append('userId', userId);
      formData.append('projectName', form.projectName);
      formData.append('siteAddress', form.siteName);
      formData.append('budget', form.budget.replace(/,/g, ''));
      formData.append('caption', form.caption);

      // Images
      form.image.forEach((file, index) => {
        if (!file.isOld) {
          formData.append('images', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.name || `image_${index}.jpg`,
          });
        }
      });

      const res = isEdit
        ? await ApiManager.updateWork(workId, formData, token)
        : await ApiManager.addWork(formData, token);

      if (res?.data?.status === 'success') {
        setIsSuccess(true);
        setPopupMessage(res?.data?.message || 'Work added successfully');
      }
    } catch (error) {
      setIsSuccess(false);
      setPopupMessage(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setPopupVisible(true);
    }
  };

  const handleChange = useCallback((key: string, value: string) => {
    let cleaned = value;
    if (key === 'budget') {
      // allow only numbers
      cleaned = value.replace(/[^0-9]/g, '');

      // prevent starting with 0
      if (cleaned.length === 1 && cleaned === '0') return;

      // limit length (optional, e.g. 10 digits)
      if (cleaned.length > 10) return;

      // format with commas (optional but nice UX)
      cleaned = Number(cleaned).toLocaleString('en-IN');
    }
    setForm(prev => ({ ...prev, [key]: cleaned }));
  }, []);

  const toggleStep = () => setIsStepTwo(prev => !prev);

  const validateStep = () => {
    // STEP 1 (Image + Caption)
    if (!isStepTwo) {
      if (!form.image || form.image.length === 0) return false;
      if (!form.caption.trim()) return false;
    }

    // STEP 2 (Project details)
    if (isStepTwo) {
      if (!form.projectName.trim()) return false;
      if (!form.siteName.trim()) return false;
      if (!form.budget.replace(/,/g, '')) return false;
    }

    return true;
  };

  const pickImage = () => {
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
        setForm(prev => ({
          ...prev,
          image: [...(prev.image || []), ...files],
        }));
      }
    });
  };

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
        <ScreenHeader title={isEdit ? 'Edit Work' : 'Add Work'} showBack />

        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.step,
              { borderColor: !isStepTwo ? Colors.primary : Colors.border },
            ]}
          />
          <View
            style={[
              styles.step,
              { borderColor: isStepTwo ? Colors.primary : Colors.border },
            ]}
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          {!isStepTwo ? (
            <>
              <UploadBox
                label="Add Photos"
                value={form.image}
                onPress={pickImage}
                onRemove={updated =>
                  setForm(prev => ({ ...prev, image: updated }))
                }
                showPreview={false}
              />

              {form.image.length > 0 && (
                <View>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={e => {
                      const index = Math.round(
                        e.nativeEvent.contentOffset.x / WIDTH(94),
                      );
                      setCurrentIndex(index);
                    }}
                  >
                    {form.image.map((item, index) => (
                      <View key={index}>
                        <Image
                          source={{ uri: item.uri }}
                          style={styles.image}
                        />

                        {/* Delete Button */}
                        <TouchableOpacity
                          style={styles.imageDelete}
                          onPress={() => {
                            const updated = form.image.filter(
                              (_, i) => i !== index,
                            );
                            setForm(prev => ({ ...prev, image: updated }));
                            setCurrentIndex(0);
                          }}
                        >
                          <CloseIcon width={16} height={16} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  {/* Dots Indicator */}
                  {form.image.length > 1 && (
                    <View style={styles.dotsContainer}>
                      {form.image.map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            currentIndex === i && styles.activeDot,
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              )}

              <BorderTextInput
                label="Caption"
                placeholder="Type here"
                value={form.caption}
                onChangeText={text => handleChange('caption', text)}
              />
            </>
          ) : (
            <>
              <BorderTextInput
                label="Project Name / Client Name"
                placeholder="Enter your Project Name"
                value={form.projectName}
                onChangeText={text => handleChange('projectName', text)}
              />

              <BorderTextInput
                label="Site Address"
                placeholder="Enter address of site"
                value={form.siteName}
                onChangeText={text => handleChange('siteName', text)}
              />

              <BorderTextInput
                label="Budget"
                placeholder="Enter your Budget"
                value={form.budget}
                onChangeText={text => handleChange('budget', text)}
                keyboardType="number-pad"
              />
            </>
          )}
        </ScrollView>
        {/* Footer Buttons */}
        {!isStepTwo ? (
          <View style={styles.footer}>
            <SecondaryButton
              title="Continue"
              onPress={toggleStep}
              disabled={!validateStep()}
              style={{
                opacity: validateStep() ? 1 : 0.5,
              }}
            />
          </View>
        ) : (
          <View style={styles.row}>
            <AppButton
              title="Back"
              type="outline"
              onPress={toggleStep}
              style={{ flex: 1 }}
            />
            <AppButton
              title={
                loading ? 'Submitting...' : isEdit ? 'Update Work' : 'Submit'
              }
              onPress={submitPortfolio}
              disabled={!validateStep() || loading}
              style={{
                flex: 1,
                opacity: validateStep() && !loading ? 1 : 0.5,
              }}
            />
          </View>
        )}

        <CustomPopup
          visible={popupVisible}
          title={isSuccess ? 'Success' : 'Error'}
          message={popupMessage}
          onClose={() => setPopupVisible(false)}
          buttons={[
            {
              label: 'OK',
              type: 'primary',
              onPress: () => {
                setPopupVisible(false);

                if (isSuccess) {
                  navigation.navigate('AddWork', {
                    isEdit: false,
                    workId: null,
                    workData: null,
                  });
                }
              },
            },
          ]}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default PortfolioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  stepContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 20,
    paddingHorizontal: WIDTH(4),
  },

  step: {
    flex: 1,
    borderWidth: 3,
    borderRadius: 50,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: WIDTH(4),
    paddingTop: 30,
    paddingBottom: HEIGHT(10),
    gap: 10,
  },

  image: {
    width: WIDTH(94),
    height: HEIGHT(40),
    borderRadius: 10,
    marginBottom: 20,
  },

  footer: {
    paddingHorizontal: WIDTH(4),
    paddingBottom: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: WIDTH(4),
    marginTop: HEIGHT(2),
    paddingBottom: 10,
  },
  imageDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 4,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },

  activeDot: {
    backgroundColor: Colors.primary,
  },
});
