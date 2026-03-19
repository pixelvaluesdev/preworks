import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
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

const SettingsScreen = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fName = useSelector(state => state.auth.user?.firstName);
  const lName = useSelector(state => state.auth.user?.LastName);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await AsyncStorage.removeItem('persist:root');

      dispatch(clearUser());

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
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={['#53d78e', '#166850']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn}>
          {/* <Ionicons name="arrow-back" size={22} color="#fff" /> */}
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>
      </LinearGradient>

      {/* PROFILE IMAGE */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/pngs/BannerImg.png')}
          style={styles.profileImage}
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
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <View style={styles.rowLeft}>
            {/* <Ionicons name="person-outline" size={20} color="#3BA56A" /> */}
            <Text style={styles.rowText}>Profile</Text>
          </View>
          {/* 
          <Ionicons name="chevron-forward" size={20} color="#999" /> */}
        </TouchableOpacity>

        {/* Notification */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            {/* <Ionicons name="notifications-outline" size={20} color="#3BA56A" /> */}
            <Text style={styles.rowText}>Notification</Text>
          </View>

          <Switch
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            trackColor={{ false: '#ccc', true: '#3BA56A' }}
          />
        </View>

        {/* Privacy */}
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            {/* <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#3BA56A"
            /> */}
            <Text style={styles.rowText}>Privacy Policy</Text>
          </View>

          {/* <Ionicons name="chevron-forward" size={20} color="#999" /> */}
        </TouchableOpacity>

        {/* Terms */}
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            {/* <Ionicons name="document-text-outline" size={20} color="#3BA56A" /> */}
            <Text style={styles.rowText}>Terms & Condition</Text>
          </View>

          {/* <Ionicons name="chevron-forward" size={20} color="#999" /> */}
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            {/* <Ionicons name="trash-outline" size={20} color="#3BA56A" /> */}
            <Text style={styles.rowText}>Delete My Account</Text>
          </View>

          {/* <Ionicons name="chevron-forward" size={20} color="#999" /> */}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => setShowLogout(true)}
        >
          {/* <Ionicons name="log-out-outline" size={20} color="red" /> */}
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
    </View>
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
