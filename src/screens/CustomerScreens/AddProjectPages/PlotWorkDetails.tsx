import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import BorderDropdown from '../../../components/Inputs/BorderDropdown';

const PlotWorkDetails = ({ data, handleChange }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          For New Construction Select Plot Size.{'\n'}
          For Renovation and Interior Work Select Floor Area.
        </Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => handleChange('selectedType', 'floor')}
          style={styles.radioRow}
        >
          <View
            style={[
              styles.radio,
              data.selectedType === 'floor' && styles.radioActive,
            ]}
          />
          <Text>Floor area</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleChange('selectedType', 'plot')}
          style={styles.radioRow}
        >
          <View
            style={[
              styles.radio,
              data.selectedType === 'plot' && styles.radioActive,
            ]}
          />
          <Text>Plot size</Text>
        </TouchableOpacity>
      </View>

      <BorderTextInput
        label={data.selectedType === 'floor' ? 'Floor area' : 'Plot size'}
        placeholder={`Enter your ${data.selectedType}`}
        value={data.area}
        onChangeText={text => handleChange('area', text)}
      />

      <BorderDropdown
        label="No of Floors"
        value={data.floors}
        options={[
          'Only Ground Floor',
          'Ground + 1 Floor',
          'Ground + 2 Floor',
          'Ground + 3 Floor',
        ]}
        onSelect={val => handleChange('floors', val)}
      />

      <BorderDropdown
        label="Type Of Quote"
        value={data.quoteType}
        options={['Labour Only', 'Labour + Material']}
        onSelect={val => handleChange('quoteType', val)}
      />
    </View>
  );
};

export default PlotWorkDetails;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  infoBox: {
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 10,
  },

  infoText: {
    fontSize: 13,
    color: '#555',
  },

  toggleRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 10,
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#999',
  },

  radioActive: {
    backgroundColor: '#2DBE7F',
    borderColor: '#2DBE7F',
  },
});
