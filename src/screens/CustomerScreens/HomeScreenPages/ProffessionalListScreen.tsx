import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FONTSIZE, HEIGHT, WIDTH } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import SearchHeader from '../../../components/SearchHeader';
import Location from '../../../assets/svgs/LocationIcon.svg';
import SuitCaseIcon from '../../../assets/svgs/suitcaseIcon.svg';
import { IMG_URL } from '../../../apis/ApiManager';
import ApiManager from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const suggestions = [
  'Residential',
  'Commercial',
  'Contractor near me',
  'Architect near me',
  'Design',
];

const ProfessionalListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const type = route?.params?.type;
  // const professionals = route?.params?.professionals || [];

  const [search, setSearch] = useState('');

  const token = useSelector((state: any) => state.auth.userToken);

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.search) {
      setSearch(route.params.search);
    }
  }, [route?.params?.search]);

  const finalList = professionals.filter(item => {
    const searchText = search.toLowerCase();

    const fullName = `${item.firstName || ''} ${
      item.lastName || ''
    }`.toLowerCase();
    const experience = (item.experience || '').toLowerCase();
    const location = (item.city || item.location || '').toLowerCase();

    return (
      fullName.includes(searchText) ||
      experience.includes(searchText) ||
      location.includes(searchText)
    );
  });

  useEffect(() => {
    fetchProfessionals();
  }, [type]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);

      const apiType = type ? type : 'all'; // fallback

      const response = await ApiManager.getProfessionals(apiType, token);

      if (response?.data?.status === 'success') {
        setProfessionals(response.data.data);
        console.log('Fetched professionals:', response.data.data);
      }
    } catch (error) {
      console.log('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={search ? 'Search' : 'Professionals List'} showBack />

      <SearchHeader
        value={search}
        onChangeText={setSearch}
        placeholder="Search Professionals"
        showProfile={false}
        style={{
          borderWidth: 0.75,
          borderColor: 'grey',
          marginTop: 10,
          marginBottom: 15,
        }}
      />

      {/* Suggestion List
      {!search && !type && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionRow}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )} */}

      {/* Professionals Grid */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: HEIGHT(5), alignSelf: 'center' }}
        />
      ) : (
        <FlatList
          data={finalList}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: WIDTH(3) }}
          renderItem={({ item }) => {
            const hasValidImage = item.image && typeof item.image === 'string';

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ProfessionalProfile', {
                    userId: item._id,
                  })
                }
              >
                <Image
                  source={
                    hasValidImage
                      ? { uri: `${IMG_URL}${item.image}` }
                      : require('../../../assets/pngs/Placeholder.png')
                  }
                  style={styles.image}
                />

                <View
                  style={{
                    backgroundColor: '#F0F0F0',
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                  </Text>

                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <SuitCaseIcon width={16} height={16} />
                    <Text style={styles.exp}>{item.experience}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Location width={16} height={16} />
                    <Text style={styles.location}>{item.city}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default ProfessionalListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginLeft: WIDTH(3),
  },

  searchBox: {
    marginHorizontal: WIDTH(4),
    marginVertical: HEIGHT(1),
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    paddingHorizontal: 15,
  },

  searchInput: {
    height: 45,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  suggestionRow: {
    paddingVertical: HEIGHT(1.5),
    paddingHorizontal: WIDTH(4),
  },

  suggestionText: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 8,
    marginBottom: HEIGHT(0.2),
    width: '50%',
  },

  image: {
    width: '100%',
    height: HEIGHT(18),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  name: {
    marginTop: 6,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 15,
  },

  exp: {
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  location: {
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },
});
