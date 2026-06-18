import React, { useState } from 'react'

/**
 * CrewAssignment page managing crew roster and ambulance binding.
 * @param {Object} props
 * @param {Array} props.crew - Current crew state
 * @param {Array} props.ambulances - Current ambulances state
 * @param {Function} props.onAssignCrew - Callback to assign a crew member to a vehicle
 * @param {Function} props.onUnassignCrew - Callback to unassign a crew member
 */
function CrewAssignment({ crew, ambulances, onAssignCrew, onUnassignCrew }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Keep track of which ambulance ID is selected for assignment, keyed by crewId
  const [selectedAmbulances, setSelectedAmbulances] = useState({})

  const handleAmbulanceSelect = (crewId, ambId) => {
    setSelectedAmbulances((prev) => ({
      ...prev,
      [crewId]: ambId
    }))
  }

  const handleAssign = (crewId) => {
    const ambId = selectedAmbulances[crewId]
    if (!ambId) return
    onAssignCrew(crewId, ambId)
    // Clear selection
    setSelectedAmbulances((prev) => {
      const copy = { ...prev }
      delete copy[crewId]
      return copy
    })
  }

  // Filter crew list
  const filteredCrew = crew.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (member.assignedAmbulanceId && member.assignedAmbulanceId.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = roleFilter === 'All' || member.role === roleFilter
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Group ambulances that are not currently out on a dispatch run, 
  // though we allow assigning crew to any active ambulance.
  const activeAmbulances = ambulances.filter(a => a.status !== 'Maintenance')

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Emergency Crew Assignment</h1>
        <span className="badge bg-secondary px-3 py-2 fs-7">
          {crew.filter(c => c.status === 'Available').length} Crew Members Available
        </span>
      </div>

      {/* Roster Controls */}
      <div className="card border-0 shadow-custom bg-white mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-12 col-md-4">
              <label htmlFor="searchCrew" className="form-label fw-semibold small text-uppercase text-secondary">Search Roster</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  id="searchCrew"
                  className="form-control border-start-0"
                  placeholder="ID, Name, or Ambulance ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="roleFilter" className="form-label fw-semibold small text-uppercase text-secondary">Filter by Role</label>
              <select
                id="roleFilter"
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Driver">Drivers</option>
                <option value="Paramedic">Paramedics</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="statusFilter" className="form-label fw-semibold small text-uppercase text-secondary">Filter by Status</label>
              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available (Unassigned)</option>
                <option value="Assigned">Assigned (Active Duty)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Crew Table */}
      <div className="card border-0 shadow-custom bg-white">
        <div className="card-body p-0">
          {filteredCrew.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1 mb-2 d-block"></i>
              <span>No crew members matched your criteria.</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-9">
                  <tr>
                    <th className="ps-4">Crew ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Assigned Ambulance</th>
                    <th className="pe-4 text-end" style={{ width: '280px' }}>Assignment Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrew.map((member) => {
                    const isAssigned = member.status === 'Assigned'
                    const currentSelected = selectedAmbulances[member.id] || ''

                    return (
                      <tr key={member.id}>
                        <td className="ps-4 fw-bold text-muted">{member.id}</td>
                        <td className="fw-semibold">{member.name}</td>
                        <td>
                          <span className={`badge ${member.role === 'Driver' ? 'bg-secondary' : 'bg-info'} px-2.5 py-1`}>
                            <i className={`bi ${member.role === 'Driver' ? 'bi-person-badge' : 'bi-heart-pulse'} me-1`}></i>
                            {member.role}
                          </span>
                        </td>
                        <td>{member.phone}</td>
                        <td>
                          <span className={`badge ${isAssigned ? 'bg-secondary' : 'bg-success'} px-2.5 py-1`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="fw-bold text-teal">
                          {member.assignedAmbulanceId ? (
                            <span>
                              <i className="bi bi-truck me-1"></i>
                              {member.assignedAmbulanceId}
                            </span>
                          ) : (
                            <span className="text-muted fw-normal small">Not Assigned</span>
                          )}
                        </td>
                        <td className="pe-4 text-end">
                          {isAssigned ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onUnassignCrew(member.id)}
                            >
                              <i className="bi bi-person-x-fill me-1"></i> Release Crew
                            </button>
                          ) : (
                            <div className="input-group input-group-sm justify-content-end">
                              <select
                                className="form-select flex-grow-0"
                                style={{ maxWidth: '160px' }}
                                value={currentSelected}
                                onChange={(e) => handleAmbulanceSelect(member.id, e.target.value)}
                              >
                                <option value="">Select Amb...</option>
                                {activeAmbulances.map((amb) => (
                                  <option key={amb.id} value={amb.id}>
                                    {amb.id} ({amb.vehicleNumber})
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-teal text-white"
                                style={{ backgroundColor: 'var(--primary-teal)' }}
                                type="button"
                                disabled={!currentSelected}
                                onClick={() => handleAssign(member.id)}
                              >
                                <i className="bi bi-person-plus-fill"></i> Assign
                              </button>
                            </div>
                          )}
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
    </div>
  )
}

export default CrewAssignment
