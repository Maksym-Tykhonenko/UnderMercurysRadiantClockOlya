import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const referenceWidth = 375;
const referenceHeight = 812; 
const widthScaleFactor = width / referenceWidth;
const heightScaleFactor = height / referenceHeight;

const isSmallScreen = height < 700;

const moderateScale = (size: number) => Math.round(size * widthScaleFactor);
const verticalScale = (size: number) => Math.round(size * heightScaleFactor);

const PAGES = [
  {
    background: require('../assets/background_onboarding.png'),
    title: 'Welcome to Under\nMercury’s Radiant\nClock',
    description: 'Mark your days beneath the\nglowing rhythm of the cosmos',
    button: 'Begin',
  },
  {
    background: require('../assets/background_onboarding2.png'),
    title: 'Count Days To and\nSince',
    description: 'Whether you\'re awaiting or\nremembering, Mercury keeps\nthe time',
    button: 'Next',
  },
  {
    background: require('../assets/background_onboarding3.png'),
    title: 'Track What Matters',
    description: 'Birthdays, journeys, anniversaries — all\nilluminated here',
    button: 'Next',
  },
  {
    background: require('../assets/background_onboarding4.png'),
    title: 'Discover Timeless\nStories',
    description: 'Explore cosmic tales and stellar facts\nthat shine through time',
    button: 'Next',
  },
  {
    background: require('../assets/background_onboarding5.png'),
    title: 'You Are the\nTimekeeper Now',
    description: 'Add your first moment and let\nMercury begin the count',
    button: 'Get Started',
  },
];

const OnboardingScreen = ({ navigation }: Props) => {
  const [pageIndex, setPageIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pageIndex]);

  const goNext = () => {
    if (pageIndex < PAGES.length - 1) {
      setPageIndex((prev) => prev + 1);
      opacity.setValue(0);
      translateX.setValue(50);
    } else {
      navigation.replace('Home');
    }
  };

  const skip = () => {
    navigation.replace('Home');
  };

  const isShiftedPage = [1, 3, 4].includes(pageIndex);
  const isSecondPage = pageIndex === 1;

  const negativeMarginBottom =
    isSecondPage && isSmallScreen
      ? moderateScale(-10)
      : isSecondPage
      ? moderateScale(-30)
      : 0;

  return (
    <View style={styles.backgroundWrapper}>
      <Image
        source={PAGES[pageIndex].background}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.safeArea}>
        {pageIndex < 4 && (
          <TouchableOpacity style={styles.skipButton} onPress={skip}>
            <Image
              source={require('../assets/close_icon.png')}
              style={styles.skipImage}
            />
          </TouchableOpacity>
        )}

        <View style={[styles.bottomContent, { marginBottom: negativeMarginBottom }]}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity,
                transform: [{ translateX }],
                marginTop: isShiftedPage
                  ? verticalScale(40)
                  : verticalScale(20),
              },
            ]}
          >
            <MaskedView
              maskElement={
                <Text style={styles.titleMasked}>
                  {PAGES[pageIndex].title}
                </Text>
              }
            >
              <LinearGradient
                colors={['#F6D600', '#EB9D06']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.titleMasked, { opacity: 0 }]}>
                  {PAGES[pageIndex].title}
                </Text>
              </LinearGradient>
            </MaskedView>

            <Text style={styles.description}>{PAGES[pageIndex].description}</Text>

            <TouchableOpacity onPress={goNext} style={styles.button}>
              <LinearGradient
                colors={['#F6D600', '#EB9D06']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonBackground}
              >
                <Text style={styles.buttonText}>
                  {PAGES[pageIndex].button}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  backgroundWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(30),
  },
  content: {
    width: width - moderateScale(40),
    alignItems: 'center',
  },
  titleMasked: {
    fontSize: verticalScale(32),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: verticalScale(18),
    color: 'white',
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(28),
  },
  button: {
    width: width - moderateScale(80),
    height: verticalScale(44),
    borderRadius: moderateScale(50),
    overflow: 'hidden',
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(50),
  },
  buttonText: {
    fontSize: verticalScale(16),
    fontWeight: '600',
    color: 'black',
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(20),
    right: moderateScale(24),
    zIndex: 10,
  },
  skipImage: {
    width: moderateScale(32),
    height: moderateScale(32),
    opacity: 1,
    resizeMode: 'contain',
  },
});