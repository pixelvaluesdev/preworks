import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import { showLocalNotification } from './localNotifications';

const app = getApp();
const messaging = getMessaging(app);

export function notificationClickListener(navigation: any) {
  // When app in background
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('Opened from background:', remoteMessage);

    //  Example navigation
    navigation.navigate('Home'); // change screen name
  });

  // When app killed
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
      console.log('Opened from quit state:', remoteMessage);

      navigation.navigate('Home');
    }
  });
}

// Token
export async function getFCMToken() {
  try {
    const token = await getToken(messaging);

    console.log('FCM Token:', token);

    return token;
  } catch (error) {
    console.log('FCM TOKEN ERROR:', error);
    return null;
  }
}

// Foreground notification
export function notificationListener() {
  onMessage(messaging, async remoteMessage => {
    console.log('Foreground Notification:', remoteMessage);

    const title = remoteMessage.notification?.title || 'No Title';
    const body = remoteMessage.notification?.body || 'No Body';

    //  THIS IS THE MAIN PART
    await showLocalNotification(title, body);
  });
}
