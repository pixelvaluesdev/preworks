import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/CommonScreens/SplashScreen';
import WelcomeScreen from '../screens/CommonScreens/WelcomeScreen';
import ProfessionalWelcomeScreen from '../screens/ProfessionalsScreens/ProfessionalWelcomeScreen';
import OnboardingScreen from '../screens/CustomerScreens/OnboardingScreen';
import LoginScreen from '../screens/CommonScreens/LoginScreen';
import VerificationScreen from '../screens/CommonScreens/VerificationScreen';
import CustomerTabNavigator from './CustomerTabNavigator';
import ProfessionalTabNavigator from './ProffessionalTabNavigator';
import CustomStatusBar from '../components/CustomStatusBar';
import ProfessionalListScreen from '../screens/CustomerScreens/ProffesionalListScreen';
import FirstLastName from '../screens/CommonScreens/FirstLastName';
import GeneralEnquiryScreen from '../screens/ProfessionalsScreens/GeneralEnquiryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <CustomStatusBar />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 400,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ProfWelc" component={ProfessionalWelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpVeri" component={VerificationScreen} />
        <Stack.Screen name="CustmTabNav" component={CustomerTabNavigator} />
        <Stack.Screen name="ProfTabNav" component={ProfessionalTabNavigator} />
        <Stack.Screen
          name="ProfessionalList"
          component={ProfessionalListScreen}
        />
        <Stack.Screen name="EnterName" component={FirstLastName} />
        <Stack.Screen name="GeneralEnquiry" component={GeneralEnquiryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
