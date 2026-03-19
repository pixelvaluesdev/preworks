import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import CustomStepIndicator from '../../../components/CustomStepIndicator';
import { FONT } from '../../../theme/fonts';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import ProjectInfo from './ProjectInfo';
import PlotWorkDetails from './PlotWorkDetails';
import ProjectTimeline from './ProjectTimeline';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecondaryButton from '../../../components/Buttons/SecondaryBtn';
import Projectfiles from './Projectfiles';
import AppButton from '../../../components/Buttons/AppButton';

const TOTAL_STEPS = 4;

const AddProjectInformationScreen = ({ navigation }: any) => {
  const [step, setStep] = useState<number>(0);

  const [form, setForm] = useState({
    projectName: '',
    address: '',
    city: '',
    pinCode: '',
    selectedType: '',
    area: '',
    floors: '',
    quoteType: '',
    startDate: '',
    lastDate: '',
    description: '',
    budget: '',
    siteImage: '',
    archDrawing: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(prev => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text>{'←'}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {step == 0 && 'Project Information'}
            {step == 1 && 'Plot & Work Details'}
            {step == 2 && 'Project Timeline & Scope'}
            {step == 3 && 'Project File & Drawings'}
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <CustomStepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        </View>

        <View style={styles.content}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContainer}
          >
            {step === 0 && (
              <ProjectInfo data={form} handleChange={handleChange} />
            )}

            {step === 1 && (
              <PlotWorkDetails data={form} handleChange={handleChange} />
            )}

            {step === 2 && (
              <ProjectTimeline data={form} handleChange={handleChange} />
            )}
            {step === 3 && (
              <Projectfiles data={form} handleChange={handleChange} />
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            {step == 0 && (
              <SecondaryButton
                title={step === TOTAL_STEPS - 1 ? 'Submit' : 'Continue'}
                style={{
                  marginHorizontal: WIDTH(4),
                  marginVertical: HEIGHT(2),
                }}
                onPress={handleNext}
              />
            )}

            {step !== 0 && (
              <View style={styles.row}>
                <AppButton
                  title="Back"
                  type="outline"
                  onPress={handleBack}
                  style={{ flex: 1 }}
                />

                <AppButton
                  title={step === TOTAL_STEPS - 1 ? 'Submit' : 'Continue'}
                  onPress={handleNext}
                  style={{ flex: 1 }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddProjectInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: WIDTH(5),
    marginTop: 20,
  },

  backBtn: {
    position: 'absolute',
    left: WIDTH(5),
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  stepContainer: {
    marginTop: 25,
    paddingHorizontal: WIDTH(10),
  },

  content: {
    flex: 1,
    justifyContent: 'space-between', // ✅ key fix
  },

  formContainer: {
    paddingHorizontal: WIDTH(4),
    marginTop: 30,
    paddingBottom: 20,
    gap: 18,
  },

  buttonContainer: {
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: WIDTH(4),
    marginVertical: HEIGHT(2),
  },
});
