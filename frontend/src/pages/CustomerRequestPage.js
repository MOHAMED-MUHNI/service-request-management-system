import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceRequestAPI } from '../services/api';

function CustomerRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    service_type: '',
    pickup_address: '',
    delivery_address: '',
    preferred_date: '',
    special_instructions: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email is invalid';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone is required';
    }

    if (!formData.service_type) {
      newErrors.service_type = 'Service type is required';
    }

    if (!formData.pickup_address.trim()) {
      newErrors.pickup_address = 'Pickup address is required';
    }

    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = 'Delivery address is required';
    }

    if (!formData.preferred_date) {
      newErrors.preferred_date = 'Preferred date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await serviceRequestAPI.create(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        service_type: '',
        pickup_address: '',
        delivery_address: '',
        preferred_date: '',
        special_instructions: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar">
        <button 
          onClick={() => navigate('/')} 
          className="back-home-button"
          style={{
            position: 'absolute',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Back to Home
        </button>
        <h1>🚚 Service Request App</h1>
      </div>

      <div className="container">
        <div className="form-container">
          <h2>Submit a Service Request</h2>
          <p style={{ marginBottom: '1.5rem', color: '#7f8c8d' }}>
            Fill out the form below to request our services
          </p>

          {success && (
            <div className="success-message">
              ✓ Your service request has been submitted successfully! We'll contact you soon.
            </div>
          )}

          {errors.submit && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customer_name">Full Name *</label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.customer_name && (
                <div className="error-message">{errors.customer_name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer_email">Email Address *</label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.customer_email && (
                <div className="error-message">{errors.customer_email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer_phone">Phone Number *</label>
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder="555-1234"
              />
              {errors.customer_phone && (
                <div className="error-message">{errors.customer_phone}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="service_type">Service Type *</label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
              >
                <option value="">Select a service</option>
                <option value="Package Delivery">Package Delivery</option>
                <option value="Furniture Moving">Furniture Moving</option>
                <option value="Document Courier">Document Courier</option>
                <option value="Express Delivery">Express Delivery</option>
                <option value="Freight Transport">Freight Transport</option>
              </select>
              {errors.service_type && (
                <div className="error-message">{errors.service_type}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="pickup_address">Pickup Address *</label>
              <textarea
                id="pickup_address"
                name="pickup_address"
                value={formData.pickup_address}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
              />
              {errors.pickup_address && (
                <div className="error-message">{errors.pickup_address}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="delivery_address">Delivery Address *</label>
              <textarea
                id="delivery_address"
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder="456 Oak Ave, City, State, ZIP"
              />
              {errors.delivery_address && (
                <div className="error-message">{errors.delivery_address}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="preferred_date">Preferred Date *</label>
              <input
                type="date"
                id="preferred_date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.preferred_date && (
                <div className="error-message">{errors.preferred_date}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="special_instructions">Special Instructions (Optional)</label>
              <textarea
                id="special_instructions"
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                placeholder="Any special requirements or instructions..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerRequestPage;
