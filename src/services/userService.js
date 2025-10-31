import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';
const AUTH_API_BASE_URL = 'http://localhost:8080/api/auth';

const userService = {
  getByEmail: async (email) => {
    const res = await axios.get(`${API_BASE_URL}/${encodeURIComponent(email)}`);
    return res.data;
  },
  
  // Get total users count from Spring Boot backend
  getTotalUsersCount: async () => {
    try {
      console.log('Fetching users count from Spring Boot backend...');
      const res = await axios.get(`${AUTH_API_BASE_URL}/users/count`);
      console.log('Users count response:', res.data);
      return res.data.count || 0;
    } catch (error) {
      console.error('Error fetching total users count:', error);
      return 0;
    }
  }
};

export default userService;
