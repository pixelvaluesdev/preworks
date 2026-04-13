import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const PortfolioScreen = () => {
  const navigation = useNavigation();

  const [isStepTwo, setIsStepTwo] = useState(false);

  const [form, setForm] = useState({
    projectName: '',
    siteName: '',
    budget: '',
    image: '',
    caption: '',
  });

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
      if (!form.image.trim()) return false;
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
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;

        if (uri) {
          handleChange('image', uri);
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
        <ScreenHeader title="Add Work" showBack />

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
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {!isStepTwo ? (
            <>
              <UploadBox
                label="Add Photo"
                value={form.image}
                onPress={pickImage}
                onRemove={() => handleChange('image', '')}
              />

              <Image
                source={{
                  uri: 'https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg',
                }}
                style={styles.image}
              />

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
              title="Submit"
              onPress={() => {
                console.log('Form Data:', form);
              }}
              disabled={!validateStep()}
              style={{
                flex: 1,
                opacity: validateStep() ? 1 : 0.5,
              }}
            />
          </View>
        )}
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
    paddingBottom: 20,
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
});
