import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Persistor, Store } from './src/redux/store';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SnackbarProvider } from './src/hooks/SnackbarProvider';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <SafeAreaProvider>
          <SnackbarProvider>
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </SnackbarProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
