import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';

import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, HEIGHT, WIDTH } from '../../utils/responsive';
import AreaIcon from '../../assets/svgs/Area.svg';
import CalenderIcon from '../../assets/svgs/Calender.svg';
import ConstructionIcon from '../../assets/svgs/Construction.svg';
import PhoneIcon from '../../assets/svgs/Phone.svg';
import StairsIcon from '../../assets/svgs/Stairs.svg';
import Phone2Icon from '../../assets/svgs/Phone2.svg';
import Popup from '../../components/Popup';
import Location from '../../assets/svgs/LocationIcon.svg';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ApiManager, { IMG_URL } from '../../apis/ApiManager';
import ImageViewing from 'react-native-image-viewing';

const GeneralEnquiryScreen = () => {
  const route = useRoute();
  const { projectId, fromProjectsScreen } = route.params;
  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;

  const [showPopup, setShowPopup] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (projectId && token) {
      fetchProjectDetails();
    }
  }, [projectId, token]);

  const imageUrls =
    project?.image?.map(img => ({
      uri: `${IMG_URL}${img}`,
    })) || [];

  const handleCall = () => {
    const phone = project?.userId?.phone;

    if (!phone) {
      Alert.alert('Phone number not available');
      return;
    }

    Linking.openURL(`tel:${phone}`);
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      const response = await ApiManager.getProjectDetails(projectId, token);

      if (response?.data?.status === 'success') {
        setProject(response.data.data.project);
      }
    } catch (error) {
      console.log('Details error', error);
    } finally {
      setLoading(false);
    }
  };

  const DetailRow = ({ label, value, icon }: any) => {
    return (
      <View style={styles.detailRow}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View>{icon}</View>
          <Text style={styles.detailLabel}>{label}</Text>
        </View>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="General Enquiry" showBack />

      {/* Image */}
      <TouchableOpacity
        onPress={() => {
          setCurrentIndex(0);
          setViewerVisible(true);
        }}
      >
        <Image
          source={
            project?.image && project.image.length > 0 && !imgError
              ? { uri: `${IMG_URL}${project.image[0]}` }
              : require('../../assets/pngs/NoImg.png')
          }
          style={styles.image}
          onError={() => setImgError(true)}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{project?.projectName}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: WIDTH(4),
          gap: 4,
        }}
      >
        <Location width={20} height={17} />
        <Text style={styles.location}>{project?.plotAddress}</Text>
      </View>

      {/* Services */}
      <Text style={styles.sectionTitle}>services customer need</Text>
      {/* from api services are not comming */}
      <View style={styles.tagRow}>
        {project?.services?.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Details */}
      <Text style={styles.sectionTitle}>Project Detail</Text>

      <DetailRow
        icon={<AreaIcon />}
        label="Plot Size"
        value={`${project?.floorArea} sq.ft`}
      />
      <View style={styles.dashedDivider} />
      <DetailRow
        icon={<StairsIcon />}
        label="No Of Floors"
        value={project?.noOfFloors}
      />
      <View style={styles.dashedDivider} />
      <DetailRow
        icon={<CalenderIcon />}
        label="Quote Last Date"
        value={
          project?.quoteLastDate
            ? new Date(project.quoteLastDate).toDateString()
            : 'N/A'
        }
      />
      <View style={styles.dashedDivider} />
      <DetailRow
        icon={<ConstructionIcon />}
        label="Type Of Quote"
        value={project?.typeOfQuote}
      />
      <View style={styles.dashedDivider} />

      {/* Call */}
      <View style={styles.callRow}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ justifyContent: 'center' }}>
            <PhoneIcon />
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.POPPINS_MEDIUM,
                fontWeight: '400',
              }}
            >
              Mobile Number
            </Text>
            <Text style={styles.mobile}>
              {project?.userId?.phone || 'Hidden'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Phone2Icon />

            <Text style={styles.callText}>Call</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.dashedDivider} />

      {/* Interested Button */}
      {!fromProjectsScreen && (
        <TouchableOpacity
          style={styles.interestedBtn}
          onPress={() => setShowPopup(true)}
        >
          <Text style={styles.interestedText}>I'm Interested</Text>
        </TouchableOpacity>
      )}

      <Popup
        title={'Show Your Interest'}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        showQuotation={false}
        projectId={projectId}
        token={token}
        userId={userId}
      />

      <ImageViewing
        images={imageUrls}
        imageIndex={currentIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </ScrollView>
  );
};

export default GeneralEnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 20,
  },

  image: {
    width: '92%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
  },

  title: {
    marginTop: 10,
    marginLeft: WIDTH(4),
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontWeight: '600',
  },

  location: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 16,
    fontWeight: '400',
  },

  sectionTitle: {
    marginTop: 18,
    marginLeft: WIDTH(4),
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontWeight: '400',
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: WIDTH(2),
    marginTop: 10,
  },

  tag: {
    backgroundColor: '#9FEDA8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    color: 'black',
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WIDTH(4),
    marginTop: 14,
    paddingBottom: 8,
    marginBottom: 8,
  },

  detailLabel: {
    color: 'grey',
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  detailValue: {
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  callRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WIDTH(4),
    marginTop: 20,
    alignItems: 'center',
  },

  mobile: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    fontWeight: '400',
    color: '#757575',
  },

  callBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  callText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontWeight: '600',
  },

  interestedBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: WIDTH(4),
    margin: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  interestedText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_MEDIUM,
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    marginHorizontal: 10,
    marginTop: 2,
  },
});
