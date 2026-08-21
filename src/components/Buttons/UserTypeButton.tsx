import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { FONT } from '../../theme/fonts';
import { WIDTH } from '../../utils/responsive';

interface Props {
  title: string;
  Icon: any;
  onPress: () => void;
}

const UserTypeButton = ({ title, Icon, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.innerContainer}>
        <View style={styles.iconContainer}>
          <Icon width={45} height={45} />
        </View>

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserTypeButton;

const styles = StyleSheet.create({
  container: {
    width: WIDTH(50),
    backgroundColor: '#fff6e9',
    borderRadius: 12,

    borderWidth: 1.2,
    borderColor: '#ededed',

    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,

    overflow: 'hidden',
  },

  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },

  iconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },

  title: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    color: '#4c4c4c',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
