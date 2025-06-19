import axios from 'axios';

// Replace with your LAN IP
const BASE_URL = 'http://192.168.1.42:8000';

export const uploadImageForOCR = async (base64Image) => {
  return axios.post(`${BASE_URL}/ocr/scan`, { image: base64Image });
};

export const parsePrescriptionText = async (text) => {
  return axios.post(`${BASE_URL}/parse`, { text });
};
