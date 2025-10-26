import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-header">
          <h1>🚗 Service Request Management System</h1>
          <p className="landing-tagline">Professional Service Request & Fleet Management Solution</p>
        </div>

        <div className="landing-options">
          <div className="option-card customer-card" onClick={() => navigate('/customer')}>
            <div className="option-icon">👤</div>
            <h2>Customer Portal</h2>
            <p>Submit a new service request</p>
            <ul className="option-features">
              <li>✓ Quick request submission</li>
              <li>✓ Multiple service types</li>
              <li>✓ Schedule preferred dates</li>
              <li>✓ Track your requests</li>
            </ul>
            <button className="option-button customer-button">
              Get Started →
            </button>
          </div>

          <div className="option-card admin-card" onClick={() => navigate('/admin/login')}>
            <div className="option-icon">🔐</div>
            <h2>Admin Dashboard</h2>
            <p>Manage requests and operations</p>
            <ul className="option-features">
              <li>✓ View all requests</li>
              <li>✓ Assign drivers & vehicles</li>
              <li>✓ Track analytics</li>
              <li>✓ Monitor operations</li>
            </ul>
            <button className="option-button admin-button">
              Admin Login →
            </button>
          </div>
        </div>

        <div className="landing-footer">
          <div className="feature-badges">
            <span className="badge">📊 Real-time Analytics</span>
            <span className="badge">🚗 Fleet Management</span>
            <span className="badge">⏰ Smart Scheduling</span>
            <span className="badge">📱 Mobile Friendly</span>
          </div>
          
          <p className="landing-info">
            <strong>Need Help?</strong> Contact our support team 24/7
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
