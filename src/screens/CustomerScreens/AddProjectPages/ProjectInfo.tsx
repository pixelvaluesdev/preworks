import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState, useMemo } from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import { City } from 'country-state-city';

const ProjectInfo = ({ data, handleChange }: any) => {
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pinSuggestions, setPinSuggestions] = useState([]);
  const [showPinDropdown, setShowPinDropdown] = useState(false);
  const [cityPincodes, setCityPincodes] = useState([]);
  const fetchPincodes = async cityName => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/postoffice/${cityName}`,
      );

      const result = await response.json();

      if (result[0]?.Status === 'Success') {
        const pins = result[0]?.PostOffice || [];

        setCityPincodes(pins);
        setPinSuggestions(pins);

        // ADD THESE LINES
        setShowPinDropdown(true);
        handleChange('pinCode', '');
      } else {
        setCityPincodes([]);
        setPinSuggestions([]);
        setShowPinDropdown(false);
      }
    } catch (error) {
      console.log('PIN API Error:', error);
    }
  };

  const indianCities = useMemo(() => {
    return City.getCitiesOfCountry('IN');
  }, []);

  const handleCitySearch = text => {
    handleChange('city', text);

    if (text.length < 2) {
      setCitySuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filteredCities = indianCities
      .filter(city => city.name.toLowerCase().includes(text.toLowerCase()))
      .slice(0, 10);

    setCitySuggestions(filteredCities);
    setShowDropdown(true);
  };

  const handlePinSearch = text => {
    handleChange('pinCode', text);

    if (text.length === 0) {
      // Show all pincodes again
      setPinSuggestions(cityPincodes);
      setShowPinDropdown(cityPincodes.length > 0);
      return;
    }

    const filteredPins = cityPincodes
      .filter(item => item.Pincode.includes(text))
      .slice(0, 10);

    setPinSuggestions(filteredPins);
    setShowPinDropdown(filteredPins.length > 0);
  };

  console.log('ProjectInfo city value:', data.city);
  return (
    <View style={{ gap: 6, zIndex: 1, paddingBottom: HEIGHT(30) }}>
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
      <View style={{ position: 'relative' }}>
        <BorderTextInput
          label="City"
          placeholder="Enter city name"
          value={data.city}
          onChangeText={handleCitySearch}
          height={HEIGHT(7)}
        />

        {showDropdown && citySuggestions.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {citySuggestions.map((item, index) => (
                <Text
                  key={index}
                  style={styles.item}
                  onPress={() => {
                    console.log('Selected city:', item.name);
                    handleChange('city', item.name);
                    fetchPincodes(item.name);
                    setShowDropdown(false);
                  }}
                >
                  {item.name}
                </Text>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <View style={{ position: 'relative' }}>
        <BorderTextInput
          label="PIN Code"
          placeholder="Enter postal code"
          value={data.pinCode}
          onChangeText={handlePinSearch}
          height={HEIGHT(7)}
          keyboardType="number-pad"
        />

        {showPinDropdown && pinSuggestions.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
              {pinSuggestions.map((item, index) => (
                <Text
                  key={index}
                  style={styles.item}
                  onPress={() => {
                    handleChange('pinCode', `${item.Pincode} - ${item.Name}`);
                    setShowPinDropdown(false);
                  }}
                >
                  {item.Pincode}{' '}
                  <Text style={{ color: '#888' }}>- {item.Name}</Text>
                </Text>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProjectInfo;

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: HEIGHT(8),
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5, //  IMPORTANT for Android
    maxHeight: 150,
  },

  item: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});
