const API_BASE_URL = 'http://localhost:8080/api/profile';

const profileService = {
  getProfile: async (email) => {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },
  updateProfile: async (email, payload) => {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },
  incrementDownloads: async (email, count = 1) => {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(email)}/downloads/increment?count=${count}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to update downloads');
    return res.json();
  }
};

export default profileService;
