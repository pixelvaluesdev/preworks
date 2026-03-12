import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FONTSIZE, WIDTH, HEIGHT } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';

import CallIcon from '../../../assets/svgs/Call.svg';
import ChatIcon from '../../../assets/svgs/Chat.svg';
import LinkIcon from '../../../assets/svgs/Links.svg';

const portfolioImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600607687644-c94bf45c6d3e',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154',
];

const ProfessionalProfileScreen = () => {
  const route = useRoute();
  const { id } = route.params;

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1501183638710-841dd1904471',
          }}
          style={styles.banner}
        />

        {/* Profile Card */}
        <View style={styles.card}>
          {/* Profile Image */}
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profileImage}
          />

          <Text style={styles.name}>Rajendra singh</Text>
          <Text style={styles.role}>Contractor</Text>
          <Text style={styles.phone}>Nagpur 441624</Text>

          <Text style={styles.description}>
            Reliable contractor specializing in quality builds, renovations, and
            repairs with a focus on client satisfaction.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.iconCircle}>
                <CallIcon width={40} height={40} />
              </View>
              <Text style={styles.actionText}>Enquire now</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.iconCircle}>
                <ChatIcon width={40} height={40} />
              </View>
              <Text style={styles.actionText}>Chat now</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.iconCircle}>
                <LinkIcon width={40} height={40} />
              </View>
              <Text style={styles.actionText}>links</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio */}
        <View style={styles.portfolioContainer}>
          <Text style={styles.portfolioTitle}>My Portfolio</Text>

          <View style={styles.grid}>
            {portfolioImages.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={styles.gridItem}
                onPress={() =>
                  navigation.navigate('ProjectDetails', {
                    projectId: index + 1,
                  })
                }
              >
                <Image source={{ uri: img }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfessionalProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  banner: {
    width: '100%',
    height: HEIGHT(25),
  },

  card: {
    backgroundColor: '#fff',
    marginTop: -HEIGHT(7),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: HEIGHT(6),
    paddingHorizontal: WIDTH(5),
    alignItems: 'center',
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: '#fff',
    position: 'absolute',
    top: -55,
  },

  name: {
    fontSize: 20,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  role: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#777',
  },

  phone: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: Colors.primary,
  },

  description: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONT.POPPINS_REGULAR,
    marginTop: 10,
    lineHeight: 20,
    color: 'black',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    width: WIDTH(100),
    justifyContent: 'space-between',
  },

  actionItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    alignSelf: 'center',
    alignContent: 'center',
    verticalAlign: 'middle',
  },

  iconCircle: {
    backgroundColor: '#3BA56A',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  actionText: {
    fontSize: 12,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  divider: {
    width: 1,
    height: HEIGHT(6),
    backgroundColor: '#ddd',
  },

  portfolioContainer: {
    paddingHorizontal: WIDTH(4),
    marginTop: 20,
  },

  portfolioTitle: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  gridItem: {
    width: '31%',
    marginBottom: 10,
  },
});
