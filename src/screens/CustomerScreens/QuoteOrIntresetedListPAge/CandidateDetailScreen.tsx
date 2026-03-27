import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import ScreenHeader from '../../../components/ScreenHeader';
import CallIcon from '../../../assets/svgs/WhitePhone.svg';
import Download from '../../../assets/svgs/DownloadIcon.svg';

const CandidateDetailScreen = ({ route }: any) => {
  const { candidate } = route.params || {};

  return (
    <View style={styles.container}>
      <ScreenHeader showBack />

      <ScrollView contentContainerStyle={{ padding: WIDTH(5) }}>
        <View style={styles.profileContainer}>
          <Image source={candidate?.image} style={styles.profileImage} />

          <Text style={styles.name}>{candidate?.name}</Text>

          <TouchableOpacity style={styles.callBtn}>
            <CallIcon width={25} height={25} />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>6 months</Text>
        </View>

        <View style={styles.dash} />

        <View style={styles.detailRow}>
          <Text style={styles.label}>Experience</Text>
          <Text style={styles.value}>6 Years</Text>
        </View>

        <View style={styles.dash} />

        <View style={styles.detailRow}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>Mumbai Maharashtra ,India</Text>
        </View>

        <View style={styles.dash} />

        <Text style={styles.messageTitle}>Message</Text>

        <Text style={styles.message}>
          This is a placeholder description created purely for testing purposes.
          It is used to demonstrate how text content will appear within a layout
          or design without using actual data.
        </Text>

        <TouchableOpacity style={styles.fileBtn}>
          <Text style={styles.fileText}>Quotation.PDF</Text>
          <Download />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileBtnText}>Contractor Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CandidateDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },

  name: {
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 16,
    marginBottom: 10,
  },

  callBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
  },

  callText: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
    color: '#fff',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  label: {
    color: '#757575',
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 16,
  },

  value: {
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 16,
  },

  dash: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    marginTop: 15,
  },

  messageTitle: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginTop: 20,
    fontSize: 16,
  },

  message: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  fileBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fileText: {
    color: Colors.primary,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 16,
  },

  profileBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  profileBtnText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 16,
  },
});
