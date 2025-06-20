import axios from 'axios';
import { Platform } from 'react-native';

// ✅ Use your actual LAN IP when testing on a physical device
const BASE_URL =
  Platform.OS === 'android' || Platform.OS === 'ios'
    ? 'http://192.168.0.106:8000' // 👈 Your PC's IP on Wi-Fi
    : 'http://127.0.0.1:8000';      // 👈 Localhost for browser/emulator

// 🔁 Combined OCR + Parsing API
export const uploadAndParseImage = async (base64Image) => {
  try {
    const response = await axios.post(`${BASE_URL}/parse-image/`, {
      image: base64Image,
    });

    return response.data; // { success: true, ocr_text, data }
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
};
