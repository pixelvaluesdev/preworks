import { Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({ focused, ActiveIcon, InactiveIcon }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.4 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const IconComponent = focused ? ActiveIcon : InactiveIcon;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <IconComponent height={22} />
    </Animated.View>
  );
};

const CustomerTabNavigator = () => {
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
        component={CustomerHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon
              focused={focused}
              ActiveIcon={ActHome}
              InactiveIcon={HomeIcon}
            />
          ),
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
