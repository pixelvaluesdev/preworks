import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Store } from './src/redux/store';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SnackbarProvider } from './src/hooks/SnackbarProvider';
import { StatusBar } from 'react-native';
function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <SnackbarProvider>
          <PaperProvider>
            <AppNavigator />
          </PaperProvider>
        </SnackbarProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
