const API_BASE_URL = 'http://localhost:8080/api/notifications';

const notificationService = {
  list: async (userId) => {
    const res = await fetch(`${API_BASE_URL}?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },
  add: async (userId, { type, title, message }) => {
    const res = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, title, message })
    });
    if (!res.ok) throw new Error('Failed to create notification');
    return res.json();
  },
  markRead: async (userId, id) => {
    const res = await fetch(`${API_BASE_URL}/mark-read/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to mark read');
    return res.json();
  },
  markAllRead: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/mark-all-read?userId=${encodeURIComponent(userId)}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to mark all read');
    return res.json();
  },
  delete: async (userId, id) => {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete notification');
    return res.json();
  },
  clear: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/clear?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear notifications');
    return res.json();
  }
};

export default notificationService;
