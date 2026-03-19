import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

interface Props {
  currentStep: number; // starts from 0
  totalSteps: number;
}

const CustomStepIndicator = ({ currentStep, totalSteps }: Props) => {
  return (
    <View style={styles.container}>
      {/* BACK LINE */}
      <View style={styles.lineBackground} />

      {/* ACTIVE LINE */}
      <View
        style={[
          styles.lineActive,
          {
            width: `${(currentStep / (totalSteps - 1)) * 100}%`,
          },
        ]}
      />

      {/* STEPS */}
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index <= currentStep;

        return (
          <View
            key={index}
            style={[
              styles.step,
              {
                left: `${(index / (totalSteps - 1)) * 100}%`,
                transform: [{ translateX: -9 }],
              },
              isActive && styles.activeStep,
            ]}
          />
        );
      })}
    </View>
  );
};

export default CustomStepIndicator;

const styles = StyleSheet.create({
  container: {
    height: 30,
    justifyContent: 'center',
  },

  lineBackground: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 2,
  },

  lineActive: {
    position: 'absolute',
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  step: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E0E0E0',
  },

  activeStep: {
    backgroundColor: Colors.primary,
  },
});
