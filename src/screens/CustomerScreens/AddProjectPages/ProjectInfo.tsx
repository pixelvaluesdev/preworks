import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { HEIGHT, WIDTH } from '../../../utils/responsive';

const ProjectInfo = ({ data, handleChange }: any) => {
  return (
    <View style={{ gap: 6 }}>
      <BorderTextInput
        label="Project Name"
        placeholder="Enter your project name"
        value={data.projectName}
        onChangeText={text => handleChange('projectName', text)}
        height={HEIGHT(7)}
      />
      <BorderTextInput
        label="Full Plot Address"
        placeholder="Enter full address of plot"
        value={data.address}
        onChangeText={text => handleChange('address', text)}
        height={HEIGHT(7)}
      />
      <BorderTextInput
        label="City"
        placeholder="Enter city name"
        value={data.city}
        onChangeText={text => handleChange('city', text)}
        height={HEIGHT(7)}
      />
      <BorderTextInput
        label="PIN Code"
        placeholder="Enter the postal code"
        value={data.pinCode}
        onChangeText={text => handleChange('pinCode', text)}
        height={HEIGHT(7)}
      />
    </View>
  );
};

export default ProjectInfo;

const styles = StyleSheet.create({});
