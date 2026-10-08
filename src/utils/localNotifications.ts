import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const DEFAULT_NOTIFICATION_TITLE = 'PreWorks';
const DEFAULT_NOTIFICATION_BODY = 'You have a new notification.';

const firstNonEmptyString = (...values: unknown[]) =>
  values
    .find(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0,
    )
    ?.trim();

export function getNotificationContent(remoteMessage: any) {
  const notification = remoteMessage?.notification || {};
  const data = remoteMessage?.data || {};

  const title = firstNonEmptyString(
    notification.title,
    data.title,
    data.notificationTitle,
    data.subject,
  );
  const body = firstNonEmptyString(
    notification.body,
    data.body,
    data.notificationBody,
    data.message,
    data.description,
  );

  return {
    title: title || DEFAULT_NOTIFICATION_TITLE,
    body: body || DEFAULT_NOTIFICATION_BODY,
    hasContent: Boolean(title || body),
  };
}

export async function showLocalNotification(title?: string, body?: string) {
  // Create channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display notification
  await notifee.displayNotification({
    title: firstNonEmptyString(title) || DEFAULT_NOTIFICATION_TITLE,
    body: firstNonEmptyString(body) || DEFAULT_NOTIFICATION_BODY,
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export function onForegroundEventHandler(navigation: any) {
  notifee.onForegroundEvent(({ type }) => {
    if (type === EventType.PRESS) {
      console.log('User pressed notification');

      navigation.navigate('Home'); // change screen
    }
  });
}
