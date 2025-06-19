import axios from 'axios';

// ⚠️ Replace this with your backend LAN IP (use if running on mobile)
const BASE_URL = 'http://127.0.0.1:8000';  // or 127.0.0.1 if testing on same PC

// 🔁 Combined OCR + Parsing API
export const uploadAndParseImage = async (base64Image) => {
  try {
    const response = await axios.post(`${BASE_URL}/parse-image/`, {
      image: base64Image,
    });

    return response.data;  // { success: true, ocr_text, data }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
};
