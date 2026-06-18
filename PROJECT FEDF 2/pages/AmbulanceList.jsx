import React, { useState } from 'react'
import AmbulanceCard from '../components/AmbulanceCard'

/**
 * AmbulanceList page showing all vehicles in the system with search and filter features.
 * @param {Object} props
 * @param {Array} props.ambulances - Current ambulances state
 * @param {Function} props.onToggleMaintenance - Callback when toggling maintenance status
 */
function AmbulanceList({ ambulances, onToggleMaintenance }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  // Filter Logic
  const filteredAmbulances = ambulances.filter((amb) => {
    // 1. Search term match
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      amb.id.toLowerCase().includes(searchLower) ||
      amb.vehicleNumber.toLowerCase().includes(searchLower) ||
      amb.driverName.toLowerCase().includes(searchLower) ||
      amb.paramedicName.toLowerCase().includes(searchLower)

    // 2. Status match
    const matchesStatus = statusFilter === 'All' || amb.status === statusFilter

    // 3. Type match
    const matchesType = typeFilter === 'All' || amb.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Ambulance Fleet Management</h1>
        <span className="badge bg-secondary px-3 py-2 fs-7">
          Showing {filteredAmbulances.length} of {ambulances.length} Ambulances
        </span>
      </div>

      {/* Filter and Search Controls */}
      <div className="card border-0 shadow-custom bg-white mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <label htmlFor="searchFleet" className="form-label fw-semibold small text-uppercase text-secondary">Search Fleet</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  id="searchFleet"
                  className="form-control border-start-0"
                  placeholder="ID, Plate Number, Staff Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                <option value="Available">Available</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="typeSelect" className="form-label fw-semibold small text-uppercase text-secondary">Filter by Type</label>
              <select
                id="typeSelect"
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Care Types</option>
                <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
                <option value="Critical Care Transport (CCT)">Critical Care Transport (CCT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Ambulance Cards */}
      {filteredAmbulances.length === 0 ? (
        <div className="card border-0 shadow-custom bg-white text-center py-5">
          <div className="card-body">
            <i className="bi bi-truck-flatbed fs-1 text-muted d-block mb-3"></i>
            <h5 className="text-secondary fw-semibold">No vehicles found</h5>
            <p className="text-muted small">Try adjusting your filters or search terms.</p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredAmbulances.map((amb) => (
            <div className="col" key={amb.id}>
              <AmbulanceCard 
                ambulance={amb} 
                onToggleMaintenance={onToggleMaintenance}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AmbulanceList
