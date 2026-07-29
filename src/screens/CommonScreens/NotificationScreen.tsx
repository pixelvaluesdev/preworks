import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { FONTSIZE, WIDTH, HEIGHT } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';

import BackIcon from '../../assets/svgs/Back.svg';
import ScreenHeader from '../../components/ScreenHeader';
import { useDispatch, useSelector } from 'react-redux';
import ApiManager from '../../apis/ApiManager';
import ScreenWrapper from '../../utils/screenWrapper';
import {
  setNotifications,
  markAllNotificationsRead,
} from '../../redux/slices/notificationSlice';

const NotificationScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const token = useSelector(state => state.auth.userToken);
  const notifications = useSelector(state => state.notification.notifications);

  console.log('notifcations data', notifications);

  const getNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await ApiManager.getNotifications(userId, token);

      if (res?.data?.status === 'success') {
        dispatch(setNotifications(res.data.data || []));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const readAllNotifications = async () => {
    try {
      const res = await ApiManager.readNotifications(userId, token);

      if (res?.data?.status === 'success') {
        dispatch(markAllNotificationsRead());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadNotifications = async () => {
    await getNotifications();
    await readAllNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View
          style={[
            styles.notificationCard,
            {
              backgroundColor: item?.isRead ? '#FFFFFF' : '#F3F3F3',
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={styles.title}>{item?.title || 'Notification'}</Text>

            <View style={styles.timeRow}>
              <Text style={styles.time}>
                {item?.createdAt ? moment(item.createdAt).fromNow() : ''}
              </Text>

              {!item?.isRead && <View style={styles.dot} />}
            </View>
          </View>

          <Text style={styles.message}>{item?.message || ''}</Text>
        </View>

        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScreenHeader title={'Notifications'} showBack />

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        // EMPTY STATE
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: HEIGHT(5) }}
          refreshing={refreshing}
          onRefresh={() => getNotifications(true)}
        />
      )}
    </ScreenWrapper>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: 'grey',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTH(4),
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  notificationCard: {
    paddingVertical: HEIGHT(1.8),
    marginHorizontal: WIDTH(4),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  title: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  message: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    color: 'black',
    marginTop: 4,
    fontWeight: '400',
    marginHorizontal: 10,
  },

  timeRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  time: {
    fontSize: 12,
    color: 'grey',
    marginRight: 6,
    fontWeight: '400',
    marginBottom: 6,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22D73D',
    alignSelf: 'flex-end',
    marginRight: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#DCDCDC',
    marginHorizontal: WIDTH(4),
  },
});
