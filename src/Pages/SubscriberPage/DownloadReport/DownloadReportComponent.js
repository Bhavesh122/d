import React, { useState } from 'react';
import './DownloadReport.css';
import { useNavigate, Routes, Route } from 'react-router-dom';

import PDFViewer from '../PDFViewer/PDFViewer';
const PDF_FILE = "http://localhost:3000/Database_Fundamentals.pdf";

const DownloadReportComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedFile,setSelectedFile] = useState(null);

    const [reports, setReports] = useState([
        { id: 1, fileName: 'Q4_2024_Financial_Report', title: 'Q4 2024 Financial Report', description: 'Comprehensive quarterly financial statements, P&L analysis, and balance sheet review', domain: 'Finance', formats: ['pdf', 'xlsx', 'csv'], size: { pdf: '2.4 MB', xlsx: '1.8 MB', csv: '950 KB' }, publishedDate: '15 Dec 2024', downloads: 145, version: 'v1.2', recommendedFormat: 'pdf' },
        { id: 2, fileName: 'Risk_Exposure_Summary', title: 'Risk Exposure Summary', description: 'Value at Risk (VaR), stress testing results, and compliance reporting metrics', domain: 'Risk Management', formats: ['xlsx', 'csv', 'pdf'], size: { pdf: '1.2 MB', xlsx: '856 KB', csv: '420 KB' }, publishedDate: '18 Dec 2024', downloads: 98, version: 'v2.0', recommendedFormat: 'xlsx' },
        { id: 3, fileName: 'Trading_Performance_Report', title: 'Trading Performance Report', description: 'Trade blotter analysis, position tracking, and performance analytics dashboard', domain: 'Trading', formats: ['pdf', 'xlsx'], size: { pdf: '3.1 MB', xlsx: '2.2 MB' }, publishedDate: '10 Dec 2024', downloads: 203, version: 'v1.0', recommendedFormat: 'pdf' },
        { id: 4, fileName: 'HR_Analytics_Monthly', title: 'HR Analytics Monthly', description: 'Workforce metrics, hiring funnel analysis, retention and employee engagement data', domain: 'HR Analytics', formats: ['pdf', 'xlsx'], size: { pdf: '1.9 MB', xlsx: '1.4 MB' }, publishedDate: '20 Dec 2024', downloads: 167, version: 'v1.1', recommendedFormat: 'pdf' },
        { id: 5, fileName: 'Operations_KPI_Dashboard', title: 'Operations KPI Dashboard', description: 'Process efficiency metrics, throughput analysis, SLA compliance, and incident tracking', domain: 'Operations', formats: ['pdf', 'csv', 'xlsx'], size: { pdf: '2.8 MB', xlsx: '2.1 MB', csv: '1.1 MB' }, publishedDate: '22 Dec 2024', downloads: 89, version: 'v2.1', recommendedFormat: 'pdf' },
        { id: 6, fileName: 'Compliance_Audit_Report', title: 'Compliance Audit Report', description: 'Audit trails, policy adherence tracking, and regulatory submission documentation', domain: 'Compliance', formats: ['pdf', 'xlsx'], size: { pdf: '2.2 MB', xlsx: '1.6 MB' }, publishedDate: '12 Dec 2024', downloads: 134, version: 'v1.0', recommendedFormat: 'pdf' }
    ]);

    const domains = ['Finance', 'Risk Management', 'Trading', 'HR Analytics', 'Operations', 'Compliance'];

    const filteredReports = reports.filter(r => {
        const search = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const dom = filterCategory === 'all' || r.domain === filterCategory;
        return search && dom;
    });

    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop();
        link.click();
    };

    const getFileIcon = (format) => {
        const icons = { pdf: 'pdf', xlsx: 'excel', csv: 'spreadsheet' };
        return `bi-file-earmark-${icons[format] || 'text'}-fill`;
    };

    if(selectedFile) return <PDFViewer fileName={selectedFile} onBack={() => setSelectedFile(null)} />;

    return (
        <div className="download-report-container">
            {/* Header Section */}
            <div className="hero-section text-center mb-5">
                <div className="hero-icon mb-3">
                    <i className="bi bi-file-earmark-arrow-down"></i>
                </div>
                <h1 className="hero-title mb-3">Download Reports</h1>
                <p className="hero-subtitle mb-4">
                    Access and download your approved reports in multiple formats
                </p>
            </div>
            
            {/* Search and Filter */}
            <div className="search-filter-section card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="search-wrapper">
                                <i className="bi bi-search search-icon"></i>
                                <input type="text" className="form-control search-input" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <select className="form-select filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="all">All Domains</option>
                                {domains.map(dom => <option key={dom} value={dom}>{dom}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports */}
            {filteredReports.length > 0 ? (
                <div className="row g-4">
                    {filteredReports.map(r => (
                        <div key={r.id} className="col-12">
                            <div className="card report-card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <div className="report-icon me-3">
                                            <i className="bi bi-file-earmark-text"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h4 className="report-card-title mb-2">{r.title}</h4>
                                            <p className="report-description text-muted mb-3">{r.description}</p>
                                            <div className="report-meta d-flex flex-wrap gap-3 mb-4">
                                                {[
                                                    { icon: 'folder', label: 'Domain', value: r.domain },
                                                    { icon: 'calendar-event', label: 'Published', value: r.publishedDate },
                                                    { icon: 'tag', label: 'Version', value: r.version },
                                                    { icon: 'file-pdf', label: 'Format', value: 'PDF' }
                                                ].map((meta, i) => (
                                                    <span key={i} className="meta-item">
                                                        <i className={`bi bi-${meta.icon} me-1`}></i>
                                                        <strong>{meta.label}:</strong> {meta.value}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="d-flex gap-3 flex-wrap">
                                                <button className="btn btn-download" onClick={() => handleDownload(PDF_FILE)}>
                                                    <i className="bi bi-download me-2"></i>Download Report
                                                </button>
                                                <button className="btn btn-preview-new" onClick={() => setSelectedFile(PDF_FILE)}>
                                                    <i className="bi bi-eye me-2"></i>Preview Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox no-results-icon"></i>
                        <h5 className="mt-3 mb-2">No Reports Found</h5>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DownloadReportComponent;