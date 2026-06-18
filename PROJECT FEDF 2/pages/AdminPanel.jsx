import React, { useState } from 'react'

const AMBULANCE_TYPES = [
  'Basic Life Support (BLS)',
  'Advanced Life Support (ALS)',
  'Critical Care Transport (CCT)'
]

/**
 * AdminPanel page to manage fleet CRUD operations and display high-level system logs.
 * @param {Object} props
 * @param {Array} props.ambulances - Current ambulances state
 * @param {Array} props.crew - Current crew state
 * @param {Array} props.incidents - Current incidents state
 * @param {Function} props.onAddAmbulance - Callback to register a new ambulance
 * @param {Function} props.onDeleteAmbulance - Callback to delete an ambulance from the system
 */
function AdminPanel({ ambulances, crew, incidents, onAddAmbulance, onDeleteAmbulance }) {
  // Form State
  const [ambId, setAmbId] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [type, setType] = useState(AMBULANCE_TYPES[0])
  const [selectedDriverId, setSelectedDriverId] = useState('')
  const [selectedParamedicId, setSelectedParamedicId] = useState('')

  // Message alerts
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Filter available crew members for selection in the form
  const availableDrivers = crew.filter((c) => c.role === 'Driver' && c.status === 'Available')
  const availableParamedics = crew.filter((c) => c.role === 'Paramedic' && c.status === 'Available')

  // Auto-generate the next AMB ID based on current list to make it easier for user
  const suggestNextId = () => {
    const ids = ambulances.map(a => parseInt(a.id.replace('AMB-', ''))).filter(n => !isNaN(n))
    const maxId = ids.length > 0 ? Math.max(...ids) : 100
    return `AMB-${maxId + 1}`
  }

  // Pre-fill ID helper
  const handlePreFillId = () => {
    setAmbId(suggestNextId())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!ambId || !vehicleNumber) {
      setErrorMsg('Please fill in both the Ambulance ID and Vehicle Plate Number.')
      return
    }

    // Validate ID uniqueness
    const idExists = ambulances.some((a) => a.id.toUpperCase() === ambId.toUpperCase())
    if (idExists) {
      setErrorMsg(`An ambulance with ID ${ambId.toUpperCase()} already exists.`)
      return
    }

    // Validate Plate Number uniqueness
    const plateExists = ambulances.some((a) => a.vehicleNumber.toUpperCase() === vehicleNumber.toUpperCase())
    if (plateExists) {
      setErrorMsg(`An ambulance with Vehicle Number ${vehicleNumber.toUpperCase()} is already registered.`)
      return
    }

    // Find driver and paramedic details
    const driver = crew.find((c) => c.id === selectedDriverId)
    const paramedic = crew.find((c) => c.id === selectedParamedicId)

    const newVehicle = {
      id: ambId.toUpperCase(),
      vehicleNumber: vehicleNumber.toUpperCase(),
      type,
      driverName: driver ? driver.name : 'Unassigned',
      paramedicName: paramedic ? paramedic.name : 'Unassigned',
      driverId: selectedDriverId || null,
      paramedicId: selectedParamedicId || null,
      status: 'Available'
    }

    onAddAmbulance(newVehicle)

    setSuccessMsg(`Ambulance ${newVehicle.id} (${newVehicle.vehicleNumber}) has been successfully added to the active fleet.`)
    
    // Clear inputs
    setAmbId('')
    setVehicleNumber('')
    setType(AMBULANCE_TYPES[0])
    setSelectedDriverId('')
    setSelectedParamedicId('')
  }

  const handleDelete = (id) => {
    const amb = ambulances.find((a) => a.id === id)
    if (!amb) return

    // Logic guard: prevent deleting a dispatched ambulance
    if (amb.status === 'Dispatched') {
      alert(`Cannot delete ${id}. This vehicle is currently dispatched to an active incident.`)
      return
    }

    if (window.confirm(`Are you sure you want to remove Ambulance ${id} from the fleet registry?`)) {
      onDeleteAmbulance(id)
      setSuccessMsg(`Ambulance ${id} was successfully deleted from the records.`)
    }
  }

  return (
    <div>
      <h1 className="page-title mb-4">System Admin Control Panel</h1>

      {/* Admin stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-custom text-center py-3 bg-white">
            <div className="card-body">
              <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Total Fleet Vehicles</h6>
              <h2 className="card-title fw-extrabold mb-0 text-primary">{ambulances.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-custom text-center py-3 bg-white">
            <div className="card-body">
              <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Total Active Crew Members</h6>
              <h2 className="card-title fw-extrabold mb-0 text-success">{crew.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-custom text-center py-3 bg-white">
            <div className="card-body">
              <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Total Logged Incidents</h6>
              <h2 className="card-title fw-extrabold mb-0 text-teal" style={{ color: 'var(--primary-teal)' }}>{incidents.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error messages */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill me-2"></i> {errorMsg}
          <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Registration Form */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-custom bg-white">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold text-teal card-title" style={{ color: 'var(--primary-teal)' }}>
                <i className="bi bi-plus-circle me-2"></i>Register New Vehicle
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="ambIdInput" className="form-label fw-semibold">Ambulance ID <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="ambIdInput"
                      className="form-control"
                      placeholder="e.g. AMB-121"
                      value={ambId}
                      onChange={(e) => setAmbId(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handlePreFillId}
                      title="Suggest Next ID"
                    >
                      Auto-fill
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="plateNumberInput" className="form-label fw-semibold">Vehicle Plate Number <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="plateNumberInput"
                    className="form-control"
                    placeholder="e.g. TS-09-EA-9999"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="typeSelectAdmin" className="form-label fw-semibold">Care Type</label>
                  <select
                    id="typeSelectAdmin"
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {AMBULANCE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="driverSelectAdmin" className="form-label fw-semibold">Assign Driver</label>
                  <select
                    id="driverSelectAdmin"
                    className="form-select"
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                  >
                    <option value="">-- No Driver Assigned --</option>
                    {availableDrivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="paraSelectAdmin" className="form-label fw-semibold">Assign Paramedic</label>
                  <select
                    id="paraSelectAdmin"
                    className="form-select"
                    value={selectedParamedicId}
                    onChange={(e) => setSelectedParamedicId(e.target.value)}
                  >
                    <option value="">-- No Paramedic Assigned --</option>
                    {availableParamedics.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                <div className="d-grid mt-4">
                  <button 
                    type="submit" 
                    className="btn text-white py-2" 
                    style={{ backgroundColor: 'var(--primary-teal)' }}
                  >
                    <i className="bi bi-save me-1"></i> Save Ambulance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Fleet Records Table */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-custom bg-white">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold card-title">Active Fleet Registry</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-uppercase fs-9">
                    <tr>
                      <th className="ps-4">Vehicle ID</th>
                      <th>Plate Number</th>
                      <th>Care Type</th>
                      <th>Driver / Paramedic</th>
                      <th>Status</th>
                      <th className="pe-4 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambulances.map((amb) => {
                      // Status color
                      let statusBadge = 'bg-success'
                      if (amb.status === 'Dispatched') statusBadge = 'bg-danger'
                      if (amb.status === 'Maintenance') statusBadge = 'bg-warning text-dark'

                      return (
                        <tr key={amb.id}>
                          <td className="ps-4 fw-bold text-dark">{amb.id}</td>
                          <td className="fw-semibold">{amb.vehicleNumber}</td>
                          <td className="small text-muted">{amb.type}</td>
                          <td>
                            <div className="small">
                              <i className="bi bi-person-fill text-muted me-1"></i>
                              {amb.driverName}
                            </div>
                            <div className="small text-muted">
                              <i className="bi bi-heart-pulse-fill text-danger me-1" style={{ fontSize: '0.75rem' }}></i>
                              {amb.paramedicName}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${statusBadge} px-2.5 py-1 text-uppercase`}>{amb.status}</span>
                          </td>
                          <td className="pe-4 text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(amb.id)}
                              disabled={amb.status === 'Dispatched'}
                              title={amb.status === 'Dispatched' ? 'Cannot delete active dispatched vehicle' : 'Remove vehicle'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
