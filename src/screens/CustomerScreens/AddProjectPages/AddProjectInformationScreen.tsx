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
import CustomPopup from '../../../components/Popups/CustomPopup';
import Colors from '../../../constants/colors';
import { triggerHaptic } from '../../../utils/hapticks';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../../utils/screenWrapper';
import {
  saveProjectDraft,
  clearProjectDraft,
} from '../../../redux/slices/projectDraftSlice';

const TOTAL_STEPS = 4;

const emptyProjectForm = {
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
  siteImage: [],
  archDrawing: [],
  existingImages: [],
  existingDrawings: [],
  hasDrawing: true,
  services: [],
  hideNumber: false,
};

const normalizeDateValue = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';

    const date = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)
        ? `${trimmedValue}T00:00:00`
        : trimmedValue,
    );
    return Number.isNaN(date.getTime())
      ? ''
      : date.toISOString().split('T')[0];
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  }

  return '';
};

const normalizeProjectForm = (draftForm = {}) => ({
  ...emptyProjectForm,
  ...draftForm,
  projectName: String(draftForm?.projectName ?? ''),
  address: String(draftForm?.address ?? ''),
  city: String(draftForm?.city ?? ''),
  pinCode: String(draftForm?.pinCode ?? ''),
  floorArea: String(draftForm?.floorArea ?? ''),
  plotSize: String(draftForm?.plotSize ?? ''),
  floors: String(draftForm?.floors ?? ''),
  quoteType: String(draftForm?.quoteType ?? ''),
  startDate: normalizeDateValue(draftForm?.startDate),
  lastDate: normalizeDateValue(draftForm?.lastDate),
  description: String(draftForm?.description ?? ''),
  budget: String(draftForm?.budget ?? ''),
  siteImage: Array.isArray(draftForm?.siteImage) ? draftForm.siteImage : [],
  archDrawing: Array.isArray(draftForm?.archDrawing)
    ? draftForm.archDrawing
    : [],
  existingImages: Array.isArray(draftForm?.existingImages)
    ? draftForm.existingImages
    : [],
  existingDrawings: Array.isArray(draftForm?.existingDrawings)
    ? draftForm.existingDrawings
    : [],
  hasDrawing: draftForm?.hasDrawing ?? true,
  services: Array.isArray(draftForm?.services) ? draftForm.services : [],
  hideNumber: !!draftForm?.hideNumber,
});

const AddProjectInformationScreen = ({ navigation, route }: any) => {
  const { isEdit, projectId } = route?.params || {};
  const [step, setStep] = useState<number>(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const draftForm = useSelector(state => state.projectDraft.form);
  const [initialForm, setInitialForm] = useState(null);

  console.log('Redux draft:', draftForm?.hasDrawing);

  useEffect(() => {
    if (isEdit && projectId) {
      fetchProjectDetails();
    }
  }, [isEdit, projectId]);

  const [form, setForm] = useState(() =>
    normalizeProjectForm({
      ...draftForm,
      hasDrawing: isEdit
        ? draftForm?.hasDrawing
        : draftForm?.hasDrawing ?? true,
    }),
  );

  useEffect(() => {
    dispatch(saveProjectDraft(normalizeProjectForm(form)));
  }, [form]);

  console.log('Form state:', form.hasDrawing);
  const dispatch = useDispatch();

  const handleChange = (key: string, value: any) => {
    console.log('handleChange', key, value);
    let updatedValue = value ?? '';

    if (key === 'pinCode') {
      updatedValue = String(updatedValue);
    }

    if (key === 'floorArea' || key === 'plotSize') {
      updatedValue = String(updatedValue).replace(/[^0-9.]/g, '');
    }

    if (key === 'city') {
      updatedValue = String(updatedValue).replace(/[^a-zA-Z ]/g, '');
    }

    setForm(prev => ({
      ...normalizeProjectForm(prev),
      [key]: updatedValue,
    }));
  };

  const validateStep = () => {
    const safeForm = normalizeProjectForm(form);

    if (step === 0) {
      if (!String(safeForm.projectName).trim()) return false;
      if (!String(safeForm.address).trim()) return false;
      if (!String(safeForm.city).trim()) return false;
      if (!String(safeForm.pinCode).trim()) return false;
    }

    if (step === 1) {
      if (!String(safeForm.floorArea).trim()) return false;
      if (!String(safeForm.floors).trim()) return false;
      if (!String(safeForm.quoteType).trim()) return false;
    }

    if (step === 2) {
      if (!String(safeForm.startDate).trim()) return false;
      if (!String(safeForm.lastDate).trim()) return false;
      if (!String(safeForm.description).trim()) return false;
      if (!String(safeForm.budget).trim()) return false;
    }

    if (step === 3) {
      if (safeForm.hasDrawing) {
        const totalDrawings =
          (safeForm.archDrawing?.length || 0) +
          (safeForm.existingDrawings?.length || 0);

        if (totalDrawings === 0) return false;
      } else {
        if (
          !Array.isArray(safeForm.services) ||
          safeForm.services.length === 0
        ) {
          return false;
        }
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

  const hasChanges = () => {
    if (!initialForm) return false;

    return JSON.stringify(form) !== JSON.stringify(initialForm);
  };

  const prefillForm = project => {
    const formattedData = {
      projectName: project?.projectName || '',
      address: project?.plotAddress || '',
      city: project?.city || '',
      pinCode: project?.pinCode || '',

      floors:
        project?.noOfFloors?.replace('Ground + ', '')?.replace(' Floor', '') ||
        '',

      floorArea: project?.floorArea?.toString() || '',
      plotSize: project?.plotSize?.toString() || '',

      quoteType:
        project?.typeOfQuote === 'labour' ? 'Labour Only' : 'Labour + Material',

      startDate: normalizeDateValue(project?.constStartDate),
      lastDate: normalizeDateValue(project?.quoteLastDate),

      description: project?.requirementDesc || '',
      budget: project?.priceRange || '',

      siteImage: [],
      archDrawing: [],

      existingImages: Array.isArray(project?.image) ? project.image : [],
      existingDrawings: Array.isArray(project?.drawing)
        ? project.drawing
        : [],
      hasDrawing: project?.drawingStatus || false,
      services: Array.isArray(project?.services) ? project.services : [],
      hideNumber: project?.hideNumber || false,
    };

    setForm(formattedData);
    setInitialForm(formattedData);
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
      const safeForm = normalizeProjectForm(form);
      setLoading(true);
      setIsSuccess(false);

      const formData = new FormData();
      formData.append('projectId', String(projectId ?? ''));

      formData.append('projectName', String(safeForm.projectName || ''));
      formData.append('plotAddress', String(safeForm.address || ''));
      formData.append('city', String(safeForm.city || ''));
      formData.append('pinCode', String(safeForm.pinCode || ''));
      formData.append('floorArea', String(safeForm.floorArea || ''));

      formData.append('plotSize', String(safeForm.plotSize || '0'));
      formData.append(
        'noOfFloors',
        `Ground + ${String(safeForm.floors || '')}`,
      );

      formData.append(
        'typeOfQuote',
        String(safeForm.quoteType || '') === 'Labour Only'
          ? 'labour'
          : 'labour+material',
      );

      formData.append('constStartDate', String(safeForm.startDate || ''));
      formData.append('quoteLastDate', String(safeForm.lastDate || ''));
      formData.append('requirementDesc', String(safeForm.description || ''));
      formData.append('priceRange', String(safeForm.budget || ''));

      formData.append('drawingStatus', String(!!safeForm.hasDrawing));
      formData.append('hideNumber', String(!!safeForm.hideNumber));

      if (!safeForm.hasDrawing) {
        formData.append('services', JSON.stringify(safeForm.services || []));
      }

      if (Array.isArray(safeForm.siteImage) && safeForm.siteImage.length) {
        safeForm.siteImage.forEach((file, index) => {
          if (!file || typeof file !== 'object' || !file.uri) return;

          formData.append('image', {
            uri: String(file.uri),
            type: String(file.type || 'image/jpeg'),
            name: String(file.name || `image_${index}.jpg`),
          });
        });
      }

      if (Array.isArray(safeForm.archDrawing) && safeForm.archDrawing.length) {
        safeForm.archDrawing.forEach((file, index) => {
          if (!file || typeof file !== 'object' || !file.uri) return;

          formData.append('drawing', {
            uri: String(file.uri),
            type: String(file.type || 'application/pdf'),
            name: String(file.name || `drawing_${index}.pdf`),
          });
        });
      }

      formData.append('userId', String(userId ?? ''));

      if (
        Array.isArray(safeForm.existingImages) &&
        safeForm.existingImages.length
      ) {
        formData.append(
          'existingImages',
          JSON.stringify(safeForm.existingImages),
        );
      }

      if (
        Array.isArray(safeForm.existingDrawings) &&
        safeForm.existingDrawings.length
      ) {
        formData.append(
          'existingDrawings',
          JSON.stringify(safeForm.existingDrawings),
        );
      }

      console.log('FORM DATA DEBUG', {
        siteImage: safeForm.siteImage,
        existingImages: safeForm.existingImages,
        archDrawing: safeForm.archDrawing,
        existingDrawings: safeForm.existingDrawings,
      });
      console.log('UPDATE PROJECT DATA:', {
        projectId,
        projectName: safeForm.projectName,
        plotAddress: safeForm.address,
        city: safeForm.city,
        pinCode: safeForm.pinCode,
        floorArea: safeForm.floorArea,
        plotSize: safeForm.plotSize,
        noOfFloors: safeForm.floors,
        quoteType: safeForm.quoteType,
        startDate: safeForm.startDate,
        lastDate: safeForm.lastDate,
        description: safeForm.description,
        budget: safeForm.budget,
        hasDrawing: safeForm.hasDrawing,
        services: safeForm.services,
        userId,
      });

      const response = isEdit
        ? await ApiManager.updateProject(formData, token)
        : await ApiManager.createProject(formData, token);

      console.log(response?.data?.message, 'Thiisssss is ss ewmewemn');

      setIsSuccess(true);
      setPopupMessage({
        title: isEdit
          ? 'Project Updated Successfully'
          : 'Project Posted Successfully',
        subtitle:
          'You will start receiving responses soon.\nYou can track your project in the Projects tab.',
      });
    } catch (error: any) {
      console.log(
        'UPDATE PROJECT ERROR:',
        JSON.stringify(error?.response?.data, null, 2),
      );

      setIsSuccess(false);

      setPopupMessage(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
      setPopupVisible(true);
    }
  };

  if (isEdit && fetchLoading) {
    return (
      <ScreenWrapper
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
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
              isEdit={isEdit}
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
                disabled={
                  !validateStep() ||
                  loading ||
                  (isEdit && step === TOTAL_STEPS - 1 && !hasChanges())
                }
                style={{
                  flex: 1,
                  opacity:
                    validateStep() &&
                    !loading &&
                    !(isEdit && step === TOTAL_STEPS - 1 && !hasChanges())
                      ? 1
                      : 0.5,
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
          disableOutsideClick={true}
          buttons={[
            {
              label: 'OK',
              type: 'primary',
              onPress: () => {
                setPopupVisible(false);

                if (isSuccess) {
                  dispatch(clearProjectDraft());
                  navigation.replace('ProjectDetails');
                }
              },
            },
          ]}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
