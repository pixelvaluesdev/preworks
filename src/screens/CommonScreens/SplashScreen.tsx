import { View, StyleSheet } from 'react-native';
import Logo from '../../assets/svgs/PreworksLogo.svg';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  const token = useSelector((state: any) => state.auth.userToken);
  const user = useSelector((state: any) => state.auth.user);
  console.log('USer Object', user);
  const userType = useSelector((state: any) => state.auth.userType);

  const isRehydrated = useSelector((state: any) => state._persist?.rehydrated);

  const hasSeenOnboarding = useSelector(
    (state: any) => state.auth.hasSeenOnboarding,
  );
  const hasSeenProfessionalOnboarding = useSelector(
    (state: any) => state.auth.hasSeenProfessionalOnboarding,
  );

  useEffect(() => {
    if (!isRehydrated) return;

    const timer = setTimeout(() => {
      if (!token) {
        navigation.replace('Welcome');
        return;
      }

      if (token && !user?.firstName) {
        navigation.replace('ShortProfile');
        return;
      }

      if (token && user?.firstName) {
        if (
          userType === 'contractor' ||
          userType === 'architect' ||
          userType === 'designer'
        ) {
          if (!hasSeenProfessionalOnboarding) {
            navigation.replace('ProfOnboarding');
          } else {
            navigation.replace('ProfTabNav');
          }
        } else {
          if (!hasSeenOnboarding) {
            navigation.replace('Onboarding');
          } else {
            navigation.replace('CustmTabNav');
          }
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isRehydrated]);

  return (
    <View style={styles.container}>
      <Logo />
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
