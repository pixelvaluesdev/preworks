import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import ScreenHeader from '../../components/ScreenHeader';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH } from '../../utils/responsive';
import AreaIcon from '../../assets/svgs/Area.svg';
import CalenderIcon from '../../assets/svgs/Calender.svg';
import ConstructionIcon from '../../assets/svgs/Construction.svg';
import PhoneIcon from '../../assets/svgs/Phone.svg';
import StairsIcon from '../../assets/svgs/Stairs.svg';
import Phone2Icon from '../../assets/svgs/Phone2.svg';
import Popup from '../../components/Popup';

const GeneralEnquiryScreen = () => {
  const [showPopup, setShowPopup] = useState(false);

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
  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="General Enquiry" showBack />

      {/* Image */}
      <Image
        source={require('../../assets/pngs/BannerImg.png')}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>ABC complex</Text>

      <Text style={styles.location}>202, C.G. Road Nagpur</Text>

      {/* Services */}
      <Text style={styles.sectionTitle}>services you need</Text>

      <View style={styles.tagRow}>
        <Text style={styles.tag}>Architectural Design</Text>
        <Text style={styles.tag}>Structural Design</Text>
        <Text style={styles.tag}>Construction</Text>
      </View>

      {/* Details */}
      <Text style={styles.sectionTitle}>Project Detail</Text>

      <DetailRow icon={<AreaIcon />} label="Plot Area" value="2782.0 sq.ft" />
      <DetailRow
        icon={<StairsIcon />}
        label="No Of Floors"
        value="Ground Floor & 1 Floor"
      />
      <DetailRow
        icon={<CalenderIcon />}
        label="Quote Last Date"
        value="09/08/2025"
      />
      <DetailRow
        icon={<ConstructionIcon />}
        label="Type Of Quote"
        value="Laboure Only"
      />

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
            <Text style={styles.mobile}>3438545685</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callBtn}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Phone2Icon />

            <Text style={styles.callText}>Call</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Interested Button */}
      <TouchableOpacity
        style={styles.interestedBtn}
        onPress={() => setShowPopup(true)}
      >
        <Text style={styles.interestedText}>I'm Intrested</Text>
      </TouchableOpacity>

      <Popup
        title={'Show Your Interest'}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        showQuotation={false}
      />
    </ScrollView>
  );
};

export default GeneralEnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    marginLeft: WIDTH(4),
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
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WIDTH(4),
    marginTop: 14,
    borderBottomWidth: 0.5,
    borderColor: '#DDD',
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
    fontSize: 18,
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
});
