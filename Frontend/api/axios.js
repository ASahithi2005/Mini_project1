import axios from 'axios';

// 👇 Use your backend's IP + port
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // If on same PC browser
  // For phone, use your LAN IP like: http://192.168.xx.xx:8000
});

export default API;


