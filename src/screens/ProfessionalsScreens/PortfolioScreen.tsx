import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import BorderTextInput from '../../components/Inputs/BorderTextInput';
import SecondaryButton from '../../components/Buttons/SecondaryBtn';
import AppButton from '../../components/Buttons/AppButton';

import Colors from '../../constants/colors';
import { WIDTH, HEIGHT } from '../../utils/responsive';
import UploadIcon from '../../assets/svgs/UploadIcon.svg';

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
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleStep = () => setIsStepTwo(prev => !prev);

  return (
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

      <View style={styles.content}>
        {!isStepTwo ? (
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
        ) : (
          <>
            <BorderTextInput
              label="Add Photo"
              placeholder="Browse image"
              value={form.image}
              onChangeText={text => handleChange('image', text)}
              rightComponent={
                <TouchableOpacity>
                  <UploadIcon />
                </TouchableOpacity>
              }
            />

            <Image
              source={{
                uri: 'https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg',
              }}
              style={styles.image}
            />

            <BorderTextInput
              label="Caption"
              placeholder="Enter caption"
              value={form.caption}
              onChangeText={text => handleChange('caption', text)}
            />
          </>
        )}
      </View>

      {/* Footer Buttons */}
      {!isStepTwo ? (
        <View style={styles.footer}>
          <SecondaryButton title="Continue" onPress={toggleStep} />
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
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
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
    flex: 1,
    paddingHorizontal: WIDTH(4),
    paddingTop: 30,
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
