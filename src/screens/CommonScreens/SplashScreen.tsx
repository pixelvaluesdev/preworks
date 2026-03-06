import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../assets/svgs/PreworksLogo.svg';
import { useEffect } from 'react';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <Logo width={180} height={180} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
