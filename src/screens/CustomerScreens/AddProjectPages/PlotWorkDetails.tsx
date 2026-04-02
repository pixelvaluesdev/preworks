import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import BorderDropdown from '../../../components/Inputs/BorderDropdown';
import { FONT } from '../../../theme/fonts';
import { HEIGHT } from '../../../utils/responsive';

const PlotWorkDetails = ({ data, handleChange }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <View style={styles.row}>
          <Text style={styles.infoText}>For New Construction Select </Text>
          <TouchableOpacity>
            <Text style={[styles.infoText, styles.linkText]}>Plot Size.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.infoText}>
            For Renovation and Interior Work Select{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.infoText, styles.linkText]}>Floor Area.</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.toggletext}>Floor area</Text>
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
          <Text style={styles.toggletext}>Plot size</Text>
        </TouchableOpacity>
      </View>

      <BorderTextInput
        label={data.selectedType === 'floor' ? 'Floor area' : 'Plot size'}
        placeholder={`Enter your ${
          data.selectedType === 'floor' ? 'Floor area' : 'Plot size'
        }`}
        value={data.area}
        onChangeText={text => handleChange('area', text)}
        height={HEIGHT(7)}
        rightComponent={
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.POPPINS_REGULAR,
            }}
          >
            sq.ft
          </Text>
        }
      />

      <BorderDropdown
        label="No of Floors"
        value={data.floors}
        options={[
          'Only Ground Floor',
          'Ground + 1 Floor',
          'Ground + 2 Floor',
          'Ground + 3 Floor',
          'Custom',
        ]}
        onSelect={val => {
          handleChange('floors', val);

          if (val !== 'Custom') {
            handleChange('customFloors', '');
          }
        }}
      />
      {data.floors === 'Custom' && (
        <BorderTextInput
          label="Enter Custom Floors"
          placeholder="e.g. 5"
          value={data.customFloors}
          onChangeText={text =>
            handleChange('customFloors', text.replace(/[^0-9]/g, ''))
          }
          height={HEIGHT(7)}
        />
      )}

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
    backgroundColor: '#C8FFC8',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#555',
    fontFamily: FONT.POPPINS_REGULAR,
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
  toggletext: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
