import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FONTSIZE, WIDTH, HEIGHT } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';
import Colors from '../../constants/colors';

import BackIcon from '../../assets/svgs/Back.svg';
import ScreenHeader from '../../components/ScreenHeader';

const notifications = [
  {
    id: '1',
    title: 'Akruti House',
    message: 'Your profile has been updated successfully.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Akruti House',
    message: 'Reminder: You have an appointment tomorrow at 10:00 AM.',
    time: '3 days ago',
    unread: true,
  },
  {
    id: '3',
    title: 'Akruti House',
    message: 'Your profile has been updated successfully.',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: '4',
    title: 'Akruti House',
    message: 'Reminder: You have an appointment tomorrow at 10:00 AM.',
    time: '3 days ago',
    unread: false,
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.notificationCard}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.timeRow}>
            <Text style={styles.time}>{item.time}</Text>
            {item.unread && <View style={styles.dot} />}
          </View>
        </View>

        <Text style={styles.message}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <ScreenHeader title={'Notifications'} showBack />

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={{ paddingBottom: HEIGHT(5) }}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTH(4),
    paddingVertical: HEIGHT(2),
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  notificationCard: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: WIDTH(4),
    paddingVertical: HEIGHT(1.8),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  message: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    color: 'black',
    marginTop: 4,
    fontWeight: '400',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  time: {
    fontSize: 12,
    color: 'grey',
    marginRight: 6,
    fontWeight: '400',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'green',
  },

  divider: {
    height: 1,
    backgroundColor: '#DCDCDC',
    marginHorizontal: WIDTH(4),
  },
});
