import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';


type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const LoadingScreen = ({ navigation }: Props) => {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
    ]).start();

  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/loader_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.Image
        source={require('../assets/loading_sun.png')}
        style={[
          styles.sunImage,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
        resizeMode="contain"
      />
    </ImageBackground>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunImage: {
    width: 250,
    height: 260,
  },
});
