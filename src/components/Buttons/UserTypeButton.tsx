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
      <View style={styles.iconContainer}></View>
      <Icon width={45} height={45} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default UserTypeButton;

const styles = StyleSheet.create({
  container: {
    width: WIDTH(50),

    backgroundColor: '#fff6e9', // Warm white
    borderRadius: 12,

    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 6,
    // paddingHorizontal: 8,

    marginBottom: 18,

    borderWidth: 1.2,
    borderColor: '#ededed',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  iconContainer: {
    width: 31,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 16,
  },

  title: {
    fontSize: 16,
    color: '#4c4c4c',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
