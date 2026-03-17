import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../assets/svgs/PreworksLogo.svg';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userType = useSelector(state => state.auth.userType);

  console.log('USerrrrr', user);
  console.log('Token', token);
  console.log('userTypew', userType);

  useEffect(() => {
    setTimeout(() => {
      if (!token) {
        navigation.replace('Welcome');
        return;
      }

      if (token && !user?.firstName) {
        navigation.replace('ShortProfile');
        return;
      }

      if (token && user?.firstName) {
        if (userType === 'professional') {
          navigation.replace('ProfTabNav');
        } else {
          navigation.replace('CustmTabNav');
        }
      }
    }, 1500);
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
