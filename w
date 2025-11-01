import axios from 'axios';

// Simple user session management utility
// This works with your existing backend and token system

const USER_SESSION_KEY = 'currentUserSession';
const API_BASE_URL = 'http://localhost:8080/api';

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
        // Also clear the auth token
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Error clearing user session:', error);
    }
};

// Update user session (for profile updates)
export const updateUserSession = async (updatedInfo) => {
    try {
        const currentSession = getUserSession();
        if (currentSession) {
            // Update user profile in backend
            await updateUserProfile(currentSession.email, updatedInfo);
            
            // Update local session
            const updatedSession = { ...currentSession, ...updatedInfo };
            setUserSession(updatedSession);
            return updatedSession;
        }
        return null;
    } catch (error) {
        console.error('Error updating user session:', error);
        throw error;
    }
};

// Fetch user data from backend
export const fetchUserData = async (email) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/profile/${email}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

// Update user profile in backend
export const updateUserProfile = async (email, profileData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_BASE_URL}/users/profile/${email}`, profileData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// Login user and fetch their profile data
export const loginUser = async (email, password, role) => {
    try {
        // First authenticate with backend
        const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
            role
        });

        const { token, user } = authResponse.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Store user session
        setUserSession(user);
        
        return user;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};
