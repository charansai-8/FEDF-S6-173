import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const EMERGENCY_TYPES = [
  'Cardiac Arrest',
  'Road Traffic Accident',
  'Severe Burn',
  'Breathing Difficulty',
  'Pregnancy Labor',
  'Stroke / Paralysis',
  'High Fever & Convulsions',
  'Fracture & Trauma',
  'Other Medical Emergency'
]

/**
 * DispatchForm page allowing users to register new emergencies and allocate available ambulances.
 * @param {Object} props
 * @param {Array} props.ambulances - Current ambulances state
 * @param {Function} props.onAddIncident - Callback to add new incident and update ambulance status
 */
function DispatchForm({ ambulances, onAddIncident }) {
  // Filter for available ambulances that can be dispatched
  const availableAmbulances = ambulances.filter((a) => a.status === 'Available')

  // Form Fields State
  const [callerName, setCallerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [patientName, setPatientName] = useState('')
  const [emergencyType, setEmergencyType] = useState('')
  const [address, setAddress] = useState('')
  const [priorityLevel, setPriorityLevel] = useState('Medium')
  const [assignedAmbulanceId, setAssignedAmbulanceId] = useState('')
  const [notes, setNotes] = useState('')

  // UI Alert States
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [newIncidentId, setNewIncidentId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Basic validation
    if (!callerName || !phoneNumber || !patientName || !emergencyType || !address || !assignedAmbulanceId) {
      setErrorMsg('Please fill in all required fields, including assigning an ambulance.')
      return
    }

    // Phone number format validation (simple digit check)
    if (!/^\d{10}$/.test(phoneNumber.replace(/[-+ ]/g, ''))) {
      setErrorMsg('Please enter a valid 10-digit phone number.')
      return
    }

    // Call the parent state handler to save the incident
    const response = onAddIncident({
      callerName,
      phoneNumber,
      patientName,
      emergencyType,
      address,
      priorityLevel,
      assignedAmbulanceId,
      notes: notes || 'No additional notes provided.'
    })

    if (response && response.success) {
      setNewIncidentId(response.id)
      setSuccessMsg(`Incident successfully registered under ID ${response.id}! Ambulance ${assignedAmbulanceId} has been dispatched.`)
      
      // Reset form fields
      setCallerName('')
      setPhoneNumber('')
      setPatientName('')
      setEmergencyType('')
      setAddress('')
      setPriorityLevel('Medium')
      setAssignedAmbulanceId('')
      setNotes('')
    } else {
      setErrorMsg('Failed to process dispatch. Please try again.')
    }
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Emergency Dispatch Form</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="alert alert-success shadow-sm d-flex align-items-start gap-3 p-3 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-4 mt-0.5"></i>
          <div className="flex-fill">
            <h5 className="alert-heading fw-bold mb-1">Dispatch Confirmed!</h5>
            <p className="mb-2">{successMsg}</p>
            <div className="d-flex gap-2">
              <Link to={`/tracker?id=${newIncidentId}`} className="btn btn-sm btn-success">
                <i className="bi bi-geo-alt"></i> Track Live Timeline
              </Link>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-success" 
                onClick={() => setSuccessMsg('')}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="alert alert-danger shadow-sm d-flex align-items-center gap-2 p-3 mb-4" role="alert">
          <i className="bi bi-exclamation-octagon-fill fs-5"></i>
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="card border-0 shadow-custom bg-white">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0 fw-bold card-title text-teal" style={{ color: 'var(--primary-teal)' }}>
            <i className="bi bi-telephone-plus me-2"></i>Log Call & Allocate Vehicle
          </h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Row 1: Caller Details */}
              <div className="col-md-6">
                <label htmlFor="callerName" className="form-label fw-semibold">Caller Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="callerName"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit number"
                  required
                />
              </div>

              {/* Row 2: Patient & Emergency Details */}
              <div className="col-md-6">
                <label htmlFor="patientName" className="form-label fw-semibold">Patient Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Amit Sharma (or 'Unknown')"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="emergencyType" className="form-label fw-semibold">Emergency Type <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  id="emergencyType"
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  required
                >
                  <option value="">-- Select Emergency Type --</option>
                  {EMERGENCY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Row 3: Priority & Ambulance Assignment */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Priority Level <span className="text-danger">*</span></label>
                <div className="d-flex gap-3 mt-1">
                  {['Critical', 'High', 'Medium', 'Low'].map((level) => (
                    <div className="form-check" key={level}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="priorityRadio"
                        id={`priority-${level}`}
                        value={level}
                        checked={priorityLevel === level}
                        onChange={(e) => setPriorityLevel(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={`priority-${level}`}>
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="assignedAmbulance" className="form-label fw-semibold">Assign Ambulance <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  id="assignedAmbulance"
                  value={assignedAmbulanceId}
                  onChange={(e) => setAssignedAmbulanceId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Available Ambulance --</option>
                  {availableAmbulances.map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      {amb.id} - {amb.vehicleNumber} ({amb.type})
                    </option>
                  ))}
                </select>
                {availableAmbulances.length === 0 && (
                  <div className="form-text text-danger">
                    <i className="bi bi-exclamation-triangle"></i> All ambulances are currently dispatched or in maintenance. Set active crew in the Admin Panel or wait for an ambulance to complete its log.
                  </div>
                )}
              </div>

              {/* Row 4: Address */}
              <div className="col-12">
                <label htmlFor="address" className="form-label fw-semibold">Address / Location <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  id="address"
                  rows="2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Detailed address or location coordinates..."
                  required
                ></textarea>
              </div>

              {/* Row 5: Notes */}
              <div className="col-12">
                <label htmlFor="notes" className="form-label fw-semibold">Incident Dispatch Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any symptoms, landmarks, or special instructions..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="col-12 text-end mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light border me-2"
                  onClick={() => {
                    setCallerName('')
                    setPhoneNumber('')
                    setPatientName('')
                    setEmergencyType('')
                    setAddress('')
                    setPriorityLevel('Medium')
                    setAssignedAmbulanceId('')
                    setNotes('')
                  }}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="btn text-white"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                  disabled={availableAmbulances.length === 0}
                >
                  <i className="bi bi-send me-1"></i> Register & Dispatch
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DispatchForm
