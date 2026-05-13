import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { HEIGHT, WIDTH } from '../../../utils/responsive';

const ProjectInfo = ({ data, handleChange }: any) => {
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const cacheRef = useRef({});

  const timeoutRef = useRef(null);

  const fetchCities = text => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (text.length < 3) {
        setCitySuggestions([]);
        setShowDropdown(false);
        return;
      }

      //  CACHE CHECK
      if (cacheRef.current[text]) {
        setCitySuggestions(cacheRef.current[text]);
        setShowDropdown(true);
        return;
      }

      try {
        const res = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${text}&countryIds=IN&limit=10`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': 'YOUR_KEY',
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
            },
          },
        );

        const data = await res.json();

        if (data.message === 'Too many requests') {
          console.log('Rate limit hit');
          return;
        }

        cacheRef.current[text] = data?.data || [];

        setCitySuggestions(data?.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.log(err);
      }
    }, 800);
  };

  return (
    <View style={{ gap: 6, zIndex: 1 }}>
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
          onChangeText={text => {
            handleChange('city', text);
            fetchCities(text);
          }}
          height={HEIGHT(7)}
        />

        {showDropdown && citySuggestions.length > 0 && (
          <View style={styles.dropdown}>
            {citySuggestions.map((item, index) => (
              <Text
                key={index}
                style={styles.item}
                onPress={() => {
                  handleChange('city', item.city);
                  setShowDropdown(false);
                }}
              >
                {item.city}
              </Text>
            ))}
          </View>
        )}
      </View>
      <BorderTextInput
        label="PIN Code"
        placeholder="Enter the postal code"
        value={data.pinCode}
        onChangeText={text => handleChange('pinCode', text)}
        height={HEIGHT(7)}
        keyboardType="number-pad"
      />
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
    elevation: 5, // 🔥 IMPORTANT for Android
    maxHeight: 150,
  },

  item: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});
