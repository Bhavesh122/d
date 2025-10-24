

// import React, { useState } from 'react';
// import {
//     LogOut,
//     RefreshCw,
//     Database,
//     AlertCircle,
//     FileText,
//     Shield,
//     Calendar,
//     Activity,
//     PlusCircle
// } from 'lucide-react';
// import './OpsDashboard.css';

// const S = {
//     card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 },
//     pad: { padding: 20 },
//     row: (jc = 'space-between', ai = 'center', gap = 12) => ({ display: 'flex', justifyContent: jc, alignItems: ai, gap }),
//     btn: ({ primary } = {}) => ({
//         display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
//         border: primary ? 'none' : '1px solid #e5e7eb', background: primary ? '#0473EA' : '#fff',
//         color: primary ? '#fff' : '#333', cursor: 'pointer', fontWeight: 600, fontSize: 14,
//     }),
//     tinyBtn: (danger = false) => ({
//         padding: '6px 14px', borderRadius: 6, border: danger ? '1px solid #dc2626' : '1px solid #e5e7eb',
//         background: '#fff', color: danger ? '#dc2626' : '#333', cursor: 'pointer', fontSize: 13, fontWeight: 600,
//     }),
//     badge: {
//         base: { padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, border: '1px solid' },
//         completed: { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
//         'in-progress': { background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
//         failed: { background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
//         pending: { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
//         validating: { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' },
//     },
// };

// const Badge = ({ status }) => (
//     <span style={{ ...S.badge.base, ...(S.badge[status] || S.badge.pending) }}>{status}</span>
// );

// const Pill = ({ ok, children }) => (
//     <span
//         style={{
//             padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
//             background: ok ? '#d1fae5' : '#fef3c7', color: ok ? '#065f46' : '#92400e',
//         }}
//     >{children}</span>
// );

// const ProgressBar = ({ value, status }) => (
//     <div className="progress-bar-bg">
//         <div
//             className="progress-bar-fill"
//             style={{
//                 width: `${value}%`,
//                 background: status === 'failed' ? '#dc2626' : status === 'in-progress' ? '#0473EA' : '#10b981',
//             }}
//         />
//     </div>
// );

// const Head = ({ title, subtitle }) => (
//     <div style={{ ...S.pad, borderBottom: '1px solid #e5e7eb' }}>
//         <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>{title}</h3>
//         {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>{subtitle}</p>}
//     </div>
// );

// const StatCard = ({ label, value, icon }) => (
//     <div style={{ ...S.card, padding: 20 }}>
//         <div style={S.row('space-between', 'flex-start')}>
//             <p style={{ margin: 0, color: '#6b7280', fontSize: 13, fontWeight: 500 }}>{label}</p>
//             {icon}
//         </div>
//         <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#111' }}>{value}</h3>
//     </div>
// );

// const Tabs = ({ tabs, active, onChange }) => (
//     <div style={{ marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
//         <div style={S.row('flex-start', 'center', 8)}>
//             {tabs.map((t) => (
//                 <button
//                     key={t.id}
//                     onClick={() => onChange(t.id)}
//                     style={{
//                         display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: 'none', background: 'transparent',
//                         color: active === t.id ? '#0473EA' : '#6b7280', cursor: 'pointer', fontWeight: active === t.id ? 600 : 500, fontSize: 14,
//                         borderBottom: active === t.id ? '3px solid #0473EA' : '3px solid transparent', marginBottom: '-2px', transition: 'all 0.2s',
//                     }}
//                 >
//                     {t.icon}
//                     {t.label}
//                 </button>
//             ))}
//         </div>
//     </div>
// );

// const OpsDashboard = ({ navigate }) => {
//     const user = { name: 'Ramesh', role: 'operations' };
//     const logout = () => navigate('landing');

//     const [activeFilter, setActiveFilter] = useState('Today');
//     const [selectedOrganization, setSelectedOrganization] = useState('All Organizations');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [activeTab, setActiveTab] = useState('monitoring');
//     const [sidebarOpen, setSidebarOpen] = useState(true);

//     const storageConnections = [
//         { id: 1, name: 'AWS S3', organization: 'Finance Dept', status: 'active', latency: '40ms', lastJob: 'Success', lastSync: '2 mins ago', reports: 12 },
//         { id: 2, name: 'Azure Blob', organization: 'Risk Management', status: 'active', latency: '60ms', lastJob: 'Success', lastSync: '5 mins ago', reports: 8 },
//         { id: 3, name: 'Google Cloud', organization: 'Operations', status: 'syncing', latency: 'Running', lastJob: 'Running', lastSync: 'Running', reports: 15 },
//     ];

//     const syncJobs = [
//         { id: 1, source: 'AWS S3', organization: 'Finance', status: 'completed', progress: 100, files: 12, time: '2 mins ago' },
//         { id: 2, source: 'Google Cloud', organization: 'Operations', status: 'in-progress', progress: 67, files: 8, time: 'Running' },
//         { id: 3, source: 'Azure Blob', organization: 'Risk', status: 'pending', progress: 0, files: 15, time: 'Scheduled' },
//         { id: 4, source: 'Local Storage', organization: 'Archive', status: 'failed', progress: 45, files: 5, time: '10 mins ago' },
//     ];

//     const pendingValidation = [
//         { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', source: 'AWS S3', size: '2.4 MB', uploaded: '10 Oct, 11:32', status: 'validating', format: 'PDF', integrity: 'Pass' },
//         { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', source: 'Azure Blob', size: '856 KB', uploaded: '10 Oct, 10:21', status: 'pending', format: 'Excel', integrity: 'Checking' },
//         { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', source: 'Google Cloud', size: '1.8 MB', uploaded: '10 Oct, 10:02', status: 'validating', format: 'PDF', integrity: 'Pass' },
//     ];

//     const publishedReports = [
//         { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', publishedAt: '10 Oct, 11:32', version: 'v1.0', subscribers: 45, notifications: 'Sent', downloads: 38 },
//         { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', publishedAt: '10 Oct, 10:21', version: 'v1.2', subscribers: 32, notifications: 'Sent', downloads: 28 },
//         { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', publishedAt: '10 Oct, 10:02', version: 'v1.0', subscribers: 28, notifications: 'Pending', downloads: 0 },
//     ];

//     const activityLogs = [
//         { id: 1, time: '10 Oct, 11:35', user: 'Ramesh', action: 'Validated Report', entity: 'Q4_Financial_Report.pdf', status: 'Success' },
//         { id: 2, time: '10 Oct, 11:25', user: 'Suresh', action: 'Sync Started', entity: 'AWS S3', status: 'Running' },
//         { id: 3, time: '10 Oct, 11:10', user: 'Ramesh', action: 'Published Report', entity: 'Operations_Summary.pdf', status: 'Success' },
//     ];

//     const failedOperations = syncJobs.filter((j) => j.status === 'failed');

//     const tabs = [
//         { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 16, height: 16 }} /> },
//         { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 16, height: 16 }} /> },
//         { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 16, height: 16 }} /> },
//         { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 16, height: 16 }} /> },
//         { id: 'audit', label: 'Activity Log', icon: <Activity style={{ width: 16, height: 16 }} /> },
//     ];

//     return (
//         <div className="dash">
//             <div className={`side ${sidebarOpen ? 'open' : ''}`}>
//                 <div className="side-head">
//                     <span className="logo-icon"></span>
//                     <div>
//                         <h2>RW Tool</h2>
//                         <p>Operations Panel</p>
//                     </div>
//                 </div>
//                 <div className="side-nav">
//                     <p className="nav-label">Operations</p>
//                     {tabs.map((t) => (
//                         <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}>
//                             <span>{t.icon}</span>
//                             {t.label}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className="main">
//                 <div className="top">
//                     <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu">☰</button>
//                     <div className="actions">
//                         <button onClick={logout} className="logout-btn">
//                             <LogOut style={{ width: 16, height: 16 }} /> Logout
//                         </button>
//                     </div>
//                 </div>

//                 <div className="content">
//                     <div style={{ marginBottom: 24, ...S.row('space-between', 'flex-start') }}>
//                         <div>
//                             <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#111' }}>Operations Dashboard</h2>
//                             <p style={{ margin: 0, color: '#6b7280', fontSize: 15 }}>Bridge between remote storage & RW Tool</p>
//                         </div>
//                         <div style={S.row('flex-start')}>
//                             <button style={S.btn()}> <Calendar style={{ width: 16, height: 16 }} /> Schedule Sync</button>
//                             <button style={S.btn({ primary: true })}> <RefreshCw style={{ width: 16, height: 16 }} /> Sync All</button>
//                         </div>
//                     </div>

//                     {/* Stat Cards */}
//                     <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
//                         {[
//                             { label: 'Active Connections', value: storageConnections.filter((s) => s.status === 'active').length, icon: <Database style={{ width: 20, height: 20, color: '#0473EA' }} /> },
//                             { label: 'Pending Validation', value: pendingValidation.length, icon: <Shield style={{ width: 20, height: 20, color: '#f59e0b' }} /> },
//                             { label: 'Sync Jobs Today', value: '48', icon: <RefreshCw style={{ width: 20, height: 20, color: '#10b981' }} /> },
//                             { label: 'Published Reports', value: publishedReports.length, icon: <FileText style={{ width: 20, height: 20, color: '#8b5cf6' }} /> },
//                             { label: 'Failed Operations', value: failedOperations.length, icon: <AlertCircle style={{ width: 20, height: 20, color: '#dc2626' }} /> },
//                         ].map((s) => (<StatCard key={s.label} {...s} />))}
//                     </div>

//                     <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

//                     {/* Monitoring */}
//                     {activeTab === 'monitoring' && (
//                         <div style={S.card}>
//                             <Head title="Remote Storage Health" subtitle="Monitor data source latency and sync condition" />
//                             <div style={S.pad}>
//                                 {storageConnections.map((c) => (
//                                     <div key={c.id} style={{ ...S.card, borderColor: '#e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, ...S.row() }}>
//                                         <div style={S.row('flex-start')}>
//                                             <div style={{ width: 48, height: 48, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                                 <Database style={{ width: 24, height: 24, color: '#0473EA' }} />
//                                             </div>
//                                             <div>
//                                                 <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#111' }}>{c.name}</p>
//                                                 <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{c.organization} • {c.reports} reports • Latency: {c.latency} • Last Job: {c.lastJob}</p>
//                                             </div>
//                                         </div>
//                                         <div style={S.row()}>
//                                             <Pill ok={c.status === 'active'}>{c.status === 'active' ? 'Active' : 'Syncing'}</Pill>
//                                             <button style={S.tinyBtn()}>Check Health</button>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <button style={{ ...S.btn({ primary: true }), marginTop: 12 }}>
//                                     <PlusCircle style={{ width: 16, height: 16 }} /> Add Connection
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* Sync */}
//                     {activeTab === 'sync' && (
//                         <div>
//                             {failedOperations.length > 0 && (
//                                 <div style={{ ...S.card, background: '#fef2f2', borderColor: '#fecaca', marginBottom: 24, ...S.pad }}>
//                                     <div style={{ ...S.row(), marginBottom: 16 }}>
//                                         <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#991b1b' }}>{failedOperations.length} failed operation(s)</p>
//                                         <button style={S.tinyBtn(true)}>Retry all failed</button>
//                                     </div>
//                                     {failedOperations.map((op) => (
//                                         <div key={op.id} style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 8, padding: 16, ...S.row() }}>
//                                             <div>
//                                                 <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>{op.source} – {op.organization}</p>
//                                                 <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{op.files} files · {op.time}</p>
//                                             </div>
//                                             <div style={S.row()}>
//                                                 <Badge status="failed" />
//                                                 <button style={S.tinyBtn()}>Retry</button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             <div style={S.card}>
//                                 <Head title="Sync & Transfer Jobs" subtitle="Fetch and transfer reports from remote sources" />
//                                 <div style={S.pad}>
//                                     {syncJobs.map((j) => (
//                                         <div key={j.id} style={{ marginBottom: 20 }}>
//                                             <div style={{ ...S.row(), marginBottom: 8 }}>
//                                                 <div>
//                                                     <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>{j.source} – {j.organization}</p>
//                                                     <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{j.files} files · {j.time}</p>
//                                                 </div>
//                                                 <div style={S.row()}>
//                                                     <Badge status={j.status} />
//                                                     {j.status === 'in-progress' && <button style={S.tinyBtn()}>Pause</button>}
//                                                     {j.status === 'failed' && <button style={S.tinyBtn()}>Retry</button>}
//                                                 </div>
//                                             </div>
//                                             {j.status !== 'pending' && <ProgressBar value={j.progress} status={j.status} />}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Validation */}
//                     {activeTab === 'validation' && (
//                         <div style={S.card}>
//                             <Head title="Validation Queue" subtitle="Validate file integrity, tags, and metadata before publishing" />
//                             <div style={{ ...S.pad }}>
//                                 <button style={S.tinyBtn()}>Auto-approve rules</button>
//                             </div>

//                             {/* changed: className + table class */}
//                             <div className="validation-wrap">
//                                 <table className="validation-table">
//                                     <thead>
//                                         <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
//                                             {['Report Name', 'Organization', 'Source', 'Format', 'Integrity', 'Status', 'Actions'].map((h) => (
//                                                 <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{h}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {pendingValidation.map((r) => (
//                                             <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{r.name}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.organization}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.source}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.format}</td>
//                                                 <td style={{ padding: '16px 20px' }}><Pill ok={r.integrity === 'Pass'}>{r.integrity}</Pill></td>
//                                                 <td style={{ padding: '16px 20px' }}><Badge status={r.status} /></td>
//                                                 <td style={{ padding: '16px 20px' }}>
//                                                     <div style={{ display: 'flex', gap: 8 }}>
//                                                         {/* changed: use consistent outlined buttons via class names */}
//                                                         <button className="approve-btn">Approve &amp; Publish</button>
//                                                         <button className="reject-btn">Reject</button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}


//                     {/* Published */}
//                     {activeTab === 'published' && (
//                         <div style={S.card}>
//                             <Head title="Publication & Notifications" subtitle="Reports available to subscribers with status overview" />
//                             <div style={{ overflowX: 'auto' }}>
//                                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                     <thead>
//                                         <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
//                                             {['Report Name', 'Organization', 'Version', 'Published At', 'Subscribers', 'Downloads', 'Notifications', 'Actions'].map((h) => (
//                                                 <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{h}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {publishedReports.map((r) => (
//                                             <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{r.name}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.organization}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.version}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.publishedAt}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.subscribers}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.downloads}</td>
//                                                 <td style={{ padding: '16px 20px' }}><Pill ok={r.notifications === 'Sent'}>{r.notifications}</Pill></td>
//                                                 <td style={{ padding: '16px 20px' }}>
//                                                     <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: 'transparent', color: '#0473EA', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
//                                                         {r.notifications === 'Pending' ? 'Send Notifications' : 'View Details'}
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     {/* Audit */}
//                     {activeTab === 'audit' && (
//                         <div style={S.card}>
//                             <Head title="Activity Log" subtitle="All system and user-triggered actions in chronological order" />
//                             <div style={{ overflowX: 'auto' }}>
//                                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                     <thead>
//                                         <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
//                                             {['Time', 'User', 'Action', 'Entity', 'Status'].map((h) => (
//                                                 <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{h}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {activityLogs.map((log) => (
//                                             <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#111' }}>{log.time}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{log.user}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{log.action}</td>
//                                                 <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{log.entity}</td>
//                                                 <td style={{ padding: '16px 20px' }}>
//                                                     <Pill ok={log.status === 'Success'}>{log.status}</Pill>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OpsDashboard;

import React, { useMemo, useState, useEffect } from 'react';
import {
    LogOut,
    RefreshCw,
    Database,
    AlertCircle,
    FileText,
    Shield,
    Calendar,
    Activity,
    PlusCircle,
    Bell,
    Search,
    Star,
    Clock,
    Download,
    Folder,
    Filter,
    ChevronLeft,
    ChevronRight,
    FileArchive,
    FileSpreadsheet,
    File as FileGeneric,
} from 'lucide-react';
import './OpsDashboard.css';

/** ---------- Small style helpers (unchanged) ---------- */
const S = {
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 },
    pad: { padding: 20 },
    row: (jc = 'space-between', ai = 'center', gap = 12) => ({
        display: 'flex',
        justifyContent: jc,
        alignItems: ai,
        gap,
    }),
    btn: ({ primary } = {}) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 8,
        border: primary ? 'none' : '1px solid #e5e7eb',
        background: primary ? '#0473EA' : '#fff',
        color: primary ? '#fff' : '#333',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 14,
    }),
    tinyBtn: (danger = false) => ({
        padding: '6px 12px',
        borderRadius: 6,
        border: '1px solid #e5e7eb',
        background: '#fff',
        color: danger ? '#dc2626' : '#333',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 600,
    }),
    badge: {
        base: { padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, border: '1px solid' },
        completed: { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
        'in-progress': { background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
        failed: { background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
        pending: { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
        validating: { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' },
    },
};

const Badge = ({ status }) => (
    <span style={{ ...S.badge.base, ...(S.badge[status] || S.badge.pending) }}>{status}</span>
);

const Pill = ({ ok, children }) => (
    <span
        style={{
            padding: '4px 10px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            background: ok ? '#d1fae5' : '#fef3c7',
            color: ok ? '#065f46' : '#92400e',
        }}
    >
        {children}
    </span>
);

const ProgressBar = ({ value, status }) => (
    <div className="progress-bar-bg">
        <div
            className="progress-bar-fill"
            style={{
                width: `${value}%`,
                background: status === 'failed' ? '#dc2626' : status === 'in-progress' ? '#0473EA' : '#10b981',
            }}
        />
    </div>
);

const Head = ({ title, subtitle, right }) => (
    <div style={{ ...S.pad, borderBottom: '1px solid #e5e7eb', ...S.row() }}>
        <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>{title}</h3>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>{subtitle}</p>}
        </div>
        {right}
    </div>
);

const StatCard = ({ label, value, icon }) => (
    <div
        style={{
            ...S.card,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',          // ensures equal height
            minHeight: 120,           // gives consistent vertical size
        }}
    >
        <div style={{ ...S.row('space-between', 'center') }}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13, fontWeight: 500 }}>{label}</p>
            {icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1 }}>
            <h3
                style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#111',
                    lineHeight: 1,
                }}
            >
                {value}
            </h3>
        </div>
    </div>
);


const Tabs = ({ tabs, active, onChange }) => (
    <div style={{ marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
        <div style={S.row('flex-start', 'center', 8)}>
            {tabs.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 20px',
                        border: 'none',
                        background: 'transparent',
                        color: active === t.id ? '#0473EA' : '#6b7280',
                        cursor: 'pointer',
                        fontWeight: active === t.id ? 600 : 500,
                        fontSize: 14,
                        borderBottom: active === t.id ? '3px solid #0473EA' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    {t.icon}
                    {t.label}
                </button>
            ))}
        </div>
    </div>
);

/** ---------- Demo data (can be replaced with API hooks) ---------- */
const ALL_REPORTS = [
    { id: 'r1', name: 'Q4_Financial_Report.pdf', org: 'Finance', type: 'PDF', folder: 'Compliance', date: '2025-10-10T11:32:00Z', downloads: 38 },
    { id: 'r2', name: 'Risk_Assessment_2024.xlsx', org: 'Risk', type: 'Excel', folder: 'Credit Risk', date: '2025-10-10T10:21:00Z', downloads: 28 },
    { id: 'r3', name: 'Operations_Summary.pdf', org: 'Operations', type: 'PDF', folder: 'General', date: '2025-10-10T10:02:00Z', downloads: 0 },
    { id: 'r4', name: 'Monthly_Review_Timing.txt', org: 'Compliance', type: 'TXT', folder: 'Compliance', date: '2025-09-28T16:00:00Z', downloads: 12 },
];

const STORAGE = [
    { id: 1, name: 'AWS S3', organization: 'Finance Dept', status: 'active', latency: '40ms', lastJob: 'Success', lastSync: '2 mins ago', reports: 12 },
    { id: 2, name: 'Azure Blob', organization: 'Risk Management', status: 'active', latency: '60ms', lastJob: 'Success', lastSync: '5 mins ago', reports: 8 },
    { id: 3, name: 'Google Cloud', organization: 'Operations', status: 'syncing', latency: 'Running', lastJob: 'Running', lastSync: 'Running', reports: 15 },
];

// Replace the original SYNC_JOBS with this file-based version
const SYNC_JOBS = [
    { id: 1, file: 'Q4_Financial_Report.pdf', status: 'completed', progress: 100, files: 12, time: '2 mins ago' },
    { id: 2, file: 'Operations_Summary.pdf', status: 'in-progress', progress: 67, files: 8, time: 'Running' },
    { id: 3, file: 'Risk_Assessment_2024.xlsx', status: 'pending', progress: 0, files: 15, time: 'Scheduled' },
    { id: 4, file: 'Monthly_Review_Timing.txt', status: 'failed', progress: 45, files: 5, time: '10 mins ago' },
];


const VALIDATION_QUEUE = [
    { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', source: 'AWS S3', size: '2.4 MB', uploaded: '10 Oct, 11:32', status: 'validating', format: 'PDF', integrity: 'Pass' },
    { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', source: 'Azure Blob', size: '856 KB', uploaded: '10 Oct, 10:21', status: 'pending', format: 'Excel', integrity: 'Checking' },
    { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', source: 'Google Cloud', size: '1.8 MB', uploaded: '10 Oct, 10:02', status: 'validating', format: 'PDF', integrity: 'Pass' },
];

const PUBLISHED = [
    { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', publishedAt: '10 Oct, 11:32', version: 'v1.0', subscribers: 45, notifications: 'Sent', downloads: 38, type: 'PDF', folder: 'Compliance' },
    { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', publishedAt: '10 Oct, 10:21', version: 'v1.2', subscribers: 32, notifications: 'Sent', downloads: 28, type: 'Excel', folder: 'Credit Risk' },
    { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', publishedAt: '10 Oct, 10:02', version: 'v1.0', subscribers: 28, notifications: 'Pending', downloads: 0, type: 'PDF', folder: 'General' },
];

const ACTIVITY = [
    { id: 1, time: '10 Oct, 11:35', user: 'Ramesh', action: 'Validated Report', entity: 'Q4_Financial_Report.pdf', status: 'Success' },
    { id: 2, time: '10 Oct, 11:25', user: 'Suresh', action: 'Sync Started', entity: 'AWS S3', status: 'Running' },
    { id: 3, time: '10 Oct, 11:10', user: 'Ramesh', action: 'Published Report', entity: 'Operations_Summary.pdf', status: 'Success' },
];

/** AD access map (US04) */
const AD_GROUPS = [
    { group: 'Wealth Compliance', allows: { folders: ['Compliance'], reports: ['KYC', 'Dormant', 'AML'] } },
    { group: 'Wealth User Admin', allows: { folders: ['Global User', 'General', 'Credit Risk', 'Compliance'] } },
];

function iconForType(type) {
    switch (type) {
        case 'PDF':
            return <FileText style={{ width: 16, height: 16 }} />;
        case 'Excel':
            return <FileSpreadsheet style={{ width: 16, height: 16 }} />;
        case 'ZIP':
            return <FileArchive style={{ width: 16, height: 16 }} />;
        case 'TXT':
        default:
            return <FileGeneric style={{ width: 16, height: 16 }} />;
    }
}

/** ======================================================
 *                     MAIN COMPONENT
 *  ====================================================== */
const OpsDashboard = ({ navigate }) => {
    const user = { name: 'Ramesh', role: 'operations', adGroups: ['Wealth Compliance', 'Wealth User Admin'] };
    const logout = () => navigate('landing');

    const [activeTab, setActiveTab] = useState('published');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Notifications (US05)
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 'n1', title: 'New: Q4_Financial_Report.pdf', reportId: 'r1', time: '2m ago', unread: true },
        { id: 'n2', title: 'Risk_Assessment_2024.xlsx published', reportId: 'r2', time: '10m ago', unread: false },
    ]);

    // Report Search & Filters (US05, US06)
    const [reportQuery, setReportQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportType, setReportType] = useState('All');
    const [folderFilter, setFolderFilter] = useState('All');

    // Pagination
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // Favourites & Recently Viewed (slide 8)
    const [favourites, setFavourites] = useState(['r1']);
    const [recentlyViewed, setRecentlyViewed] = useState(['r2', 'r3']);

    // Storage / Sync / Validation data
    const [storageConnections] = useState(STORAGE);
    const [syncJobs, setSyncJobs] = useState(SYNC_JOBS);
    const [pendingValidation, setPendingValidation] = useState(VALIDATION_QUEUE);
    const [publishedReports, setPublishedReports] = useState(PUBLISHED);
    const [activityLogs] = useState(ACTIVITY);

    // Access control (US04) → compute allowed folders
    const allowedFolders = useMemo(() => {
        const g = AD_GROUPS.filter((g) => user.adGroups.includes(g.group));
        const sets = new Set();
        g.forEach((x) => x.allows.folders.forEach((f) => sets.add(f)));
        return sets;
    }, [user.adGroups]);

    // Search domain = published + (optionally) all reports
    const reportsDomain = useMemo(
        () =>
            ALL_REPORTS.filter((r) => allowedFolders.has(r.folder)), // enforce access (US04)
        [allowedFolders]
    );

    const filteredReports = useMemo(() => {
        let rows = reportsDomain;

        if (reportQuery.trim()) {
            const q = reportQuery.toLowerCase();
            rows = rows.filter((r) => r.name.toLowerCase().includes(q));
        }
        if (reportType !== 'All') {
            rows = rows.filter((r) => r.type === reportType);
        }
        if (folderFilter !== 'All') {
            rows = rows.filter((r) => r.folder === folderFilter);
        }
        if (fromDate) {
            rows = rows.filter((r) => new Date(r.date) >= new Date(fromDate));
        }
        if (toDate) {
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            rows = rows.filter((r) => new Date(r.date) <= end);
        }
        return rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [reportsDomain, reportQuery, reportType, folderFilter, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    const pagedReports = filteredReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Multi-select & batch download (US06)
    const [selectedIds, setSelectedIds] = useState([]);
    const toggleSelect = (id) =>
        setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
    const selectAllPage = () => setSelectedIds(pagedReports.map((r) => r.id));
    const clearSelection = () => setSelectedIds([]);

    const batchDownload = () => {
        // Simulate: in real app, request ZIP for selected items & dates (US06)
        alert(`Downloading ${selectedIds.length} report(s) as ZIP...`);
        clearSelection();
    };

    const addToFavourites = (id) => {
        setFavourites((cur) => (cur.includes(id) ? cur : [id, ...cur]));
    };

    const markViewed = (id) => {
        setRecentlyViewed((cur) => [id, ...cur.filter((x) => x !== id)].slice(0, 8));
    };

    const failedOperations = syncJobs.filter((j) => j.status === 'failed');

    const tabs = [
        { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 16, height: 16 }} /> },
        { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 16, height: 16 }} /> },
        { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 16, height: 16 }} /> },
        { id: 'audit', label: 'Activity Log', icon: <Activity style={{ width: 16, height: 16 }} /> },
        // { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 16, height: 16 }} /> }, // temporarily disabled
    ];


    /** ---------- helpers for UI ---------- */
    const notifUnread = notifications.filter((n) => n.unread).length;
    const openReportFromNotif = (n) => {
        setActiveTab('published');
        setReportQuery(n.title.replace('New: ', '').split(' ').join('_').toLowerCase());
        setNotifications((arr) => arr.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
        setNotifOpen(false);
    };

    return (
        <div className="dash">
            {/* Sidebar (unchanged structure) */}
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
                    {tabs.map((t) => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}>
                            <span>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="main">
                <div className="top">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu">☰</button>
                    <div className="actions">
                        {/* Notifications (US05) */}
                        <div className="notif">
                            <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                                <Bell size={18} />
                                {notifUnread > 0 && <span className="notif-dot">{notifUnread}</span>}
                            </button>
                            {notifOpen && (
                                <div className="notif-list">
                                    <div className="notif-head">
                                        <strong>Notifications</strong>
                                        <button className="link-btn" onClick={() => setNotifications((arr) => arr.map((n) => ({ ...n, unread: false })))}>
                                            Mark all read
                                        </button>
                                    </div>
                                    {notifications.length === 0 && <div className="notif-empty">No notifications</div>}
                                    {notifications.map((n) => (
                                        <button key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`} onClick={() => openReportFromNotif(n)}>
                                            <div className="notif-title">{n.title}</div>
                                            <div className="notif-time">{n.time}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={logout} className="logout-btn">
                            <LogOut style={{ width: 16, height: 16 }} /> Logout
                        </button>
                    </div>
                </div>

                <div className="content">
                    {/* Header */}
                    <div style={{ marginBottom: 24, ...S.row('space-between', 'flex-start') }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#111' }}>Operations Dashboard</h2>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: 15 }}>Bridge between remote storage & RW Tool</p>
                        </div>
                        <div style={S.row('flex-start')}>
                            <button style={S.btn()}> <Calendar style={{ width: 16, height: 16 }} /> Schedule Sync</button>
                            <button style={S.btn({ primary: true })}> <RefreshCw style={{ width: 16, height: 16 }} /> Sync All</button>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                        {[
                            { label: 'Active Connections', value: STORAGE.filter((s) => s.status === 'active').length, icon: <Database style={{ width: 20, height: 20, color: '#0473EA' }} /> },
                            { label: 'Pending Validation', value: VALIDATION_QUEUE.length, icon: <Shield style={{ width: 20, height: 20, color: '#f59e0b' }} /> },
                            { label: 'Sync Jobs Today', value: '48', icon: <RefreshCw style={{ width: 20, height: 20, color: '#10b981' }} /> },
                            { label: 'Published Reports', value: PUBLISHED.length, icon: <FileText style={{ width: 20, height: 20, color: '#8b5cf6' }} /> },
                            { label: 'Failed Operations', value: SYNC_JOBS.filter((j) => j.status === 'failed').length, icon: <AlertCircle style={{ width: 20, height: 20, color: '#dc2626' }} /> },
                        ].map((s) => (<StatCard key={s.label} {...s} />))}
                    </div>

                    {/* Tabs */}
                    <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

                    {/* Remote Monitoring */}
                    {/* {activeTab === 'monitoring' && (
                        <div style={S.card}>
                            <Head title="Remote Monitoring" subtitle="Monitor data source latency and sync condition" />
                            <div style={S.pad}>
                                {storageConnections.map((c) => (
                                    <div key={c.id} style={{ ...S.card, borderColor: '#e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, ...S.row() }}>
                                        <div style={S.row('flex-start')}>
                                            <div className="icon-48"><Database style={{ width: 24, height: 24, color: '#0473EA' }} /></div>
                                            <div>
                                                <p className="title-16">{c.name}</p>
                                                <p className="muted-13">{c.organization} • {c.reports} reports • Latency: {c.latency} • Last Job: {c.lastJob} • Last sync: {c.lastSync}</p>
                                            </div>
                                        </div>
                                        <div style={S.row()}>
                                            <Pill ok={c.status === 'active'}>{c.status === 'active' ? 'Active' : 'Syncing'}</Pill>
                                            <button style={S.tinyBtn()}>Check Health</button>
                                        </div>
                                    </div>
                                ))}
                                <button style={{ ...S.btn({ primary: true }), marginTop: 12 }}>
                                    <PlusCircle style={{ width: 16, height: 16 }} /> Add Connection
                                </button>
                            </div>
                        </div>
                    )} */}

                    {/* Sync Operations */}
                    {activeTab === 'sync' && (
                        <div>
                            {failedOperations.length > 0 && (
                                <div style={{ ...S.card, background: '#fef2f2', borderColor: '#fecaca', marginBottom: 24, ...S.pad }}>
                                    <div style={{ ...S.row(), marginBottom: 16 }}>
                                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#991b1b' }}>{failedOperations.length} failed operation(s)</p>
                                        <button style={S.tinyBtn(true)}>Retry all failed</button>
                                    </div>
                                    {failedOperations.length > 0 && (
                                        <div style={{ ...S.card, background: '#fef2f2', borderColor: '#fecaca', marginBottom: 24, ...S.pad }}>
                                            <div style={{ ...S.row(), marginBottom: 16 }}>
                                                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#991b1b' }}>
                                                    {failedOperations.length} failed operation(s)
                                                </p>
                                                <button style={S.tinyBtn(true)}>Retry all failed</button>
                                            </div>
                                            {failedOperations.map((op) => (
                                                <div key={op.id} className="failed-op">
                                                    <div>
                                                        <p className="title-15">{op.file}</p>
                                                        <p className="muted-13">{op.files} files · {op.time}</p>
                                                    </div>
                                                    <div style={S.row()}>
                                                        <Badge status="failed" />
                                                        <button style={S.tinyBtn()}>Retry</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            )}

                            <div style={S.card}>
                                <Head title="Sync Operations" subtitle="Fetch and transfer reports from remote sources" />
                                <div style={S.pad}>
                                    {syncJobs.map((j) => (
                                        <div key={j.id} style={{ marginBottom: 20 }}>
                                            <div style={{ ...S.row(), marginBottom: 8 }}>
                                                <div>
                                                    <p className="title-15">{j.file}</p>
                                                    <p className="muted-13">{j.files} files · {j.time}</p>
                                                </div>
                                                <div style={S.row()}>
                                                    <Badge status={j.status} />
                                                    {j.status === 'in-progress' && <button style={S.tinyBtn()}>Pause</button>}
                                                    {j.status === 'failed' && <button style={S.tinyBtn()}>Retry</button>}
                                                </div>
                                            </div>
                                            {j.status !== 'pending' && <ProgressBar value={j.progress} status={j.status} />}
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation Queue */}
                    {activeTab === 'validation' && (
                        <div style={S.card}>
                            <Head
                                title="Validation Queue"
                                subtitle="Validate file integrity, tags, and metadata before publishing"
                                right={<button style={S.tinyBtn()}><Filter size={14} /> Auto-approve rules</button>}
                            />
                            <div className="validation-wrap">
                                <table className="validation-table">
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            {['Report Name', 'Organization', 'Source', 'Format', 'Integrity', 'Status', 'Actions'].map((h) => (
                                                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingValidation.map((r) => (
                                            <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td className="nowrap">{r.name}</td>
                                                <td className="muted-td">{r.organization}</td>
                                                <td className="muted-td">{r.source}</td>
                                                <td className="muted-td">{r.format}</td>
                                                <td><Pill ok={r.integrity === 'Pass'}>{r.integrity}</Pill></td>
                                                <td><Badge status={r.status} /></td>
                                                <td>
                                                    <div className="row-8">
                                                        <button className="approve-btn">Approve &amp; Publish</button>
                                                        <button className="reject-btn">Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Published Reports — search, filters, listing, favourites, recently viewed, batch download */}
                    {activeTab === 'published' && (
                        <div className="pub-full">
                            <div className="pub-main" style={S.card}>
                                <Head
                                    title="Published Reports"
                                    subtitle="Search, filter, and download reports"
                                    right={
                                        <div className="toolbar">
                                            <div className="search">
                                                <Search size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Search reports by name..."
                                                    value={reportQuery}
                                                    onChange={(e) => setReportQuery(e.target.value)}
                                                />
                                            </div>
                                            <div className="filters">
                                                <Folder size={14} />
                                                <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}>
                                                    <option>All</option>
                                                    {[...allowedFolders].map((f) => (<option key={f}>{f}</option>))}
                                                </select>

                                                <FileText size={14} />
                                                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                                    <option>All</option>
                                                    <option>PDF</option>
                                                    <option>Excel</option>
                                                    <option>TXT</option>
                                                </select>

                                                <Calendar size={14} />
                                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                                <span className="sep">to</span>
                                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                            </div>
                                        </div>
                                    }
                                />

                                <div className="pub-wrap">
                                    <table className="pub-table">

                                        <thead>
                                            <tr>
                                                <th className="col-select" style={{ width: 36, padding: 0 }}>
                                                    <div className="chk-center">
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => (e.target.checked ? selectAllPage() : clearSelection())}
                                                        />
                                                    </div>
                                                </th>

                                                <th className="col-no">No.</th>
                                                <th className="col-report" style={{ width: '28%', paddingRight: 6 }}>Report</th>
                                                <th className="col-org" style={{ width: '12%', paddingLeft: 6 }}>Org</th>

                                                <th className="col-type">Type</th>
                                                <th className="col-date">Date</th>
                                                <th className="col-actions">Actions</th>
                                                <th className="col-downloads">Downloads</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pagedReports.map((r, idx) => (
                                                <tr key={r.id} onClick={() => markViewed(r.id)}>
                                                    <td className="col-select" style={{ width: 36, padding: 0 }}>
                                                        <div className="chk-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(r.id)}
                                                                onChange={() => toggleSelect(r.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </td>

                                                    <td className="col-no">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                                    <td className="report-cell col-report" style={{ width: '28%', paddingRight: 6 }}>
                                                        <span className="type-icon">{iconForType(r.type)}</span>
                                                        <span className="report-name">{r.name}</span>
                                                    </td>
                                                    <td className="muted-td col-org" style={{ width: '12%', paddingLeft: 6 }}>{r.org}</td>

                                                    <td className="muted-td col-type">{r.type}</td>
                                                    <td className="muted-td col-date">{new Date(r.date).toLocaleString()}</td>
                                                    <td className="row-8 col-actions">
                                                        <button
                                                            className="approve-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                alert('Downloading...');
                                                            }}
                                                        >
                                                            <Download size={14} /> Download
                                                        </button>
                                                    </td>
                                                    <td className="muted-td col-downloads">{r.downloads}</td>
                                                </tr>
                                            ))}
                                            {pagedReports.length === 0 && (
                                                <tr>
                                                    <td colSpan={8} className="muted-td">No reports found.</td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>

                                <div className="pub-footer">
                                    <div className="row-8">
                                        <button className="approve-btn" disabled={!selectedIds.length} onClick={batchDownload}>
                                            <Download size={14} /> Download selected (ZIP)
                                        </button>
                                        {selectedIds.length > 0 && (
                                            <button className="reject-btn" onClick={clearSelection}>Clear selection</button>
                                        )}
                                    </div>
                                    <div className="pager">
                                        <button className="tiny-icon-btn" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span>Page {page} / {totalPages}</span>
                                        <button className="tiny-icon-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Activity Log */}
                    {activeTab === 'audit' && (
                        <div style={S.card}>
                            <Head title="Activity Log" subtitle="All system and user-triggered actions in chronological order" />
                            <div className="audit-wrap">
                                <table className="audit-table">
                                    <thead>
                                        <tr>
                                            {['Time', 'User', 'Action', 'Entity', 'Status'].map((h) => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activityLogs.map((log) => (
                                            <tr key={log.id}>
                                                <td>{log.time}</td>
                                                <td className="muted-td">{log.user}</td>
                                                <td className="title-15">{log.action}</td>
                                                <td className="muted-td">{log.entity}</td>
                                                <td><Pill ok={log.status === 'Success'}>{log.status}</Pill></td>
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
