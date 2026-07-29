import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';

import ApiManager from '../apis/ApiManager';
import { clearUser } from '../redux/slices/authSlice';
import { clearNotifications } from '../redux/slices/notificationSlice';
import { clearProjectDraft } from '../redux/slices/projectDraftSlice';
import { Persistor } from '../redux/store';

const CHECK_INTERVAL = 30000; // every 30 seconds

const useCheckLogin = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const token = useSelector((state: any) => state.auth.userToken);
  const user = useSelector((state: any) => state.auth.user);
  const [popupVisible, setPopupVisible] = useState(false);

  const [popupConfig, setPopupConfig] = useState({
    message: '',
    buttons: [],
  });

  const showPopup = (message, buttons = []) => {
    setPopupConfig({ message, buttons });
    setPopupVisible(true);
  };

  useEffect(() => {
    if (!token || !user?._id) return;

    let interval: NodeJS.Timeout;

    const logoutUser = async () => {
      dispatch(clearProjectDraft());
      dispatch(clearNotifications());
      dispatch(clearUser());

      await Persistor.purge();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        }),
      );
    };

    const checkLogin = async () => {
      try {
        const res = await ApiManager.checkLogin(user._id, token);

        // API Response:
        // { _id: "...", status: true }

        if (!res?.data?.status) {
          clearInterval(interval);

          Alert.alert(
            'Account Removed',
            'Your account has been deleted. Please contact support if you believe this is a mistake.',
            [
              {
                text: 'OK',
                onPress: logoutUser,
              },
            ],
            { cancelable: false },
          );
        }
      } catch (err) {
        console.log('Check Login Error', err);
      }
    };

    checkLogin(); // immediately
    interval = setInterval(checkLogin, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [token, user?._id]);
};

export default useCheckLogin;
