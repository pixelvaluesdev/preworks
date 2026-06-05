import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';

import { WIDTH, HEIGHT } from '../../utils/responsive';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { useNavigation } from '@react-navigation/native';
import { clearUser } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomPopup from '../../components/Popups/CustomPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import BackIcon from '../../assets/svgs/whiteBackIcon.svg';
import ProfileIcon from '../../assets/svgs/ProfileIcon.svg';
import NotifiIcon from '../../assets/svgs/NotifiIcon.svg';
import PrivacyIcon from '../../assets/svgs/PrivacyIcon.svg';
import PolicyIcon from '../../assets/svgs/PolicyIcon.svg';
import DeleteIcon from '../../assets/svgs/DeleteActIcon.svg';
import Logoutcon from '../../assets/svgs/LogoutIcon.svg';
import RightIcon from '../../assets/svgs/whiteBackIcon.svg';
import ForwardIcon from '../../assets/svgs/ForwardArrow.svg';
import YesIcon from '../../assets/svgs/YesIcon.svg';
import { IMG_URL } from '../../apis/ApiManager';
import { triggerHaptic } from '../../utils/hapticks';
import ScreenWrapper from '../../utils/screenWrapper';
import { clearProjectDraft } from '../../redux/slices/projectDraftSlice';
import { Persistor } from '../../redux/store';

const SettingsScreen = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fName = useSelector(state => state.auth.user?.firstName);
  const lName = useSelector(state => state.auth.user?.lastName);

  const userType = useSelector((state: any) => state.auth.userType);
  console.log('userType:', userType);
  const isCustomer = userType === 'customer';

  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  console.log('User ID:', userId);

  const handleLogout = async () => {
    try {
      setLoading(true);

      // AsyncStorage.removeItem('persist:root');
      dispatch(clearProjectDraft());
      dispatch(clearUser());

      await Persistor.purge();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.log('Logout error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: HEIGHT(10) }}
        >
          {/* HEADER */}
          <LinearGradient
            colors={['#53d78e', '#166850']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={navigation.goBack}
            >
              <RightIcon />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Settings</Text>
          </LinearGradient>

          {/* PROFILE IMAGE */}
          <View style={styles.profileContainer}>
            <Image
              style={styles.profileImage}
              source={
                user?.image
                  ? { uri: `${IMG_URL}${user.image}` }
                  : require('../../assets/pngs/Placeholder.png')
              }
            />
            <Text style={styles.name}>
              {fName} {lName}
            </Text>
          </View>

          {/* SETTINGS LIST */}
          <View style={styles.listContainer}>
            {/* Profile */}
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate(
                  isCustomer ? 'ProfileScreen' : 'ProfessionalProfile',
                  { userId: userId },
                )
              }
            >
              <View style={styles.rowLeft}>
                <ProfileIcon />
                <Text style={styles.rowText}>Profile</Text>
              </View>
              <ForwardIcon />
            </TouchableOpacity>

            {/* Applied Projects (only for professionals) */}
            {!isCustomer && (
              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.navigate('ProjectDetails')}
              >
                <View style={styles.rowLeft}>
                  <YesIcon />
                  <Text style={styles.rowText}>Applied Projects</Text>
                </View>
                <ForwardIcon />
              </TouchableOpacity>
            )}

            {/* Notification
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <NotifiIcon />
              <Text style={styles.rowText}>Notification</Text>
            </View>

            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#ccc', true: '#3BA56A' }}
            />
          </View> */}

            {/* Privacy */}
            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <PrivacyIcon />
                <Text style={styles.rowText}>Privacy Policy</Text>
              </View>

              <ForwardIcon />
            </TouchableOpacity>

            {/* Terms */}
            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <PolicyIcon />
                <Text style={styles.rowText}>Terms & Condition</Text>
              </View>

              <ForwardIcon />
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowDeletePopup(true)}
            >
              <View style={styles.rowLeft}>
                <DeleteIcon />
                <Text style={styles.rowText}>Delete My Account</Text>
              </View>

              <ForwardIcon />
            </TouchableOpacity>

            {/* FAQ's */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('FAQ')}
            >
              <View style={styles.rowLeft}>
                <PolicyIcon />
                <Text style={styles.rowText}>FAQ's</Text>
              </View>

              <ForwardIcon />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutRow}
              onPress={() => {
                setShowLogout(true);
                triggerHaptic('impactHeavy');
              }}
            >
              <Logoutcon />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <CustomPopup
            visible={showLogout}
            message="Are you sure you want to Logout?"
            buttons={[
              {
                label: 'Logout',
                type: 'primary',
                onPress: () => {
                  handleLogout();
                  setShowLogout(false);
                },
              },
              {
                label: 'Cancel',

                onPress: () => {
                  setShowLogout(false);
                },
              },
            ]}
          />

          <CustomPopup
            visible={showDeletePopup}
            message={{
              title: 'Are you sure you want to delete your account?',
              subtitle:
                'Your account deletion request will be sent to the admin and reviewed within 3 working days.',
            }}
            buttons={[
              {
                label: 'Send Request',
                type: 'primary',
                onPress: () => {
                  console.log('Delete API call here');
                  setShowDeletePopup(false);
                },
              },
              {
                label: 'Cancel',
                onPress: () => setShowDeletePopup(false),
              },
            ]}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  header: {
    height: HEIGHT(25),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: WIDTH(5),
    top: HEIGHT(6),
  },

  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  profileContainer: {
    alignItems: 'center',
    marginTop: -40,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#fff',
  },

  name: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  listContainer: {
    marginTop: 20,
    paddingHorizontal: WIDTH(6),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    color: '#333',
  },

  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
