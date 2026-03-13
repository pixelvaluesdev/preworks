import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import StepIndicator from 'react-native-step-indicator';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';

import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import { FONTSIZE, WIDTH, HEIGHT } from '../../../utils/responsive';

const labels = ['', '', '', ''];

const AddProjectInformationScreen = ({ navigation }: any) => {
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');

  const stepStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 22,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: Colors.primary,
    stepStrokeUnFinishedColor: '#D3D3D3',
    separatorFinishedColor: Colors.primary,
    separatorUnFinishedColor: '#D3D3D3',
    stepIndicatorFinishedColor: Colors.primary,
    stepIndicatorUnFinishedColor: '#fff',
    stepIndicatorCurrentColor: Colors.primary,

    // FIX
    stepIndicatorLabelFontSize: 1,
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Ionicons name="arrow-back" size={22} /> */}
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Project Information</Text>
      </View>

      {/* STEP INDICATOR */}
      <View style={styles.stepContainer}>
        <StepIndicator
          customStyles={stepStyles}
          currentPosition={0}
          stepCount={4}
          labels={labels}
        />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <BorderTextInput
          label="Project Name"
          value={projectName}
          onChangeText={setProjectName}
        />

        <BorderTextInput
          label="Full Plot Address"
          value={address}
          onChangeText={setAddress}
        />

        <BorderTextInput label="City" value={city} onChangeText={setCity} />

        <BorderTextInput
          label="PIN Code"
          value={pinCode}
          onChangeText={setPinCode}
        />

        <PrimaryButton
          title="Continue"
          onPress={() => {}}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
};

export default AddProjectInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WIDTH(5),
    marginTop: 20,
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginLeft: 15,
  },

  stepContainer: {
    marginTop: 20,
    paddingHorizontal: WIDTH(8),
  },

  formContainer: {
    paddingHorizontal: WIDTH(6),
    marginTop: 25,
  },

  button: {
    marginTop: 40,
  },
});
