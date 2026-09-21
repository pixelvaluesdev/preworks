import React, { useEffect, useState, useMemo } from 'react';
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
  BackHandler,
} from 'react-native';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import Camera from '../../../assets/svgs/CameraSvg.svg';
import Back from '../../../assets/svgs/whiteBackIcon.svg';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '../../../assets/svgs/AddBtnIcon.svg';
import CustomPopup from '../../../components/Popups/CustomPopup';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useRoute } from '@react-navigation/native';
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';
import { setUser } from '../../../redux/slices/authSlice';
import ScreenWrapper from '../../../utils/screenWrapper';
import { City, State } from 'country-state-city';

const EditProfileScreen = ({ navigation }: any) => {
  const userType = useSelector((state: any) => state?.auth?.userType);
  const loggedInUser = useSelector((state: any) => state?.auth?.user);
  const token = useSelector((state: any) => state?.auth?.userToken);
  const isProfessional = userType !== 'customer';

  const route = useRoute();

  const rawUserId =
    route?.params?.userId || loggedInUser?._id || loggedInUser?.id;
  const userId =
    rawUserId !== undefined && rawUserId !== null && String(rawUserId).trim()
      ? String(rawUserId).trim()
      : '';

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

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [pinSuggestions, setPinSuggestions] = useState([]);
  const [showPinDropdown, setShowPinDropdown] = useState(false);

  const [cityPincodes, setCityPincodes] = useState([]);
  const [linkErrors, setLinkErrors] = useState([]);

  const indianCities = useMemo(() => {
    const cities = City?.getCitiesOfCountry?.('IN');
    return Array.isArray(cities) ? cities : [];
  }, []);

  const indianStates = useMemo(() => {
    const states = State?.getStatesOfCountry?.('IN');
    return Array.isArray(states) ? states : [];
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      return;
    }

    Alert.alert('Profile not available', 'Please try again from your profile.');

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  }, [userId, navigation, route, loggedInUser?._id, userType, token]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Do you want to close the app?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ]);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler?.remove?.();
  }, []);

  const handleLinkChange = (text, index) => {
    const updatedLinks = [...links];
    updatedLinks[index] = text;
    setLinks(updatedLinks);

    const updatedErrors = [...linkErrors];
    updatedErrors[index] = validateLink(text);
    setLinkErrors(updatedErrors);
  };

  const addMoreLinks = () => {
    setLinks([...links, '']);
    setLinkErrors([...linkErrors, '']);
  };

  const removeLink = index => {
    const updatedLinks = links.filter((_, i) => i !== index);
    const updatedErrors = linkErrors.filter((_, i) => i !== index);

    setLinks(updatedLinks.length ? updatedLinks : ['']);
    setLinkErrors(updatedErrors.length ? updatedErrors : ['']);
  };

  const fetchProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await ApiManager?.getProfile?.(userId, token);

      if (response?.data?.status === 'success') {
        let data = response?.data?.data;

        if (data && typeof data === 'object' && data?.user) {
          data = data.user;
        }

        if (!data || typeof data !== 'object') {
          setProfile(null);
          return;
        }

        setProfile(data);

        const fullName = `${data?.firstName || ''} ${
          data?.lastName || ''
        }`.trim();
        setName(fullName);
        setMobile(data?.phone || '');
        setEmail(data?.email || '');
        setCity(data?.city || '');
        setPin(data?.pincode || '');
        setState(data?.state || '');
        setAddress(data?.address || '');

        setExperience(data?.experience || '');
        setBio(data?.bio || '');

        const existingLinks = Array.isArray(data?.links) ? data.links : [];
        if (existingLinks.length > 0) {
          setLinks(existingLinks);
          setLinkErrors(existingLinks.map(() => ''));
        } else {
          setLinks(['']);
          setLinkErrors(['']);
        }
      }
    } catch (error) {
      // Fetch failed; leave existing state untouched.
    } finally {
      setLoading(false);
    }
  };

  const openImagePicker = type => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    launchImageLibrary(options, response => {
      if (response?.didCancel) return;
      if (response?.errorCode) return;

      const image = response?.assets?.[0];

      if (!image) return;

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
      if (response?.didCancel) return;

      if (response?.errorCode) {
        Alert.alert(
          'Camera Error',
          `${response?.errorCode}\n${response?.errorMessage || ''}`,
        );
        return;
      }

      if (response?.assets?.length) {
        const image = response.assets[0];

        if (type === 'profile') {
          setProfileImage(image);
        } else {
          setCoverImage(image);
        }
      }
    });
  };

  const validateLink = link => {
    if (!link?.trim()) return '';

    const regex = /^https:\/\/.+/i;

    return regex.test(link) ? '' : 'Link should start with https://';
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
    if (!name?.trim()) return false;
    if (!mobile?.trim()) return false;
    if (!city?.trim()) return false;
    if (!pin?.trim()) return false;
    if (!state?.trim()) return false;
    if (!address?.trim()) return false;

    if (!isProfessional && !email?.trim()) return false;

    if (isProfessional) {
      if (!experience?.trim()) return false;
      if (!bio?.trim()) return false;

      const hasInvalidLinks = links.some(
        link => link?.trim() !== '' && validateLink(link),
      );

      if (hasInvalidLinks) return false;
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

    const invalidLink = links.find(
      link => link?.trim() !== '' && validateLink(link),
    );

    if (invalidLink) {
      Alert.alert('Invalid Link', 'Please enter links starting with https://');
      return;
    }

    if (!userId) {
      Alert.alert(
        'Profile not available',
        'Please try again from your profile.',
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

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

      const filteredLinks = links.filter(link => link?.trim() !== '');

      if (filteredLinks.length > 0) {
        formData.append('links', JSON.stringify(filteredLinks));
      }

      if (profileImage) {
        formData.append('image', {
          uri: profileImage?.uri,
          type: profileImage?.type || 'image/jpeg',
          name: profileImage?.fileName || 'profile.jpg',
        });
      }

      if (coverImage) {
        formData.append('userBanner', {
          uri: coverImage?.uri,
          type: coverImage?.type || 'image/jpeg',
          name: coverImage?.fileName || 'banner.jpg',
        });
      }

      const response = await ApiManager?.updateProfile?.(
        userId,
        formData,
        token,
      );

      if (response?.data?.status === 'success') {
        const updatedUser = response?.data?.data;
        dispatch(setUser(updatedUser));
        setShowPopup(true);
      }
    } catch (error: any) {
      Alert.alert(
        'Update Failed',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPincodes = async (cityName, fallbackState = '') => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/postoffice/${cityName}`,
      );

      const result = await response?.json?.();

      if (result?.[0]?.Status === 'Success') {
        const pins = result?.[0]?.PostOffice || [];

        setCityPincodes(pins);
        setPinSuggestions(pins);

        if (fallbackState) {
          setState(fallbackState);
        } else if (pins?.[0]?.State) {
          setState(pins[0].State);
        }
      } else {
        setCityPincodes([]);
        setPinSuggestions([]);
      }
    } catch (error) {
      // Pincode lookup failed; keep existing suggestions empty.
    }
  };

  const getCityMatchScore = (cityName, query) => {
    const normalizedCity = cityName?.toLowerCase?.().trim();
    const normalizedQuery = query?.toLowerCase?.().trim();

    if (!normalizedQuery) return Number.MAX_SAFE_INTEGER;
    if (normalizedCity === normalizedQuery) return 0;
    if (normalizedCity?.startsWith(normalizedQuery)) return 1;

    const cityWords = normalizedCity?.split(/\s+/) || [];
    const wordMatchIndex = cityWords.findIndex(word =>
      word?.startsWith(normalizedQuery),
    );

    if (wordMatchIndex !== -1) {
      return 2 + wordMatchIndex * 0.1;
    }

    const containsIndex = normalizedCity?.indexOf(normalizedQuery) ?? -1;
    if (containsIndex !== -1) {
      return 3 + containsIndex;
    }

    return Number.MAX_SAFE_INTEGER;
  };

  const getStateMatchScore = (stateName, query) => {
    const normalizedState = stateName?.toLowerCase?.().trim();
    const normalizedQuery = query?.toLowerCase?.().trim();

    if (!normalizedQuery) return Number.MAX_SAFE_INTEGER;
    if (normalizedState === normalizedQuery) return 0;
    if (normalizedState?.startsWith(normalizedQuery)) return 1;

    const stateWords = normalizedState?.split(/\s+/) || [];
    const wordMatchIndex = stateWords.findIndex(word =>
      word?.startsWith(normalizedQuery),
    );

    if (wordMatchIndex !== -1) {
      return 2 + wordMatchIndex * 0.1;
    }

    const containsIndex = normalizedState?.indexOf(normalizedQuery) ?? -1;
    if (containsIndex !== -1) {
      return 3 + containsIndex;
    }

    return Number.MAX_SAFE_INTEGER;
  };

  const handleCitySearch = text => {
    setCity(text);

    const trimmedText = text?.trim?.() || '';

    if (trimmedText.length < 2) {
      setCitySuggestions([]);
      setShowDropdown(false);
      return;
    }

    const query = trimmedText.toLowerCase();

    const filteredCities = [...indianCities]
      .filter(city => city?.name?.toLowerCase?.().includes(query))
      .sort((a, b) => {
        const scoreDiff =
          getCityMatchScore(a?.name, query) - getCityMatchScore(b?.name, query);

        if (scoreDiff !== 0) return scoreDiff;

        return a?.name?.localeCompare(b?.name);
      })
      .slice(0, 10);

    setCitySuggestions(filteredCities);
    setShowDropdown(filteredCities.length > 0);
  };

  const handleStateSearch = text => {
    const cleanedText = text?.replace(/[^a-zA-Z ]/g, '') || '';
    setState(cleanedText);

    const trimmedText = cleanedText.trim();

    if (trimmedText.length < 2) {
      setStateSuggestions([]);
      setShowStateDropdown(false);
      return;
    }

    const query = trimmedText.toLowerCase();

    const filteredStates = [...indianStates]
      .filter(item => item?.name?.toLowerCase?.().includes(query))
      .sort((a, b) => {
        const scoreDiff =
          getStateMatchScore(a?.name, query) -
          getStateMatchScore(b?.name, query);

        if (scoreDiff !== 0) return scoreDiff;

        return a?.name?.localeCompare(b?.name);
      })
      .slice(0, 10);

    setStateSuggestions(filteredStates);
    setShowStateDropdown(filteredStates.length > 0);
  };

  const handlePinSearch = text => {
    handleInputChange('pin', text, setPin);

    if (!text?.trim?.()) {
      setPinSuggestions([]);
      setShowPinDropdown(false);
      return;
    }

    const filteredPins = cityPincodes
      .filter(item => item?.Pincode?.includes(text))
      .slice(0, 10);

    setPinSuggestions(filteredPins);
    setShowPinDropdown(true);
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                      ? { uri: coverImage.uri }
                      : profile?.userBanner
                      ? { uri: `${IMG_URL}${profile.userBanner}` }
                      : require('../../../assets/pngs/Placeholder.png')
                  }
                />
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => {
                    if (navigation?.canGoBack?.()) {
                      navigation.goBack();
                    } else {
                      Alert.alert('Exit App', 'Do you want to close the app?', [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            setTimeout(() => {
                              BackHandler.exitApp();
                            }, 300);
                          },
                        },
                      ]);
                    }
                  }}
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

              <View style={styles.profileWrapper}>
                <View style={styles.profileSection}>
                  <Image
                    style={styles.profileImage}
                    source={
                      profileImage?.uri
                        ? { uri: profileImage.uri }
                        : profile?.image
                        ? { uri: `${IMG_URL}${profile.image}` }
                        : require('../../../assets/pngs/Placeholder.png')
                    }
                  />

                  <TouchableOpacity
                    style={styles.cameraBtn}
                    onPress={() => showImageOptions('profile')}
                  >
                    <Camera width={35} />

                    {isProfessional && (
                      <Text style={styles.requiredStar}>*</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

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
                        setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="Enter your email"
                    />

                    {errors?.email ? (
                      <Text style={{ color: 'red', marginTop: -20 }}>
                        {errors.email}
                      </Text>
                    ) : null}
                  </>
                )}

                <View style={styles.row}>
                  <View style={[styles.col, { zIndex: 1000 }]}>
                    <View style={{ position: 'relative' }}>
                      <BorderTextInput
                        label="City"
                        value={city}
                        onChangeText={handleCitySearch}
                        placeholder="City"
                      />

                      {showDropdown && citySuggestions.length > 0 && (
                        <View style={styles.dropdown}>
                          <ScrollView
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                          >
                            {citySuggestions.map((item, index) => (
                              <Text
                                key={index}
                                style={styles.item}
                                onPress={() => {
                                  const matchedState = indianStates.find(
                                    s =>
                                      s?.isoCode === item?.stateCode ||
                                      s?.name?.toLowerCase() ===
                                        item?.name?.toLowerCase(),
                                  );

                                  setCity(item?.name);
                                  setPin('');
                                  setState(matchedState?.name || '');
                                  fetchPincodes(
                                    item?.name,
                                    matchedState?.name || '',
                                  );

                                  setShowDropdown(false);
                                  setShowPinDropdown(true);
                                }}
                              >
                                {item?.name}
                              </Text>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={[styles.col, { zIndex: 999 }]}>
                    <View style={{ position: 'relative' }}>
                      <BorderTextInput
                        label="Pin code"
                        value={pin}
                        onChangeText={handlePinSearch}
                        placeholder="Pincode"
                        keyboardType="number-pad"
                        onFocus={() => {
                          setPinSuggestions(cityPincodes);
                          setShowPinDropdown(true);
                        }}
                      />

                      {showPinDropdown && pinSuggestions.length > 0 && (
                        <View style={styles.dropdown}>
                          <ScrollView
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                          >
                            {pinSuggestions.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  setPin(item?.Pincode);
                                  setShowPinDropdown(false);
                                }}
                              >
                                <Text style={styles.item}>
                                  {item?.Pincode}
                                  <Text style={{ color: '#888' }}>
                                    {' '}
                                    - {item?.Name}
                                  </Text>
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={[styles.col, { zIndex: 998, width: '100%' }]}>
                  <View style={{ position: 'relative' }}>
                    <BorderTextInput
                      label="State"
                      value={state}
                      onChangeText={handleStateSearch}
                      placeholder="Enter your State"
                    />

                    {showStateDropdown && stateSuggestions.length > 0 && (
                      <View style={styles.dropdown}>
                        <ScrollView
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                        >
                          {stateSuggestions.map((item, index) => (
                            <Text
                              key={index}
                              style={styles.item}
                              onPress={() => {
                                setState(item?.name);
                                setStateSuggestions([]);
                                setShowStateDropdown(false);
                                if (!city?.trim()) {
                                  setCity('');
                                }
                              }}
                            >
                              {item?.name}
                            </Text>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                <BorderTextInput
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your Address"
                />

                {isProfessional && (
                  <BorderTextInput
                    label="Experience"
                    value={experience}
                    onChangeText={setExperience}
                    placeholder="Enter your experience in years"
                    keyboardType="number-pad"
                  />
                )}

                <View>
                  {isProfessional &&
                    links.map((item, index) => (
                      <View key={index} style={{ marginBottom: 10 }}>
                        <BorderTextInput
                          label={`Link ${index + 1} (Paste URL)`}
                          value={item}
                          onChangeText={text => handleLinkChange(text, index)}
                          placeholder="e.g. Instagram / LinkedIn profile URL"
                          mandotory={false}
                        />

                        {linkErrors[index] ? (
                          <Text
                            style={{
                              color: 'red',
                              fontSize: 12,
                              marginTop: -15,
                              marginBottom: 5,
                              marginLeft: 5,
                            }}
                          >
                            {linkErrors[index]}
                          </Text>
                        ) : null}

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
                    if (isProfessional) {
                      navigation?.replace?.('ProfTabNav');
                    } else {
                      navigation?.replace?.('CustmTabNav');
                    }
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
  dropdown: {
    position: 'absolute',
    top: HEIGHT(8),
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 9999,
    elevation: 20,
    maxHeight: HEIGHT(25),
  },
  item: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  requiredStar: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
