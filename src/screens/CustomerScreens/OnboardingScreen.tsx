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

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
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
      <Image source={item.image} style={styles.image} resizeMode="contain" />

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
            {slides.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <View style={styles.nextContent}>
                <Text style={styles.nextText}>
                  {currentIndex === 2 ? 'Start' : 'Next'}
                </Text>

                <View style={{ justifyContent: 'center' }}>
                  <NextIcon
                    width={20}
                    height={20}
                    style={{ marginBottom: 3 }}
                  />
                </View>
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
  },

  image: {
    width: '100%',
    height: HEIGHT(50),
    alignSelf: 'center',
    marginTop: HEIGHT(10),
  },

  bottomSection: {
    position: 'absolute',
    bottom: 0,
    height: HEIGHT(42),
    width: '100%',
  },

  bottomBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  },

  dots: {
    flexDirection: 'row',
    marginTop: 20,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#fff',
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
    paddingVertical: 6,
    borderRadius: 20,
  },

  skipText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 18,
  },

  nextBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
  },

  nextText: {
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 18,
    color: '#3AA171',
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
    gap: 6,
    justifyContent: 'center',
  },
});
