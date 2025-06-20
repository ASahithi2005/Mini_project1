import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { uploadAndParseImage } from '../api/prescriptionApi';

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (type) => {
    let result;
    
    try {
      if (type === 'camera') {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
          Alert.alert('Permission required', 'Camera access is needed to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });
      }

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access image: ' + error.message);
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
      <Text style={styles.title}>Upload Prescription</Text>
      <Text style={styles.subtitle}>Take a photo or select from gallery</Text>

      {/* Image Source Selection */}
      {!image && (
        <View style={styles.sourceButtons}>
          <TouchableOpacity 
            style={styles.sourceButton}
            onPress={() => pickImage('camera')}
          >
            <MaterialIcons name="photo-camera" size={32} color="#1E88E5" />
            <Text style={styles.sourceButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sourceButton}
            onPress={() => pickImage('gallery')}
          >
            <Ionicons name="images" size={32} color="#1E88E5" />
            <Text style={styles.sourceButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Image Preview */}
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <View style={styles.imageActionRow}>
            <TouchableOpacity 
              style={styles.imageActionButton}
              onPress={() => pickImage('camera')}
            >
              <MaterialIcons name="camera-alt" size={20} color="#1E88E5" />
              <Text style={styles.imageActionText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.imageActionButton}
              onPress={() => pickImage('gallery')}
            >
              <Ionicons name="swap-horizontal" size={20} color="#1E88E5" />
              <Text style={styles.imageActionText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Upload Button */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Analyzing your prescription...</Text>
        </View>
      ) : (
        image && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
          >
            <Text style={styles.uploadButtonText}>Extract Prescription Data</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 32,
    textAlign: 'center',
  },
  sourceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sourceButton: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  sourceButtonText: {
    color: '#ffffff',
    marginTop: 12,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'contain',
    backgroundColor: '#1e1e1e',
  },
  imageActionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  imageActionText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 10,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    color: '#aaaaaa',
    marginTop: 16,
  },
});