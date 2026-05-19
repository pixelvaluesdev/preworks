import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import Camera from '../../../assets/svgs/CameraSvg.svg';
import Back from '../../../assets/svgs/whiteBackIcon.svg';
import { useSelector } from 'react-redux';
import AddIcon from '../../../assets/svgs/AddBtnIcon.svg';
import CustomPopup from '../../../components/Popups/CustomPopup';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useRoute } from '@react-navigation/native';
import ApiManager from '../../../apis/ApiManager';
import { IMG_URL } from '../../../apis/ApiManager';
import { setUser } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '../../../utils/screenWrapper';

const EditProfileScreen = ({ navigation }: any) => {
  const userType = useSelector((state: any) => state.auth.userType);
  console.log('userType:', userType);
  const isProfessional = userType !== 'customer';
  const token = useSelector((state: any) => state.auth.userToken);

  const route = useRoute();
  const userId = route?.params?.userId;
  console.log('EditProfileScreen userId:', userId);

  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [links, setLinks] = useState(['']);
  const [bio, setBio] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleLinkChange = (text, index) => {
    const updatedLinks = [...links];
    updatedLinks[index] = text;
    setLinks(updatedLinks);
  };

  const addMoreLinks = () => {
    setLinks([...links, '']);
  };

  const removeLink = index => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks.length ? updatedLinks : ['']);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await ApiManager.getProfile(userId, token);
      console.log('Profile response hehehehehhe:', response.data.data);

      if (response?.data?.status === 'success') {
        let data = response.data.data;

        if (data?.user) {
          data = data.user; // contractor case
        }

        setProfile(data);

        setName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
        setMobile(data?.phone || '');
        setEmail(data?.email || '');
        setCity(data?.city || '');
        setPin(data?.pincode || '');
        setState(data?.state || '');
        setAddress(data?.address || '');

        // optional
        setExperience(data?.experience || '');
        setBio(data?.bio || '');

        if (data?.links?.length > 0) {
          setLinks(data.links);
        } else {
          setLinks(['']);
        }
      }
    } catch (error) {
      console.log('Edit Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openImagePicker = type => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    // OPEN GALLERY
    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Error:', response.errorMessage);
        return;
      }

      const image = response.assets[0];

      if (type === 'profile') {
        setProfileImage(image);
      } else {
        setCoverImage(image);
      }
    });
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const openCamera = async type => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert('Permission denied', 'Camera permission is required');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    launchCamera(options, response => {
      if (response.didCancel) return;

      if (response.errorCode) {
        console.log('Error:', response.errorMessage);
        Alert.alert('Camera Error', response.errorMessage);
        return;
      }

      if (!response.assets || response.assets.length === 0) return;

      const image = response.assets[0];

      if (type === 'profile') {
        setProfileImage(image);
      } else {
        setCoverImage(image);
      }
    });
  };

  const handleInputChange = (key, value, setter) => {
    let cleaned = value;

    if (key === 'mobile') {
      cleaned = value.replace(/[^0-9]/g, '');

      if (cleaned.length === 1 && !['6', '7', '8', '9'].includes(cleaned))
        return;
      if (cleaned.length > 10) return;
    }

    if (key === 'pin') {
      cleaned = value.replace(/[^0-9]/g, '');

      if (cleaned.length === 1 && cleaned === '0') return;
      if (cleaned.length > 6) return;
    }

    if (key === 'city' || key === 'state') {
      cleaned = value.replace(/[^a-zA-Z ]/g, '');
    }

    if (key === 'area' || key === 'experience') {
      cleaned = value.replace(/[^0-9]/g, '');
    }

    setter(cleaned);
  };

  const showImageOptions = type => {
    Alert.alert('Select Image', 'Choose option', [
      {
        text: 'Camera',
        onPress: () => openCamera(type),
      },
      {
        text: 'Gallery',
        onPress: () => openImagePicker(type),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return 'Email is required';
    if (!regex.test(email)) return 'Enter valid email';

    return '';
  };

  const isFormValid = () => {
    if (!name.trim()) return false;
    if (!mobile.trim()) return false;
    if (!city.trim()) return false;
    if (!pin.trim()) return false;
    if (!state.trim()) return false;
    if (!address.trim()) return false;

    // Only for customer (email required)
    if (!isProfessional && !email.trim()) return false;

    // Only for professional
    if (isProfessional) {
      if (!experience.trim()) return false;
      if (!bio.trim()) return false;

      const hasValidLink = links.some(link => link.trim() !== '');
      if (!hasValidLink) return false;

      // IMAGE REQUIRED
      if (!profileImage && !profile?.image) return false;
    }

    return true;
  };

  const handleSave = async () => {
    let emailError = '';

    if (!isProfessional) {
      emailError = validateEmail(email);
    }

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({ email: '' });

    if (isProfessional && !profileImage && !profile?.image) {
      Alert.alert('Please upload profile image');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // formData.append('phone', mobile);

      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ');

      formData.append('firstName', firstName);
      formData.append('lastName', lastName);

      formData.append('email', email);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('pincode', pin);
      formData.append('address', address);

      if (experience) formData.append('experience', experience);
      if (bio) formData.append('bio', bio);

      const filteredLinks = links.filter(link => link.trim() !== '');

      if (filteredLinks.length > 0) {
        formData.append('links', JSON.stringify(filteredLinks));
      }

      if (profileImage) {
        formData.append('image', {
          uri: profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.fileName || 'profile.jpg',
        });
      }

      if (coverImage) {
        formData.append('userBanner', {
          uri: coverImage.uri,
          type: coverImage.type || 'image/jpeg',
          name: coverImage.fileName || 'banner.jpg',
        });
      }

      console.log('USER ID:', userId);

      const response = await ApiManager.updateProfile(userId, formData, token);

      console.log('UPDATE RESPONSE:', response.data);

      if (response?.data?.status === 'success') {
        const updatedUser = response.data.data;
        dispatch(setUser(updatedUser));
        setShowPopup(true);
      }
    } catch (error) {
      console.log('Update error:', error);
      Alert.alert('Error', 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Hide keyboard on outside tap */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* HEADER */}
              <LinearGradient
                colors={['#53d78e', '#166850']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.header}
              >
                <Image
                  style={styles.coverImage}
                  source={
                    coverImage?.uri
                      ? { uri: coverImage.uri } // newly selected
                      : profile?.userBanner
                      ? { uri: `${IMG_URL}${profile.userBanner}` } // backend image
                      : require('../../../assets/pngs/Placeholder.png')
                  }
                />
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => navigation.goBack()}
                >
                  <Back />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraCvrBtn}
                  onPress={() => showImageOptions('cover')}
                >
                  <Camera width={35} />
                </TouchableOpacity>
              </LinearGradient>

              {/* PROFILE IMAGE */}
              <View style={styles.profileWrapper}>
                <View style={styles.profileSection}>
                  <Image
                    style={styles.profileImage}
                    source={
                      profileImage?.uri
                        ? { uri: profileImage.uri } // newly selected
                        : profile?.image
                        ? { uri: `${IMG_URL}${profile.image}` } // backend image
                        : require('../../../assets/pngs/Placeholder.png')
                    }
                  />

                  <TouchableOpacity
                    style={styles.cameraBtn}
                    onPress={() => showImageOptions('profile')}
                  >
                    <Camera width={35} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* FORM CARD */}
              <View style={styles.card}>
                <BorderTextInput
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />

                <BorderTextInput
                  label="Mobile Number"
                  value={mobile}
                  editable={false}
                  containerStyle={{ backgroundColor: '#f5f5f5' }}
                  onChangeText={text =>
                    handleInputChange('mobile', text, setMobile)
                  }
                  placeholder="+91- Enter your mobile number"
                  keyboardType="number-pad"
                />

                {!isProfessional && (
                  <>
                    <BorderTextInput
                      label="Email"
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        setErrors(prev => ({ ...prev, email: '' })); // clear error while typing
                      }}
                      placeholder="Enter your email"
                    />

                    {errors.email ? (
                      <Text style={{ color: 'red', marginTop: -20 }}>
                        {errors.email}
                      </Text>
                    ) : null}
                  </>
                )}

                {/* ROW */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <BorderTextInput
                      label="City"
                      value={city}
                      onChangeText={text =>
                        handleInputChange('city', text, setCity)
                      }
                      placeholder="City"
                    />
                  </View>

                  <View style={styles.col}>
                    <BorderTextInput
                      label="Pin code"
                      value={pin}
                      onChangeText={text =>
                        handleInputChange('pin', text, setPin)
                      }
                      placeholder="Pincode"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <BorderTextInput
                  label="State"
                  value={state}
                  onChangeText={text =>
                    handleInputChange('state', text, setState)
                  }
                  placeholder="Enter your State"
                />

                <BorderTextInput
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  //multiline
                  placeholder="Enter your Address"
                />

                {isProfessional && (
                  <BorderTextInput
                    label="Experience"
                    value={experience}
                    onChangeText={setExperience}
                    placeholder="Enter your experience"
                  />
                )}
                <View style={{}}>
                  {isProfessional &&
                    links.map((item, index) => (
                      <View key={index} style={{ marginBottom: 10 }}>
                        <BorderTextInput
                          label={`Link ${index + 1}`}
                          value={item}
                          onChangeText={text => handleLinkChange(text, index)}
                          placeholder="Enter link"
                        />

                        {links.length > 1 && (
                          <TouchableOpacity onPress={() => removeLink(index)}>
                            <Text style={{ color: 'red', fontSize: 12 }}>
                              Remove
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                  {isProfessional && (
                    <TouchableOpacity
                      style={styles.addMoreBtn}
                      onPress={addMoreLinks}
                    >
                      <AddIcon />
                      <Text style={styles.addMoreText}>Add more links</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isProfessional && (
                  <BorderTextInput
                    label="Bio"
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Write Here.."
                    multiline={true}
                  />
                )}
                {/* SAVE BUTTON */}
                <TouchableOpacity
                  style={[styles.saveBtn, { opacity: isFormValid() ? 1 : 0.5 }]}
                  onPress={handleSave}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <CustomPopup
              visible={showPopup}
              message="Your profile has been saved successfully!"
              onClose={() => setShowPopup(false)}
              buttons={[
                {
                  label: 'OK',
                  type: 'primary',
                  onPress: () => {
                    setShowPopup(false);
                    navigation.replace('ProfTabNav');
                  },
                },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  header: {
    height: HEIGHT(24),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  backBtn: {
    position: 'absolute',
    top: HEIGHT(6),
    left: WIDTH(5),
  },

  profileWrapper: {
    alignItems: 'center',
    marginTop: -60,
  },

  profileSection: {
    position: 'relative',
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },

  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -20,

    padding: 8,
    borderRadius: 20,
  },

  card: {
    padding: WIDTH(5),
    borderRadius: 14,
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 4,
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  col: {
    width: '48%',
  },

  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },
  cameraCvrBtn: {
    position: 'absolute',
    top: 110,
    right: 10,

    padding: 8,
    borderRadius: 20,
  },
  addMoreBtn: {
    marginTop: HEIGHT(-2),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  addMoreText: {
    color: Colors.primary,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 14,
    textAlignVertical: 'center',
  },
});
