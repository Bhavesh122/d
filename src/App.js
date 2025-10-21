import React, { useState } from 'react';
import LandingPage from './Pages/HomePage/LandingPage';
import LoginPage from './Pages/HomePage/LoginPage';
import SignupPage from './Pages/HomePage/SignupPage';
import OpsDashboard from './Pages/OpsPage/OpsDashboard';
import Dashboard from './Pages/AdminPage/AdminDashBoard/Dashboard';
import SubscriberDashboard from './Pages/SubscriberPage/SubscriberDashboard/SubscriberDashboard';
import './Pages/HomePage/Style.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState(null);

  const navigate = (page, role = null) => {
    setCurrentPage(page);
    setUserRole(role);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage navigate={navigate} />;
      case 'login':
        return <LoginPage role={userRole} navigate={navigate} />;
      case 'signup':
        return <SignupPage role={userRole} navigate={navigate} />;
      case 'admin-dashboard':
        return <Dashboard navigate={navigate} />;
      case 'ops-dashboard':
        return <OpsDashboard navigate={navigate} />;
      case 'subscriber-dashboard':
        return <SubscriberDashboard navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
};

export default App;