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
import { triggerHaptic } from '../../utils/hapticks';
import ScreenWrapper from '../../utils/screenWrapper';

const GeneralEnquiryScreen = () => {
  const route = useRoute();
  const { projectId, fromProjectsScreen, interestedStatus } =
    route.params || {};
  const token = useSelector(state => state.auth.userToken);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;

  const [showPopup, setShowPopup] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const isQuoteExpired = project?.quoteLastDate
    ? new Date(project.quoteLastDate).getTime() < new Date().getTime()
    : false;

  const showInterestButton =
    !isQuoteExpired && !fromProjectsScreen && !interestedStatus;

  console.log();

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
    triggerHaptic('impactHeavy');
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

  const priceRanges = [
    { max: 0, label: '0 - 5 Lakh' },
    { max: 2.5, label: '5 - 10 Lakh' },
    { max: 5, label: '10 - 15 Lakh' },
    { max: 7.5, label: '15 - 20 Lakh' },
    { max: 10, label: '20 - 25 Lakh' },
    { max: 12.5, label: '25 - 30 Lakh' },
    { max: 15, label: '30 - 35 Lakh' },
    { max: 17.5, label: '35 - 40 Lakh' },
    { max: 20, label: '40 - 45 Lakh' },
    { max: 22.5, label: '45 - 50 Lakh' },
    { max: 25, label: '50 - 55 Lakh' },
    { max: 27.5, label: '55 - 60 Lakh' },
    { max: 30, label: '60 - 65 Lakh' },
    { max: 32.5, label: '65 - 70 Lakh' },
    { max: 35, label: '70 - 75 Lakh' },
    { max: 37.5, label: '75 - 80 Lakh' },
    { max: 40, label: '80 - 85 Lakh' },
    { max: 42.5, label: '85 - 90 Lakh' },
    { max: 45, label: '90 - 95 Lakh' },
    { max: 47.5, label: '95 Lakh - 1 CR' },

    { max: 50, label: '1 - 1.05 CR' },
    { max: 52.5, label: '1.05 - 1.10 CR' },
    { max: 55, label: '1.10 - 1.15 CR' },
    { max: 57.5, label: '1.15 - 1.20 CR' },
    { max: 60, label: '1.20 - 1.25 CR' },
    { max: 62.5, label: '1.25 - 1.30 CR' },
    { max: 65, label: '1.30 - 1.35 CR' },
    { max: 67.5, label: '1.35 - 1.40 CR' },
    { max: 70, label: '1.40 - 1.45 CR' },
    { max: 72.5, label: '1.45 - 1.50 CR' },
    { max: 75, label: '1.50 - 1.55 CR' },
    { max: 77.5, label: '1.55 - 1.60 CR' },
    { max: 80, label: '1.60 - 1.65 CR' },
    { max: 82.5, label: '1.65 - 1.70 CR' },
    { max: 85, label: '1.70 - 1.75 CR' },
    { max: 87.5, label: '1.75 - 1.80 CR' },
    { max: 90, label: '1.80 - 1.85 CR' },
    { max: 92.5, label: '1.85 - 1.90 CR' },
    { max: 95, label: '1.90 - 1.95 CR' },
    { max: 97.5, label: '1.95 - 2 CR' },

    { max: 100, label: '2 CR+' },
  ];

  const getPriceLabel = value => {
    if (value === undefined || value === null) return 'N/A';

    const range = priceRanges.find(r => value <= r.max);

    return range ? range.label : '2 CR+';
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
    <ScreenWrapper>
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
                : require('../../assets/images/NoImg1.jpeg')
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
        {/* Floor Area */}
        <DetailRow
          icon={<StairsIcon />}
          label="Floor Area"
          value={`${project?.floorArea ?? 'N/A'} sq.ft`}
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
        {/* Budget / Price Range */}
        <DetailRow
          icon={<ConstructionIcon />}
          label="Budget"
          value={getPriceLabel(project?.priceRange)}
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
        {showInterestButton && (
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
    </ScreenWrapper>
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
