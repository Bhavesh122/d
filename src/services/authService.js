import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data);
      }
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data);
      }
      throw error;
    }
  },

  // Get total registered users count
  getTotalUsersCount: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/count`);
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching total users count:', error);
      return 0;
    }
  }
};

export default authService;
