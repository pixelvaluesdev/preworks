import React, { useEffect } from 'react';
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
  getFCMToken,
  notificationListener,
} from './src/utils/firebaseNotifications';

function App() {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Delay fixes activity attach issue
        setTimeout(async () => {
          await requestUserPermission();
          await getFCMToken();

          // Register foreground listener
          notificationListener();
        }, 2000);
      } catch (e) {
        console.log('Notification Init Error:', e);
      }
    };

    initializeNotifications();
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
