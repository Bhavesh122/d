import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/routing';

const fileRoutingService = {
  // Get incoming files
  getIncomingFiles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/incoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incoming files:', error);
      return [];
    }
  },

  // Route a single file
  routeFile: async (fileName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/route-one?fileName=${encodeURIComponent(fileName)}`);
      return response.data;
    } catch (error) {
      console.error('Error routing file:', error);
      throw error;
    }
  },

  // Get active reports count from localStorage (sent files with ACTIVE status)
  getActiveReportsCount: () => {
    try {
      const SENT_ROWS_KEY = "fpm_sent_rows_v1";
      const raw = localStorage.getItem(SENT_ROWS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          // Count files that have been sent (all files in sentRows are active)
          return Object.keys(parsed).length;
        }
      }
      return 0;
    } catch (error) {
      console.error('Error fetching active reports count from localStorage:', error);
      return 0;
    }
  }
};

export default fileRoutingService;
