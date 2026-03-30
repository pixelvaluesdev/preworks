import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerHomeScreen from '../screens/CustomerScreens/CustomerHomeScreen';
import NotificationScreen from '../screens/CommonScreens/NotificationScreen';
import SettingsScreen from '../screens/CommonScreens/SettingsScreen';
import HomeIcon from '../assets/svgs/Home.svg';
import NotificationIcon from '../assets/svgs/Notification.svg';
import SettingsIcon from '../assets/svgs/Settings.svg';
import ProjectIcon from '../assets/svgs/Project.svg';
import Colors from '../constants/colors';
import ProjectsScreen from '../screens/CommonScreens/ProjectTabPages/ProjectsScreen';

import ActProject from '../assets/svgs/ActProjectIcon.svg';
import ActHome from '../assets/svgs/ActHomeIcon.svg';
import ActNotifi from '../assets/svgs/ActNotifiIcon.svg';
import ActSetting from '../assets/svgs/ActSettingIcon.svg';

const Tab = createBottomTabNavigator();

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 10,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <ActHome height={22} /> : <HomeIcon height={22} />,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <ActProject /> : <ProjectIcon height={22} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ActNotifi height={22} />
            ) : (
              <NotificationIcon height={22} />
            ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <ActSetting height={22} /> : <SettingsIcon height={22} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;
