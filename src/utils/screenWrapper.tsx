import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 0 : 0,
        },
        style,
      ]}
      edges={Platform.OS === 'ios' ? ['top'] : []}
    >
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
