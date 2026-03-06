import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/building.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          Please choose one of the options below to register.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Professional</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },

  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
