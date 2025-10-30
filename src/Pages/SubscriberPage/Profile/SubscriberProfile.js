import React, { useEffect, useState } from 'react';
import { Mail, Phone, Briefcase } from 'lucide-react';
import './SubscriberProfile.css';
import profileService from '../../../services/profileService';

const SubscriberProfile = () => {
    const [data, setData] = useState({ name: '', email: '', phone: '', domain: '', department: '', reportsDownloaded: 0, favoriteReports: 0 });
    const [temp, setTemp] = useState({ name: '', email: '', phone: '', domain: '', department: '' });

    // TODO: replace with auth user
    const currentUser = { name: 'Tony Stark', email: 'tony3000@stark.com' };

    useEffect(() => {
        const load = async () => {
            try {
                const profile = await profileService.getProfile(currentUser.email);
                setData(profile);
                setTemp({ name: profile.name || '', email: profile.email || '', phone: profile.phone || '', domain: profile.domain || '', department: profile.department || '' });
            } catch (e) {
                // ignore load error for now
            }
        };
        load();
    }, []);

    const saveField = async (key, value) => {
        try {
            const updated = await profileService.updateProfile(currentUser.email, { [key]: value });
            setData(updated);
        } catch (e) {
            // revert on failure
            setTemp(prev => ({ ...prev, [key]: data[key] }));
        }
    };

    const fields = [
        { icon: Mail, label: 'Email', key: 'email', type: 'email' },
        { icon: Phone, label: 'Phone', key: 'phone', type: 'tel' },
        { icon: Briefcase, label: 'Domain', key: 'domain', type: 'text' }
    ];

    const stats = [
        { label: 'Reports Downloaded', value: String(data.reportsDownloaded || 0), color: '#0473BA' },
        { label: 'Favorite Reports', value: String(data.favoriteReports || 0), color: '#38D200' }
    ];

    return (
        <div className="profile-container">
            <h1 className="profile-title">My Profile</h1>
            <br></br>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="header-info">
                        <input className="name-input" value={temp.name}
                            onChange={(e) => setTemp({ ...temp, name: e.target.value })}
                            onBlur={(e) => saveField('name', e.target.value)} />
                        <p>Subscriber</p>
                    </div>
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
                                    <input type={f.type} value={temp[f.key]}
                                        onChange={(e) => setTemp({ ...temp, [f.key]: e.target.value })}
                                        onBlur={(e) => saveField(f.key, e.target.value)} />
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