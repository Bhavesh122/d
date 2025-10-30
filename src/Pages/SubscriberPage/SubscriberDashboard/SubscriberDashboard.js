import React, { useState, useEffect } from 'react';
import SubscriptionRequestComponent from '../SubscriptionRequestComponent/SubscriptionRequestComponent';
import DownloadReportComponent from '../DownloadReport/DownloadReportComponent';
import SubscriptionDashboard from '../SubscriptionStatusPage/SubsciptionDashboard';
import SubscriberNotification from '../SubscriberNotification/SubscriberNotification';
import SubscriberProfile from '../Profile/SubscriberProfile';
import { LogOut } from 'lucide-react';
import '../../AdminPage/AdminDashBoard/Dashboard.css';
import './SubscriberDashboard.css';
import subscriptionService from '../../../services/subscriptionService';
import folderService from '../../../services/folderService';

const SubscriberDashboard = ({ navigate: navigateToPage }) => {
    const [view, setView] = useState('dashboard');
    const [open, setOpen] = useState(true);
    const [subscriptions, setSubscriptions] = useState([]);
    const [reports, setReports] = useState([]);
    const [rawFiles, setRawFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        navigateToPage('landing');
    };

    const user = { name: 'Tony Stark', email: 'tony3000@stark.com', role: 'Subscriber' };
    
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                // fetch subscriptions for user
                const subs = await subscriptionService.getRequestsByUser(user.email);
                setSubscriptions(Array.isArray(subs) ? subs : (subs.subscriptions || []));
                // fetch accessible files for user
                const files = await folderService.getUserAccessibleFiles(user.email);
                setRawFiles(Array.isArray(files) ? files : []);
                // normalize to match DownloadReportComponent display: remove prefix before underscore and extension
                const normalized = (files || []).map((f, idx) => {
                    const original = f.name || '';
                    const underscoreIdx = original.indexOf('_');
                    const afterPrefix = underscoreIdx >= 0 ? original.substring(underscoreIdx + 1) : original;
                    const lastDot = afterPrefix.lastIndexOf('.');
                    const display = lastDot > 0 ? afterPrefix.substring(0, lastDot) : afterPrefix;
                    return {
                        id: idx + 1,
                        title: display,
                        domain: f.folder
                    };
                });
                setReports(normalized);
            } catch (e) {
                setSubscriptions([]);
                setReports([]);
                setRawFiles([]);
            } finally {
                setLoading(false);
            }
        };
        load();
        const t = setInterval(load, 15000);
        return () => clearInterval(t);
    }, []);

    const approvedDomains = subscriptions
        .filter(s => (s.status || '').toUpperCase() === 'APPROVED')
        .map(s => s.domain || s.domainName || s.folder || s.category)
        .filter(Boolean);
    const filteredReports = reports.filter(r => approvedDomains.includes(r.domain));

    const nav = [
        { name: 'Dashboard', view: 'dashboard' },
        { name: 'My Subscriptions', view: 'subscriptions' },
        { name: 'Request Subscription', view: 'request' },
        { name: 'Download Reports', view: 'downloads' },
        { name: 'Profile', view: 'profile' }
    ];

    const renderContent = () => {
        if (view === 'subscriptions') return <SubscriptionDashboard subscriptions={subscriptions} />;
        if (view === 'request') return <SubscriptionRequestComponent subscriptions={subscriptions} />;
        if (view === 'downloads') return <DownloadReportComponent reports={reports} subscriptions={subscriptions} />;
        if (view === 'profile') return <SubscriberProfile userEmail={user.email} />;

        return (
            <>
                <h1>Dashboard</h1>
                <p className="subtitle">Welcome back, {user.name}</p>
                <div className="stats">
                    <div className="card"><div><p className="label">Active Subscriptions</p><h2>{approvedDomains.length}</h2></div></div>
                    <div className="card"><div><p className="label">Pending Requests</p><h2>{subscriptions.filter(s => s.status === 'PENDING').length}</h2></div></div>
                    <div className="card"><div><p className="label">Available Reports</p><h2>{reports.length}</h2></div></div>
                    <div className="card"><div><p className="label">Rejected Requests</p><h2>{subscriptions.filter(s => s.status === 'REJECTED').length}</h2></div></div>
                </div>
                <div className="grid">
                    <div className="card">
                        <div className="header">
                            <div><h3> My Subscriptions</h3><p>Approved and pending domains</p></div>
                            <button onClick={() => setView('subscriptions')}>View all</button>
                        </div>
                        <table>
                            <thead><tr><th>Domain</th><th>Status</th></tr></thead>
                            <tbody>
                                {(subscriptions || []).slice(0, 5).map(s => {
                                    const dom = s.domain || s.domainName || s.folder || s.category || '—';
                                    const status = (s.status || '').toString();
                                    return (
                                        <tr key={s.id}><td className="bold">{dom}</td><td><span className={`badge ${status.toLowerCase()}`}>{status}</span></td></tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="card">
                        <div className="header">
                            <div><h3> Download Reports</h3><p>Reports for approved domains</p></div>
                            <button onClick={() => setView('downloads')}>View all</button>
                        </div>
                        <table>
                            <thead><tr><th>Title</th><th>Domain</th></tr></thead>
                            <tbody>
                                {(reports || []).slice(0, 5).map(r => (
                                    <tr key={r.id}><td className="bold">{r.title}</td><td>{r.domain}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="dash">
            <div className={`side ${open ? 'open' : ''}`}>
                <div className="side-head">
                    <span className="logo-icon"></span>
                    <div><h2>RW Tool</h2><p>Subscriber Panel</p></div>
                </div>
                <div className="side-nav">
                    <p className="nav-label">Navigation</p>
                    {nav.map((n, i) => (
                        <button key={i} onClick={() => setView(n.view)} className={`nav-btn ${view === n.view ? 'active' : ''}`}>
                            <span>{n.icon}</span>{n.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="main">
                <div className="top">
                    <button onClick={() => setOpen(!open)} className="menu">☰</button>
                    <div className="actions">
                        <SubscriberNotification
                            userEmail={user.email}
                            subscriptions={subscriptions}
                            files={rawFiles}
                            approvedDomains={approvedDomains}
                        />
                        <button onClick={logout} className="logout-btn">
                            <LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>
                </div>
                <div className="content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default SubscriberDashboard;