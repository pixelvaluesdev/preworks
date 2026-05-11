import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import ApiManager from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import CustomPopup from '../../../components/Popups/CustomPopup';
import Colors from '../../../constants/colors';
import { triggerHaptic } from '../../../utils/hapticks';

const TOTAL_STEPS = 4;

const AddProjectInformationScreen = ({ navigation, route }: any) => {
  const { isEdit, projectId } = route.params || {};
  const [step, setStep] = useState<number>(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (isEdit && projectId) {
      fetchProjectDetails();
    }
  }, [isEdit, projectId]);

  const [form, setForm] = useState({
    projectName: '',
    address: '',
    city: '',
    pinCode: '',
    floorArea: '',
    plotSize: '',
    floors: '',
    quoteType: '',
    startDate: '',
    lastDate: '',
    description: '',
    budget: '',
    siteImage: [], // new images
    archDrawing: [], // new drawings

    existingImages: [], //  API images
    existingDrawings: [], // API drawings
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
    if (key === 'floorArea' || key === 'plotSize') {
      let cleaned = value.replace(/[^0-9.]/g, '');
      setForm(prev => ({ ...prev, [key]: cleaned }));
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
      if (!form.floorArea) return false;
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
      const totalImages =
        (form.siteImage?.length || 0) + (form.existingImages?.length || 0);

      if (totalImages === 0) return false;

      if (form.hasDrawing) {
        const totalDrawings =
          (form.archDrawing?.length || 0) +
          (form.existingDrawings?.length || 0);

        if (totalDrawings === 0) return false;
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
      submitProjectApi();
    }
    triggerHaptic('impactHeavy');
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(prev => prev - 1);
    }
    triggerHaptic('impactHeavy');
  };

  const mapFloors = val => {
    if (val === 'Only Ground Floor') return 'g';
    if (val === 'Ground + 1 Floor') return 'g1';
    if (val === 'Ground + 2 Floor') return 'g2';
    return val;
  };

  const prefillForm = project => {
    setForm({
      projectName: project?.projectName || '',
      address: project?.plotAddress || '',
      city: project?.city || '',
      pinCode: project?.pinCode || '',

      // selectedType: 'floor', // default (or adjust later)

      floorArea: project?.floorArea?.toString() || '',
      plotSize: project?.plotSize?.toString() || '',
      floors: project?.noOfFloors || '',

      quoteType:
        project?.typeOfQuote === 'labour' ? 'Labour Only' : 'Labour + Material',

      startDate: project?.constStartDate?.split('T')[0] || '',
      lastDate: project?.quoteLastDate?.split('T')[0] || '',

      description: project?.requirementDesc || '',
      budget: project?.priceRange || '',

      siteImage: [],
      archDrawing: [],

      existingImages: project?.image || [],
      existingDrawings: project?.drawing || [],
      hasDrawing: project?.drawingStatus || false,
      services: project?.services || [],
      hideNumber: project?.hideNumber || false,
    });
  };

  const fetchProjectDetails = async () => {
    try {
      setFetchLoading(true);
      setLoading(true);

      const res = await ApiManager.getProjectDetails(projectId, token);

      if (res?.data?.status === 'success') {
        const project = res?.data?.data?.project;
        console.log('Myy gert ppriereo', project);

        prefillForm(project);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  };

  const submitProjectApi = async () => {
    try {
      setLoading(true);
      setIsSuccess(false);

      const formData = new FormData();
      formData.append('projectId', projectId);

      formData.append('projectName', form.projectName);
      formData.append('plotAddress', form.address);
      formData.append('city', form.city);
      formData.append('pinCode', form.pinCode);
      formData.append('floorArea', form.floorArea);

      if (form.plotSize) {
        formData.append('plotSize', form.plotSize);
      }
      formData.append('noOfFloors', form.floors);

      formData.append(
        'typeOfQuote',
        form.quoteType === 'Labour Only' ? 'labour' : 'labour+material',
      );

      formData.append('constStartDate', form.startDate);
      formData.append('quoteLastDate', form.lastDate);
      formData.append('requirementDesc', form.description);
      formData.append('priceRange', form.budget);

      formData.append('drawingStatus', form.hasDrawing ? true : false);
      formData.append('hideNumber', form.hideNumber ? true : false);

      if (!form.hasDrawing) {
        formData.append('services', JSON.stringify(form.services));
      }

      // images
      if (form.siteImage?.length) {
        form.siteImage.forEach((file, index) => {
          formData.append('image', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.name || `image_${index}.jpg`,
          });
        });
      }

      // drawings
      if (form.archDrawing?.length) {
        form.archDrawing.forEach((file, index) => {
          formData.append('drawing', {
            uri: file.uri,
            type: file.type || 'application/pdf',
            name: file.name || `drawing_${index}.pdf`,
          });
        });
      }

      formData.append('userId', userId);

      if (form.existingImages?.length) {
        formData.append('existingImages', JSON.stringify(form.existingImages));
      }

      // EXISTING DRAWINGS
      if (form.existingDrawings?.length) {
        formData.append(
          'existingDrawings',
          JSON.stringify(form.existingDrawings),
        );
      }

      console.log('FORM DATA DEBUG', {
        siteImage: form.siteImage,
        existingImages: form.existingImages,
        archDrawing: form.archDrawing,
        existingDrawings: form.existingDrawings,
      });
      console.log('FormDataaaaaa', formData);

      const response = isEdit
        ? await ApiManager.updateProject(formData, token)
        : await ApiManager.createProject(formData, token);

      console.log(response?.data?.message, 'Thiisssss is ss ewmewemn');

      setIsSuccess(true);
      setPopupMessage({
        title: 'Project Created Successfully',
        subtitle:
          'You will start receiving quotations soon.\nYou can track your project in the Projects tab.',
      });
    } catch (error) {
      setIsSuccess(false);
      setPopupMessage(error?.response?.data?.message || 'Something went wrong');
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
      setPopupVisible(true);
    }
  };

  if (isEdit && fetchLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
            <Projectfiles
              data={{ ...form, projectId }}
              handleChange={handleChange}
              loading={fetchLoading}
            />
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
                title={
                  loading
                    ? 'Submitting...'
                    : step === TOTAL_STEPS - 1
                    ? isEdit
                      ? 'Update Project'
                      : 'Submit Project'
                    : 'Continue'
                }
                onPress={handleNext}
                disabled={!validateStep() || loading}
                style={{
                  flex: 1,
                  opacity: validateStep() && !loading ? 1 : 0.5,
                }}
              />
            </View>
          )}
        </View>

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
                  navigation.navigate('ProjectDetails');
                }
              },
            },
          ]}
        />
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
