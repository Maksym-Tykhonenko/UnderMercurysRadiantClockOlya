import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMoment'>;

const STORAGE_KEY = 'saved_moments';

const predefinedImages = {
  predefined_1: require('../assets/placeholder_image.png'),
  predefined_2: require('../assets/placeholder_image2.png'),
  predefined_3: require('../assets/placeholder_image3.png'),
  predefined_4: require('../assets/placeholder_image4.png'),
  predefined_5: require('../assets/placeholder_image5.png'),
  predefined_6: require('../assets/placeholder_image6.png'),
};

export type SelectedImageType =
  | { type: 'predefined'; id: keyof typeof predefinedImages; source: any }
  | { type: 'uri'; uri: string };

const AddMomentScreen = ({ navigation, route }: Props) => {
  const { editMode = false, momentData = null } = route.params || {};

  const [title, setTitle] = useState(momentData?.title || '');
  const [date, setDate] = useState(momentData ? new Date(momentData.date) : new Date());
  const [time, setTime] = useState(momentData?.time ? new Date(momentData.time) : new Date());
  const [note, setNote] = useState(momentData?.note || '');
  const [textColor, setTextColor] = useState<string>(momentData?.textColor || '#F6D600');
  const [selectedImage, setSelectedImage] = useState<SelectedImageType | null>(
    momentData?.image
      ? (predefinedImages as any)[momentData.image]
        ? {
            type: 'predefined',
            id: momentData.image as keyof typeof predefinedImages,
            source: predefinedImages[momentData.image as keyof typeof predefinedImages],
          }
        : { type: 'uri', uri: momentData.image }
      : null
  );

  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const isFormValid = title.trim() !== '' || note.trim() !== '' || selectedImage !== null;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  const handleSelectedImageChange = (img: SelectedImageType) => {
    setSelectedImage(img);
  };

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fill in at least one field or select an image.');
      return;
    }

    let imageToSave: string | null = null;
    if (selectedImage) {
      if (selectedImage.type === 'predefined') {
        imageToSave = selectedImage.id;
      } else if (selectedImage.type === 'uri') {
        imageToSave = selectedImage.uri;
      }
    }

    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      let moments: any[] = existingData ? JSON.parse(existingData) : [];
      if (!Array.isArray(moments)) moments = [];

      if (editMode && momentData) {
        moments = moments.map((m) =>
          m.id === momentData.id
            ? {
                ...m,
                title: title.trim(),
                date: date.toISOString(),
                time: time.toISOString(),
                note: note.trim(),
                textColor,
                image: imageToSave,
              }
            : m
        );
      } else {
        const newMoment = {
          id: Date.now().toString(),
          title: title.trim(),
          date: date.toISOString(),
          time: time.toISOString(),
          note: note.trim(),
          textColor,
          image: imageToSave,
        };
        moments.push(newMoment);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error saving moment:', error);
      Alert.alert('Save Error', 'Failed to save the moment. Please try again.');
    }
  };

  const renderImageSource = () => {
    if (!selectedImage) {
      return require('../assets/placeholder_image.png');
    }
    if (selectedImage.type === 'predefined') {
      return selectedImage.source;
    }
    if (selectedImage.type === 'uri') {
      return { uri: selectedImage.uri };
    }
    return require('../assets/placeholder_image.png');
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
 
    if (Platform.OS === 'android') {
      setShowDateModal(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    } else {
      if (selectedDate) {
        setDate(selectedDate);
      }
    }
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowTimeModal(false);
      if (selectedTime) {
        setTime(selectedTime);
      }
    } else {
      if (selectedTime) {
        setTime(selectedTime);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_home.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
       
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image source={require('../assets/back_icon.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {editMode ? 'Edit a Radiant Moment' : 'Mark a Radiant Moment'}
            </Text>
          </View>

          <View style={styles.imageBlock}>
            <Image source={renderImageSource()} style={styles.image} />
          </View>

          <Text style={styles.label}>Select Image</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() =>
              navigation.navigate('SelectImage', {
                onSelectImage: handleSelectedImageChange,
              })
            }
          >
            <Text style={styles.inputText}>
              {selectedImage ? 'Image Selected' : 'Select Image'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Event Title</Text>
          <TextInput
            placeholder="Event Title"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Choose a Date</Text>
          <TouchableOpacity
            onPress={() => setShowDateModal(true)}
            style={[styles.input, styles.row]}
          >
            <Text style={styles.inputText}>{date.toDateString()}</Text>
            <Image source={require('../assets/calendar_icon.png')} style={styles.icon} />
          </TouchableOpacity>

          {Platform.OS === 'ios' ? (
            <Modal transparent visible={showDateModal} animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    style={{ backgroundColor: 'white' }}
                  />
                  <TouchableOpacity onPress={() => setShowDateModal(false)} style={styles.closeModalBtn}>
                    <Text style={styles.closeModalText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            showDateModal && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )
          )}

          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimeModal(true)}
            style={[styles.input, styles.row]}
          >
            <Text style={styles.inputText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Image source={require('../assets/icon_time.png')} style={styles.icon} />
          </TouchableOpacity>

          {Platform.OS === 'ios' ? (
            <Modal transparent visible={showTimeModal} animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    is24Hour
                    onChange={onTimeChange}
                    style={{ backgroundColor: 'white' }}
                  />
                  <TouchableOpacity onPress={() => setShowTimeModal(false)} style={styles.closeModalBtn}>
                    <Text style={styles.closeModalText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            showTimeModal && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                is24Hour
                onChange={onTimeChange}
              />
            )
          )}

          <Text style={styles.label}>Font Color</Text>
          <View style={styles.colorRow}>
            <TouchableOpacity
              onPress={() => setTextColor((prev: string) => (prev === '#F6D600' ? '#00F0FF' : '#F6D600'))}
              style={[styles.colorCircle, { backgroundColor: textColor }]}
            />
          </View>

          <Text style={styles.label}>Note</Text>
          <TextInput
            placeholder="Note"
            placeholderTextColor="#aaa"
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <TouchableOpacity
            style={[styles.saveButton, !isFormValid && { opacity: 0.5 }]}
            disabled={!isFormValid}
            onPress={handleSave}
          >
            <LinearGradient
              colors={['#F6D600', '#EB9D06']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradient, !isFormValid && { opacity: 0.5 }]}
            >
              <Text style={styles.saveButtonText}>{editMode ? 'Update' : 'Save'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

export default AddMomentScreen;

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollViewContainer: { flexGrow: 1, paddingVertical: 20 },
  container: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { color: '#F6D600', fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  backButton: { padding: 4 },
  backIcon: { width: 24, height: 24, tintColor: '#fff' },
  imageBlock: { alignItems: 'center', marginBottom: 12 },
  image: { width: 153, height: 222, borderRadius: 10 },
  label: { color: '#fff', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#012652', borderRadius: 10, padding: 12, color: 'white', marginBottom: 12 },
  inputText: { color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  icon: { width: 24, height: 24, tintColor: '#fff' },
  colorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  colorCircle: { width: 24, height: 24, borderRadius: 12 },
  saveButton: { marginTop: 10 },
  gradient: { borderRadius: 12, paddingVertical: 5, alignItems: 'center', height: 80, justifyContent: 'center' },
  saveButtonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center' },
  closeModalBtn: { marginTop: 10, backgroundColor: '#F6D600', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 8 },
  closeModalText: { color: '#000', fontWeight: 'bold' },
});