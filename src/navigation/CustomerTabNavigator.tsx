import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerHomeScreen from '../screens/CustomerScreens/CustomerHomeScreen';
import NotificationScreen from '../screens/CommonScreens/NotificationScreen';
import ProjectScreen from '../screens/CommonScreens/ProjectScreen';
import SettingsScreen from '../screens/CommonScreens/SettingsScreen';
import HomeIcon from '../assets/svgs/Home.svg';
import NotificationIcon from '../assets/svgs/Notification.svg';
import SettingsIcon from '../assets/svgs/Settings.svg';
import ProjectIcon from '../assets/svgs/Project.svg';
import Colors from '../constants/colors';
const Tab = createBottomTabNavigator();

const CustomerTabNavigator = () => {
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
        name="CustomerHome"
        component={CustomerHomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeIcon widht={22} height={22} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <ProjectIcon widht={22} height={22} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <NotificationIcon widht={22} height={22} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <SettingsIcon widht={22} height={22} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;
