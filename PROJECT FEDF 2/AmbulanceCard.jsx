import React from 'react'

/**
 * Reusable component to display details and actions for a single ambulance.
 * @param {Object} props
 * @param {Object} props.ambulance - The ambulance data object
 * @param {Function} [props.onToggleMaintenance] - Optional callback when the maintenance status is toggled
 */
function AmbulanceCard({ ambulance, onToggleMaintenance }) {
  const { id, vehicleNumber, type, driverName, paramedicName, status } = ambulance

  // Determine status styling
  let statusBadgeClass = 'bg-success'
  let cardBorderClass = 'border-start-success'
  
  if (status === 'Dispatched') {
    statusBadgeClass = 'bg-danger'
    cardBorderClass = 'border-start-danger'
  } else if (status === 'Maintenance') {
    statusBadgeClass = 'bg-warning text-dark'
    cardBorderClass = 'border-start-warning'
  }

  return (
    <div className={`card shadow-sm h-100 border-0 border-start border-4 ${cardBorderClass}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0 fw-bold text-teal" style={{ color: 'var(--primary-teal)' }}>{id}</h5>
          <span className={`badge ${statusBadgeClass} text-uppercase px-2.5 py-1.5`}>{status}</span>
        </div>
        
        <h6 className="card-subtitle mb-3 text-muted">
          <i className="bi bi-tag-fill me-1"></i> {vehicleNumber}
        </h6>
        
        <div className="mb-3 small">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-secondary">Type:</span>
            <span className="fw-semibold">{type}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span className="text-secondary">Driver:</span>
            <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: '140px' }}>{driverName}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-secondary">Paramedic:</span>
            <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: '140px' }}>{paramedicName}</span>
          </div>
        </div>

        {onToggleMaintenance && (
          <div className="pt-2 border-top">
            <button
              onClick={() => onToggleMaintenance(id)}
              disabled={status === 'Dispatched'}
              className={`btn btn-sm w-100 ${
                status === 'Maintenance' ? 'btn-outline-success' : 'btn-outline-warning'
              }`}
            >
              <i className={`bi ${status === 'Maintenance' ? 'bi-check-circle' : 'bi-tools'} me-1`}></i>
              {status === 'Maintenance' ? 'Set as Active' : 'Send to Maintenance'}
            </button>
            {status === 'Dispatched' && (
              <small className="text-danger d-block mt-1 text-center" style={{ fontSize: '0.75rem' }}>
                Cannot change status while dispatched
              </small>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AmbulanceCard
