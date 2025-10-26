import React from 'react';

function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Requests</h3>
        <div className="value">{stats.totalRequests}</div>
      </div>

      <div className="stat-card">
        <h3>Pending</h3>
        <div className="value" style={{ color: '#f39c12' }}>
          {stats.pendingRequests}
        </div>
      </div>

      <div className="stat-card">
        <h3>Completed</h3>
        <div className="value" style={{ color: '#27ae60' }}>
          {stats.completedRequests}
        </div>
      </div>

      <div className="stat-card">
        <h3>Active Assignments</h3>
        <div className="value" style={{ color: '#3498db' }}>
          {stats.activeAssignments}
        </div>
      </div>

      <div className="stat-card">
        <h3>Available Drivers</h3>
        <div className="value">{stats.availableDrivers}</div>
      </div>

      <div className="stat-card">
        <h3>Available Vehicles</h3>
        <div className="value">{stats.availableVehicles}</div>
      </div>
    </div>
  );
}

export default DashboardStats;
