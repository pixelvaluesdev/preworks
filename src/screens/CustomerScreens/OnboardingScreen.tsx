import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, HEIGHT, WIDTH } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../../assets/svgs/LeftArrow.svg';
import NextIcon from '../../assets/svgs/NextIcon.svg';
import { useDispatch } from 'react-redux';
import { setHasSeenOnboarding } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/pngs/Walkthrough1.png'),
    title: 'Post Your Project In Minutes',
    subtitle: 'Just add basic details to start receiving offers.',
  },
  {
    id: '2',
    image: require('../../assets/pngs/Walkthrough2.png'),
    title: 'Compare Transparent Quotes',
    subtitle: 'View Detailed contractor profile, pricing, and scope.',
  },
  {
    id: '3',
    image: require('../../assets/pngs/Walkthrough3.png'),
    title: 'Select and Begin Construction',
    subtitle: 'Finalize your partner and start your project confidently.',
  },
];

const OnboardingScreen = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      dispatch(setHasSeenOnboarding(true));
      console.log('SETTING ONBOARDING TRUE');
      navigation.replace('Login');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <BackIcon width={20} height={20} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginBottom: HEIGHT(2) }}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.bottomSection}>
        <Image
          source={require('../../assets/pngs/bottomCircle.png')}
          style={styles.bottomBg}
          resizeMode="stretch"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.subtitle}>{item.subtitle}</Text>

          {/* DOTS */}
          <View style={styles.dots}>
            {slides.map((_, index) => {
              const isActive = currentIndex === index;

              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    isActive ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              );
            })}
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => {
                dispatch(setHasSeenOnboarding(true));
                navigation.replace('Login');
              }}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <View style={styles.nextContent}>
                <Text style={styles.nextText}>
                  {currentIndex === 2 ? 'Start' : 'Next'}
                </Text>

                <NextIcon width={20} height={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={event => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  slide: {
    width: width,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },

  image: {
    width: '100%',
    height: HEIGHT(47),
    alignSelf: 'center',
    marginTop: HEIGHT(10),
  },

  bottomSection: {
    bottom: 0,
    height: HEIGHT(35),
    width: '100%',
  },

  bottomBg: {
    position: 'absolute',
    width: '100%',
    height: HEIGHT(40),
    bottom: 0,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: HEIGHT(2),
    paddingBottom: HEIGHT(3),
  },

  title: {
    fontSize: FONTSIZE(2.6),
    color: '#fff',
    textAlign: 'center',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  subtitle: {
    fontSize: FONTSIZE(2.2),
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '400',
    fontFamily: FONT.POPPINS_REGULAR,
    width: '90%',
    alignSelf: 'center',
  },

  dots: {
    flexDirection: 'row',
    marginTop: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    opacity: 0.5,
    borderRadius: 4,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WIDTH(88),
    marginTop: 25,
  },

  skipBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 30,
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  skipText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 18,
  },

  nextBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
  },

  nextText: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 18,
    color: '#3AA171',
    marginRight: 5,
  },
  backBtn: {
    position: 'absolute',
    top: HEIGHT(4),
    left: WIDTH(2),
    height: 40,
    width: 40,

    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  nextContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
