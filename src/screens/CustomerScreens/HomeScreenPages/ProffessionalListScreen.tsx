import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FONTSIZE, HEIGHT, WIDTH } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import ScreenHeader from '../../../components/ScreenHeader';
import SearchHeader from '../../../components/SearchHeader';

const professionals = [
  {
    id: '1',
    name: 'Rajendra Singh',
    exp: '5 yrs exp',
    location: 'Mumbai, India',
    type: 'contractor',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Rajendra Singh',
    exp: '5 yrs exp',
    location: 'Mumbai, India',
    type: 'architect',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '3',
    name: 'Rajendra Singh',
    exp: '5 yrs exp',
    location: 'Mumbai, India',
    type: 'interior',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
];

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

  const [search, setSearch] = useState('');

  const filteredList = professionals.filter(item => {
    if (type === 'All' || !type) return true;
    return item.type === type;
  });

  const finalList = filteredList.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

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
          marginTop: -25,
          marginBottom: 15,
        }}
      />

      {/* Suggestion List */}
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
      )}

      {/* Professionals Grid */}
      {(type || search) && (
        <FlatList
          data={finalList}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: WIDTH(3) }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('ProfessionalProfile', { id: item.id })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />

              <View
                style={{
                  backgroundColor: '#F0F0F0',
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 2,
                }}
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.exp}>{item.exp}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>
            </TouchableOpacity>
          )}
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
    borderRadius: 25,
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
    borderRadius: 12,
    padding: 10,
    marginBottom: HEIGHT(2),
    width: '50%',
  },

  image: {
    width: '100%',
    height: HEIGHT(18),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
