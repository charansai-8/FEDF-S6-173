// Helper arrays to keep the mock data generation readable yet realistic
const NAMES = [
  "Rajesh Kumar", "Dr. Sunita Sharma", "Michael Scott", "Aarav Patel", "Dr. Priya Sen",
  "John Doe", "Jane Smith", "Amit Mishra", "Sanjay Dutt", "Dr. Vikram Seth",
  "Sneha Reddy", "Arjun Rao", "Neha Gupta", "Rohan Joshi", "Dr. Anita Desai",
  "David Miller", "Sarah Jenkins", "Dr. Rohan Malhotra", "Vijay Prasad", "Karan Johar",
  "Dr. Lisa Ray", "Rahul Dravid", "Preeti Zinta", "Abhishek Bachchan", "Dr. Manoj Bajpayee",
  "Shilpa Shetty", "Deepak Hooda", "Dr. Swati Goel", "Manish Pandey", "Ravi Shastri"
]

const ROLES = ["Driver", "Paramedic"]
const EMERGENCY_TYPES = [
  "Cardiac Arrest", "Road Traffic Accident", "Severe Burn", "Breathing Difficulty",
  "Pregnancy Labor", "Stroke / Paralysis", "High Fever & Convulsions", "Fracture & Trauma"
]
const PRIORITIES = ["Critical", "High", "Medium", "Low"]
const INCIDENT_STATUSES = [
  "Call Received", "Ambulance Assigned", "Crew Assigned", "En Route",
  "Arrived At Scene", "Patient Picked Up", "Reached Hospital", "Completed"
]

// Generate 30 Crew Members
const crew = Array.from({ length: 30 }, (_, index) => {
  const id = `CREW-${String(index + 1).padStart(3, '0')}`
  const name = NAMES[index % NAMES.length]
  const role = index % 2 === 0 ? "Driver" : "Paramedic"
  // Assign first 20 crew members to first 10 ambulances
  const isAssigned = index < 20
  const ambNum = isAssigned ? 101 + Math.floor(index / 2) : null
  const assignedAmbulanceId = ambNum ? `AMB-${ambNum}` : null

  return {
    id,
    name,
    role,
    phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
    status: isAssigned ? "Assigned" : "Available",
    assignedAmbulanceId
  }
})

// Generate 20 Ambulances
const ambulances = Array.from({ length: 20 }, (_, index) => {
  const id = `AMB-${101 + index}`
  const vehicleNumber = `TS-09-EA-${1000 + index}`
  const types = ["Basic Life Support (BLS)", "Advanced Life Support (ALS)", "Critical Care Transport (CCT)"]
  const type = types[index % types.length]
  
  // Link driver and paramedic from the first 20 crew members (indexes 0-19)
  const isAssigned = index < 10
  const driver = isAssigned ? crew[index * 2] : null
  const paramedic = isAssigned ? crew[index * 2 + 1] : null
  
  // Set status: first 4 dispatched, next 6 available, rest available or in maintenance
  let status = "Available"
  if (index < 4) {
    status = "Dispatched"
  } else if (index === 18 || index === 19) {
    status = "Maintenance"
  }

  return {
    id,
    vehicleNumber,
    type,
    driverName: driver ? driver.name : "Unassigned",
    paramedicName: paramedic ? paramedic.name : "Unassigned",
    status
  }
})

// Generate 50 Incidents with realistic history
const incidents = Array.from({ length: 50 }, (_, index) => {
  const id = `INC-${1001 + index}`
  const priorityLevel = PRIORITIES[index % PRIORITIES.length]
  const emergencyType = EMERGENCY_TYPES[index % EMERGENCY_TYPES.length]
  const callerName = NAMES[(index + 5) % NAMES.length]
  const patientName = NAMES[(index + 10) % NAMES.length]
  
  // Incident Status:
  // First 10 active (varying statuses), next 40 completed
  let status = "Completed"
  let assignedAmbulanceId = null
  
  if (index < 10) {
    status = INCIDENT_STATUSES[index % (INCIDENT_STATUSES.length - 1)] // excluding Completed
    // Assign one of the dispatched ambulances (AMB-101 to AMB-104)
    assignedAmbulanceId = `AMB-${101 + (index % 4)}`
  } else {
    // Completed incidents can reference any ambulance
    assignedAmbulanceId = `AMB-${101 + (index % 20)}`
  }

  // Generate a random timestamp in the last 24 hours
  const date = new Date()
  date.setHours(date.getHours() - (50 - index))

  return {
    id,
    callerName,
    phoneNumber: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
    patientName,
    emergencyType,
    address: `${10 + (index % 90)}, Emergency Street, Sector ${1 + (index % 15)}, City Center`,
    priorityLevel,
    assignedAmbulanceId,
    status,
    timestamp: date.toISOString(),
    notes: `Incident logged for emergency type: ${emergencyType}. Responder assignment confirmed.`
  }
})

// Export the mock database structure
export const mockData = {
  ambulances,
  crew,
  incidents
}
