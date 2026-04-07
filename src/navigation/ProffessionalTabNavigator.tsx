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
import ActAdd from '../assets/svgs/ActAddIcon.svg';
import ActProject from '../assets/svgs/ActProjectIcon.svg';
import ActHome from '../assets/svgs/ActHomeIcon.svg';
import ActNotifi from '../assets/svgs/ActNotifiIcon.svg';
import ActSetting from '../assets/svgs/ActSettingIcon.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const ProfessionalTabNavigator = () => {
  const insets = useSafeAreaInsets();
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
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={ProfessionalHomeScreen}
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
        name="Add Work"
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <ActAdd height={22} /> : <AddIcon height={22} />,
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

export default ProfessionalTabNavigator;
