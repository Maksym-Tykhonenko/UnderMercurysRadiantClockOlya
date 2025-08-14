import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Share,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width, height } = Dimensions.get('window');

const referenceWidth = 375;
const referenceHeight = 812;
const widthScaleFactor = width / referenceWidth;
const heightScaleFactor = height / referenceHeight;

const moderateScale = (size: number) => Math.round(size * widthScaleFactor);
const verticalScale = (size: number) => Math.round(size * heightScaleFactor);

const predefinedImages = {
  predefined_1: require('../assets/placeholder_image.png'),
  predefined_2: require('../assets/placeholder_image2.png'),
  predefined_3: require('../assets/placeholder_image3.png'),
  predefined_4: require('../assets/placeholder_image4.png'),
  predefined_5: require('../assets/placeholder_image5.png'),
  predefined_6: require('../assets/placeholder_image6.png'),
};

const renderImageSource = (image: any) => {
  if (!image) {
    return require('../assets/placeholder_image.png');
  }
  if (typeof image === 'string') {
    if (image.startsWith('predefined_')) {
      return predefinedImages[image as keyof typeof predefinedImages];
    }
    return { uri: image };
  }
  return image;
};

export default function MomentDetailsScreen({ route, navigation }: { route: any; navigation: any }) {
  const { moment, onDelete } = route.params;
  const [timeView, setTimeView] = useState<'days' | 'months' | 'time'>('days');
  const [timeDifference, setTimeDifference] = useState({
    days: 0,
    months: 0,
    time: '00:00:00',
  });

  const imageAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      imageAnim.setValue(0);
      buttonsAnim.setValue(0);

      Animated.sequence([
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const momentDate = new Date(moment.date);
      const diff = now.getTime() - momentDate.getTime();

      const totalSeconds = Math.floor(diff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      const months = Math.floor(totalDays / 30.44);
      const days = totalDays;

      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      const formatTime = (value: number) => (value < 10 ? `0${value}` : `${value}`);

      setTimeDifference({
        days: days,
        months: months,
        time: `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [moment.date]);

  const handleDelete = () => {
    Alert.alert(
      'Delete this Moment?',
      "This will remove the moment from Mercury's clock. Are you sure?",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete) onDelete(moment.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${moment.title}\n${new Date(moment.date).toDateString()}\n${moment.note || ''}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const renderValue = () => {
    switch (timeView) {
      case 'days':
        return <Text style={styles.value}>{timeDifference.days}</Text>;
      case 'months':
        return <Text style={styles.value}>{timeDifference.months}</Text>;
      case 'time':
        return <Text style={styles.value}>{timeDifference.time}</Text>;
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_home.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/back_icon.png')}
              style={styles.topIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Image
              source={require('../assets/divide.png')}
              style={styles.topIcon}
            />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.imageWrapper, { opacity: imageAnim, transform: [{ translateY: imageAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Image
            source={renderImageSource(moment.image)}
            style={styles.image}
          />
          <View style={styles.overlay}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{moment.title}</Text>
              <Text style={styles.date}>
                {new Date(moment.date).toDateString()}
              </Text>
            </View>

            <View style={styles.centerValue}>
              {renderValue()}
              <Text style={styles.valueLabel}>
                {timeView.charAt(0).toUpperCase() + timeView.slice(1)}
              </Text>
            </View>

            <View style={styles.switchRow}>
              <TouchableOpacity
                style={[styles.switchBtn, timeView === 'days' && styles.switchActive]}
                onPress={() => setTimeView('days')}
              >
                <Text style={styles.switchText}>Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchBtn, timeView === 'months' && styles.switchActive]}
                onPress={() => setTimeView('months')}
              >
                <Text style={styles.switchText}>Months</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchBtn, timeView === 'time' && styles.switchActive]}
                onPress={() => setTimeView('time')}
              >
                <Text style={styles.switchText}>Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: buttonsAnim, transform: [{ translateY: buttonsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('AddMoment', {
                editMode: true,
                momentData: {
                  ...moment,
                  image: typeof moment.image === 'string'
                    ? moment.image
                    : moment.imageSourceKey ?? null,
                },
              })
            }
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },
  topBar: {
    position: 'absolute',
    top: verticalScale(30),
    left: moderateScale(16),
    right: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topIcon: {
    width: moderateScale(26),
    height: moderateScale(26),
    tintColor: '#fff',
  },
  imageWrapper: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
    marginTop: verticalScale(20),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: verticalScale(10),
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(20),
  },
  title: {
    fontSize: verticalScale(22),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  date: {
    fontSize: verticalScale(16),
    color: '#fff',
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  centerValue: {
    position: 'absolute',
    top: '45%',
    alignItems: 'center',
  },
  value: { fontSize: verticalScale(48), fontWeight: 'bold', color: '#fff' },
  valueLabel: { fontSize: verticalScale(20), color: '#fff', marginTop: verticalScale(4) },
  switchRow: {
    flexDirection: 'row',
    gap: moderateScale(8),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: moderateScale(8),
    padding: moderateScale(4),
  },
  switchBtn: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(6),
  },
  switchActive: {
    backgroundColor: '#F6D600',
  },
  switchText: { color: '#fff', fontWeight: 'bold' },
  editButton: {
    backgroundColor: '#012652',
    width: width * 0.9,
    height: verticalScale(43),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  editText: { color: '#fff', fontWeight: 'bold', fontSize: verticalScale(16) },
  deleteButton: {
    backgroundColor: '#8B0000',
    width: width * 0.9,
    height: verticalScale(43),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  deleteText: { color: '#fff', fontWeight: 'bold', fontSize: verticalScale(16) },
});