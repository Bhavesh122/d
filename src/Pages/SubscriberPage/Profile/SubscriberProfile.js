import React, { useEffect, useState } from 'react';
import { Mail, Briefcase } from 'lucide-react';
import './SubscriberProfile.css';
import userService from '../../../services/userService';

const SubscriberProfile = ({ userEmail }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ name: '', email: userEmail || '', domain: '' });

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!userEmail) { setLoading(false); return; }
            try {
                setLoading(true);
                const user = await userService.getByEmail(userEmail);
                if (mounted) {
                    setData({
                        name: user.name || '',
                        email: user.email || userEmail,
                        domain: user.domain || ''
                    });
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [userEmail]);

    const fields = [
        { icon: Mail, label: 'Email', key: 'email' },
        { icon: Briefcase, label: 'Name', key: 'name' },
        { icon: Briefcase, label: 'Domain', key: 'domain' }
    ];

    const stats = [
        { label: 'Reports Downloaded', value: '—', color: '#0473BA' },
        { label: 'Favorite Reports', value: '—', color: '#38D200' }
    ];

    return (
        <div className="profile-container">
            <h1 className="profile-title">My Profile</h1>
            <br></br>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="header-info">
                        <h2>{data.name || '—'}</h2>
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
                                    <p>{data[f.key] || '—'}</p>
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