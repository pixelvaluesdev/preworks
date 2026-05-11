import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import Location from '../../assets/svgs/LocationIcon.svg';
import { triggerHaptic } from '../../utils/hapticks';

const ProjectCard = ({ title, location, image, selectedTab, item, time }) => {
  const [imgError, setImgError] = React.useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            image && !imgError
              ? { uri: image }
              : require('../../assets/pngs/NoImg.png')
          }
          style={styles.image}
          onError={() => setImgError(true)}
        />
        {/* 🔥 TIME BADGE */}
        {time && (
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
      </View>

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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('CommonProjectDetails', {
                projectId: item._id,
              });
              triggerHaptic('impactHeavy');
            }}
          >
            <Text style={styles.buttonText}>View Full Details</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('GeneralEnquiry', {
                projectId: item._id,
              });
              triggerHaptic('impactHeavy');
            }}
          >
            <Text style={styles.buttonText}>View Full Enquiry</Text>
          </TouchableOpacity>
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
    height: 130,
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
    fontSize: 14,
  },

  new: {
    color: '#0E77EF',
    fontSize: 14,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 12,
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
  imageWrapper: {
    position: 'relative',
  },

  timeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(59, 59, 59, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  timeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONT.POPPINS_REGULAR,
  },
});
