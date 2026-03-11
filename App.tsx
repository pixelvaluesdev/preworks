import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Store } from './src/redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
