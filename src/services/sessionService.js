const storageKey = 'current_user_email';

const sessionService = {
  getEmail: () => {
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  },
  setEmail: (email) => {
    try {
      if (email) localStorage.setItem(storageKey, email);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }
};

export default sessionService;
