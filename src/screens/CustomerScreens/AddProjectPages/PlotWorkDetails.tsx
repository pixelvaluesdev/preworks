import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import BorderDropdown from '../../../components/Inputs/BorderDropdown';
import { FONT } from '../../../theme/fonts';
import { HEIGHT } from '../../../utils/responsive';

const PlotWorkDetails = ({ data, handleChange }: any) => {
  return (
    <View style={styles.container}>
      {/* <View style={styles.infoBox}>
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
      </View> */}

      <BorderTextInput
        label="Floor Area"
        keyboardType="number-pad"
        placeholder="Enter floor area"
        value={data.floorArea}
        onChangeText={text => handleChange('floorArea', text)}
        height={HEIGHT(7)}
        rightComponent={<Text style={{ fontSize: 16 }}>sq.ft</Text>}
        maxLength={6}
      />

      <BorderTextInput
        label="Plot Size (Optional)"
        keyboardType="number-pad"
        placeholder="Enter plot size"
        value={data.plotSize}
        onChangeText={text => handleChange('plotSize', text)}
        height={HEIGHT(7)}
        rightComponent={<Text style={{ fontSize: 16 }}>sq.ft</Text>}
        mandotory={false}
        maxLength={6}
      />

      {/* <BorderTextInput
        label={data.selectedType === 'floor' ? 'Floor area' : 'Plot size'}
        keyboardType="number-pad"
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
      /> */}

      <BorderTextInput
        label="No of Floors"
        placeholder="Enter number of floors"
        value={data.floors || ''}
        onChangeText={text => {
          const cleaned = text.replace(/[^0-9]/g, '');
          handleChange('floors', cleaned);
        }}
        height={HEIGHT(7)}
        keyboardType="number-pad"
        maxLength={2}
        leftComponent={
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.POPPINS_REGULAR,
            }}
          >
            Ground +
          </Text>
        }
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
    backgroundColor: '#C8FFC8',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
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
