import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PriorityBadge from '../components/PriorityBadge'

/**
 * IncidentLog page displaying all call logs, search/filters, CSV exports, and a modal detail view.
 * @param {Object} props
 * @param {Array} props.incidents - Current incidents state
 */
function IncidentLog({ incidents }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Selected incident details for the popup/modal
  const [selectedIncident, setSelectedIncident] = useState(null)

  // Filter Logic
  const filteredIncidents = incidents.filter((incident) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      incident.id.toLowerCase().includes(searchLower) ||
      incident.patientName.toLowerCase().includes(searchLower) ||
      incident.callerName.toLowerCase().includes(searchLower) ||
      incident.emergencyType.toLowerCase().includes(searchLower) ||
      incident.address.toLowerCase().includes(searchLower)

    const matchesPriority = priorityFilter === 'All' || incident.priorityLevel === priorityFilter
    const matchesStatus = statusFilter === 'All' || incident.status === statusFilter

    return matchesSearch && matchesPriority && matchesStatus
  })

  // Simple client-side CSV Export Function
  const handleExportCSV = () => {
    if (filteredIncidents.length === 0) {
      alert('No data to export.')
      return
    }

    // CSV Headers
    const headers = [
      'Incident ID',
      'Caller Name',
      'Phone Number',
      'Patient Name',
      'Emergency Type',
      'Address',
      'Priority Level',
      'Assigned Ambulance',
      'Status',
      'Logged Time',
      'Notes'
    ]

    // Convert incidents to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...filteredIncidents.map((inc) => {
        return [
          `"${inc.id}"`,
          `"${inc.callerName.replace(/"/g, '""')}"`,
          `"${inc.phoneNumber}"`,
          `"${inc.patientName.replace(/"/g, '""')}"`,
          `"${inc.emergencyType.replace(/"/g, '""')}"`,
          `"${inc.address.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${inc.priorityLevel}"`,
          `"${inc.assignedAmbulanceId || 'None'}"`,
          `"${inc.status}"`,
          `"${new Date(inc.timestamp).toLocaleString()}"`,
          `"${inc.notes.replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(',')
      })
    ]

    // Create file blob and trigger download
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `incident_logs_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Emergency Incident Logs</h1>
        <div className="d-flex gap-2">
          <button 
            onClick={handleExportCSV} 
            className="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-download"></i>
            <span>Export to CSV</span>
          </button>
          <Link 
            to="/dispatch" 
            className="btn btn-teal text-white shadow-sm"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            <i className="bi bi-plus-lg me-1"></i> New Dispatch
          </Link>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="card border-0 shadow-custom bg-white mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-12 col-md-4">
              <label htmlFor="searchInc" className="form-label fw-semibold small text-uppercase text-secondary">Search Logs</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  id="searchInc"
                  className="form-control border-start-0"
                  placeholder="ID, Caller, Patient, Type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Priority Filter */}
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="prioritySelect" className="form-label fw-semibold small text-uppercase text-secondary">Filter by Priority</label>
              <select
                id="prioritySelect"
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="statusSelect" className="form-label fw-semibold small text-uppercase text-secondary">Filter by Status</label>
              <select
                id="statusSelect"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Call Received">Call Received</option>
                <option value="Ambulance Assigned">Ambulance Assigned</option>
                <option value="Crew Assigned">Crew Assigned</option>
                <option value="En Route">En Route</option>
                <option value="Arrived At Scene">Arrived At Scene</option>
                <option value="Patient Picked Up">Patient Picked Up</option>
                <option value="Reached Hospital">Reached Hospital</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table Card */}
      <div className="card border-0 shadow-custom bg-white">
        <div className="card-body p-0">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-file-earmark-text fs-1 mb-2 d-block"></i>
              <span>No incident logs match your query.</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-9">
                  <tr>
                    <th className="ps-4">Incident ID</th>
                    <th>Patient Name</th>
                    <th>Emergency Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Vehicle</th>
                    <th>Logged Date/Time</th>
                    <th className="pe-4 text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map((incident) => {
                    const localTime = new Date(incident.timestamp).toLocaleString()
                    return (
                      <tr key={incident.id}>
                        <td className="ps-4 fw-bold">{incident.id}</td>
                        <td className="fw-semibold">{incident.patientName}</td>
                        <td>{incident.emergencyType}</td>
                        <td>
                          <PriorityBadge priority={incident.priorityLevel} />
                        </td>
                        <td>
                          <span className={`badge rounded-pill bg-light text-dark border px-2 py-1`}>
                            {incident.status}
                          </span>
                        </td>
                        <td className="fw-bold text-teal">{incident.assignedAmbulanceId || 'None'}</td>
                        <td className="text-muted small">{localTime}</td>
                        <td className="pe-4 text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            <i className="bi bi-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Simple react-based Detail Modal */}
      {selectedIncident && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-activity text-danger me-2"></i>
                  Incident Details: {selectedIncident.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedIncident(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Patient Name</span>
                    <strong className="fs-5 text-dark">{selectedIncident.patientName}</strong>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Priority Level</span>
                    <div className="mt-1">
                      <PriorityBadge priority={selectedIncident.priorityLevel} />
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Caller Name</span>
                    <span>{selectedIncident.callerName}</span>
                  </div>
                  <div className="col-12 col-md-6 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Phone Number</span>
                    <span>{selectedIncident.phoneNumber}</span>
                  </div>

                  <div className="col-12 col-md-6 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Emergency Category</span>
                    <span>{selectedIncident.emergencyType}</span>
                  </div>
                  <div className="col-12 col-md-6 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Assigned Unit</span>
                    <span className="fw-bold text-teal">{selectedIncident.assignedAmbulanceId || 'None'}</span>
                  </div>

                  <div className="col-12 col-md-6 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Current Flow Status</span>
                    <span className="badge bg-light text-dark border px-2 py-1 mt-1">{selectedIncident.status}</span>
                  </div>
                  <div className="col-12 col-md-6 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Log Date & Time</span>
                    <span className="small text-muted">{new Date(selectedIncident.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="col-12 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Incident Location Address</span>
                    <p className="mb-0 bg-light p-2 rounded small text-dark border">{selectedIncident.address}</p>
                  </div>

                  <div className="col-12 border-top pt-2">
                    <span className="text-muted d-block small text-uppercase fw-semibold">Dispatch Operational Notes</span>
                    <p className="mb-0 text-muted small bg-light p-2 rounded border" style={{ fontStyle: 'italic' }}>
                      {selectedIncident.notes}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light py-2.5">
                <Link 
                  to={`/tracker?id=${selectedIncident.id}`}
                  className="btn btn-sm btn-teal text-white" 
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                  onClick={() => setSelectedIncident(null)}
                >
                  <i className="bi bi-geo-alt me-1"></i> Track Live Status
                </Link>
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => setSelectedIncident(null)}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncidentLog
