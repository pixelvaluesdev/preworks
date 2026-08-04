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
      <View style={styles.iconContainer}>
        <Icon width={50} height={50} />
      </View>

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

    paddingVertical: 10,
    paddingHorizontal: 10,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#F3EEE8',

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
    width: 48,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  title: {
    fontSize: 16,
    color: '#222222',
    fontFamily: FONT.POPPINS_MEDIUM,
  },
});
