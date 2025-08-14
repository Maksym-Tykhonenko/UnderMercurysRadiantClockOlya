import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type RouteProps = RouteProp<RootStackParamList, 'StoryDetail'>;

const StoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { title, content } = route.params;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${title}\n\n${content}`,
      
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
       
        } else {
        
        }
      } else if (result.action === Share.dismissedAction) {

      }
    } catch (error: unknown) { 
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_home.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
              source={require('../assets/back_icon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.shareButton}>
            <Image
              source={require('../assets/share_icon.png')}
              style={styles.shareIcon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{content}</Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default StoryDetailScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scroll: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EB9D06',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
  },
  backButton: {
    padding: 10,
    marginTop: 10,
  },
  backIcon: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  shareButton: {
    padding: 10,
    marginTop: 10,
  },
  shareIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});