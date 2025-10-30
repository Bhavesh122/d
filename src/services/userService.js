import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

const userService = {
  getByEmail: async (email) => {
    const res = await axios.get(`${API_BASE_URL}/${encodeURIComponent(email)}`);
    return res.data;
  }
};

export default userService;
