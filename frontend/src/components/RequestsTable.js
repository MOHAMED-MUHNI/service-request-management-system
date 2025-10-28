import React from 'react';

function RequestsTable({
  requests,
  pagination,
  filters,
  loading,
  onFilterChange,
  onPageChange,
  onSchedule,
  onStatusChange,
}) {
  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="search-input"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />

        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="filter-select"
          value={filters.service_type}
          onChange={(e) => onFilterChange('service_type', e.target.value)}
        >
          <option value="">All Services</option>
          <option value="Package Delivery">Package Delivery</option>
          <option value="Furniture Moving">Furniture Moving</option>
          <option value="Document Courier">Document Courier</option>
          <option value="Express Delivery">Express Delivery</option>
          <option value="Freight Transport">Freight Transport</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      ) : requests.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
          No service requests found
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Service Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>#{request.id}</td>
                  <td>{request.customer_name}</td>
                  <td>
                    <div>{request.customer_email}</div>
                    <div style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
                      {request.customer_phone}
                    </div>
                  </td>
                  <td>{request.service_type}</td>
                  <td>
                    {new Date(request.preferred_date).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', marginRight: '0.5rem' }}
                          onClick={() => onSchedule(request)}
                        >
                          Schedule
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to reject this request?')) {
                              onStatusChange(request.id, 'cancelled');
                            }
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'assigned' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        onClick={() => onStatusChange(request.id, 'in_progress')}
                      >
                        Start
                      </button>
                    )}
                    {request.status === 'in_progress' && (
                      <button
                        className="btn btn-success"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        onClick={() => onStatusChange(request.id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default RequestsTable;
