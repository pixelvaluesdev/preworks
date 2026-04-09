import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import BackArrow from '../../../assets/svgs/LeftArrow.svg';

const TOTAL_STEPS = 4;

const AddProjectInformationScreen = ({ navigation }: any) => {
  const [step, setStep] = useState<number>(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
    if (key === 'pinCode') {
      // Allow only numbers
      let cleaned = value.replace(/[^0-9]/g, '');

      // Prevent first digit as 0
      if (cleaned.length === 1 && cleaned === '0') {
        return;
      }

      // Limit to 6 digits
      if (cleaned.length > 6) {
        return;
      }

      setForm(prev => ({
        ...prev,
        pinCode: cleaned,
      }));
      return;
    }

    //  For area field (numbers only)
    if (key === 'area') {
      let cleaned = value.replace(/[^0-9.]/g, ''); // only integers

      setForm(prev => ({ ...prev, area: cleaned }));
      return;
    }

    //  City: only alphabets + spaces
    if (key === 'city') {
      let cleaned = value.replace(/[^a-zA-Z ]/g, '');

      setForm(prev => ({ ...prev, city: cleaned }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = () => {
    // STEP 0 validation (ProjectInfo)
    if (step === 0) {
      if (!form.projectName.trim()) return false;
      if (!form.address.trim()) return false;
      if (!form.city.trim()) return false;
      if (!form.pinCode.trim()) return false;
    }

    // STEP 1 validation (PlotWorkDetails)
    if (step === 1) {
      if (!form.selectedType) return false;
      if (!form.area) return false;
      if (!form.floors) return false;
      if (!form.quoteType) return false;
    }

    // STEP 2 validation (Timeline)
    if (step === 2) {
      if (!form.startDate) return false;
      if (!form.lastDate) return false;
      if (!form.description) return false;
      if (!form.budget) return false;
    }

    // STEP 3 validation (Files)
    if (step === 3) {
      if (!form.siteImage?.length) return false;

      if (form.hasDrawing) {
        if (!form.archDrawing?.length) return false;
      } else {
        if (!form.services || form.services.length === 0) return false;
        // hideNumber is NOT mandatory → no need to validate
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      setPopupMessage('Please fill all required fields');
      setPopupVisible(true);
      return;
    }

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <BackArrow />
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

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20} // tweak if needed
      >
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
              title="Continue"
              disabled={!validateStep()}
              style={{
                marginHorizontal: WIDTH(4),
                marginVertical: HEIGHT(2),
                opacity: validateStep() ? 1 : 0.5,
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
                title={step === TOTAL_STEPS - 1 ? 'Submit Project' : 'Continue'}
                onPress={handleNext}
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
    </View>
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
    justifyContent: 'space-between',
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
