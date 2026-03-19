import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import Colors from '../../../constants/colors';
import Slider from '@react-native-community/slider';
import { FONT } from '../../../theme/fonts';

const ProjectTimeline = ({ data, handleChange }: any) => {
  return (
    <View style={styles.container}>
      {/* START DATE */}
      <TouchableOpacity>
        <BorderTextInput
          label="Plan to start your construction"
          placeholder="Enter your start date"
          value={data.startDate}
          onChangeText={text => handleChange('startDate', text)}
        />
      </TouchableOpacity>

      {/* LAST DATE */}
      <TouchableOpacity>
        <BorderTextInput
          label="Last Date of Receiving Quotation"
          placeholder="Enter your Last Date"
          value={data.lastDate}
          onChangeText={text => handleChange('lastDate', text)}
        />
      </TouchableOpacity>

      {/* DESCRIPTION */}
      <BorderTextInput
        label="Scope of work description"
        placeholder="Write here..."
        value={data.description}
        onChangeText={text => handleChange('description', text)}
        multiline
        height={120}
      />

      {/* PRICE RANGE */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Select Price Range</Text>

        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={data.budget}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor="#ccc"
          thumbTintColor={Colors.primary}
          onValueChange={val => {
            handleChange('budget', val);
          }}
        />

        {/* RANGE LABELS */}
        <View style={styles.rangeRow}>
          <Text style={styles.rangeText}>5 - 10 Lakh</Text>
          <Text style={styles.rangeText}>2 CR+</Text>
        </View>
      </View>
    </View>
  );
};

export default ProjectTimeline;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  sliderContainer: {},

  sliderLabel: {
    fontSize: 16,
    color: '#333',
  },

  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rangeText: {
    color: '#2DBE7F',
    fontSize: 14,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
