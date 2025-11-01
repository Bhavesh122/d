// Simple user session management utility
// This works with your existing backend and token system

const USER_SESSION_KEY = 'currentUserSession';

// Store user session after successful login
export const setUserSession = (userInfo) => {
    try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userInfo));
    } catch (error) {
        console.error('Error storing user session:', error);
    }
};

// Get current user session
export const getUserSession = () => {
    try {
        const session = localStorage.getItem(USER_SESSION_KEY);
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Error retrieving user session:', error);
        return null;
    }
};

// Clear user session on logout
export const clearUserSession = () => {
    try {
        localStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
        console.error('Error clearing user session:', error);
    }
};

// Update user session (for profile updates)
export const updateUserSession = (updatedInfo) => {
    try {
        const currentSession = getUserSession();
        if (currentSession) {
            const updatedSession = { ...currentSession, ...updatedInfo };
            setUserSession(updatedSession);
            return updatedSession;
        }
        return null;
    } catch (error) {
        console.error('Error updating user session:', error);
        return null;
    }
};

// Default user data based on role (for demo purposes)
export const getDefaultUserData = (email, role) => {
    const userDefaults = {
        'user@rwtool.com': {
            name: 'Tony Stark',
            email: 'user@rwtool.com',
            phone: '+1 (555) 123-4567',
            domain: 'Finance',
            department: 'Engineering',
            role: 'user'
        },
        'admin@rwtool.com': {
            name: 'Steve Rogers',
            email: 'admin@rwtool.com',
            phone: '+1 (555) 987-6543',
            domain: 'Technology',
            department: 'Administration',
            role: 'admin'
        },
        'ops@rwtool.com': {
            name: 'Natasha Romanoff',
            email: 'ops@rwtool.com',
            phone: '+1 (555) 456-7890',
            domain: 'Operations',
            department: 'Operations',
            role: 'ops'
        }
    };

    return userDefaults[email] || {
        name: 'User',
        email: email,
        phone: '',
        domain: '',
        department: '',
        role: role
    };
};
