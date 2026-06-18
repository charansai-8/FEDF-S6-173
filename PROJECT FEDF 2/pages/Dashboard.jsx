import React from 'react'
import { Link } from 'react-router-dom'
import PriorityBadge from '../components/PriorityBadge'

/**
 * Dashboard page displaying system summary metrics and active incidents.
 * @param {Object} props
 * @param {Array} props.ambulances - Current ambulances state
 * @param {Array} props.incidents - Current incidents state
 */
function Dashboard({ ambulances, incidents }) {
  // Compute metric totals dynamically based on state
  const totalAmbulances = ambulances.length
  const availableAmbulances = ambulances.filter((a) => a.status === 'Available').length
  const activeIncidents = incidents.filter((i) => i.status !== 'Completed').length
  const completedIncidents = incidents.filter((i) => i.status === 'Completed').length
  const criticalCases = incidents.filter(
    (i) => i.priorityLevel === 'Critical' && i.status !== 'Completed'
  ).length

  // Filter for top 5 active/recent incidents to display in the overview table
  const recentActiveIncidents = incidents
    .filter((i) => i.status !== 'Completed')
    .slice(0, 5)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Dashboard Overview</h1>
        <Link 
          to="/dispatch" 
          className="btn btn-teal text-white shadow-sm d-flex align-items-center gap-2"
          style={{ backgroundColor: 'var(--primary-teal)' }}
        >
          <i className="bi bi-plus-lg"></i>
          <span>New Emergency Dispatch</span>
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Total Ambulances */}
        <div className="col-12 col-sm-6 col-md-4 col-lg">
          <div className="card border-0 shadow-custom border-start border-primary border-4 h-100 bg-white">
            <div className="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Total Fleet</h6>
                <h3 className="card-title mb-0 fw-extrabold">{totalAmbulances}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary rounded p-2.5">
                <i className="bi bi-truck fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Available Ambulances */}
        <div className="col-12 col-sm-6 col-md-4 col-lg">
          <div className="card border-0 shadow-custom border-start border-success border-4 h-100 bg-white">
            <div className="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Available</h6>
                <h3 className="card-title mb-0 fw-extrabold">{availableAmbulances}</h3>
              </div>
              <div className="bg-success bg-opacity-10 text-success rounded p-2.5">
                <i className="bi bi-check-circle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Incidents */}
        <div className="col-12 col-sm-6 col-md-4 col-lg">
          <div className="card border-0 shadow-custom border-start border-warning border-4 h-100 bg-white">
            <div className="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Active Calls</h6>
                <h3 className="card-title mb-0 fw-extrabold">{activeIncidents}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning rounded p-2.5">
                <i className="bi bi-telephone-inbound-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4: Completed Incidents */}
        <div className="col-12 col-sm-6 col-md-4 col-lg">
          <div className="card border-0 shadow-custom border-start border-info border-4 h-100 bg-white">
            <div className="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Completed</h6>
                <h3 className="card-title mb-0 fw-extrabold">{completedIncidents}</h3>
              </div>
              <div className="bg-info bg-opacity-10 text-info rounded p-2.5">
                <i className="bi bi-check2-all fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 5: Critical Cases */}
        <div className="col-12 col-sm-6 col-md-4 col-lg">
          <div className="card border-0 shadow-custom border-start border-danger border-4 h-100 bg-white">
            <div className="card-body py-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle text-muted text-uppercase small fw-bold mb-1">Critical Cases</h6>
                <h3 className="card-title mb-0 fw-extrabold">{criticalCases}</h3>
              </div>
              <div className="bg-danger bg-opacity-10 text-danger rounded p-2.5">
                <i className="bi bi-exclamation-triangle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Incidents and Shortcuts */}
      <div className="row g-4">
        {/* Table Column */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-custom bg-white h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
              <h5 className="mb-0 fw-bold card-title">Recent Active Emergencies</h5>
              <Link to="/incidents" className="btn btn-sm btn-outline-teal" style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}>
                View Incident Log
              </Link>
            </div>
            
            <div className="card-body p-0">
              {recentActiveIncidents.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-activity fs-1 mb-2 d-block"></i>
                  <span>No active emergencies at the moment. All clear!</span>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-uppercase fs-9">
                      <tr>
                        <th className="ps-3">ID</th>
                        <th>Patient</th>
                        <th>Emergency</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Ambulance</th>
                        <th className="pe-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActiveIncidents.map((incident) => (
                        <tr key={incident.id}>
                          <td className="ps-3 fw-bold">{incident.id}</td>
                          <td className="fw-semibold">{incident.patientName}</td>
                          <td>{incident.emergencyType}</td>
                          <td>
                            <PriorityBadge priority={incident.priorityLevel} />
                          </td>
                          <td>
                            <span className="badge rounded-pill bg-light text-dark border">
                              {incident.status}
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold">{incident.assignedAmbulanceId || 'None'}</span>
                          </td>
                          <td className="pe-3 text-center">
                            <Link 
                              to={`/tracker?id=${incident.id}`} 
                              className="btn btn-sm btn-outline-teal d-inline-flex align-items-center gap-1"
                              style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)', fontSize: '0.8rem' }}
                            >
                              <i className="bi bi-geo-alt"></i> Track
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shortcuts Panel */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-custom bg-white mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Quick Navigation</h5>
              <div className="d-grid gap-2">
                <Link to="/dispatch" className="btn btn-outline-secondary text-start py-2.5 px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle text-teal"></i>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>New Dispatch</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Log a call and dispatch assistance</div>
                  </div>
                </Link>
                <Link to="/ambulances" className="btn btn-outline-secondary text-start py-2.5 px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-truck text-teal"></i>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Ambulance Statuses</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>View fleet location and status details</div>
                  </div>
                </Link>
                <Link to="/crew" className="btn btn-outline-secondary text-start py-2.5 px-3 d-flex align-items-center gap-2">
                  <i className="bi bi-people text-teal"></i>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Crew Roster</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Pair paramedics and drivers with vehicles</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-custom bg-white">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-2">Operational Guidelines</h5>
              <p className="card-text text-muted small" style={{ lineHeight: '1.5' }}>
                Verify crew availability before scheduling dispatch actions. Critical calls must be assigned to Advanced Life Support (ALS) or Critical Care Transport (CCT) ambulances immediately. Use the status tracker to log steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
