import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import Location from '../../assets/svgs/LocationIcon.svg';

const ProjectCard = ({ title, location, image, selectedTab, item }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.new}>New</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Location width={18} height={18} />
          <Text style={styles.location}>{location}</Text>
        </View>

        {selectedTab == 'project' ? (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('CommonProjectDetails', { project: item })
              }
            >
              <Text style={styles.buttonText}>View Full Details</Text>
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
    fontSize: 16,
  },

  new: {
    color: '#0E77EF',
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 14,
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
