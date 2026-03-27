import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { HEIGHT, WIDTH } from '../../utils/responsive';
import { FONT } from '../../theme/fonts';

interface Props {
  title: string;
  subtitle: string;
  Icon: React.FC<any>;
  onPress: () => void;
}

const ServiceCard: React.FC<Props> = ({ title, Icon, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon width={60} height={60} />
      </View>

      <View style={styles.textcontainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    //width: WIDTH(55),
    //height: HEIGHT(9),
    backgroundColor: Colors.lightGreen,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 14,
  },

  iconWrapper: {
    backgroundColor: Colors.background,

    borderRadius: 6,
    marginRight: 10,
  },

  title: {
    fontSize: 16,
    textAlign: 'left',
    flexShrink: 1,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
  textcontainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'left',
    fontWeight: '400',
    flexShrink: 1,
    fontFamily: FONT.POPPINS_REGULAR,
  },
});
