import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/profile';

const userProfileService = {
  get: async (email) => {
    const res = await axios.get(`${API_BASE_URL}/${encodeURIComponent(email)}`);
    return res.data;
  },
  update: async (email, payload) => {
    const res = await axios.put(`${API_BASE_URL}/${encodeURIComponent(email)}`, payload);
    return res.data;
  },
  incrementDownloads: async (email, count = 1) => {
    const res = await axios.post(`${API_BASE_URL}/${encodeURIComponent(email)}/downloads/increment`, null, {
      params: { count }
    });
    return res.data;
  }
};

export default userProfileService;
