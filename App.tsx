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
  notificationClickListener,
  notificationListener,
} from './src/utils/firebaseNotifications';
import { useEffect } from 'react';
import { useNavigation } from './react-navigation';

function App() {
  useEffect(() => {
    requestUserPermission();
    getFCMToken();
    notificationListener();
  }, []);

  const navigation = useEffect(() => {
    notificationClickListener(navigation);
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
