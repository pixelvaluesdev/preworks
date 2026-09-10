import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';

import QuoteIcon from '../../../assets/svgs/Quote.svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import GreyMobile from '../../../assets/svgs/greyMobile.svg';
import GreyAdress from '../../../assets/svgs/GreyAdress.svg';
import Area from '../../../assets/svgs/GreyArea.svg';
import Stairs from '../../../assets/svgs/GreyStairs.svg';
import Construction from '../../../assets/svgs/GreyConstruction.svg';
import Calender from '../../../assets/svgs/GreyCalender.svg';
import Money from '../../../assets/svgs/GreyMoney.svg';
import BorderTextInput from '../../../components/Inputs/BorderTextInput';
import DownloadIcon from '../../../assets/svgs/DownloadIcon.svg';
import SecondaryButton from '../../../components/Buttons/SecondaryBtn';
import Popup from '../../../components/Popup';
import CallIcon from '../../../assets/svgs/Call.svg';
import BackArrow from '../../../assets/svgs/LeftArrow.svg';
import EditIcon from '../../../assets/svgs/WhiteEdit.svg';
import ApiManager, { IMG_URL } from '../../../apis/ApiManager';
import ImageViewing from 'react-native-image-viewing';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { triggerHaptic } from '../../../utils/hapticks';
import ScreenWrapper from '../../../utils/screenWrapper';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

const CommonProjectDetailsScreen = ({ route }: any) => {
  const { projectId, fromProjectsScreen, appliedStatus } = route.params || {};
  const flatListRef = React.useRef(null);

  const userTypeRed = useSelector(state => state.auth.userType);
  console.log('USER TYPE 👉', userTypeRed);
  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const token = useSelector(state => state.auth.userToken);
  const isCustomer = userTypeRed === 'customer';
  const isProfessional =
    userTypeRed === 'contractor' ||
    userTypeRed === 'architect' ||
    userTypeRed === 'designer';

  const [project, setProject] = useState(null);
  const drawings = project?.drawing || [];

  const [loading, setLoading] = useState(false);
  const [enquiryCount, setEnquiryCount] = useState(0);

  const [quoteCount, setQuoteCount] = useState(0);

  const navigation = useNavigation();

  const [showPopup, setShowPopup] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const [imgError, setImgError] = useState(false);

  const [loadingFileIndex, setLoadingFileIndex] = useState(null);

  const images =
    project?.image && project.image.length > 0 ? project.image : [null];
  console.log('project.image 👉', project?.image);
  const imageCount = images.length;

  const requestCallPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'Phone Call Permission',
        message: 'App needs permission to make phone calls',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleCall = async () => {
    const phone = project?.userId?.phone;

    if (!phone) {
      Alert.alert('No Phone Number Available');
      return;
    }

    const hasPermission = await requestCallPermission();

    if (!hasPermission) {
      Alert.alert('Permission Denied');
      return;
    }

    triggerHaptic('impactHeavy');

    RNImmediatePhoneCall.immediatePhoneCall(phone);
  };
  const allImages = [
    ...(project?.image || []),
    ...drawings.filter(
      file =>
        file.endsWith('.jpg') ||
        file.endsWith('.png') ||
        file.endsWith('.jpeg'),
    ),
  ];

  const imageUrls = [
    ...(project?.image || []),
    ...drawings.filter(
      file =>
        file.endsWith('.jpg') ||
        file.endsWith('.png') ||
        file.endsWith('.jpeg'),
    ),
  ].map(img => ({
    uri: `${IMG_URL}/${img}`,
  }));

  useEffect(() => {
    if (imageCount <= 1) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % imageCount;

      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }, 3000); // 3 sec

    return () => clearInterval(interval);
  }, [imageCount]);
  const openViewer = index => {
    setCurrentIndex(index);
    setViewerVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (projectId) {
        fetchProjectDetails();
      }
    }, [projectId]),
  );

  const openFile = async (file, index) => {
    const fileUrl = `${IMG_URL}/${file}`;

    // IMAGE
    if (
      file.endsWith('.jpg') ||
      file.endsWith('.png') ||
      file.endsWith('.jpeg')
    ) {
      setCurrentIndex(index);
      setViewerVisible(true);
    } else {
      // PDF LOADING START
      setLoadingFileIndex(index);

      try {
        const localPath = `${RNFS.DocumentDirectoryPath}/${file
          .split('/')
          .pop()}`;

        const res = await RNFS.downloadFile({
          fromUrl: fileUrl,
          toFile: localPath,
        }).promise;

        if (res.statusCode === 200) {
          await FileViewer.open(localPath);
        }
      } catch (error) {
        console.log('Error opening file:', error);
      } finally {
        // PDF LOADING STOP
        setLoadingFileIndex(null);
      }
    }
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProjectDetails(projectId, token);
      console.log('Project Details Response:', res?.data);

      if (res?.data?.status === 'success') {
        const data = res?.data?.data;

        setProject(data?.project);
        setEnquiryCount(data?.enquiryCount || 0);

        // future ready
        setQuoteCount(data?.quoteCount || 0);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !project) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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

  const isQuoteExpired = project?.quoteLastDate
    ? new Date(project.quoteLastDate).getTime() < new Date().getTime()
    : false;

  console.log('QUOTATION DEBUG 👉', {
    projectId,
    quoteLastDate: project?.quoteLastDate,
    appliedStatus,
    fromProjectsScreen,
    isProfessional,
    isQuoteExpired,
  });

  const showQuotationButton =
    isProfessional && !isQuoteExpired && (!appliedStatus || fromProjectsScreen);

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HEIGHT(12) }}
      >
        {/* Banner Image */}
        <View>
          {imageCount === 1 ? (
            <TouchableOpacity onPress={() => openViewer(0)}>
              <Image
                source={
                  images.length > 0 && !imgError
                    ? {
                        uri: `${IMG_URL}${
                          images?.[0]?.startsWith('/')
                            ? images[0]
                            : '/' + (images?.[0] || '')
                        }`,
                      }
                    : require('../../../assets/images/NoImg1.jpeg')
                }
                style={styles.banner}
                resizeMode="cover"
                onError={() => setImgError(true)}
              />
            </TouchableOpacity>
          ) : (
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{
                width: screenWidth,
                height: HEIGHT(35),
              }}
              keyExtractor={(_, index) => index.toString()}
              getItemLayout={(_, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => openViewer(index)}>
                  <Image
                    source={
                      item && !imgError
                        ? {
                            uri: `${IMG_URL}${
                              item.startsWith('/') ? item : '/' + item
                            }`,
                          }
                        : require('../../../assets/images/NoImg1.jpeg')
                    }
                    style={styles.banner}
                    resizeMode="cover"
                    onError={() => setImgError(true)}
                  />
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <BackArrow width={25} height={25} />
          </TouchableOpacity>
          {/* Quote badge */}
          {isCustomer && (
            <TouchableOpacity
              style={styles.quoteBadge}
              onPress={() =>
                navigation.navigate('Quote/IntrestedList', {
                  projectId,
                  isQuote: project?.drawingStatus, // true = quote, false = interested
                })
              }
            >
              <QuoteIcon width={30} height={30} />

              {/* Dynamic Label */}
              <Text style={styles.quoteLabel}>
                {project?.drawingStatus ? 'Quotes' : 'Interested'}
              </Text>

              {/* Count Badge */}
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{enquiryCount || 0}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Image Thumbnails */}
        {imageCount > 1 && (
          <View style={styles.thumbnailContainer}>
            <View style={styles.thumbnailContainer2}>
              {images.slice(0, 3).map((img, index) => (
                <TouchableOpacity key={index} onPress={() => openViewer(index)}>
                  <Image
                    source={
                      img
                        ? { uri: `${IMG_URL}/${img}` }
                        : require('../../../assets/images/NoImg1.jpeg')
                    }
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              ))}

              {imageCount > 3 && (
                <View style={styles.moreThumb}>
                  <Text style={styles.moreText}>{imageCount - 3}+</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View>
            <View style={styles.row}>
              {/* LEFT SIDE */}
              <View style={styles.rowLeft}>
                <GreyMobile width={25} height={25} />
                {/* Important : we have reverse the logic of hidenumber on frontend  */}
                <View style={{ marginLeft: 10, margin: 10 }}>
                  <Text style={styles.sectionTitle}>Mobile Number</Text>
                  <Text style={styles.valueText}>
                    {/* {project?.hideNumber ?  : project?.userId?.phone} */}
                    {project?.hideNumber ? project?.userId?.phone : 'Hidden'}
                  </Text>
                </View>
              </View>

              {/* RIGHT SIDE */}
              {/* RIGHT SIDE */}
              {!isCustomer && project?.hideNumber && (
                <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                  <CallIcon height={40} width={40} />
                  <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <GreyAdress width={25} height={25} />

              <View style={{ marginLeft: 10, margin: 10 }}>
                <Text style={styles.sectionTitle}>Full Plot Address</Text>
                <Text style={styles.valueText}>
                  {project?.pinCode
                    ? project.pinCode
                    : `${project?.plotAddress}, ${project?.city}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dashedDivider} />

          <View style={styles.projectDetailSection}>
            <Text style={styles.heading}>Project Detail</Text>

            <View style={styles.rowBetween}>
              {/* LEFT SIDE */}
              <View style={styles.rowLeft}>
                <Area width={25} height={25} />

                <Text style={[styles.label, { marginLeft: 10, margin: 10 }]}>
                  Plot Size
                </Text>
              </View>

              {/* RIGHT SIDE */}
              <Text style={styles.value}>{project?.plotSize} sq.ft</Text>
            </View>

            <View style={styles.dashedDivider} />

            {/* Floor Area */}
            <View style={styles.rowBetween}>
              <View style={styles.rowLeft}>
                <Stairs width={25} height={25} />
                <Text style={[styles.label, { marginLeft: 10, margin: 10 }]}>
                  Floor Area
                </Text>
              </View>

              <Text style={styles.value}>{project?.floorArea} sq.ft</Text>
            </View>

            <View style={styles.dashedDivider} />

            {/* No Of Floors */}
            <View style={styles.rowBetween}>
              <View style={styles.rowLeft}>
                <Stairs width={25} height={25} />
                <Text style={[styles.label, { marginLeft: 10, margin: 10 }]}>
                  No Of Floors
                </Text>
              </View>

              <Text style={styles.value}>{project?.noOfFloors}</Text>
            </View>

            <View style={styles.dashedDivider} />

            {/* Quote Last Date */}
            <View style={styles.rowBetween}>
              <View style={styles.rowLeft}>
                <Calender width={25} height={25} />
                <Text style={[styles.label, { marginLeft: 10, margin: 10 }]}>
                  Quote Last Date
                </Text>
              </View>

              <Text style={styles.value}>
                {new Date(project?.quoteLastDate).toDateString()}
              </Text>
            </View>

            <View style={styles.dashedDivider} />

            {/* Type Of Quote */}
            <View style={styles.rowBetween}>
              <View style={styles.rowLeft}>
                <Construction width={25} height={25} />
                <Text style={[styles.label, { marginLeft: 10, margin: 10 }]}>
                  Type Of Quote
                </Text>
              </View>

              <Text style={styles.value}>{project?.typeOfQuote}</Text>
            </View>
            <View style={styles.dashedDivider} />
            {/* Price Range */}
            <View style={styles.rowBetween}>
              <View style={styles.rowLeft}>
                <Money width={25} height={25} />
                <Text style={[styles.label, { marginLeft: 10, margin: 10 }]}>
                  Price Range
                </Text>
              </View>

              <Text style={styles.value}>
                {getPriceLabel(project?.priceRange)}
              </Text>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          {/* Scope */}
          <Text style={styles.scopeTitle}>Scope Of Work Description</Text>
          <Text style={styles.scopeText}>{project?.requirementDesc}</Text>

          {drawings && drawings.length > 0 && (
            <>
              <Text style={[styles.scopeTitle, { marginBottom: 10 }]}>
                Architectural Drawings
              </Text>

              {/* Attachments */}
              <FlatList
                data={drawings}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item, index }) => {
                  const fileName = item.split('/').pop();

                  return (
                    <TouchableOpacity
                      style={styles.fileCard}
                      onPress={() => openFile(item, index)}
                    >
                      <View style={styles.fileIcon}>
                        {loadingFileIndex === index ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.primary}
                          />
                        ) : null}
                      </View>

                      <Text style={styles.fileName}>{fileName}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}

          {showQuotationButton && (
            <View style={{ marginTop: 15 }}>
              <SecondaryButton
                title={
                  fromProjectsScreen
                    ? 'Send Quotation Again'
                    : 'Send Your Quotation'
                }
                onPress={() => setShowPopup(true)}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Edit Button for customers if there customers project */}
      {isCustomer && (
        <TouchableOpacity
          style={styles.floatingEditBtn}
          onPress={() =>
            navigation.navigate('AddProjectInformation', {
              isEdit: true,
              projectId: projectId,
            })
          }
        >
          <EditIcon width={30} style={{ marginRight: 4 }} />
          <Text style={styles.editText}>Edit Your Project</Text>
        </TouchableOpacity>
      )}

      <Popup
        title="Send your Quotation"
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        projectId={projectId}
        token={token}
        userId={userId}
        customerId={project?.userId?._id}
        projectName={project?.projectName || ''}
        showQuotation={true}
      />
      <ImageViewing
        images={imageUrls}
        imageIndex={currentIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </ScreenWrapper>
  );
};

export default CommonProjectDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  banner: {
    width: Dimensions.get('window').width,
    height: HEIGHT(35),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quoteBadge: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#00000090',
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  quoteLabel: {
    color: '#fff',
    fontSize: 10,
    marginTop: 8,
  },

  thumbnailContainer: {
    flexDirection: 'row',
    marginTop: -25,
    paddingHorizontal: WIDTH(4),
    justifyContent: 'center',
  },

  thumbnailContainer2: {
    flexDirection: 'row',
    padding: WIDTH(2),
    paddingHorizontal: WIDTH(5),
    backgroundColor: 'rgba(210, 202, 202, 0.85)',
    justifyContent: 'center',
    borderRadius: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: -4,
      height: 4,
    },
    shadowOpacity: 0.08,

    elevation: 6,
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 8,
  },

  moreThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moreText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  detailsCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 15,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 14,
    color: 'black',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  valueText: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: 'grey',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  projectDetailSection: {
    marginTop: 20,
  },

  heading: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 15,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // important for vertical alignment
    paddingVertical: 10,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },

  label: {
    fontSize: 16,
    color: '#777',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  value: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  scopeTitle: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginTop: 20,
  },

  scopeText: {
    fontSize: 14,

    marginVertical: 10,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginRight: 10,
    alignItems: 'center',
    textAlign: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
  },

  fileName: {
    fontSize: 14,
  },

  floatingEditBtn: {
    position: 'absolute',
    flexDirection: 'row',
    right: 20,
    bottom: 30,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  editText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 15,
  },
  callBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  callText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },
  rowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // for call button
    alignItems: 'center',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(222, 221, 221, 0.88)',
    padding: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    position: 'absolute',
    bottom: 30,
    left: 18,
    backgroundColor: 'red',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  countText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
