// LocalStorage key names
const KEYS = {
  AMBULANCES: 'rescue_ambulances',
  CREW: 'rescue_crew',
  INCIDENTS: 'rescue_incidents',
}

// ----------------------------------------------------
// Getters
// ----------------------------------------------------

export const getAmbulances = () => {
  const data = localStorage.getItem(KEYS.AMBULANCES)
  return data ? JSON.parse(data) : []
}

export const getCrew = () => {
  const data = localStorage.getItem(KEYS.CREW)
  return data ? JSON.parse(data) : []
}

export const getIncidents = () => {
  const data = localStorage.getItem(KEYS.INCIDENTS)
  return data ? JSON.parse(data) : []
}

// ----------------------------------------------------
// Setters (Saves complete array back to LocalStorage)
// ----------------------------------------------------

export const saveAmbulances = (ambulances) => {
  localStorage.setItem(KEYS.AMBULANCES, JSON.stringify(ambulances))
}

export const saveCrew = (crew) => {
  localStorage.setItem(KEYS.CREW, JSON.stringify(crew))
}

export const saveIncidents = (incidents) => {
  localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(incidents))
}

// ----------------------------------------------------
// Initialization Function
// ----------------------------------------------------

/**
 * Initializes the LocalStorage with default data if empty.
 * @param {Object} defaultData - Object containing { ambulances, crew, incidents }
 */
export const initStorage = (defaultData) => {
  if (!localStorage.getItem(KEYS.AMBULANCES)) {
    saveAmbulances(defaultData.ambulances)
  }
  if (!localStorage.getItem(KEYS.CREW)) {
    saveCrew(defaultData.crew)
  }
  if (!localStorage.getItem(KEYS.INCIDENTS)) {
    saveIncidents(defaultData.incidents)
  }
}
