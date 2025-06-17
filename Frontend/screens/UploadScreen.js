import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageForOCR } from '../api/prescriptionApi';

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    try {
      const response = await uploadImageForOCR(image.base64);
      navigation.navigate('Result', { text: response.data.text });
    } catch (error) {
      console.error('Upload error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Upload to Extract" onPress={handleUpload} disabled={!image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: 200, height: 200, marginVertical: 20 },
});