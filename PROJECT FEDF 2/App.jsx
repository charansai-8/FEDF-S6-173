import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom'

// Layout files
import './App.css'

// Page Components
import Dashboard from './pages/Dashboard'
import DispatchForm from './pages/DispatchForm'
import AmbulanceList from './pages/AmbulanceList'
import CrewAssignment from './pages/CrewAssignment'
import IncidentLog from './pages/IncidentLog'
import StatusTracker from './pages/StatusTracker'
import AdminPanel from './pages/AdminPanel'

// Decoupled Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Utilities & Mock Data
import { mockData } from './data/mockData'
import {
  initStorage,
  getAmbulances,
  getCrew,
  getIncidents,
  saveAmbulances,
  saveCrew,
  saveIncidents
} from './utils/storage'

function App() {
  // Toggle for responsive navigation on small viewport sizes
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // ----------------------------------------------------
  // LocalStorage State Management
  // ----------------------------------------------------
  const [ambulances, setAmbulances] = useState([])
  const [crew, setCrew] = useState([])
  const [incidents, setIncidents] = useState([])

  // On mount, initialize storage (if empty) and load current datasets
  useEffect(() => {
    initStorage(mockData)
    setAmbulances(getAmbulances())
    setCrew(getCrew())
    setIncidents(getIncidents())
  }, [])

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar)
  }

  // ----------------------------------------------------
  // Callback Handlers (Lifting State Up)
  // ----------------------------------------------------

  // 1. Toggle Maintenance Status
  const handleToggleMaintenance = (id) => {
    const updated = ambulances.map((amb) => {
      if (amb.id === id) {
        return {
          ...amb,
          status: amb.status === 'Maintenance' ? 'Available' : 'Maintenance'
        }
      }
      return amb
    })
    setAmbulances(updated)
    saveAmbulances(updated)
  }

  // 2. Add New Emergency Incident (Dispatch Form)
  const handleAddIncident = (incidentData) => {
    // Generate clean incrementing INC ID
    const nextIncNum = incidents.length > 0 
      ? Math.max(...incidents.map((i) => {
          const num = parseInt(i.id.replace('INC-', ''))
          return isNaN(num) ? 1000 : num
        })) + 1 
      : 1001

    const newId = `INC-${nextIncNum}`
    const newIncident = {
      id: newId,
      ...incidentData,
      status: 'Call Received',
      timestamp: new Date().toISOString()
    }

    // Update incidents collection
    const updatedIncidents = [newIncident, ...incidents]
    setIncidents(updatedIncidents)
    saveIncidents(updatedIncidents)

    // Set assigned ambulance status to 'Dispatched'
    const updatedAmbs = ambulances.map((amb) => {
      if (amb.id === incidentData.assignedAmbulanceId) {
        return { ...amb, status: 'Dispatched' }
      }
      return amb
    })
    setAmbulances(updatedAmbs)
    saveAmbulances(updatedAmbs)

    return { success: true, id: newId }
  }

  // 3. Assign Crew to Ambulance
  const handleAssignCrew = (crewId, ambId) => {
    // 1. Update Crew Status
    const updatedCrew = crew.map((member) => {
      if (member.id === crewId) {
        return { ...member, status: 'Assigned', assignedAmbulanceId: ambId }
      }
      return member
    })
    setCrew(updatedCrew)
    saveCrew(updatedCrew)

    // 2. Update Ambulance details
    const member = crew.find((c) => c.id === crewId)
    const updatedAmbs = ambulances.map((amb) => {
      if (amb.id === ambId) {
        if (member.role === 'Driver') {
          return { ...amb, driverName: member.name, driverId: member.id }
        } else {
          return { ...amb, paramedicName: member.name, paramedicId: member.id }
        }
      }
      return amb
    })
    setAmbulances(updatedAmbs)
    saveAmbulances(updatedAmbs)
  }

  // 4. Release Crew from Assignment
  const handleUnassignCrew = (crewId) => {
    const member = crew.find((c) => c.id === crewId)
    if (!member) return
    const ambId = member.assignedAmbulanceId

    // 1. Release Crew Status
    const updatedCrew = crew.map((c) => {
      if (c.id === crewId) {
        return { ...c, status: 'Available', assignedAmbulanceId: null }
      }
      return c
    })
    setCrew(updatedCrew)
    saveCrew(updatedCrew)

    // 2. Clear from Ambulance
    if (ambId) {
      const updatedAmbs = ambulances.map((amb) => {
        if (amb.id === ambId) {
          if (member.role === 'Driver') {
            return { ...amb, driverName: 'Unassigned', driverId: null }
          } else {
            return { ...amb, paramedicName: 'Unassigned', paramedicId: null }
          }
        }
        return amb
      })
      setAmbulances(updatedAmbs)
      saveAmbulances(updatedAmbs)
    }
  }

  // 5. Update Timeline Status (Status Tracker)
  const handleUpdateIncidentStatus = (incidentId, nextStatus) => {
    const incident = incidents.find((i) => i.id === incidentId)
    if (!incident) return

    // Update Incident Status
    const updatedIncidents = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return { ...inc, status: nextStatus }
      }
      return inc
    })
    setIncidents(updatedIncidents)
    saveIncidents(updatedIncidents)

    // Synchronize vehicle availability if flow completes
    if (nextStatus === 'Completed' && incident.assignedAmbulanceId) {
      const updatedAmbs = ambulances.map((amb) => {
        if (amb.id === incident.assignedAmbulanceId) {
          return { ...amb, status: 'Available' }
        }
        return amb
      })
      setAmbulances(updatedAmbs)
      saveAmbulances(updatedAmbs)
    }
  }

  // 6. Admin Panel CRUD: Add Vehicle
  const handleAddAmbulance = (newVehicle) => {
    const updatedAmbs = [...ambulances, newVehicle]
    setAmbulances(updatedAmbs)
    saveAmbulances(updatedAmbs)

    // If driver and paramedic were pre-bound in form, lock their status in Crew state
    const crewIdsToLock = []
    if (newVehicle.driverId) crewIdsToLock.push(newVehicle.driverId)
    if (newVehicle.paramedicId) crewIdsToLock.push(newVehicle.paramedicId)

    if (crewIdsToLock.length > 0) {
      const updatedCrew = crew.map((member) => {
        if (crewIdsToLock.includes(member.id)) {
          return { ...member, status: 'Assigned', assignedAmbulanceId: newVehicle.id }
        }
        return member
      })
      setCrew(updatedCrew)
      saveCrew(updatedCrew)
    }
  }

  // 7. Admin Panel CRUD: Delete Vehicle
  const handleDeleteAmbulance = (id) => {
    // Remove vehicle from collection
    const updatedAmbs = ambulances.filter((amb) => amb.id !== id)
    setAmbulances(updatedAmbs)
    saveAmbulances(updatedAmbs)

    // Automatically release any crew members previously assigned to this vehicle
    const updatedCrew = crew.map((member) => {
      if (member.assignedAmbulanceId === id) {
        return { ...member, status: 'Available', assignedAmbulanceId: null }
      }
      return member
    })
    setCrew(updatedCrew)
    saveCrew(updatedCrew)
  }

  // Count active incidents to display in navbar alert count
  const criticalCount = incidents.filter(
    (i) => i.priorityLevel === 'Critical' && i.status !== 'Completed'
  ).length

  return (
    <Router>
      <div className="app-container">
        {/* Top Navbar */}
        <Navbar criticalCount={criticalCount} onToggleSidebar={toggleSidebar} />

        {/* Main Layout Area */}
        <div className="main-layout">
          {/* Left Navigation Sidebar */}
          <Sidebar showMobileSidebar={showMobileSidebar} onLinkClick={() => setShowMobileSidebar(false)} />

          {/* Router Content Container */}
          <main className="content-wrapper">
            <Routes>
              <Route 
                path="/" 
                element={<Dashboard ambulances={ambulances} incidents={incidents} />} 
              />
              <Route 
                path="/dispatch" 
                element={<DispatchForm ambulances={ambulances} onAddIncident={handleAddIncident} />} 
              />
              <Route 
                path="/ambulances" 
                element={<AmbulanceList ambulances={ambulances} onToggleMaintenance={handleToggleMaintenance} />} 
              />
              <Route 
                path="/crew" 
                element={
                  <CrewAssignment 
                    crew={crew} 
                    ambulances={ambulances} 
                    onAssignCrew={handleAssignCrew} 
                    onUnassignCrew={handleUnassignCrew} 
                  />
                } 
              />
              <Route 
                path="/incidents" 
                element={<IncidentLog incidents={incidents} />} 
              />
              <Route 
                path="/tracker" 
                element={
                  <StatusTracker 
                    incidents={incidents} 
                    onUpdateIncidentStatus={handleUpdateIncidentStatus} 
                  />
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminPanel 
                    ambulances={ambulances} 
                    crew={crew} 
                    incidents={incidents} 
                    onAddAmbulance={handleAddAmbulance} 
                    onDeleteAmbulance={handleDeleteAmbulance} 
                  />
                } 
              />
              <Route 
                path="*" 
                element={
                  <div className="text-center py-5">
                    <h1 className="display-1 text-danger fw-bold">404</h1>
                    <h2>Page Not Found</h2>
                    <p className="text-muted">The requested dispatch screen does not exist.</p>
                    <Link to="/" className="btn text-white mt-3" style={{ backgroundColor: 'var(--primary-teal)' }}>
                      Go back to Dashboard
                    </Link>
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
