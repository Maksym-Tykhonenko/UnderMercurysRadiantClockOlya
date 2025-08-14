import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground, 
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type SelectImageRouteProp = RouteProp<RootStackParamList, 'SelectImage'>;

const predefinedImages = [
  require('../assets/placeholder_image.png'),
  require('../assets/placeholder_image2.png'),
  require('../assets/placeholder_image3.png'),
  require('../assets/placeholder_image4.png'),
  require('../assets/placeholder_image5.png'),
  require('../assets/placeholder_image6.png'),
];

const backgroundImage = require('../assets/background_home.png');

const SelectImageScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'SelectImage'>>();
  const route = useRoute<SelectImageRouteProp>();
  const { onSelectImage } = route.params;

  const handleSelectPredefined = (index: number) => {
    onSelectImage({
      type: 'predefined',
      id: `predefined_${index + 1}` as keyof typeof predefinedImages,
      source: predefinedImages[index],
    });
    navigation.goBack();
  };

  const handleOpenGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        onSelectImage({
          type: 'uri',
          uri: response.assets[0].uri,
        });
        navigation.goBack();
      }
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
   
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Image source={require('../assets/back_icon.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Image</Text>
        <TouchableOpacity onPress={handleOpenGallery} style={styles.headerButton}>
          <Image
            source={require('../assets/gallery_icon.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={predefinedImages}
        numColumns={2}
        keyExtractor={(_, index) => `image_${index}`}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleSelectPredefined(index)}
            style={styles.card}
          >
            <Image source={item} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
};

export default SelectImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    color: '#F6D600',
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 5,
  },
  headerIcon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
  list: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  card: {
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 153,
    height: 222,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});