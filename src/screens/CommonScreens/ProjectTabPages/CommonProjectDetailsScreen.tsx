import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';

import QuoteIcon from '../../../assets/svgs/Quote.svg';
import { useNavigation } from '@react-navigation/native';

const images = [
  require('../../../assets/pngs/BannerImg.png'),
  require('../../../assets/pngs/BannerImg.png'),
  require('../../../assets/pngs/BannerImg.png'),
];

const attachments = [
  { id: '1', name: 'Akruti mall.png' },
  { id: '2', name: 'Akruti mall.pdf' },
];

const CommonProjectDetailsScreen = ({ route }: any) => {
  const { projectId, userType = 'customer' } = route.params || {};

  const isCustomer = userType === 'customer';

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HEIGHT(12) }}
      >
        {/* Banner Image */}
        <View>
          <Image
            source={require('../../../assets/pngs/BannerImg.png')}
            style={styles.banner}
          />

          {/* Quote badge */}
          <TouchableOpacity
            style={styles.quoteBadge}
            onPress={() => navigation.navigate('Quote/IntrestedList')}
          >
            <QuoteIcon width={30} height={30} />
            <Text style={styles.quoteLabel}>Quotes</Text>
          </TouchableOpacity>
        </View>

        {/* Image Thumbnails */}
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnailContainer2}>
            {images.map((img, index) => (
              <Image key={index} source={img} style={styles.thumbnail} />
            ))}

            <View style={styles.moreThumb}>
              <Text style={styles.moreText}>4+</Text>
            </View>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Mobile Number</Text>
          <Text style={styles.valueText}>3438545685</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Full Plot Address</Text>
          <Text style={styles.valueText}>Mumbai Maharashtra ,India</Text>

          <View style={styles.projectDetailSection}>
            <Text style={styles.heading}>Project Detail</Text>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Plot Area</Text>
              <Text style={styles.value}>2782.0 sq.ft</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.rowBetween}>
              <Text style={styles.label}>No Of Floors</Text>
              <Text style={styles.value}>1 Floor</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Quote Last Date</Text>
              <Text style={styles.value}>12 Aug 2026</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Type Of Quote</Text>
              <Text style={styles.value}>Labour Only</Text>
            </View>
          </View>

          {/* Scope */}
          <Text style={styles.scopeTitle}>Scope Of Work Description</Text>
          <Text style={styles.scopeText}>
            This is a placeholder description created purely for testing
            purposes. It is used to demonstrate how text content will appear
            within a layout or design without using actual data.
          </Text>

          {/* Attachments */}
          <FlatList
            data={attachments}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.fileCard}>
                <View style={styles.fileIcon} />
                <Text style={styles.fileName}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Floating Edit Button */}
      {isCustomer && (
        <TouchableOpacity style={styles.floatingEditBtn}>
          <Text style={styles.editText}>Edit Your Project</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommonProjectDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  banner: {
    width: '100%',
    height: HEIGHT(35),
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
    paddingVertical: 10,
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
    marginTop: 10,
  },

  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginRight: 10,
  },

  fileName: {
    fontSize: 14,
  },

  floatingEditBtn: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#3BA56A',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 5,
  },

  editText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 15,
  },
});
