import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import { HEIGHT } from '../../../utils/responsive';

const CITY_API = 'https://countries.dev/cities';

const ProjectInfo = ({ data, handleChange }: any) => {
  const safeData = data || {};

  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [pinSuggestions, setPinSuggestions] = useState<any[]>([]);
  const [showPinDropdown, setShowPinDropdown] = useState(false);

  const [cityPincodes, setCityPincodes] = useState<any[]>([]);

  const cityRequestId = useRef(0);
  const pinRequestId = useRef(0);

  const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      cityRequestId.current += 1;
      pinRequestId.current += 1;

      if (cityDebounceRef.current) {
        clearTimeout(cityDebounceRef.current);
      }
    };
  }, []);

  /**
   * CITY SEARCH
   *
   * Uses countries.dev instead of country-state-city.
   *
   * Example:
   * https://countries.dev/cities?q=mu&country=IN&limit=10
   *
   * No API key required.
   */
  const searchCities = (query: string) => {
    const requestId = ++cityRequestId.current;

    if (cityDebounceRef.current) {
      clearTimeout(cityDebounceRef.current);
    }

    cityDebounceRef.current = setTimeout(async () => {
      try {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
          setCitySuggestions([]);
          setShowDropdown(false);
          return;
        }

        const url =
          `${CITY_API}?q=${encodeURIComponent(trimmedQuery)}` +
          `&country=IN&limit=10`;

        console.log('CITY API:', url);

        const response = await fetch(url);

        if (requestId !== cityRequestId.current) {
          return;
        }

        if (!response.ok) {
          console.log('City API failed:', response.status, response.statusText);

          setCitySuggestions([]);
          setShowDropdown(false);

          return;
        }

        const result = await response.json();

        if (requestId !== cityRequestId.current) {
          return;
        }

        const cities = Array.isArray(result) ? result : [];

        console.log('CITY API RESULT COUNT:', cities.length);

        setCitySuggestions(cities);
        setShowDropdown(cities.length > 0);
      } catch (error) {
        if (requestId !== cityRequestId.current) {
          return;
        }

        console.log('CITY API ERROR:', error);

        setCitySuggestions([]);
        setShowDropdown(false);
      }
    }, 350);
  };

  /**
   * CITY INPUT
   */
  const handleCitySearch = (text: string) => {
    const safeText = String(text ?? '');

    handleChange('city', safeText);

    // Cancel old PIN request because city has changed.
    pinRequestId.current += 1;

    const query = safeText.trim();

    if (query.length < 2) {
      if (cityDebounceRef.current) {
        clearTimeout(cityDebounceRef.current);
      }

      setCitySuggestions([]);
      setShowDropdown(false);

      return;
    }

    searchCities(query);
  };

  /**
   * FETCH PINCODES FOR SELECTED CITY
   */
  const fetchPincodes = async (cityName: string) => {
    const requestId = ++pinRequestId.current;

    try {
      const safeCityName = String(cityName ?? '').trim();

      if (!safeCityName) {
        setCityPincodes([]);
        setPinSuggestions([]);
        setShowPinDropdown(false);
        return;
      }

      const url =
        `https://api.postalpincode.in/postoffice/` +
        `${encodeURIComponent(safeCityName)}`;

      console.log('PIN API:', url);

      const response = await fetch(url);

      const result = await response.json();

      if (requestId !== pinRequestId.current) {
        return;
      }

      if (result?.[0]?.Status === 'Success') {
        const pins = result?.[0]?.PostOffice || [];

        const safePins = Array.isArray(pins) ? pins : [];

        console.log('PIN RESULT COUNT:', safePins.length);

        setCityPincodes(safePins);
        setPinSuggestions(safePins);

        setShowPinDropdown(safePins.length > 0);

        handleChange('pinCode', '');
      } else {
        setCityPincodes([]);
        setPinSuggestions([]);
        setShowPinDropdown(false);
      }
    } catch (error) {
      if (requestId !== pinRequestId.current) {
        return;
      }

      console.log('PIN API Error:', error);

      setCityPincodes([]);
      setPinSuggestions([]);
      setShowPinDropdown(false);
    }
  };

  /**
   * PIN SEARCH
   */
  const handlePinSearch = (text: string) => {
    const safeText = String(text ?? '');

    handleChange('pinCode', safeText);

    if (safeText.length === 0) {
      setPinSuggestions(cityPincodes);

      setShowPinDropdown(
        Array.isArray(cityPincodes) && cityPincodes.length > 0,
      );

      return;
    }

    const search = safeText.toLowerCase();

    const filteredPins = (Array.isArray(cityPincodes) ? cityPincodes : [])
      .filter(item => {
        return (
          String(item?.Pincode ?? '').includes(search) ||
          String(item?.Name ?? '')
            .toLowerCase()
            .includes(search)
        );
      })
      .slice(0, 10);

    setPinSuggestions(filteredPins);
    setShowPinDropdown(filteredPins.length > 0);
  };

  console.log('ProjectInfo city value:', safeData.city);

  return (
    <View
      style={{
        gap: 6,
        zIndex: 1,
        paddingBottom: HEIGHT(30),
      }}
    >
      {/* PROJECT NAME */}
      <BorderTextInput
        label="Project Name"
        placeholder="Enter your project name"
        value={safeData.projectName}
        onChangeText={text => handleChange('projectName', text)}
        height={HEIGHT(7)}
      />

      {/* FULL ADDRESS */}
      <BorderTextInput
        label="Full Plot Address"
        placeholder="Enter full address of plot"
        value={safeData.address}
        onChangeText={text => handleChange('address', text)}
        height={HEIGHT(7)}
      />

      {/* CITY */}
      <View style={{ position: 'relative' }}>
        <BorderTextInput
          label="City"
          placeholder="Enter city name"
          value={safeData.city}
          onChangeText={handleCitySearch}
          height={HEIGHT(7)}
        />

        {showDropdown &&
          Array.isArray(citySuggestions) &&
          citySuggestions.length > 0 && (
            <View style={styles.dropdown}>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {citySuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={`${item?.name ?? 'city'}-${index}`}
                    activeOpacity={0.7}
                    onPress={() => {
                      const selectedCity = String(item?.name ?? '');

                      console.log('Selected city:', selectedCity);

                      handleChange('city', selectedCity);

                      setShowDropdown(false);

                      Keyboard.dismiss();

                      // Fetch PIN/locality data after city selection.
                      fetchPincodes(selectedCity);
                    }}
                  >
                    <Text style={styles.item}>{item?.name ?? ''}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
      </View>

      {/* PIN CODE / LOCALITY */}
      <View style={{ position: 'relative' }}>
        <BorderTextInput
          label="PIN Code/Locality"
          placeholder="Enter postal code"
          value={safeData.pinCode}
          onChangeText={handlePinSearch}
          height={HEIGHT(7)}
        />

        {showPinDropdown &&
          Array.isArray(pinSuggestions) &&
          pinSuggestions.length > 0 && (
            <View style={styles.dropdown}>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {pinSuggestions.map((item, index) => (
                  <Text
                    key={`${item?.Pincode ?? 'pin'}-${
                      item?.Name ?? 'locality'
                    }-${index}`}
                    style={styles.item}
                    onPress={() => {
                      const selectedValue = `${item?.Pincode ?? ''} - ${
                        item?.Name ?? ''
                      }`;

                      handleChange('pinCode', selectedValue);

                      setShowPinDropdown(false);

                      Keyboard.dismiss();
                    }}
                  >
                    {item?.Pincode ?? ''}{' '}
                    <Text style={{ color: '#888' }}>- {item?.Name ?? ''}</Text>
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
    elevation: 5,
    maxHeight: 150,
  },

  item: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});
