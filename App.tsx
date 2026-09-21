import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Persistor, Store } from './src/redux/store';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SnackbarProvider } from './src/hooks/SnackbarProvider';
import { PersistGate } from 'redux-persist/integration/react';
import { InternetProvider } from './src/context/InternetContext';

import { requestUserPermission } from './src/utils/requestUserPermission';

import {
  getAPNsToken,
  getFCMToken,
  notificationListener,
} from './src/utils/firebaseNotifications';

function App() {
  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe: (() => void) | undefined;

    const initializeNotifications = async () => {
      try {
        await new Promise<void>(resolve => {
          timeout = setTimeout(resolve, 2000);
        });

        if (cancelled) {
          return;
        }

        await requestUserPermission();
        const apnsToken = await getAPNsToken();
        const token = await getFCMToken();

        if (token) {
          Clipboard.setString(token);
          // Alert.alert(
          //   'TestFlight Push Tokens',
          //   `APNs token:\n${
          //     apnsToken || 'NOT RECEIVED'
          //   }\n\nFCM token:\n${token}\n\nFCM token copied to clipboard.`,
          // );
        } else {
          // Alert.alert(
          //   'Push Token Error',
          //   `APNs token:\n${
          //     apnsToken || 'NOT RECEIVED'
          //   }\n\nNo FCM token was returned. Check the device logs for FCM TOKEN ERROR.`,
          // );
        }

        if (!cancelled) {
          // Register foreground listener
          unsubscribe = notificationListener();
        }
      } catch (e) {
        console.log('Notification Init Error:', e);
      }
    };

    initializeNotifications();

    return () => {
      cancelled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      unsubscribe?.();
    };
  }, []);

  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <SafeAreaProvider>
          <SnackbarProvider>
            <InternetProvider>
              <PaperProvider>
                <AppNavigator />
              </PaperProvider>
            </InternetProvider>
          </SnackbarProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
