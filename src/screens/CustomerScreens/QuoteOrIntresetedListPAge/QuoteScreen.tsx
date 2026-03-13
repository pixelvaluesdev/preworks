//This same screeeen can be used for intrested list as well

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import ScreenHeader from '../../../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';

const candidates = [
  {
    id: '1',
    name: 'Rajendra singh',
    exp: '6 Years of experience',
    location: 'Mumbai Maharashtra ,India',
    // image: require('../../../assets/pngs/profile.png'),
  },
  {
    id: '2',
    name: 'Rajendra singh',
    exp: '6 Years of experience',
    location: 'Mumbai Maharashtra ,India',
    // image: require('../../../assets/pngs/profile.png'),
  },
  {
    id: '3',
    name: 'Rajendra singh',
    exp: '6 Years of experience',
    location: 'Mumbai Maharashtra ,India',
    // image: require('../../../assets/pngs/profile.png'),
  },
];

const QuoteListScreen = ({ route }: any) => {
  const navigation = useNavigation();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CandidateDetail', { candidate: item })
      }
    >
      <Image source={item.image} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.exp}>{item.exp}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Quote List" showBack />

      <FlatList
        data={candidates}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: WIDTH(4) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default QuoteListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    padding: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  info: {
    marginLeft: 12,
  },

  name: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 15,
  },

  exp: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 12,
    color: '#666',
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 12,
    color: '#666',
  },
});
