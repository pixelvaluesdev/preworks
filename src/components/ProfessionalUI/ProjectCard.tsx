import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Location from '../../assets/svgs/LocationIcon.svg';
import { triggerHaptic } from '../../utils/hapticks';
import { useSelector } from 'react-redux';
import ApiManager from '../../apis/ApiManager';

const ProjectCard = ({ title, location, image, selectedTab, item, time }) => {
  const user = useSelector(state => state.auth.user);

  const userId = user?._id;
  const token = useSelector((state: any) => state.auth.userToken);
  const [imgError, setImgError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState(null);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProfile(userId, token);

      if (res?.data?.status === 'success') {
        setProfile(res.data.data);

        // console.log('Profile data 12232424:', res.data.data);
      }
    } catch (error) {
      console.log('Profile Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            image && !imgError
              ? { uri: image }
              : require('../../assets/images/NoImg1.jpeg')
          }
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
        {/* TIME BADGE */}
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
              profile?.user?.isSubscribed
                ? navigation.navigate('CommonProjectDetails', {
                    projectId: item._id,
                  })
                : navigation.navigate('Subscription');
              triggerHaptic('impactHeavy');
            }}
          >
            <Text style={styles.buttonText}>View Full Details</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              profile?.user?.isSubscribed
                ? navigation.navigate('GeneralEnquiry', {
                    projectId: item._id,
                  })
                : navigation.navigate('Subscription');
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
    width: '102%',
    height: 130,
    marginLeft: -2,
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
    width: '100%',
    overflow: 'hidden',
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
