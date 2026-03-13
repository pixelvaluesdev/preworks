import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfessionalHomeScreen from '../screens/ProfessionalsScreens/ProfessionalHomeScreen';
import ProjectsScreen from '../screens/CommonScreens/ProjectTabPages/ProjectsScreen';
import PortfolioScreen from '../screens/ProfessionalsScreens/PortfolioScreen';
import NotificationScreen from '../screens/CommonScreens/NotificationScreen';
import SettingsScreen from '../screens/CommonScreens/SettingsScreen';
import HomeIcon from '../assets/svgs/Home.svg';
import NotificationIcon from '../assets/svgs/Notification.svg';
import SettingsIcon from '../assets/svgs/Settings.svg';
import ProjectIcon from '../assets/svgs/Project.svg';
import AddIcon from '../assets/svgs/AddIcon.svg';
import Colors from '../constants/colors';

const Tab = createBottomTabNavigator();

const ProfessionalTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name="ProfessionalHome"
        component={ProfessionalHomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <ProjectIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AddPortfolio"
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AddIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <NotificationIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <SettingsIcon width={22} height={22} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ProfessionalTabNavigator;
