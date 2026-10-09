import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
  markNotificationSeen,
} from '../../redux/slices/notificationSlice';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;
  const token = useAppSelector(state => state.auth.userToken);
  const notifications = useAppSelector(
    state => state.notification.notifications,
  );
  const newNotificationIds = useAppSelector(
    state => state.notification.newNotificationIds,
  );

  const getNotifications = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const res = await ApiManager.getNotifications(userId, token);

        if (res?.data?.status === 'success') {
          console.log('Notifica', res.data.data);
          dispatch(setNotifications(res.data.data || []));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dispatch, token, userId],
  );

  const loadNotifications = useCallback(
    (isRefresh = false) => getNotifications(isRefresh),
    [getNotifications],
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const renderItem = ({ item }: any) => {
    const isNew = newNotificationIds.includes(item?._id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardWrapper}
        onPress={() => {
          if (isNew && item?._id) {
            dispatch(markNotificationSeen(item._id));
          }
        }}
      >
        <View
          style={[
            styles.notificationCard,
            isNew ? styles.newCard : styles.readCard,
          ]}
        >
          <View style={styles.dotWrap}>
            {isNew && <View style={styles.unreadDot} />}
          </View>

          <View style={styles.contentContainer}>
            <Text style={[styles.title, isNew && styles.unreadTitle]}>
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
      <ScreenHeader
        title="Notifications"
        showBack
        onBackPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

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
            onRefresh={() => loadNotifications(true)}
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

  newCard: {
    backgroundColor: '#EAF7EE',
    borderColor: '#CBE8D3',
  },

  dotWrap: {
    width: 8,
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
