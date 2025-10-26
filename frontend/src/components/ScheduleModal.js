import React, { useState } from 'react';

function ScheduleModal({ request, drivers, vehicles, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    driver_id: '',
    vehicle_id: '',
    scheduled_date: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.driver_id) {
      newErrors.driver_id = 'Driver is required';
    }

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Vehicle is required';
    }

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Scheduled date is required';
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
    try {
      await onSubmit({
        ...formData,
        driver_id: parseInt(formData.driver_id),
        vehicle_id: parseInt(formData.vehicle_id),
      });
    } catch (error) {
      console.error('Error submitting schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Schedule Service Request</h2>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
          <p><strong>Customer:</strong> {request.customer_name}</p>
          <p><strong>Service:</strong> {request.service_type}</p>
          <p><strong>Pickup:</strong> {request.pickup_address}</p>
          <p><strong>Delivery:</strong> {request.delivery_address}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="driver_id">Select Driver *</label>
            <select
              id="driver_id"
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
            >
              <option value="">Choose a driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.phone}
                </option>
              ))}
            </select>
            {errors.driver_id && (
              <div className="error-message">{errors.driver_id}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="vehicle_id">Select Vehicle *</label>
            <select
              id="vehicle_id"
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
            >
              <option value="">Choose a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.model} - {vehicle.plate_number}
                </option>
              ))}
            </select>
            {errors.vehicle_id && (
              <div className="error-message">{errors.vehicle_id}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="scheduled_date">Scheduled Date & Time *</label>
            <input
              type="datetime-local"
              id="scheduled_date"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.scheduled_date && (
              <div className="error-message">{errors.scheduled_date}</div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleModal;
