import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SMS from 'expo-sms';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission denied to access gallery');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission denied to access camera');

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendSMS = async () => {
    const available = await SMS.isAvailableAsync();
    if (!available) return Alert.alert('SMS not supported');
    await SMS.sendSMSAsync(['1234567890'], 'Hello from my app!');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/home-wallpaper.jpg')} 
      style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 10 }}>
        Welcome Home
      </Text>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
        />
      )}

      {/* Bottom Dock Icons */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: 10,
          flexWrap:'wrap'
        }}
      >

        <TouchableOpacity onPress={sendSMS}>
        <Ionicons name="call-outline" size={32} color="#4caf50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={sendSMS}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#4caf50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={openCamera}>
          <Ionicons name="camera-outline" size={32} color="#2196f3" />
        </TouchableOpacity>

        <TouchableOpacity onPress={openGallery}>
          <MaterialIcons name="photo-library" size={32} color="#9c27b0" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/MapScreen')}>
          <FontAwesome5 name="map-marked-alt" size={32} color="#f44336" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Settings')}>
      <Ionicons name="settings-outline" size={28} color="#607d8b" />
      </TouchableOpacity>

    </ImageBackground>
  );
}
