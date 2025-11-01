import React, { useState, useEffect } from 'react';
import { Mail, Phone, Briefcase, Edit2, Save, X } from 'lucide-react';
import { getUserSession, updateUserSession, fetchUserData } from '../../../utils/userSession';
import './SubscriberProfile.css';

const SubscriberProfile = () => {
    const [editing, setEditing] = useState(false);
    const [data, setData] = useState({
        name: '', email: '', phone: '', domain: '', department: ''
    });
    const [temp, setTemp] = useState({ ...data });
    const [loading, setLoading] = useState(true);

    // Load user data from session and refresh from backend when component mounts
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const currentUser = getUserSession();
            if (currentUser) {
                // Try to fetch fresh data from backend
                try {
                    const freshUserData = await fetchUserData(currentUser.email);
                    const userData = {
                        name: freshUserData.name || '',
                        email: freshUserData.email || '',
                        phone: freshUserData.phone || '',
                        domain: freshUserData.domain || '',
                        department: freshUserData.department || ''
                    };
                    setData(userData);
                    setTemp(userData);
                } catch (error) {
                    // If backend fails, use session data as fallback
                    console.warn('Could not fetch fresh user data, using session data:', error);
                    const userData = {
                        name: currentUser.name || '',
                        email: currentUser.email || '',
                        phone: currentUser.phone || '',
                        domain: currentUser.domain || '',
                        department: currentUser.department || ''
                    };
                    setData(userData);
                    setTemp(userData);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { icon: Mail, label: 'Email', key: 'email', type: 'email' },
        { icon: Phone, label: 'Phone', key: 'phone', type: 'tel' },
        { icon: Briefcase, label: 'Domain', key: 'domain', type: 'text' }
    ];

    const handleSave = async () => {
        try {
            // Update the session and backend with new data
            await updateUserSession(temp);
            setData({ ...temp });
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const stats = [
        { label: 'Reports Downloaded', value: '142', color: '#0473BA' },
        { label: 'Favorite Reports', value: '3', color: '#38D200' }
    ];

    if (loading) {
        return (
            <div className="profile-container">
                <h1 className="profile-title">My Profile</h1>
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            </div>
        );
    }

    const currentUser = getUserSession();
    if (!currentUser) {
        return (
            <div className="profile-container">
                <h1 className="profile-title">My Profile</h1>
                <div style={{ textAlign: 'center', padding: '2rem' }}>Please log in to view your profile.</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h1 className="profile-title">My Profile</h1>
            <br></br>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="header-info">
                        {editing ? (
                            <input className="name-input" value={temp.name} 
                                onChange={(e) => setTemp({ ...temp, name: e.target.value })} />
                        ) : <h2>{data.name}</h2>}
                        <p>Subscriber</p>
                    </div>
                    {!editing ? (
                        <button className="btn-edit" onClick={() => { setEditing(true); setTemp({ ...data }); }}>
                            <Edit2 size={16} /> Edit
                        </button>
                    ) : (
                        <div className="edit-btns">
                            <button className="btn-save" onClick={handleSave}>
                                <Save size={16} /> Save
                            </button>
                            <button className="btn-cancel" onClick={() => { setTemp({ ...data }); setEditing(false); }}>
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="stats">
                    {stats.map((s, i) => (
                        <div key={i} className="stat" style={{ borderLeftColor: s.color }}>
                            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="info-section">
                    <h3>Personal Information</h3>
                    <div className="info-grid">
                        {fields.map((f, i) => (
                            <div key={i} className="info-item">
                                <div className="icon"><f.icon size={20} /></div>
                                <div>
                                    <label>{f.label}</label>
                                    {editing ? (
                                        <input type={f.type} value={temp[f.key]} 
                                            onChange={(e) => setTemp({ ...temp, [f.key]: e.target.value })} />
                                    ) : <p>{data[f.key]}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriberProfile;
