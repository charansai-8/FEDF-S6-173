import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * Sidebar Navigation Component linking all pages via React Router NavLink.
 * @param {Object} props
 * @param {boolean} props.showMobileSidebar - Mobile display visible state
 * @param {Function} props.onLinkClick - Callback to dismiss sidebar on mobile after clicking a route link
 */
function Sidebar({ showMobileSidebar, onLinkClick }) {
  return (
    <aside className={`sidebar ${showMobileSidebar ? 'show' : ''}`}>
      <nav className="nav flex-column">
        <NavLink to="/" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>
        <NavLink to="/dispatch" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-plus-circle"></i> Dispatch Form
        </NavLink>
        <NavLink to="/ambulances" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-truck"></i> Ambulances
        </NavLink>
        <NavLink to="/crew" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-people"></i> Crew Assignment
        </NavLink>
        <NavLink to="/incidents" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-file-earmark-text"></i> Incident Log
        </NavLink>
        <NavLink to="/tracker" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-geo-alt"></i> Status Tracker
        </NavLink>
        <NavLink to="/admin" className="nav-link" onClick={onLinkClick}>
          <i className="bi bi-gear"></i> Admin Panel
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
