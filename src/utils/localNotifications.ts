import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

export async function showLocalNotification(title: string, body: string) {
  if (Platform.OS === 'ios') {
    await notifee.displayNotification({
      title,
      body,
      ios: {
        sound: 'default',
      },
    });
    return;
  }

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export function onForegroundEventHandler(navigation: any) {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('User pressed notification');

      navigation.navigate('Home'); // change screen
    }
  });
}
