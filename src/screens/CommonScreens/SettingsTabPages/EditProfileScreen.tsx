import React, { useState } from 'react';
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

const EditProfileScreen = ({ navigation }: any) => {
  const userType = useSelector((state: any) => state.auth.userType);
  console.log('userType:', userType);
  const isProfessional = userType !== 'customer';
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [links, setLinks] = useState('');
  const [bio, setBio] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
  });

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

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return 'Email is required';
    if (!regex.test(email)) return 'Enter valid email';

    return '';
  };

  const handleSave = () => {
    let emailError = '';

    if (!isProfessional) {
      emailError = validateEmail(email);
    }

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({ email: '' });

    setShowPopup(true);
  };

  return (
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
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <Back />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraCvrBtn}>
                <Camera width={35} />
              </TouchableOpacity>
            </LinearGradient>

            {/* PROFILE IMAGE */}
            <View style={styles.profileWrapper}>
              <View style={styles.profileSection}>
                <Image
                  style={styles.profileImage}
                  source={require('../../../assets/pngs/BannerImg.png')}
                />

                <TouchableOpacity style={styles.cameraBtn}>
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
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your experience"
                />
              )}
              <View style={{}}>
                {isProfessional && (
                  <BorderTextInput
                    label="Links"
                    value={links}
                    onChangeText={setLinks}
                    placeholder="Prework.com/follow/."
                  />
                )}

                {isProfessional && (
                  <TouchableOpacity style={styles.addMoreBtn}>
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
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
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
                  navigation.goBack(); // optional
                },
              },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
