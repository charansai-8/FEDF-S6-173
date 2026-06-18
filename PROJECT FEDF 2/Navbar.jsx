import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Top Navbar component displaying logo and critical notifications.
 * @param {Object} props
 * @param {number} props.criticalCount - Number of active critical incidents
 * @param {Function} props.onToggleSidebar - Callback to toggle sidebar in mobile layout
 */
function Navbar({ criticalCount, onToggleSidebar }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom fixed-top shadow-sm">
      <div className="container-fluid px-3">
        {/* Mobile Hamburger toggle */}
        <button 
          className="btn btn-outline-secondary d-lg-none me-2 shadow-none" 
          type="button" 
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <i className="bi bi-list"></i>
        </button>
        
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <i className="bi bi-heart-pulse-fill text-danger fs-4"></i>
          <span>RescueLink</span>
          <span className="badge bg-secondary text-uppercase fs-9 fw-normal" style={{ fontSize: '0.65rem' }}>Dispatch</span>
        </Link>
        
        <div className="ms-auto d-flex align-items-center">
          {criticalCount > 0 && (
            <span className="badge bg-danger rounded-pill me-2 d-none d-sm-inline-block">
              <i className="bi bi-exclamation-octagon-fill me-1"></i>
              {criticalCount} Critical Call{criticalCount > 1 ? 's' : ''}
            </span>
          )}
          <div className="dropdown">
            <Link to="/incidents" className="btn btn-link text-dark position-relative p-1" title="Notification Logs">
              <i className="bi bi-bell fs-5"></i>
              {criticalCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
