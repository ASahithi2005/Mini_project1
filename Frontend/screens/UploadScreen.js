import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadAndParseImage } from '../api/prescriptionApi';

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // ✅ Correct media type
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const response = await uploadAndParseImage(image.base64);

      if (response.success) {
        navigation.navigate('Result', {
          data: response.data,
          ocr_text: response.ocr_text,
        });
      } else {
        Alert.alert('Upload Failed', response.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Upload error', error);
      Alert.alert('Upload Error', 'Something went wrong while uploading.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />

      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button
          title="Upload to Extract"
          onPress={handleUpload}
          disabled={!image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  image: {
    width: 220, height: 220, marginVertical: 20, borderRadius: 8,
  },
});
