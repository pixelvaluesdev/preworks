//This same screeeen can be used for intrested list as well

import React, { useEffect, useState } from 'react';
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
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';

const QuoteListScreen = ({ route }: any) => {
  const token = useSelector(state => state.auth.userToken);
  const { projectId, isQuote } = route.params;
  const navigation = useNavigation();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProjectEnquiryList(projectId, token);

      if (res?.data?.status === 'success') {
        const fullData = res?.data?.data || [];
        console.log('Full Enquiry List:', fullData);

        console.log('API LIST:', fullData);
        setList(fullData);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const user = item?.userId;

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('CandidateDetail', { candidate: item })
        }
      >
        <Image
          source={
            user?.image?.[0]
              ? { uri: `${IMG_URL}/${user.image[0]}` }
              : require('../../../assets/pngs/Placeholder.png')
          }
          style={styles.avatar}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{user?.firstName}</Text>

          <Text style={styles.exp}>
            <Text style={styles.exp}>
              {user?.experience
                ? `${user.experience} Years`
                : 'Experience not available'}
            </Text>
          </Text>
          <Text style={styles.location}>
            {user?.city ? user.city : 'Location not available'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={isQuote ? 'Quote List' : 'Interested List'}
        showBack
      />

      <FlatList
        data={list}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (loading) return null;

          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isQuote ? 'No quotes yet' : 'No one has shown interest yet'}
              </Text>
            </View>
          );
        }}
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
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
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
    color: '#000000',
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 14,
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
  },

  emptyText: {
    fontSize: 16,
    color: '#777',
    fontFamily: FONT.POPPINS_REGULAR,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
