import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import StatusTimeline from '../components/StatusTimeline'
import PriorityBadge from '../components/PriorityBadge'

/**
 * StatusTracker page displaying timeline progression for active and completed incidents.
 * @param {Object} props
 * @param {Array} props.incidents - Current incidents state
 * @param {Function} props.onUpdateIncidentStatus - Callback to update incident status in parent state
 */
function StatusTracker({ incidents, onUpdateIncidentStatus }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const incidentIdParam = searchParams.get('id') || ''

  // Fallback to the first active incident if no query parameter is provided
  useEffect(() => {
    if (!incidentIdParam && incidents.length > 0) {
      const firstActive = incidents.find((i) => i.status !== 'Completed')
      if (firstActive) {
        setSearchParams({ id: firstActive.id })
      } else if (incidents.length > 0) {
        setSearchParams({ id: incidents[0].id })
      }
    }
  }, [incidentIdParam, incidents, setSearchParams])

  const selectedIncident = incidents.find((i) => i.id === incidentIdParam)

  const handleIncidentSelect = (e) => {
    const val = e.target.value
    if (val) {
      setSearchParams({ id: val })
    }
  }

  const handleStatusUpdate = (nextStatus) => {
    if (selectedIncident) {
      onUpdateIncidentStatus(selectedIncident.id, nextStatus)
    }
  }

  // Separate active incidents and completed incidents for the selector dropdown
  const activeIncidents = incidents.filter((i) => i.status !== 'Completed')
  const completedIncidents = incidents.filter((i) => i.status === 'Completed')

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Live Incident Tracker</h1>
        <Link to="/incidents" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-file-earmark-text me-1"></i> View Logs
        </Link>
      </div>

      {/* Selector Dropdown */}
      <div className="card border-0 shadow-custom bg-white mb-4">
        <div className="card-body">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-5">
              <label htmlFor="incidentSelect" className="form-label fw-semibold small text-uppercase text-secondary">
                Select Incident to Track
              </label>
              <select
                id="incidentSelect"
                className="form-select border-teal"
                style={{ borderColor: 'var(--primary-teal)' }}
                value={incidentIdParam}
                onChange={handleIncidentSelect}
              >
                <option value="">-- Choose an Incident --</option>
                {activeIncidents.length > 0 && (
                  <optgroup label="Active Incidents">
                    {activeIncidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        {inc.id} - {inc.patientName} ({inc.emergencyType})
                      </option>
                    ))}
                  </optgroup>
                )}
                {completedIncidents.length > 0 && (
                  <optgroup label="Completed Incidents">
                    {completedIncidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        {inc.id} - {inc.patientName} (Completed)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div className="col-12 col-md-7 text-md-end">
              {selectedIncident && selectedIncident.status !== 'Completed' ? (
                <span className="badge bg-danger p-2 fs-8 shadow-sm">
                  <span className="spinner-grow spinner-grow-sm me-1.5" role="status" aria-hidden="true"></span>
                  Live Dispatch Action Running
                </span>
              ) : (
                selectedIncident && (
                  <span className="badge bg-success p-2 fs-8 shadow-sm">
                    <i className="bi bi-check-lg me-1"></i> Mission Completed
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tracker Grid */}
      {selectedIncident ? (
        <div className="row g-4">
          {/* Metadata Card */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-custom bg-white mb-4">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold text-teal card-title" style={{ color: 'var(--primary-teal)' }}>
                  <i className="bi bi-info-circle me-2"></i>Incident Information
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <span className="text-secondary small d-block">Patient Name</span>
                    <strong className="text-dark fs-6">{selectedIncident.patientName}</strong>
                  </div>
                  <div className="col-12 col-sm-6">
                    <span className="text-secondary small d-block">Priority Level</span>
                    <div className="mt-1">
                      <PriorityBadge priority={selectedIncident.priorityLevel} />
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 border-top pt-2.5">
                    <span className="text-secondary small d-block">Caller Name</span>
                    <span className="fw-semibold">{selectedIncident.callerName}</span>
                  </div>
                  <div className="col-12 col-sm-6 border-top pt-2.5">
                    <span className="text-secondary small d-block">Caller Phone</span>
                    <span className="fw-semibold">{selectedIncident.phoneNumber}</span>
                  </div>

                  <div className="col-12 col-sm-6 border-top pt-2.5">
                    <span className="text-secondary small d-block">Emergency Type</span>
                    <span className="fw-semibold">{selectedIncident.emergencyType}</span>
                  </div>
                  <div className="col-12 col-sm-6 border-top pt-2.5">
                    <span className="text-secondary small d-block">Assigned Ambulance</span>
                    <span className="fw-bold text-teal">
                      <i className="bi bi-truck me-1"></i> {selectedIncident.assignedAmbulanceId || 'Unassigned'}
                    </span>
                  </div>

                  <div className="col-12 border-top pt-2.5">
                    <span className="text-secondary small d-block">Logged Timestamp</span>
                    <span className="text-muted small">{new Date(selectedIncident.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="col-12 border-top pt-2.5">
                    <span className="text-secondary small d-block">Location / Address</span>
                    <p className="mb-0 bg-light p-2.5 rounded small text-dark border mt-1">
                      {selectedIncident.address}
                    </p>
                  </div>

                  <div className="col-12 border-top pt-2.5">
                    <span className="text-secondary small d-block">Notes</span>
                    <p className="mb-0 text-muted small bg-light p-2.5 rounded border mt-1" style={{ fontStyle: 'italic' }}>
                      {selectedIncident.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Progress Column */}
          <div className="col-12 col-lg-5">
            <StatusTimeline 
              currentStatus={selectedIncident.status} 
              onStatusUpdate={handleStatusUpdate} 
            />
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-custom bg-white text-center py-5">
          <div className="card-body">
            <i className="bi bi-geo-alt fs-1 text-muted d-block mb-3"></i>
            <h5 className="text-secondary fw-semibold">No Incident Selected</h5>
            <p className="text-muted small">Select an emergency log from the dropdown menu to start tracking.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusTracker
