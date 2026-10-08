/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

import notifee, { EventType } from '@notifee/react-native';
import {
  getNotificationContent,
  showLocalNotification,
} from './src/utils/localNotifications';

//  BACKGROUND Notification HANDLER
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Notification:', remoteMessage);

  // Notification payloads are displayed by the OS. Only create a local
  // notification for data-only messages to avoid showing duplicates.
  const data = remoteMessage?.data;
  if (!remoteMessage?.notification && data && Object.keys(data).length > 0) {
    const { title, body } = getNotificationContent(remoteMessage);
    await showLocalNotification(title, body);
  }
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('Background press');
  }
});

AppRegistry.registerComponent(appName, () => App);
