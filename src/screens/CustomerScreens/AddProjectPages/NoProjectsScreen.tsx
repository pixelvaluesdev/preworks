import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import SecondaryButton from '../../../components/Buttons/SecondaryBtn';
import { useNavigation } from '@react-navigation/native';
import PlusIcon from '../../../assets/svgs/PlusIcon.svg';
import ScreenHeader from '../../../components/ScreenHeader';
const NoProjectScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Quote List"
        showBack
        onBackPress={() =>
          navigation.navigate('CustmTabNav', {
            screen: 'CustomerHome',
          })
        }
      />
      <View style={styles.content}>
        {/* PNG Image */}
        <Image
          source={require('../../../assets/pngs/NoProjectsImg.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Main Message */}
        <Text style={styles.message}>
          You don’t have any projects yet.Hit 'Add Project' to get started.
        </Text>

        {/* Button */}
        <SecondaryButton
          title="Add Project Details"
          style={styles.button}
          onPress={() => navigation.navigate('AddProjectInformation')}
          icon={<PlusIcon height={20} width={30} />}
        />
      </View>
    </View>
  );
};

export default NoProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(6),
  },

  image: {
    width: WIDTH(70),
    height: HEIGHT(35),
  },

  message: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },

  subMessage: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_REGULAR,
    textAlign: 'center',
    marginTop: HEIGHT(1),
    color: '#666',
  },

  button: {
    marginTop: HEIGHT(3),
    width: '100%',
  },
});
