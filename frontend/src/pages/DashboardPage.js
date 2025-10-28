import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  serviceRequestAPI,
  analyticsAPI,
  driverAPI,
  vehicleAPI,
  assignmentAPI,
} from '../services/api';
import DashboardStats from '../components/DashboardStats';
import RequestsChart from '../components/RequestsChart';
import RequestsTable from '../components/RequestsTable';
import ScheduleModal from '../components/ScheduleModal';

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    service_type: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      const [statsRes, chartRes, driversRes, vehiclesRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getRequestsByDay(7),
        driverAPI.getAvailable(),
        vehicleAPI.getAvailable(),
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data);
      setDrivers(driversRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await serviceRequestAPI.getAll(filters);
      setRequests(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSchedule = (request) => {
    setSelectedRequest(request);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (scheduleData) => {
    try {
      await assignmentAPI.create({
        request_id: selectedRequest.id,
        driver_id: scheduleData.driver_id,
        vehicle_id: scheduleData.vehicle_id,
        scheduled_date: scheduleData.scheduled_date,
      });

      // Reload data
      await loadDashboardData();
      await loadRequests();
      setShowScheduleModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await serviceRequestAPI.updateStatus(id, newStatus);
      await loadRequests();
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-container">
        {stats && <DashboardStats stats={stats} />}

        {chartData.length > 0 && <RequestsChart data={chartData} />}

        <RequestsTable
          requests={requests}
          pagination={pagination}
          filters={filters}
          loading={loading}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onSchedule={handleSchedule}
          onStatusChange={handleStatusChange}
        />
      </div>

      {showScheduleModal && (
        <ScheduleModal
          request={selectedRequest}
          drivers={drivers}
          vehicles={vehicles}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleScheduleSubmit}
        />
      )}
    </div>
  );
}

export default DashboardPage;
