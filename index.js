/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

import notifee, { EventType } from '@notifee/react-native';

//  BACKGROUND Notification HANDLER
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Notification:', remoteMessage);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('Background press');
  }
});

AppRegistry.registerComponent(appName, () => App);
