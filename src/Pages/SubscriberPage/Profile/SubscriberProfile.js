import React, { useState, useEffect } from 'react';
import { Mail, Phone, Briefcase, Edit2, Save, X } from 'lucide-react';
import './SubscriberProfile.css';
import userProfileService from '../../../services/userProfileService';

const SubscriberProfile = ({ userEmail }) => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        name: 'Subscriber', email: userEmail || '', phone: '',
        domain: '', department: '', reportsDownloaded: 0, favoriteReports: 0
    });
    const [temp, setTemp] = useState({ ...data });

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!userEmail) { setLoading(false); return; }
            try {
                setLoading(true);
                const profile = await userProfileService.get(userEmail);
                if (mounted) {
                    setData({
                        name: profile.name || 'Subscriber',
                        email: profile.email || userEmail,
                        phone: profile.phone || '',
                        domain: profile.domain || '',
                        department: profile.department || '',
                        reportsDownloaded: profile.reportsDownloaded ?? 0,
                        favoriteReports: profile.favoriteReports ?? 0
                    });
                    setTemp({
                        name: profile.name || 'Subscriber',
                        email: profile.email || userEmail,
                        phone: profile.phone || '',
                        domain: profile.domain || '',
                        department: profile.department || ''
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
        { icon: Mail, label: 'Email', key: 'email', type: 'email' },
        { icon: Phone, label: 'Phone', key: 'phone', type: 'tel' },
        { icon: Briefcase, label: 'Domain', key: 'domain', type: 'text' },
        { icon: Briefcase, label: 'Department', key: 'department', type: 'text' }
    ];

    const stats = [
        { label: 'Reports Downloaded', value: String(data.reportsDownloaded ?? 0), color: '#0473BA' },
        { label: 'Favorite Reports', value: String(data.favoriteReports ?? 0), color: '#38D200' }
    ];

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
                            <button className="btn-save" onClick={async () => {
                                const payload = {
                                    name: temp.name,
                                    phone: temp.phone,
                                    domain: temp.domain,
                                    department: temp.department
                                };
                                try {
                                    await userProfileService.update(data.email || userEmail, payload);
                                    setData((prev) => ({ ...prev, ...payload }));
                                } finally {
                                    setEditing(false);
                                }
                            }}>
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
                                            readOnly={f.key === 'email'}
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