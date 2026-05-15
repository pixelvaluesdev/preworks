import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={['top']}>
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
