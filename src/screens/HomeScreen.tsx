import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
  ImageBackground,
  Platform,
  Pressable,
  FlatList,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const STORAGE_KEY = 'saved_moments';

const predefinedImages = {
  predefined_1: require('../assets/placeholder_image.png'),
  predefined_2: require('../assets/placeholder_image2.png'),
  predefined_3: require('../assets/placeholder_image3.png'),
  predefined_4: require('../assets/placeholder_image4.png'),
  predefined_5: require('../assets/placeholder_image5.png'),
  predefined_6: require('../assets/placeholder_image6.png'),
};

type MomentItem = {
  id: string;
  title: string;
  date: string; 
  time?: string;
  note?: string;
  textColor?: string;
  image?: string;
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Days Until' | 'Days Since'>('All');
  const [moments, setMoments] = useState<MomentItem[]>([]);
  const isFocused = useIsFocused();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const loadMoments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMoments(Array.isArray(parsed) ? parsed : []);
      } else {
        setMoments([]);
      }
    } catch (e) {
      console.log('Error loading moments:', e);
      setMoments([]);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadMoments();

      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this awesome app!',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMoment = useCallback(async (id: string) => {
    try {
      const updatedMoments = moments.filter(m => m.id !== id);
      setMoments(updatedMoments);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMoments));
    } catch (error) {
      console.log('Error deleting moment:', error);
    }
  }, [moments]);

  const handleTerms = () => {
    Linking.openURL('https://www.termsfeed.com/live/4dc35f59-8d97-4b79-ab37-b34f777a23ae');
  };

  const getFilteredMoments = () => {
    if (activeTab === 'All') return moments;
    const now = dayjs();
    return moments.filter(m => {
      const diff = dayjs(m.date).diff(now, 'day');
      if (activeTab === 'Days Until') return diff >= 0;
      if (activeTab === 'Days Since') return diff < 0;
      return true;
    });
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
  
  const renderMoment = ({ item }: { item: MomentItem }) => {
    const now = dayjs();
    const eventDate = dayjs(item.date);
    const diffDays = eventDate.diff(now, 'day');
    const isFuture = diffDays >= 0;

    const imageSource = renderImageSource(item.image);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MomentDetails', {
            moment: {
              ...item,
              image: imageSource,
              imageSourceKey: item.image,
            },
            onDelete: handleDeleteMoment,
          })
        }
      >
        <View style={styles.card}>
          <Image
            source={imageSource}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDate}>{eventDate.format('dddd, DD MMMM YYYY')}</Text>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: isFuture ? '#00AEEF' : '#F7931E' }]}
          >
            <Text style={styles.counterText}>{Math.abs(diffDays)}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background_home.png')}
      style={styles.background}
    >
      {menuVisible && (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuVisible(false)} />
      )}

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Track what matters{'\n'}beneath the cosmic pulse
          </Text>

          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Image
              source={require('../assets/settings_icon.png')}
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={handleShare} style={styles.menuItem}>
              <Text style={styles.menuText}>Share the App</Text>
            </TouchableOpacity>
            <View style={{ height: 5 }} />
            <TouchableOpacity onPress={handleTerms} style={styles.menuItem}>
              <Text style={styles.menuText}>Terms of Use</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tabs}>
          {['All', 'Days Until', 'Days Since'].map((label) => {
            const isActive = label === activeTab;
            return (
              <TouchableOpacity
                key={label}
                onPress={() => setActiveTab(label as any)}
                style={[styles.tabButton, !isActive && styles.inactiveTab]}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#F6D600', '#EB9D06']}
                    style={styles.tabGradient}
                  >
                    <Text style={styles.activeTabText}>{label}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.inactiveTabText}>{label}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {moments.length === 0 ? (
          <Image
            source={require('../assets/no_moments.png')}
            style={styles.noMomentsImage}
          />
        ) : (
          <FlatList
            data={getFilteredMoments()}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderMoment}
            contentContainerStyle={styles.list}
          />
        )}

        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
            <Image
              source={require('../assets/stories_icon.png')}
              style={styles.bottomIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddMoment')}>
            <Image
              source={require('../assets/add_icon.png')}
              style={styles.bottomIcon}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F6AE29',
    marginRight: 10,
  },
  settingsIcon: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  menuBox: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 115 : 100,
    right: 20,
    backgroundColor: '#F6D600',
    padding: 10,
    borderRadius: 16,
    zIndex: 100,
  },
  menuItem: {
    alignItems: 'flex-start',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 5,
  },
  tabButton: {
    width: 115,
    height: 38,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveTab: {
    backgroundColor: '#012652',
  },
  inactiveTabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noMomentsImage: {
    width: 345,
    height: 282,
    alignSelf: 'center',
    marginTop: 50,
  },
  list: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#012652',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: width / 2 - 40,
    resizeMode: 'cover',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  cardDate: {
    color: '#ccc',
    fontSize: 12,
  },
  counterButton: {
    marginTop: 6,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  counterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    gap: 20,
  },
  bottomIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});