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
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import ScreenHeader from '../../../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { FONTSIZE, WIDTH, HEIGHT } from '../../../utils/responsive';

const QuoteListScreen = ({ route }: any) => {
  const token = useSelector(state => state.auth.userToken);
  const { projectId, isQuote } = route.params || {};
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
            <View style={styles.noResponseContainer}>
              <Image
                source={require('../../../assets/pngs/EmptyBox.png')}
                style={styles.noResponseImage}
                resizeMode="contain"
              />

              <Text style={styles.noResponseTitle}>
                {isQuote ? 'No Quotes Yet' : 'No Interest Yet'}
              </Text>

              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Your project is live</Text>
              </View>

              <Text style={styles.description}>
                {isQuote
                  ? 'We’ve notified relevant professionals about your requirement.\nQuotes will start appearing soon.'
                  : 'We’ve notified professionals in your area.\nInterested responses will start appearing soon.'}
              </Text>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <View
                    style={[styles.iconCircle, { backgroundColor: '#EEF4FF' }]}
                  >
                    <Text style={styles.icon}>👁</Text>
                  </View>

                  <Text style={styles.infoText}>
                    Your project is visible to relevant professionals
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View
                    style={[styles.iconCircle, { backgroundColor: '#EDF8EF' }]}
                  >
                    <Text style={styles.icon}>🔔</Text>
                  </View>

                  <Text style={styles.infoText}>
                    We’ve notified professionals in your area
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View
                    style={[styles.iconCircle, { backgroundColor: '#FFF4E8' }]}
                  >
                    <Text style={styles.icon}>⏰</Text>
                  </View>

                  <Text style={styles.infoText}>
                    You’ll be notified as soon as someone responds
                  </Text>
                </View>
              </View>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    marginHorizontal: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  info: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#111827',
  },

  exp: {
    fontSize: 13,
    fontFamily: FONT.POPPINS_REGULAR,
    color: '#6B7280',
    marginTop: 2,
  },

  location: {
    fontSize: 13,
    fontFamily: FONT.POPPINS_REGULAR,
    color: '#6B7280',
    marginTop: 2,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noResponseContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  noResponseImage: {
    width: 380,
    height: 240,
  },

  noResponseTitle: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#081A4B',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF8EF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginTop: 12,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },

  liveText: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  description: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 26,
    color: '#5E6475',
    fontFamily: FONT.POPPINS_REGULAR,
    paddingHorizontal: 10,
  },

  infoSection: {
    width: '100%',
    marginTop: 30,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 16,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    color: '#4B5563',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 62,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#777',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  emptyImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
});
