import axios from 'axios';
const BASE_URL = 'http://<your-ip>:8000'; // Replace with your local or hosted FastAPI backend

export const uploadImageForOCR = async (base64Image) => {
  return axios.post(`${BASE_URL}/ocr/scan`, { image: base64Image });
};

export const parsePrescriptionText = async (text) => {
  return axios.post(`${BASE_URL}/nlp/parse`, { text });
};
