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
import ProffessionalListScreen from '../screens/CustomerScreens/HomeScreenPages/ProffessionalListScreen';
import ShortProfileScreen from '../screens/CommonScreens/ShortProfileScreen';
import GeneralEnquiryScreen from '../screens/ProfessionalsScreens/GeneralEnquiryScreen';
import HelpRequestSuccessScreen from '../screens/CustomerScreens/HomeScreenPages/HelpRequestSuccessScreen';
import ProfessionalProfileScreen from '../screens/CustomerScreens/HomeScreenPages/ProfessionalProfileScreen';
import ProfessionalsProjectDetails from '../screens/CustomerScreens/HomeScreenPages/ProfessionalsProjectDetails';
import ProjectsScreen from '../screens/CommonScreens/ProjectTabPages/ProjectsScreen';
import CommonProjectDetailsScreen from '../screens/CommonScreens/ProjectTabPages/CommonProjectDetailsScreen';
import QuoteListScreen from '../screens/CustomerScreens/QuoteOrIntresetedListPAge/QuoteScreen';
import CandidateDetailScreen from '../screens/CustomerScreens/QuoteOrIntresetedListPAge/CandidateDetailScreen';
import ProfileScreen from '../screens/CommonScreens/SettingsTabPages/ProfileScreen';
import EditProfileScreen from '../screens/CommonScreens/SettingsTabPages/EditProfileScreen';
import AddProjectInformationScreen from '../screens/CustomerScreens/AddProjectPages/AddProjectInformationScreen';
import AppliedProjectsScreen from '../screens/ProfessionalsScreens/AppliedProjectsListScreen';
import NoProjectScreen from '../screens/CustomerScreens/AddProjectPages/NoProjectsScreen';
import ProfOnboardingScreen from '../screens/ProfessionalsScreens/ProfOnboardingScreen';
import SubscriptionScreen from '../screens/ProfessionalsScreens/SubscriptionScreen';
import PortfolioScreen from '../screens/ProfessionalsScreens/PortfolioScreen';

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
        <Stack.Screen name="ProfOnboarding" component={ProfOnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpVeri" component={VerificationScreen} />
        <Stack.Screen name="CustmTabNav" component={CustomerTabNavigator} />
        <Stack.Screen name="ProfTabNav" component={ProfessionalTabNavigator} />
        <Stack.Screen
          name="ProfessionalList"
          component={ProffessionalListScreen}
        />
        <Stack.Screen name="ShortProfile" component={ShortProfileScreen} />
        <Stack.Screen name="GeneralEnquiry" component={GeneralEnquiryScreen} />
        <Stack.Screen
          name="HelpRequestSuccess"
          component={HelpRequestSuccessScreen}
        />
        <Stack.Screen
          name="ProfessionalProfile"
          component={ProfessionalProfileScreen}
        />
        {/* Project details Screen from Professinal profile page when click on the portfolio project */}
        <Stack.Screen name="ProjectDetails" component={ProjectsScreen} />

        {/* Project Detail screen of Projects tab in bottom navigation for both customer and proffesional (C) */}
        <Stack.Screen
          name="CommonProjectDetails"
          component={CommonProjectDetailsScreen}
        />

        <Stack.Screen name="Quote/IntrestedList" component={QuoteListScreen} />
        <Stack.Screen
          name="CandidateDetail"
          component={CandidateDetailScreen}
        />
        {/* Common Profile Screen for All user Type */}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen
          name="AddProjectInformation"
          component={AddProjectInformationScreen}
        />
        <Stack.Screen
          name="ProfessionalsProject"
          component={ProfessionalsProjectDetails}
        />
        <Stack.Screen
          name="AppliedProjects"
          component={AppliedProjectsScreen}
        />

        <Stack.Screen name="NoProjects" component={NoProjectScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="AddWork" component={PortfolioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
