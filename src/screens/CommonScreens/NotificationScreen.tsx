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
      <>
        <View
          style={[
            styles.notificationCard,
            { backgroundColor: item.unread ? '#F3F3F3' : 'white' },
          ]}
        >
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.timeRow}>
              <Text style={styles.time}>{item.time}</Text>
              {item.unread && <View style={styles.dot} />}
            </View>
          </View>

          <Text style={styles.message}>{item.message}</Text>
        </View>
        <View style={styles.divider} />
      </>
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
        // ItemSeparatorComponent={() => <View style={styles.divider} />}
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
    // paddingVertical: HEIGHT(2),
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
