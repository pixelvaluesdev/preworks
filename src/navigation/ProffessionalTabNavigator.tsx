import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfessionalHomeScreen from '../screens/ProfessionalsScreens/ProfessionalHomeScreen';

const Tab = createBottomTabNavigator();

const ProfessionalTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="ProfessionalHome" component={ProfessionalHomeScreen} />
      <Tab.Screen name="Projects" component={ProjectScreen} />
      <Tab.Screen name="AddPortfolio" component={PortfolioScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default ProfessionalTabNavigator;
