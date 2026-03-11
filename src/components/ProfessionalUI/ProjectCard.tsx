import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';

const ProjectCard = ({ title, location, image, selectedTab }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.new}>New</Text>
        </View>

        <Text style={styles.location}>{location}</Text>

        {selectedTab == 'project' ? (
          <>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Send Quotation</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('GeneralEnquiry')}
            >
              <Text style={styles.buttonText}>View Full Enquiry</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: WIDTH(4),
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#757575',
  },

  image: {
    width: '100%',
    height: 150,
  },

  content: {
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: FONTSIZE(1.6),
    fontWeight: '600',
  },

  new: {
    color: '#0E77EF',
    fontSize: FONTSIZE(1.6),
    fontFamily: FONT.POPPINS_REGULAR,
    fontWeight: '500',
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: FONTSIZE(1.4),
    fontWeight: '400',
  },

  button: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_MEDIUM,
  },
});
