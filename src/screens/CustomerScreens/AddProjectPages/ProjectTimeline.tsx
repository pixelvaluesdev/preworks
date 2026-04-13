import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import Colors from '../../../constants/colors';
import Slider from '@react-native-community/slider';
import { FONT } from '../../../theme/fonts';
import { HEIGHT } from '../../../utils/responsive';
import CalenderIcon from '../../../assets/svgs/CalenderIcon.svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ProjectTimeline = ({ data, handleChange }: any) => {
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const handleConfirm = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];

    if (selectedField === 'startDate') {
      handleChange('startDate', formatted);
    } else if (selectedField === 'lastDate') {
      handleChange('lastDate', formatted);
    }

    setSelectedField(null);
    hideDatePicker();
  };

  const getBudgetLabel = val => {
    if (val <= 20) return '5 - 10 Lakh';
    if (val <= 40) return '10 - 25 Lakh';
    if (val <= 60) return '25 - 50 Lakh';
    if (val <= 75) return '50 Lakh - 1 Cr';
    if (val <= 90) return '1 Cr - 2 Cr';
    return '2 Cr+';
  };
  const getThumbPosition = () => {
    const min = 500000;
    const max = 20000000;

    const ratio = (data.budget - min) / (max - min);
    const position = ratio * sliderWidth;

    const labelWidth = 80;

    return Math.min(
      Math.max(position - labelWidth / 2, 0),
      sliderWidth - labelWidth,
    );
  };

  const formatBudgetRange = val => {
    const step = 500000;
    const max = 20000000;

    if (val >= max) {
      return '2 Cr+';
    }

    const start = val;
    const end = Math.min(val + step, max);

    const toLakh = v => Math.round(v / 100000);

    // If >= 1 Cr → show in Cr
    if (start >= 10000000) {
      const startCr = start / 10000000;
      const endCr = end / 10000000;

      return `${startCr.toFixed(2)} - ${endCr.toFixed(2)} Cr`;
    }

    return `${toLakh(start)} - ${toLakh(end)} Lakh`;
  };

  return (
    <View style={styles.container}>
      {/* START DATE */}

      <BorderTextInput
        label="Plan to start your construction"
        placeholder="Enter your start date"
        value={data.startDate}
        onChangeText={() => {}}
        editable={false}
        height={HEIGHT(7)}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              setSelectedField('startDate');
              showDatePicker();
            }}
          >
            <CalenderIcon />
          </TouchableOpacity>
        }
      />

      {/* LAST DATE */}

      <BorderTextInput
        label="Last Date of Receiving Quotation"
        placeholder="Enter your Last Date"
        editable={false}
        value={data.lastDate}
        onChangeText={() => {}}
        height={HEIGHT(7)}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              setSelectedField('lastDate');
              showDatePicker();
            }}
          >
            <CalenderIcon />
          </TouchableOpacity>
        }
      />

      {/* DESCRIPTION */}
      <BorderTextInput
        label="Scope of work description"
        placeholder="Write here..."
        value={data.description}
        onChangeText={text => handleChange('description', text)}
        multiline
        height={HEIGHT(10)}
      />

      {/* PRICE RANGE */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Select Price Range <Text style={styles.asterisk}> *</Text>
        </Text>

        <View style={{ position: 'relative', width: '100%' }}>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={500000} // 5 Lakh
            maximumValue={20000000} // 2 Crore
            step={500000} // 5 Lakh step
            value={data.budget}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#ccc"
            thumbTintColor={Colors.primary}
            onValueChange={val => {
              handleChange('budget', val);
            }}
            onLayout={e => {
              setSliderWidth(e.nativeEvent.layout.width);
            }}
          />

          <View
            style={[
              styles.floatingLabel,
              {
                left: getThumbPosition(), // adjust center
              },
            ]}
          >
            <Text style={styles.selectedValue}>
              {formatBudgetRange(data.budget)}
            </Text>
          </View>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
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
  floatingLabel: {
    position: 'absolute',
    top: 35,
  },

  selectedValue: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
