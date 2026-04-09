import React, { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomerHomeScreen from '../screens/CustomerScreens/CustomerHomeScreen';
import NotificationScreen from '../screens/CommonScreens/NotificationScreen';
import SettingsScreen from '../screens/CommonScreens/SettingsScreen';
import ProjectsScreen from '../screens/CommonScreens/ProjectTabPages/ProjectsScreen';

import HomeIcon from '../assets/svgs/Home.svg';
import NotificationIcon from '../assets/svgs/Notification.svg';
import SettingsIcon from '../assets/svgs/Settings.svg';
import ProjectIcon from '../assets/svgs/Project.svg';

import ActProject from '../assets/svgs/ActProjectIcon.svg';
import ActHome from '../assets/svgs/ActHomeIcon.svg';
import ActNotifi from '../assets/svgs/ActNotifiIcon.svg';
import ActSetting from '../assets/svgs/ActSettingIcon.svg';

import Colors from '../constants/colors';

const Tab = createBottomTabNavigator();

// CUSTOM TAB BUTTON
const AnimatedTabButton = (
  props,
  ActiveIcon,
  InactiveIcon,
  label,
  navigation,
  routeName,
) => {
  const { onPress } = props;

  // ACTIVE TAB CHECK
  const state = navigation.getState();
  const currentRoute = state.routes[state.index].name;
  const focused = currentRoute === routeName;

  // 🎯 Animations
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // ACTIVE EFFECT
  const activeScale = focused ? 1.15 : 1;
  const activeLift = focused ? -4 : 0;

  const handlePress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 3,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onPress && onPress();
  };

  const IconComponent = focused ? ActiveIcon : InactiveIcon;

  return (
    <Pressable onPress={handlePress} style={styles.tab}>
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [
              { scale: Animated.multiply(scale, activeScale) }, // 🔥 size effect
              { translateY: Animated.add(translateY, activeLift) }, // 🔥 lift effect
            ],
          },
        ]}
      >
        {/* ICON */}
        <IconComponent height={24} />

        {/* TEXT */}
        <Text
          style={[
            styles.label,
            {
              color: focused ? Colors.primary : '#999',
              fontWeight: focused ? '700' : '400',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// MAIN NAVIGATOR
const CustomerTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={({ navigation, route }) => ({
          tabBarButton: props =>
            AnimatedTabButton(
              props,
              ActHome,
              HomeIcon,
              'Home',
              navigation,
              route.name,
            ),
        })}
      />

      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={({ navigation, route }) => ({
          tabBarButton: props =>
            AnimatedTabButton(
              props,
              ActProject,
              ProjectIcon,
              'Projects',
              navigation,
              route.name,
            ),
        })}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={({ navigation, route }) => ({
          tabBarButton: props =>
            AnimatedTabButton(
              props,
              ActNotifi,
              NotificationIcon,
              'Notifications',
              navigation,
              route.name,
            ),
        })}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => ({
          tabBarButton: props =>
            AnimatedTabButton(
              props,
              ActSetting,
              SettingsIcon,
              'Settings',
              navigation,
              route.name,
            ),
        })}
      />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;

// 🎨 STYLES
const styles = StyleSheet.create({
  tab: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 4,
  },
});
