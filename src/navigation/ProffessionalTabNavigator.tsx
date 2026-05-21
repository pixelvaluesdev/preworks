import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

import ActAdd from '../assets/svgs/ActAddIcon.svg';
import ActProject from '../assets/svgs/ActProjectIcon.svg';
import ActHome from '../assets/svgs/ActHomeIcon.svg';
import ActNotifi from '../assets/svgs/ActNotifiIcon.svg';
import ActSetting from '../assets/svgs/ActSettingIcon.svg';

import Colors from '../constants/colors';
import { triggerHaptic } from '../utils/hapticks';
import { useSelector } from 'react-redux';
import ApiManager from '../apis/ApiManager';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const AnimatedTabButton = (
  props,
  ActiveIcon,
  InactiveIcon,
  label,
  navigation,
  routeName,
  showBadge = false,
) => {
  const { onPress } = props;

  const state = navigation.getState();
  const currentRoute = state.routes[state.index].name;
  const focused = currentRoute === routeName;

  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // BLINK ANIMATION
  const blinkAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    let animation;

    if (showBadge) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();
    } else {
      blinkAnim.setValue(0);
    }

    return () => {
      animation?.stop();
    };
  }, [showBadge]);

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

    triggerHaptic('impactHeavy');
  };

  const IconComponent = focused ? ActiveIcon : InactiveIcon;

  return (
    <Pressable onPress={handlePress} style={styles.tab}>
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [
              { scale: Animated.multiply(scale, activeScale) },
              { translateY: Animated.add(translateY, activeLift) },
            ],
          },
        ]}
      >
        {/* BLINKING RED CIRCLE */}
        {showBadge && (
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: blinkAnim,
                transform: [
                  {
                    scale: blinkAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1, 1.15],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        <IconComponent height={24} />

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

const ProfessionalTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const token = useSelector(state => state.auth.userToken);

  console.log('Professspmdke', userId);

  const [workList, setWorkList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      const res = await ApiManager.getProfile(userId, token);

      console.log('FULL RESPONSE =>', JSON.stringify(res, null, 2));

      if (res?.data?.status === 'success') {
        setWorkList(res?.data?.data?.workList || []);
      }
    } catch (error) {
      console.log('Profile Error:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={ProfessionalHomeScreen}
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
        name="AddWork"
        component={PortfolioScreen}
        options={({ navigation, route }) => ({
          tabBarButton: props =>
            AnimatedTabButton(
              {
                ...props,
                onPress: () => {
                  navigation.navigate('AddWork', {
                    isEdit: false,
                    workId: null,
                    workData: null,
                  });
                },
              },
              ActAdd,
              AddIcon,
              'Add Work',
              navigation,
              route.name,
              workList?.length === 0,
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

export default ProfessionalTabNavigator;

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
  glowRing: {
    position: 'absolute',
    width: 72,
    height: 62,
    borderRadius: 26,
    backgroundColor: Colors.primary + '33',
  },
});
