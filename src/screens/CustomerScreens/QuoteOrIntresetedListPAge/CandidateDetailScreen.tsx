import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  FlatList,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import ScreenHeader from '../../../components/ScreenHeader';
import CallIcon from '../../../assets/svgs/WhitePhone.svg';
import Download from '../../../assets/svgs/DownloadIcon.svg';
import { IMG_URL } from '../../../apis/ApiManager';
import ImageViewing from 'react-native-image-viewing';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const CandidateDetailScreen = ({ route, navigation }: any) => {
  const { candidate } = route.params || {};
  const user = candidate?.userId || {};

  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  const openFile = async (file, index) => {
    const fileUrl = `${IMG_URL}/${file}`;
    const extension = file.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      setImageUrls([{ uri: fileUrl }]);
      setCurrentIndex(0);
      setViewerVisible(true);
    } else {
      try {
        const localPath = `${
          RNFS.DocumentDirectoryPath
        }/${Date.now()}.${extension}`;

        const download = await RNFS.downloadFile({
          fromUrl: fileUrl,
          toFile: localPath,
        }).promise;

        if (download.statusCode === 200) {
          await FileViewer.open(localPath);
        } else {
          Alert.alert('Failed to open file');
        }
      } catch (error) {
        console.log('File open error:', error);
        Alert.alert('Error opening file');
      }
    }
  };

  const handleCall = () => {
    if (user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    } else {
      Alert.alert('No phone number available');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader showBack />

      <ScrollView contentContainerStyle={{ padding: WIDTH(5) }}>
        <View style={styles.profileContainer}>
          <Image
            source={
              user?.image?.[0]
                ? { uri: `${IMG_URL}/${user.image[0]}` }
                : require('../../../assets/pngs/Placeholder.png')
            }
            style={styles.profileImage}
          />

          <Text style={styles.name}>{user?.firstName || 'No Name'}</Text>

          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <CallIcon width={25} height={25} />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* EXPERIENCE REAL */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Experience</Text>
          <Text style={styles.value}>
            {user?.experience ? `${user.experience} Years` : 'Not available'}
          </Text>
        </View>

        <View style={styles.dash} />

        {/*  CITY */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{user?.city || 'N/A'}</Text>
        </View>

        <View style={styles.dash} />

        {/* MESSAGE */}
        <Text style={styles.messageTitle}>Message</Text>

        <Text style={styles.message}>
          {candidate?.desc || 'No message provided'}
        </Text>

        {/* FILE */}
        {candidate?.files?.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.messageTitle}>Files</Text>

            <FlatList
              data={candidate?.files}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item, index }) => {
                const fileName = item.split('/').pop();

                return (
                  <TouchableOpacity
                    style={styles.fileCard}
                    onPress={() => openFile(item, index)}
                  >
                    <View style={styles.fileIcon} />
                    <Text style={styles.fileName}>{fileName}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/*  PROFILE NAVIGATION */}
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() =>
            navigation.navigate('ProfessionalProfile', {
              id: user?._id, //  correct id
            })
          }
        >
          <Text style={styles.profileBtnText}>Contractor Profile</Text>
        </TouchableOpacity>
        <ImageViewing
          images={imageUrls}
          imageIndex={currentIndex}
          visible={viewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />
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
  },

  fileName: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_MEDIUM,
    flex: 1,
  },
});
