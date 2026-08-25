import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const messaging = getMessaging();

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Android notification permission granted');
    } else {
      console.log('Android notification permission denied');
    }

    return;
  }

  if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(messaging);

    if (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    ) {
      console.log('iOS notification permission granted');
    } else {
      console.log('iOS notification permission denied');
    }
  }
}
