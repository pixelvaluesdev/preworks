import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTSIZE, HEIGHT, WIDTH } from '../../../utils/responsive';
import { FONT } from '../../../theme/fonts';
import Colors from '../../../constants/colors';
import SecondaryButton from '../../../components/Buttons/SecondaryBtn';
import { useNavigation } from '@react-navigation/native';
import SuccessIcon from '../../../assets/svgs/Success.svg'; // use your svg

const HelpRequestSuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SuccessIcon width={80} height={80} />

        <Text style={styles.message}>Thank you for contacting us.</Text>

        <Text style={styles.subMessage}>
          Our support team will get back to you within 24 hours.
        </Text>
      </View>

      <SecondaryButton
        title="Back To Home"
        style={styles.button}
        onPress={() =>
          navigation.navigate('CustmTabNav', {
            screen: 'CustomerHome',
          })
        }
      />
    </SafeAreaView>
  );
};

export default HelpRequestSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },

  content: {
    flex: 1,
    marginVertical: HEIGHT(14),
    alignItems: 'center',
    paddingHorizontal: WIDTH(2),
  },

  message: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },

  subMessage: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    textAlign: 'center',
  },

  button: {
    marginHorizontal: WIDTH(4),
    marginBottom: HEIGHT(3),
  },
});
