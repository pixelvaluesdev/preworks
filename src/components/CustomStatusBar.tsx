import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const CustomStatusBar = () => {
  return (
    <View>
      <View style={styles.statusBarBackground} />
      <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
    </View>
  );
};

export default CustomStatusBar;

const styles = StyleSheet.create({
  statusBarBackground: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: '#fff',
  },
});
