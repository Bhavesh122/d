import React, { useState } from 'react';
import {
    LogOut,
    RefreshCw,
    Database,
    AlertCircle,
    FileText,
    Shield,
    Calendar,
} from 'lucide-react';
import './OpsDashboard.css';

const OpsDashboard = ({ navigate }) => {
    const user = { name: 'Ramesh', role: 'operations' };
    const logout = () => navigate('landing');

    const [activeFilter, setActiveFilter] = useState('Today');
    const [selectedOrganization, setSelectedOrganization] = useState('All Organizations');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('monitoring');
    const [sidebarOpen,
        setSidebarOpen] = useState(true);

    const storageConnections = [
        { id: 1, name: 'AWS S3', organization: 'Finance Dept', status: 'active', lastSync: '2 mins ago', reports: 12 },
        { id: 2, name: 'Azure Blob', organization: 'Risk Management', status: 'active', lastSync: '5 mins ago', reports: 8 },
        { id: 3, name: 'Google Cloud', organization: 'Operations', status: 'syncing', lastSync: 'Running', reports: 15 },
    ];

    const pendingValidation = [
        { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', source: 'AWS S3', size: '2.4 MB', uploaded: '10 Oct, 11:32', status: 'validating', format: 'PDF', integrity: 'Pass' },
        { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', source: 'Azure Blob', size: '856 KB', uploaded: '10 Oct, 10:21', status: 'pending', format: 'Excel', integrity: 'Checking' },
        { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', source: 'Google Cloud', size: '1.8 MB', uploaded: '10 Oct, 10:02', status: 'validating', format: 'PDF', integrity: 'Pass' },
    ];

    const syncJobs = [
        { id: 1, source: 'AWS S3', organization: 'Finance', status: 'completed', progress: 100, files: 12, time: '2 mins ago' },
        { id: 2, source: 'Google Cloud', organization: 'Operations', status: 'in-progress', progress: 67, files: 8, time: 'Running' },
        { id: 3, source: 'Azure Blob', organization: 'Risk', status: 'pending', progress: 0, files: 15, time: 'Scheduled' },
        { id: 4, source: 'Local Storage', organization: 'Archive', status: 'failed', progress: 45, files: 5, time: '10 mins ago' },
    ];

    const publishedReports = [
        { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', publishedAt: '10 Oct, 11:32', subscribers: 45, notifications: 'Sent', downloads: 38 },
        { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', publishedAt: '10 Oct, 10:21', subscribers: 32, notifications: 'Sent', downloads: 28 },
        { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', publishedAt: '10 Oct, 10:02', subscribers: 28, notifications: 'Pending', downloads: 0 },
    ];

    const failedOperations = syncJobs.filter((job) => job.status === 'failed');

    const getStatusBadge = (status) => {
        const styles = {
            base: { padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, border: '1px solid' },
            completed: { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
            'in-progress': { background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
            failed: { background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
            pending: { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
            validating: { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' },
        };
        return <span style={{ ...styles.base, ...(styles[status] || styles.pending) }}>{status}</span>;
    };

    const progressBar = (value, status) => {
        let barColor = '#10b981';
        if (status === 'in-progress') barColor = '#0473EA';
        if (status === 'failed') barColor = '#dc2626';
        return (
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${value}%`, background: barColor }} />
            </div>
        );
    };

    return (
        <div className="dash">
            {/* Sidebar */}
            <div className={`side ${sidebarOpen ? 'open' : ''}`}>
                <div className="side-head">
                    <span className="logo-icon"></span>
                    <div>
                        <h2>RW Tool</h2>
                        <p>Operations Panel</p>
                    </div>
                </div>
                <div className="side-nav">
                    <p className="nav-label">Operations</p>
                    {[
                        { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 18, height: 18 }} /> },
                        { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 18, height: 18 }} /> },
                        { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 18, height: 18 }} /> },
                        { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 18, height: 18 }} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="main">
                <div className="top">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu">☰</button>
                    <div className="actions">
                        <button onClick={logout} className="logout-btn">
                            <LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="content">
                    {/* Header Actions */}
                    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#111' }}>Operations Dashboard</h2>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: 15 }}>
                                Data bridge between remote storage and RW Tool system
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '10px 18px',
                                    borderRadius: 8,
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    color: '#333',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                <Calendar style={{ width: 16, height: 16 }} />
                                Schedule Sync
                            </button>
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '10px 18px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: '#0473EA',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                <RefreshCw style={{ width: 16, height: 16 }} />
                                Sync All
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                        {[
                            {
                                label: 'Active Connections',
                                value: storageConnections.filter((s) => s.status === 'active').length,
                                icon: <Database style={{ width: 20, height: 20, color: '#0473EA' }} />,
                            },
                            { label: 'Pending Validation', value: pendingValidation.length, icon: <Shield style={{ width: 20, height: 20, color: '#f59e0b' }} /> },
                            { label: 'Sync Jobs Today', value: '48', icon: <RefreshCw style={{ width: 20, height: 20, color: '#10b981' }} /> },
                            { label: 'Published Reports', value: publishedReports.length, icon: <FileText style={{ width: 20, height: 20, color: '#8b5cf6' }} /> },
                            { label: 'Failed Operations', value: failedOperations.length, icon: <AlertCircle style={{ width: 20, height: 20, color: '#dc2626' }} /> },
                        ].map((stat) => (
                            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: 13, fontWeight: 500 }}>{stat.label}</p>
                                    {stat.icon}
                                </div>
                                <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#111' }}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[
                                { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 16, height: 16 }} /> },
                                { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 16, height: 16 }} /> },
                                { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 16, height: 16 }} /> },
                                { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 16, height: 16 }} /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '12px 20px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: activeTab === tab.id ? '#0473EA' : '#6b7280',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 600 : 500,
                                        fontSize: 14,
                                        borderBottom: activeTab === tab.id ? '3px solid #0473EA' : '3px solid transparent',
                                        marginBottom: '-2px',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {['Today', 'Last 7 days', 'Last 30 days'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: activeFilter === filter ? '2px solid #0473EA' : '1px solid #e5e7eb',
                                    background: activeFilter === filter ? '#eff6ff' : '#fff',
                                    color: activeFilter === filter ? '#0473EA' : '#6b7280',
                                    cursor: 'pointer',
                                    fontWeight: activeFilter === filter ? 600 : 500,
                                    fontSize: 14,
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                        <select
                            value={selectedOrganization}
                            onChange={(e) => setSelectedOrganization(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                color: '#333',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            <option>All Organizations</option>
                            <option>Finance</option>
                            <option>Risk Management</option>
                            <option>Operations</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search reports or sources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                fontSize: 14,
                                flex: 1,
                                minWidth: 200,
                            }}
                        />
                    </div>

                    {/* Monitoring Tab */}
                    {activeTab === 'monitoring' && (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Remote Storage Connections</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    Monitor connected storage sources and detect new reports
                                </p>
                            </div>
                            <div style={{ padding: '20px' }}>
                                {storageConnections.map((conn) => (
                                    <div
                                        key={conn.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: 10,
                                            padding: '16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 16,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 10,
                                                    background: '#eff6ff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Database style={{ width: 24, height: 24, color: '#0473EA' }} />
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#111' }}>{conn.name}</p>
                                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                    {conn.organization} • {conn.reports} reports • Last sync: {conn.lastSync}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <span
                                                style={{
                                                    padding: '6px 14px',
                                                    borderRadius: 16,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    background: conn.status === 'active' ? '#d1fae5' : '#fef3c7',
                                                    color: conn.status === 'active' ? '#065f46' : '#92400e',
                                                }}
                                            >
                                                {conn.status === 'active' ? 'Active' : 'Syncing'}
                                            </span>
                                            <button
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: 6,
                                                    border: '1px solid #e5e7eb',
                                                    background: '#fff',
                                                    color: '#333',
                                                    cursor: 'pointer',
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Check for Updates
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sync Tab */}
                    {activeTab === 'sync' && (
                        <div>
                            {failedOperations.length > 0 && (
                                <div
                                    style={{
                                        background: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: 12,
                                        padding: '20px',
                                        marginBottom: 24,
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#991b1b' }}>
                                            {failedOperations.length} failed operation
                                        </p>
                                        <button
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: 6,
                                                border: '1px solid #dc2626',
                                                background: '#fff',
                                                color: '#dc2626',
                                                cursor: 'pointer',
                                                fontSize: 13,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Retry all failed
                                        </button>
                                    </div>
                                    {failedOperations.map((op) => (
                                        <div
                                            key={op.id}
                                            style={{
                                                background: '#fff',
                                                border: '1px solid #fecaca',
                                                borderRadius: 8,
                                                padding: '16px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>
                                                    {op.source} – {op.organization}
                                                </p>
                                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                    {op.files} files · {op.time}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                {getStatusBadge('failed')}
                                                <button
                                                    style={{
                                                        padding: '6px 14px',
                                                        borderRadius: 6,
                                                        border: '1px solid #e5e7eb',
                                                        background: '#fff',
                                                        color: '#333',
                                                        cursor: 'pointer',
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Sync Operations</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>Fetch and transfer reports from remote storage</p>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    {syncJobs.map((job) => (
                                        <div key={job.id} style={{ marginBottom: 20 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>
                                                        {job.source} – {job.organization}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                        {job.files} files · {job.time}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    {getStatusBadge(job.status)}
                                                    {job.status === 'in-progress' && (
                                                        <button
                                                            style={{
                                                                padding: '6px 14px',
                                                                borderRadius: 6,
                                                                border: '1px solid #e5e7eb',
                                                                background: '#fff',
                                                                color: '#333',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {job.status === 'failed' && (
                                                        <button
                                                            style={{
                                                                padding: '6px 14px',
                                                                borderRadius: 6,
                                                                border: '1px solid #e5e7eb',
                                                                background: '#fff',
                                                                color: '#333',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Retry
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {job.status !== 'pending' && progressBar(job.progress, job.status)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation Tab */}
                    {activeTab === 'validation' && (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Validation Queue</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    Validate file integrity, format, and metadata before publishing
                                </p>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Report Name</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Organization</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Source</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Format</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Integrity</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Status</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingValidation.map((report) => (
                                            <tr key={report.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{report.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.organization}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.source}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.format}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: 12,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            background: report.integrity === 'Pass' ? '#d1fae5' : '#fef3c7',
                                                            color: report.integrity === 'Pass' ? '#065f46' : '#92400e',
                                                        }}
                                                    >
                                                        {report.integrity}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>{getStatusBadge(report.status)}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: 6,
                                                                border: 'none',
                                                                background: '#0473EA',
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Approve & Publish
                                                        </button>
                                                        <button
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: 6,
                                                                border: '1px solid #e5e7eb',
                                                                background: '#fff',
                                                                color: '#dc2626',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Published Tab */}
                    {activeTab === 'published' && (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Published Reports</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>Reports available to subscribers with notification status</p>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Report Name</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Organization</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Published At</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Subscribers</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Downloads</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Notifications</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {publishedReports.map((report) => (
                                            <tr key={report.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{report.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.organization}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.publishedAt}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.subscribers}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.downloads}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: 12,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            background: report.notifications === 'Sent' ? '#d1fae5' : '#fef3c7',
                                                            color: report.notifications === 'Sent' ? '#065f46' : '#92400e',
                                                        }}
                                                    >
                                                        {report.notifications}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <button
                                                        style={{
                                                            padding: '6px 12px',
                                                            borderRadius: 6,
                                                            border: 'none',
                                                            background: 'transparent',
                                                            color: '#0473EA',
                                                            cursor: 'pointer',
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {report.notifications === 'Pending' ? 'Send Notifications' : 'View Details'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpsDashboard;
