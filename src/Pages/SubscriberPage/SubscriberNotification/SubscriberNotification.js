import React, { useEffect, useRef, useState } from 'react';
import { Bell, X, CheckCircle, XCircle, FileText } from 'lucide-react';
import '../../AdminPage/AdminNotification/AdminNotification.css';
import './SubscriberNotification.css';

const SubscriberNotification = ({ userEmail, subscriptions = [], files = [], approvedDomains = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Track previous snapshots to detect changes
  const prevSubsRef = useRef([]);
  const prevFilesRef = useRef([]);
  const idRef = useRef(1);
  const containerRef = useRef(null);

  const pushNotif = (partial) => {
    const now = new Date();
    const n = {
      id: idRef.current++,
      isNew: true,
      time: now.toLocaleTimeString(),
      ...partial
    };
    setNotifications((prev) => [n, ...prev]);
  };

  // Detect subscription status changes (approved/rejected)
  useEffect(() => {
    const prev = prevSubsRef.current;
    const prevMap = new Map(prev.map(s => [String(s.id), s]));
    (subscriptions || []).forEach(s => {
      const key = String(s.id);
      const before = prevMap.get(key);
      const status = (s.status || '').toUpperCase();
      if (!before && (status === 'APPROVED' || status === 'REJECTED')) {
        // Newly visible sub with final status
        pushNotif({
          type: status === 'APPROVED' ? 'accepted' : 'rejected',
          icon: status === 'APPROVED' ? CheckCircle : XCircle,
          title: `Subscription ${status === 'APPROVED' ? 'Accepted' : 'Rejected'}`,
          message: `Your subscription request for ${(s.domain || s.domainName || s.folder || s.category || '').toString()} has been ${status === 'APPROVED' ? 'accepted' : 'rejected'}`
        });
      } else if (before && (before.status || '').toUpperCase() !== status && (status === 'APPROVED' || status === 'REJECTED')) {
        // Status transitioned to approved/rejected
        pushNotif({
          type: status === 'APPROVED' ? 'accepted' : 'rejected',
          icon: status === 'APPROVED' ? CheckCircle : XCircle,
          title: `Subscription ${status === 'APPROVED' ? 'Accepted' : 'Rejected'}`,
          message: `Your subscription request for ${(s.domain || s.domainName || s.folder || s.category || '').toString()} has been ${status === 'APPROVED' ? 'accepted' : 'rejected'}`
        });
      }
    });
    prevSubsRef.current = subscriptions || [];
  }, [subscriptions]);

  // Detect new files in approved domains
  useEffect(() => {
    const prevFiles = prevFilesRef.current;
    const prevKeys = new Set(prevFiles.map(f => `${f.folder}|${f.name}`));
    (files || []).forEach(f => {
      const inApproved = approvedDomains.includes(f.folder);
      const key = `${f.folder}|${f.name}`;
      if (inApproved && !prevKeys.has(key)) {
        pushNotif({
          type: 'file',
          icon: FileText,
          title: 'New File Added',
          message: `${f.name} added to ${f.folder}`
        });
      }
    });
    prevFilesRef.current = files || [];
  }, [files, approvedDomains]);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isNew: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!isOpen) return;
      const node = containerRef.current;
      if (node && !node.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  return (
    <div className="admin-notif-container" ref={containerRef}>
      {/* Bell Icon with Badge */}
      <div className="admin-notif-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="admin-notif-badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="admin-notif-dropdown">
          {/* Header */}
          <div className="admin-notif-header">
            <h5 className="admin-notif-title">Notifications</h5>
            {unreadCount > 0 && (
              <button className="admin-mark-all" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="admin-notif-list">
            {notifications.length === 0 ? (
              <div className="admin-no-notif">
                <Bell size={40} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={`admin-notif-item ${notification.isNew ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={`admin-notif-icon ${notification.type}`}>
                      <Icon size={18} />
                    </div>
                    <div className="admin-notif-content">
                      <h6>{notification.title}</h6>
                      <p>{notification.message}</p>
                      <span className="admin-notif-time">{notification.time}</span>
                    </div>
                    <button 
                      className="admin-notif-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="admin-notif-footer">
              <button className="admin-mark-all" onClick={clearAll}>Clear all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriberNotification;