import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

export async function showLocalNotification(title: string, body: string) {
  // Create channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display notification
  await notifee.displayNotification({
    title: title,
    body: body,
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
