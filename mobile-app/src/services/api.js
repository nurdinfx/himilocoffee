import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 is the localhost address for Android emulators.
// Replace with your machine's local IP for physical devices.
const API_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
