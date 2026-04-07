//Professional's Project Details Screen when click on Project from Professional Profile

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { FONTSIZE, WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import LocationIcon from '../../../assets/svgs/LocationIcon.svg';
import BackArrow from '../../../assets/svgs/LeftArrow.svg';

const ProjectDetailsScreen = () => {
  const route = useRoute();
  const { projectId } = route.params;
  const navigation = useNavigation();

  // Later you will call API using projectId

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
          }}
          style={styles.projectImage}
        />
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <BackArrow width={25} height={25} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>ABC complex</Text>

        <View style={{ flexDirection: 'row' }}>
          <LocationIcon width={20} height={20} />
          <Text style={styles.location}> Location</Text>
        </View>

        <Text style={styles.budget}>
          Project Budget : <Text style={{ fontWeight: '600' }}>2 Crore</Text>
        </Text>

        <Text style={styles.description}>
          This is a placeholder description created purely for testing purposes.
          It is used to demonstrate how text content will appear within a layout
          or design without using actual data.
        </Text>

        <TouchableOpacity
          style={{
            alignItems: 'center',
          }}
        >
          <Text style={styles.showMore}>Show More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProjectDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  imageWrapper: {
    paddingHorizontal: WIDTH(4),
    marginTop: HEIGHT(2),
  },

  projectImage: {
    width: '100%',
    height: HEIGHT(50),
    borderRadius: 12,
  },

  content: {
    padding: WIDTH(5),
  },

  title: {
    fontSize: 24,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 8,
    fontWeight: '600',
  },

  location: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    color: 'black',
    marginBottom: 8,
  },

  budget: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    lineHeight: 22,
    color: '#444',
    fontWeight: '400',
  },

  showMore: {
    color: Colors.primary,
    marginTop: 10,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontSize: 16,
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
});
