import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Briefcase } from 'lucide-react';
import authService from '../../services/authService';

const SignupPage = ({ role, navigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        domain: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const roleConfig = {
        user: { color: '#38D200', title: 'User Registration' },
        admin: { color: '#0473EA', title: 'Admin Registration' },
        ops: { color: '#38D200', title: 'Ops Registration' }
    };

    const config = roleConfig[role];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (role === 'user' && !formData.domain.trim()) {
            newErrors.domain = 'Domain is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                setLoading(true);
                
                // Prepare signup request data
                const signupData = {
                    fullName: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    domain: formData.domain,
                    password: formData.password,
                    role: role === 'user' ? 'SUBSCRIBER' : role.toUpperCase()
                };

                // Call backend signup API
                const response = await authService.signup(signupData);
                
                if (response.token) {
                    // Save token and user data from signup
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userEmail', formData.email);
                    localStorage.setItem('userName', formData.name);
                    localStorage.setItem('userDomain', formData.domain);
                    localStorage.setItem('userRole', role === 'user' ? 'SUBSCRIBER' : role.toUpperCase());
                    
                    // Save full user data for admin approval
                    const userData = {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        domain: formData.domain,
                        role: role === 'user' ? 'SUBSCRIBER' : role.toUpperCase()
                    };
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    alert(`${config.title} successful! Please login.`);
                    navigate('login', role);
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert(`Signup failed: ${error.message || 'Please try again.'}`);
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <button className="back-button" onClick={() => navigate('landing')}>
                    ← Back
                </button>

                <div className="auth-header">
                    <h1 className="auth-title">{config.title}</h1>
                    <p className="auth-subtitle">Create your account to get started</p>
                </div>

                <div className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <div className="input-wrapper">
                            <User size={20} className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone size={20} className="input-icon" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    {role === 'user' && (
                        <div className="form-group">
                            <label htmlFor="domain" className="form-label">Domain/Industry</label>
                            <div className="input-wrapper">
                                <Briefcase size={20} className="input-icon" />
                                <select
                                    id="domain"
                                    name="domain"
                                    className={`form-input ${errors.domain ? 'error' : ''}`}
                                    value={formData.domain}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '45px' }}
                                >
                                    <option value="">Select your domain</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Credit">Credit</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Loan">Loan</option>
                                </select>
                            </div>
                            {errors.domain && <span className="error-text">{errors.domain}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        className="submit-button"
                        style={{ backgroundColor: config.color }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={20} /></>}
                    </button>
                </div>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <button
                            className="link-button"
                            style={{ color: config.color }}
                            onClick={() => navigate('login', role)}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

subreq

import React, { useState, useEffect } from 'react';
import './SubscriptionRequest.css';
import domainService from '../../../services/domainService';
import subscriptionService from '../../../services/subscriptionService';
const SubscriptionRequestComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestingDomain, setRequestingDomain] = useState(null);
    const [requestReason, setRequestReason] = useState('');
    const [reasonError, setReasonError] = useState('');

    // Domain catalog fetched from backend
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [notification, setNotification] = useState('');

    // Get current user data from localStorage (saved during signup)
    const getUserData = () => {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsed = JSON.parse(userData);
                return {
                    name: parsed.name || localStorage.getItem('userName') || 'Unknown User',
                    email: parsed.email || localStorage.getItem('userEmail') || 'unknown@example.com',
                    domain: parsed.domain || localStorage.getItem('userDomain') || 'Unknown',
                    role: parsed.role || localStorage.getItem('userRole') || 'Subscriber'
                };
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
        
        // Fallback to individual localStorage items
        return {
            name: localStorage.getItem('userName') || 'Unknown User',
            email: localStorage.getItem('userEmail') || 'unknown@example.com',
            domain: localStorage.getItem('userDomain') || 'Unknown',
            role: localStorage.getItem('userRole') || 'Subscriber'
        };
    };
    
    const currentUser = getUserData();

    // Fetch available domains and user subscriptions from backend
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch all domains
            const domainsData = await domainService.getAllDomains();
            
            // Fetch user's subscription requests
            const subscriptionsData = await subscriptionService.getRequestsByUser(currentUser.email);
            setUserSubscriptions(subscriptionsData);
            
            // Map domains with subscription status
            const domainsWithStatus = domainsData.map(domain => {
                const subscription = subscriptionsData.find(sub => sub.domainId === domain.id);
                return {
                    ...domain,
                    subscriptionId: subscription?.id || null,
                    status: subscription?.status?.toLowerCase() || null,
                    requestReason: subscription?.requestReason || '',
                    rejectionReason: subscription?.rejectionReason || ''
                };
            });
            setDomains(domainsWithStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
            setNotification('Error loading domains. Please try again.');
            setTimeout(() => setNotification(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const filteredDomains = domains.filter(d => {
        const q = searchQuery.toLowerCase();
        const match = d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
        return (filterStatus === 'all' || d.status === filterStatus) && match;
    });

    const handleRequest = (domain) => {
        setRequestingDomain(domain);
        setRequestReason('');
        setReasonError('');
        setShowRequestModal(true);
    };

    const handleSubmitRequest = async () => {
        if (!requestReason.trim()) {
            setReasonError('Please type a reason for your request');
            return;
        }

        try {
            // Create subscription request with user profile info
            const requestData = {
                domainId: requestingDomain.id,
                domainName: requestingDomain.name,
                requestReason: requestReason,
                userName: currentUser.name,
                userEmail: currentUser.email,
                userDepartment: currentUser.domain, // Send user's working domain
                userRole: currentUser.role
            };

            await subscriptionService.createRequest(requestData);
            
            // Refresh data to show updated status
            await fetchData();
            
            setNotification('Subscription request submitted successfully!');
            setTimeout(() => setNotification(''), 3000);
            
            setShowRequestModal(false);
            setRequestingDomain(null);
            setRequestReason('');
            setReasonError('');
        } catch (error) {
            const errorMessage = error.message || 'Failed to submit request';
            setReasonError(errorMessage);
        }
    };

    const handleCancel = async (domainId, subscriptionId) => {
        try {
            await subscriptionService.cancelRequest(subscriptionId, currentUser.email);
            await fetchData();
            setNotification('Request cancelled successfully');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            setNotification('Error cancelling request');
            setTimeout(() => setNotification(''), 3000);
        }
    };
    const getCount = (status) => domains.filter(d => d.status === status).length;

    return (
        <div className="subscription-container">
            {/* Notification */}
            {notification && (
                <div className="alert alert-info alert-dismissible fade show" role="alert" style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    minWidth: '300px'
                }}>
                    {notification}
                </div>
            )}

            {/* Hero Section */}
            <div className="hero-section mb-5">
                <div className="d-flex align-items-center mb-3">
                    <div className="hero-icon me-3">
                        <i className="bi bi-folder-check"></i>
                    </div>
                    <div>
                        <h1 className="hero-title mb-2">Domain Subscription Center</h1>
                        <p className="hero-subtitle mb-0">
                            Browse and request access to business domains like Finance, Risk Management, Trading, and HR Analytics
                        </p>
                    </div>
                </div>
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
                                            <h5 className="domain-name mb-0">{d.name}</h5>
                                        </div>
                                        {d.status && (
                                            <span className={`status-badge badge ${
                                                d.status === 'approved' ? 'bg-success' : 
                                                d.status === 'rejected' ? 'bg-danger' : 
                                                'bg-warning text-dark'
                                            }`}>
                                                {d.status === 'approved' ? (
                                                    <><i className="bi bi-check-circle me-1"></i>Approved</>
                                                ) : d.status === 'rejected' ? (
                                                    <><i className="bi bi-x-circle me-1"></i>Rejected</>
                                                ) : (
                                                    <><i className="bi bi-clock me-1"></i>Pending</>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="domain-meta mb-3">
                                        <span className="meta-item">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Description: {d.description}
                                        </span>
                                    </div>

                                    <div className="action-buttons">
                                        {d.status === 'approved' ? (
                                            <button className="btn btn-success w-100" disabled>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Access Granted
                                            </button>
                                        ) : d.status === 'pending' ? (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-warning flex-grow-1" disabled>
                                                    <i className="bi bi-hourglass-split me-2"></i>
                                                    Pending Approval
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleCancel(d.id, d.subscriptionId)}
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </div>
                                        ) : d.status === 'rejected' ? (
                                            <button className="btn btn-danger w-100" disabled>
                                                <i className="bi bi-x-circle me-2"></i>
                                                Request Rejected
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-gradient w-100"
                                                onClick={() => handleRequest(d)}
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

            {/* Request Access Modal */}
            {showRequestModal && requestingDomain && (
                <div className="modal-backdrop" onClick={() => setShowRequestModal(false)} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1050
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Request Access to {requestingDomain.name}
                        </h3>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ color: '#666', marginBottom: '15px' }}>
                                <strong>Domain:</strong> {requestingDomain.name}
                            </p>
                            <p style={{ color: '#666', marginBottom: '15px' }}>
                                <strong>Description:</strong> {requestingDomain.description}
                            </p>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                                Reason for Request <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Please explain why you need access to this domain..."
                                value={requestReason}
                                onChange={(e) => {
                                    setRequestReason(e.target.value);
                                    if (reasonError) setReasonError('');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: reasonError ? '1px solid #dc3545' : '1px solid #ddd',
                                    fontSize: '14px'
                                }}
                            />
                            {reasonError && (
                                <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {reasonError}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowRequestModal(false)}
                                style={{ padding: '8px 20px' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmitRequest}
                                style={{ padding: '8px 20px' }}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionRequestComponent;


import React, { useEffect, useState } from "react";
import "./ApproveRejectSubscription.css";
import subscriptionService from "../../../services/subscriptionService";

const ApproveRejectSubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingSubscription, setRejectingSubscription] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");
    const [loadingAD, setLoadingAD] = useState(true);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoadingAD(true);
            const data = await subscriptionService.getAllRequests();
            
            // Transform backend data to match component structure
            const subscriptionsWithAD = data.map((sub) => {
                // Use domain from user signup data (userDepartment field contains the domain from signup)
                const signupDomain = sub.userDepartment || 'Unknown';
                return {
                    id: sub.id,
                    name: sub.userName,
                    email: sub.userEmail,
                    domain: sub.domainName,
                    date: new Date(sub.requestedDate).toLocaleDateString(),
                    reviewedDate: sub.reviewedDate ? new Date(sub.reviewedDate).toLocaleDateString() : null,
                    status: sub.status,
                    requestReason: sub.requestReason,
                    rejectionReason: sub.rejectionReason,
                    userDepartment: sub.userDepartment,
                    userRole: sub.userRole,
                    actualDepartment: signupDomain, // Show domain from user signup
                    departmentMatch: signupDomain.toLowerCase() === sub.domainName.toLowerCase(),
                    profileDomain: signupDomain
                };
            });

            setSubscriptions(subscriptionsWithAD);
        } catch (error) {
            console.error('Error fetching subscription requests:', error);
            setNotification('Error loading subscription requests');
            setTimeout(() => setNotification(''), 3000);
        } finally {
            setLoadingAD(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await subscriptionService.approveRequest(id);
            setNotification('Subscription request approved successfully!');
            setTimeout(() => setNotification(''), 3000);
            // Refresh the list
            await fetchPendingRequests();
        } catch (error) {
            console.error('Error approving request:', error);
            setNotification('Error approving request');
            setTimeout(() => setNotification(''), 3000);
        }
    };

    const openRejectModal = (subscription) => {
        setRejectingSubscription(subscription);
        if (!subscription.departmentMatch) {
            setRejectionReason("Requested domain does not match user's signup department");
        } else {
            setRejectionReason("");
        }
        setShowRejectModal(true);
    };

    const closeRejectModal = () => {
        setShowRejectModal(false);
        setRejectingSubscription(null);
        setRejectionReason("");
        setOtherReasonText("");
    };

    const handleReject = async () => {
        const finalReason = rejectionReason === "Other" ? otherReasonText : rejectionReason;
        
        if (!finalReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        try {
            await subscriptionService.rejectRequest(rejectingSubscription.id, finalReason);
            setNotification('Subscription request rejected');
            setTimeout(() => setNotification(''), 3000);
            closeRejectModal();
            // Refresh the list
            await fetchPendingRequests();
        } catch (error) {
            console.error('Error rejecting request:', error);
            setNotification('Error rejecting request');
            setTimeout(() => setNotification(''), 3000);
        }
    };

    const filteredData = subscriptions.filter((sub) => {
        const matchSearch =
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            sub.domain.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "All" ? true : sub.status.toUpperCase() === filter.toUpperCase();
        return matchSearch && matchFilter;
    });

    const pendingCount = subscriptions.filter((s) => s.status === "PENDING").length;

    return (
        <div className="ar-container">
            {/* Notification */}
            {notification && (
                <div className="ar-notification">{notification}</div>
            )}
            <div className="ar-top-header">
                <div className="ar-header-left">
                    <h2 className="ar-title">Subscription Requests</h2>
                    <p className="ar-subtitle">Manage and review employee subscription requests</p>
                </div>
                <div className="ar-header-right">
                    <span className="ar-pending-count">
                        
                        {pendingCount} Pending
                    </span>
                </div>
            </div>

            <div className="ar-search-filter-section">
                <input
                    type="text"
                    className="ar-search-input"
                    placeholder="Search by name, email, or domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="ar-filter-buttons">
                    {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                        <button
                            key={tab}
                            className={`ar-filter-tab ${filter === tab ? "ar-active" : ""}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ar-cards-container">
                {loadingAD && (
                    <div className="ar-loading">Loading AD information...</div>
                )}
                {!loadingAD && filteredData.map((sub) => (
                    <div key={sub.id} className={`ar-subscription-card ${!sub.departmentMatch && sub.status.toUpperCase() === 'PENDING' ? 'ar-mismatch' : ''}`}>
                        <div className="ar-sub-info">
                            <h5 className="ar-name">{sub.name}</h5>
                            <p className="ar-email">{sub.email}</p>
                            <p className="ar-date">Request Date: {sub.date}</p>
                            {sub.reviewedDate && (
                                <p className="ar-date" style={{color: '#6c757d'}}>
                                    Reviewed Date: {sub.reviewedDate}
                                </p>
                            )}
                            
                            <div className="ar-domain-comparison">
                                <div className="ar-domain-row">
                                    <span className="ar-domain-label">Requested Domain:</span>
                                    <span className="ar-domain-value">{sub.domain}</span>
                                </div>
                                <div className="ar-domain-row">
                                    <span className="ar-domain-label">User Signup Domain:</span>
                                    <span className={`ar-domain-value ${sub.departmentMatch ? 'ar-match' : 'ar-no-match'}`}>
                                        {sub.actualDepartment}
                                        {sub.departmentMatch ? ' ✓' : ' ✗'}
                                    </span>
                                </div>
                            </div>
                            
                            {sub.requestReason && (
                                <div className="ar-request-reason">
                                    <strong>Request Reason:</strong>
                                    <p>{sub.requestReason}</p>
                                </div>
                            )}
                            
                            {!sub.departmentMatch && sub.status.toUpperCase() === 'PENDING' && (
                                <div className="ar-warning">
                                    ⚠️ Department mismatch detected
                                </div>
                            )}
                            
                            {sub.status.toUpperCase() === 'REJECTED' && sub.rejectionReason && (
                                <div className="ar-rejection-reason">
                                    <strong>Rejection Reason:</strong> {sub.rejectionReason}
                                </div>
                            )}
                        </div>

                        <div className="ar-sub-actions">
                            <span
                                className={`ar-status-badge ${
                                    sub.status.toUpperCase() === "PENDING"
                                        ? "ar-status-pending"
                                        : sub.status.toUpperCase() === "APPROVED"
                                        ? "ar-status-approved"
                                        : "ar-status-rejected"
                                }`}
                            >
                                {sub.status}
                            </span>

                            {sub.status.toUpperCase() === "PENDING" && (
                                <div className="ar-btn-group">
                                    <button
                                        className="ar-action-btn ar-approve"
                                        onClick={() => handleApprove(sub.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="ar-action-btn ar-reject"
                                        onClick={() => openRejectModal(sub)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {!loadingAD && filteredData.length === 0 && (
                    <p className="ar-no-data">No records found.</p>
                )}
            </div>

            {showRejectModal && rejectingSubscription && (
                <div className="ar-modal-backdrop" onClick={closeRejectModal}>
                    <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="ar-modal-title">Reject Subscription Request</h2>
                        <div className="ar-modal-user-info">
                            <p><strong>User:</strong> {rejectingSubscription.name}</p>
                            <p><strong>Email:</strong> {rejectingSubscription.email}</p>
                            <p><strong>Requested Domain:</strong> {rejectingSubscription.domain}</p>
                            <p><strong>Signup Department:</strong> {rejectingSubscription.actualDepartment}</p>
                        </div>
                        
                        {rejectingSubscription.requestReason && (
                            <div className="ar-modal-request-reason">
                                <strong>📝 Subscriber's Request Reason:</strong>
                                <p>{rejectingSubscription.requestReason}</p>
                            </div>
                        )}
                        
                        <div className="ar-modal-form">
                            <label className="ar-modal-label">Reason for Rejection *</label>
                            <select
                                className="ar-modal-select"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            >
                                <option value="">-- Select Reason --</option>
                                <option value="Requested domain does not match user's signup department">
                                    Requested domain does not match user's signup department
                                </option>
                                <option value="User not found in Active Directory">
                                    User not found in Active Directory
                                </option>
                                <option value="Insufficient permissions for requested domain">
                                    Insufficient permissions for requested domain
                                </option>
                                <option value="Domain access restricted">
                                    Domain access restricted
                                </option>
                                <option value="Other">Other</option>
                            </select>
                            
                            {rejectionReason === "Other" && (
                                <textarea
                                    className="ar-modal-textarea"
                                    placeholder="Please specify the reason..."
                                    rows="3"
                                    value={otherReasonText}
                                    onChange={(e) => setOtherReasonText(e.target.value)}
                                />
                            )}
                        </div>
                        
                        <div className="ar-modal-actions">
                            <button className="ar-modal-btn ar-cancel" onClick={closeRejectModal}>
                                Cancel
                            </button>
                            <button className="ar-modal-btn ar-confirm-reject" onClick={handleReject}>
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveRejectSubscription;

