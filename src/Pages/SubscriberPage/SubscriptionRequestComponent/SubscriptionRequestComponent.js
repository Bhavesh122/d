import React, { useState } from 'react';
import './SubscriptionRequest.css';
const SubscriptionRequestComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Domain catalog instead of individual files/reports
    const [domains, setDomains] = useState([
        { id: 1, name: 'Finance', description: 'Financial statements, P&L, balance sheets, forecasting models', status: null },
        { id: 2, name: 'Risk Management', description: 'Risk exposure, VaR, stress testing, compliance reporting', status: null },
        { id: 3, name: 'Trading', description: 'Trade blotter, positions, performance analytics, market data', status: null },
        { id: 4, name: 'HR Analytics', description: 'Workforce metrics, hiring funnel, retention and engagement', status: null },
        { id: 5, name: 'Operations', description: 'Process KPIs, throughput, SLAs, incident management', status: null },
        { id: 6, name: 'Compliance', description: 'Audit trails, policy adherence, regulatory submissions', status: null }
    ]);

    const filteredDomains = domains.filter(d => {
        const q = searchQuery.toLowerCase();
        const match = d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
        return (filterStatus === 'all' || d.status === filterStatus) && match;
    });

    const handleRequest = (id) => setDomains(domains.map(d => d.id === id && !d.status ? { ...d, status: 'requested' } : d));
    const handleCancel = (id) => setDomains(domains.map(d => d.id === id && d.status === 'requested' ? { ...d, status: null } : d));
    const getCount = (status) => domains.filter(d => d.status === status).length;

    return (
        <div className="subscription-container">
            {/* Hero Section */}
            <div className="hero-section text-center mb-5">
                <div className="hero-icon mb-3">
                    <i className="bi bi-folder-check"></i>
                </div>
                <h1 className="hero-title mb-3">Domain Subscription Center</h1>
                <p className="hero-subtitle mb-4">
                    Browse and request access to business domains like Finance, Risk Management, Trading, and HR Analytics
                </p>
            </div>

            {/* Search & Filter Section */}
            <div className="card shadow-sm mb-4 filter-card">
                <div className="card-body p-4">
                    <div className="row g-3 mb-3">
                        <div className="col-12">
                            <div className="search-wrapper">
                                <i className="bi bi-search search-icon"></i>
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder="Search domains by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button
                            className={`btn filter-btn ${filterStatus === 'all' ? 'active' : 'btn-outline-secondary'}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            <i className="bi bi-grid-3x3-gap me-2"></i>
                            All Domains
                            <span className="badge ms-2">{domains.length}</span>
                        </button>
                        <button
                            className={`btn filter-btn ${filterStatus === 'requested' ? 'active' : 'btn-outline-warning'}`}
                            onClick={() => setFilterStatus('requested')}
                        >
                            <i className="bi bi-clock-history me-2"></i>
                            Requested
                            <span className="badge ms-2">{getCount('requested')}</span>
                        </button>
                        <button
                            className={`btn filter-btn ${filterStatus === 'approved' ? 'active' : 'btn-outline-success'}`}
                            onClick={() => setFilterStatus('approved')}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Approved
                            <span className="badge ms-2">{getCount('approved')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Domains Section */}
            <div className="domains-header mb-4">
                <h4 className="domains-title">
                    <i className="bi bi-collection me-2"></i>
                    Available Domains
                </h4>
                <p className="domains-subtitle">
                    Showing {filteredDomains.length} of {domains.length} domains
                </p>
            </div>

            {filteredDomains.length === 0 ? (
                <div className="no-results card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox no-results-icon"></i>
                        <h5 className="mt-3 mb-2">No Domains Found</h5>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredDomains.map(d => (
                        <div key={d.id} className="col-12 col-lg-6">
                            <div className={`card domain-card shadow-sm h-100 report-card ${d.status || ''}`}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="domain-icon me-3">
                                            <i className="bi bi-folder-fill"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="domain-name mb-2">{d.name}</h5>
                                            <p className="domain-description text-muted mb-0">{d.description}</p>
                                        </div>
                                        {d.status && (
                                            <span className={`status-badge badge ${d.status === 'approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {d.status === 'approved' ? (
                                                    <><i className="bi bi-check-circle me-1"></i>Approved</>
                                                ) : (
                                                    <><i className="bi bi-clock me-1"></i>Pending</>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="domain-meta mb-3">
                                        <span className="meta-item">
                                            <i className="bi bi-tag me-1"></i>
                                            Domain: {d.name}
                                        </span>
                                    </div>

                                    <div className="action-buttons">
                                        {d.status === 'approved' ? (
                                            <button className="btn btn-success w-100" disabled>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Access Granted
                                            </button>
                                        ) : d.status === 'requested' ? (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-warning flex-grow-1" disabled>
                                                    <i className="bi bi-hourglass-split me-2"></i>
                                                    Pending Approval
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleCancel(d.id)}
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-gradient w-100"
                                                onClick={() => handleRequest(d.id)}
                                            >
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Request Access
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubscriptionRequestComponent;