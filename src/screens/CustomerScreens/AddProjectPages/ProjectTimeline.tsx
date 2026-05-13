import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import Colors from '../../../constants/colors';
import Slider from '@react-native-community/slider';
import { FONT } from '../../../theme/fonts';
import { HEIGHT } from '../../../utils/responsive';
import CalenderIcon from '../../../assets/svgs/CalenderIcon.svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ranges = [
  { max: 0, label: '0' },
  { max: 10, label: '0 - 5 Lakh' },
  { max: 20, label: '5 - 10 Lakh' },
  { max: 30, label: '10 - 15 Lakh' },
  { max: 40, label: '15 - 20 Lakh' },
  { max: 50, label: '20 - 30 Lakh' },
  { max: 60, label: '30 - 50 Lakh' },
  { max: 70, label: '50 - 75 Lakh' },
  { max: 80, label: '75L - 1 CR' },
  { max: 90, label: '1 - 2 CR' },
  { max: 100, label: '2 CR+' },
];

const ProjectTimeline = ({ data, handleChange }: any) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

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

  // 🔥 Get label from percentage
  const getLabelFromPercentage = (value: number) => {
    const range = ranges.find(r => value <= r.max);
    return range ? range.label : '';
  };

  // 🔥 Tooltip position
  const getThumbPosition = () => {
    const ratio = data.budget / 100;
    const position = ratio * sliderWidth;

    const labelWidth = 90;

    return Math.min(
      Math.max(position - labelWidth / 2, 0),
      sliderWidth - labelWidth,
    );
  };
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');

    return `${day}-${month}-${year}`;
  };

  return (
    <View style={styles.container}>
      {/* LAST DATE */}
      <BorderTextInput
        label="Last Date of Receiving Quotation"
        placeholder="Enter your Last Date"
        editable={false}
        value={formatDisplayDate(data.lastDate)}
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

      {/* START DATE */}
      <BorderTextInput
        label="Plan to start your construction"
        placeholder="Enter your start date"
        value={formatDisplayDate(data.startDate)}
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

      {/* DESCRIPTION */}
      <BorderTextInput
        label="Scope of work description"
        placeholder="Write here..."
        value={data.description}
        onChangeText={text => handleChange('description', text)}
        multiline
        height={HEIGHT(10)}
        maxLength={2500}
      />
      <Text style={styles.charCount}>{data.description?.length || 0}/2500</Text>

      {/* PRICE RANGE */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Select Price Range <Text style={styles.asterisk}> *</Text>
        </Text>

        <View
          style={{ position: 'relative', width: '100%' }}
          onLayout={e => {
            setSliderWidth(e.nativeEvent.layout.width);
          }}
        >
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={10}
            value={data.budget}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#ccc"
            thumbTintColor={Colors.primary}
            onValueChange={val => {
              handleChange('budget', val); // store percentage
            }}
          />

          {/* TOOLTIP */}
          <View style={[styles.tooltipContainer, { left: getThumbPosition() }]}>
            <View style={styles.tooltipBox}>
              <Text style={styles.tooltipText}>
                {getLabelFromPercentage(data.budget)}
              </Text>
            </View>

            <View style={styles.tooltipArrow} />
          </View>
        </View>
      </View>

      {/* DATE PICKER */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={
          selectedField === 'startDate' && data.lastDate
            ? new Date(data.lastDate)
            : new Date()
        }
      />
    </View>
  );
};

export default ProjectTimeline;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  sliderContainer: {
    gap: 30,
  },

  sliderLabel: {
    fontSize: 16,
    color: '#333',
  },

  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#777',
    marginTop: -30,
    marginRight: 10,
  },

  tooltipContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
  },

  tooltipBox: {
    backgroundColor: '#B4F2BB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },

  tooltipText: {
    color: '#333',
    fontSize: 12,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#B4F2BB',
    marginTop: -1,
  },
});
