import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import { WIDTH, HEIGHT } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import ApiManager from '../../apis/ApiManager';
import ScreenWrapper from '../../utils/screenWrapper';
import {
  setNotifications,
  markAllNotificationsRead,
} from '../../redux/slices/notificationSlice';

const NotificationScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;
  const token = useAppSelector(state => state.auth.userToken);
  const notifications = useAppSelector(
    state => state.notification.notifications,
  );

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
    const isRead = Boolean(item?.isRead);

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.cardWrapper}>
        <View
          style={[
            styles.notificationCard,
            !isRead && styles.unreadCard,
            isRead && styles.readCard,
          ]}
        >
          <View style={styles.dotWrap}>
            {!isRead && <View style={styles.unreadDot} />}
          </View>

          <View style={styles.contentContainer}>
            <Text style={[styles.title, !isRead && styles.unreadTitle]}>
              {item?.title || 'Notification'}
            </Text>

            <Text style={styles.message}>{item?.message || ''}</Text>

            <Text style={styles.time}>
              {item?.createdAt ? moment(item.createdAt).fromNow() : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScreenHeader title={'Notifications'} showBack />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <View style={styles.listWrap}>
          <FlatList
            data={notifications}
            keyExtractor={(item: any) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={() => getNotifications(true)}
            showsVerticalScrollIndicator={false}
          />
        </View>
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listWrap: {
    flex: 1,
    paddingTop: HEIGHT(1.5),
  },

  listContent: {
    paddingHorizontal: WIDTH(4),
    paddingBottom: HEIGHT(5),
  },

  cardWrapper: {
    marginBottom: HEIGHT(1.5),
  },

  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: HEIGHT(1.7),
    paddingHorizontal: WIDTH(3.2),
    borderRadius: 14,
    borderWidth: 1,
  },

  readCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
  },

  unreadCard: {
    backgroundColor: '#F8FBF9',
    borderColor: '#DDEEE2',
  },

  dotWrap: {
    width: 14,
    alignItems: 'center',
    paddingTop: HEIGHT(0.4),
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  contentContainer: {
    flex: 1,
    paddingLeft: WIDTH(1.5),
  },

  title: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontFamily: FONT.POPPINS_MEDIUM,
    marginBottom: HEIGHT(0.5),
  },

  unreadTitle: {
    color: '#1E2128',
  },

  message: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.textSecondary,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  time: {
    marginTop: HEIGHT(0.7),
    fontSize: 11,
    color: '#8A8F98',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(12),
  },

  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: FONT.POPPINS_MEDIUM,
    textAlign: 'center',
  },
});
