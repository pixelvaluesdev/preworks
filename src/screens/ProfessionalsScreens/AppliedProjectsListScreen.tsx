import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../utils/responsive';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import ScreenHeader from '../../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';

const projects = [
  {
    id: '1',
    title: 'Akruti House',
    location: 'Mumbai, Maharashtra, India',
  },
  {
    id: '2',
    title: 'Skyline Apartment',
    location: 'Pune, Maharashtra, India',
  },
  {
    id: '3',
    title: 'Green Villa',
    location: 'Nagpur, Maharashtra, India',
  },
];

const AppliedProjectsScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CommonProjectDetailsScreen', {
          projectId: item.id,
        })
      }
    >
      {/* Left placeholder box (optional instead of avatar) */}
      <View style={styles.projectIcon} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Projects Applied" showBack />

      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: WIDTH(4) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AppliedProjectsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    padding: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  projectIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },

  info: {
    marginLeft: 12,
  },

  name: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 15,
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 12,
    color: '#666',
  },
});
