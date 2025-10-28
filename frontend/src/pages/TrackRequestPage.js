import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceRequestAPI } from '../services/api';

function TrackRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    setRequests([]);

    try {
      const response = await serviceRequestAPI.track(formData.email, formData.phone);
      setRequests(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'assigned':
        return '#3498db';
      case 'in_progress':
        return '#9b59b6';
      case 'completed':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="navbar" style={{ justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/')}
          className="back-home-button"
          style={{
            position: 'absolute',
            left: '2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Home
        </button>
        <h1 style={{ margin: 0 }}>Track My Request</h1>
      </div>

      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="form-container">
          <h2>Track Your Service Request</h2>
          <p style={{ marginBottom: '1.5rem', color: '#7f8c8d' }}>
            Enter your email and phone number to check the status of your request
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Track Request'}
            </button>
          </form>

          {error && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '8px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}
        </div>

        {searched && requests.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              Your Requests ({requests.length})
            </h3>
            {requests.map((request) => (
              <div
                key={request.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                      Request #{request.id} - {request.service_type}
                    </h4>
                    <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
                      Submitted on {formatDate(request.created_at)}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      background: getStatusColor(request.status),
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                  >
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div>
                    <strong style={{ color: '#34495e' }}>Pickup:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d' }}>{request.pickup_address}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#34495e' }}>Delivery:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d' }}>{request.delivery_address}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#34495e' }}>Preferred Date:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d' }}>{formatDate(request.preferred_date)}</p>
                  </div>
                </div>

                {request.status === 'assigned' && request.driver_name && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#e8f5e9',
                    borderRadius: '8px',
                    border: '1px solid #c8e6c9'
                  }}>
                    <h5 style={{ margin: '0 0 0.75rem 0', color: '#2e7d32' }}>Assignment Details</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <strong style={{ color: '#2e7d32' }}>Driver:</strong>
                        <p style={{ margin: '0.25rem 0 0 0' }}>{request.driver_name}</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>{request.driver_phone}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#2e7d32' }}>Vehicle:</strong>
                        <p style={{ margin: '0.25rem 0 0 0' }}>{request.vehicle_model}</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>{request.vehicle_plate}</p>
                      </div>
                      {request.scheduled_date && (
                        <div>
                          <strong style={{ color: '#2e7d32' }}>Scheduled:</strong>
                          <p style={{ margin: '0.25rem 0 0 0' }}>{formatDate(request.scheduled_date)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {searched && requests.length === 0 && !loading && !error && (
          <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'white',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
              No requests found with the provided information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackRequestPage;
