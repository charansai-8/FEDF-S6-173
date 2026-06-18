import React from 'react'

const TIMELINE_STEPS = [
  'Call Received',
  'Ambulance Assigned',
  'Crew Assigned',
  'En Route',
  'Arrived At Scene',
  'Patient Picked Up',
  'Reached Hospital',
  'Completed'
]

/**
 * Reusable vertical status timeline component.
 * @param {Object} props
 * @param {string} props.currentStatus - The current status of the incident
 * @param {Function} [props.onStatusUpdate] - Optional callback to advance/update status
 */
function StatusTimeline({ currentStatus, onStatusUpdate }) {
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus)

  const handleNextStep = () => {
    if (onStatusUpdate && currentIndex < TIMELINE_STEPS.length - 1) {
      onStatusUpdate(TIMELINE_STEPS[currentIndex + 1])
    }
  }

  const handlePrevStep = () => {
    if (onStatusUpdate && currentIndex > 0) {
      onStatusUpdate(TIMELINE_STEPS[currentIndex - 1])
    }
  }

  return (
    <div className="status-timeline-container p-3 bg-white rounded shadow-sm border">
      <h5 className="border-bottom pb-2 mb-3 fw-bold">Incident Timeline Progress</h5>
      
      <div className="position-relative ps-4" style={{ borderLeft: '3px solid #e2e8f0', margin: '1rem 0.5rem 1.5rem 0.5rem' }}>
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex
          const isPending = index > currentIndex

          // Determine bullet colors
          let bulletColorClass = 'bg-secondary'
          let textColorClass = 'text-muted'
          let icon = 'bi-circle'

          if (isActive) {
            bulletColorClass = 'bg-teal border-4 border-white'
            textColorClass = 'text-dark fw-bold'
            icon = 'bi-arrow-right-circle-fill'
          } else if (isCompleted) {
            bulletColorClass = 'bg-success'
            textColorClass = 'text-success'
            icon = 'bi-check-circle-fill'
          }

          return (
            <div key={step} className="position-relative mb-4">
              {/* Custom Dot Overlay */}
              <div 
                className={`position-absolute rounded-circle d-flex align-items-center justify-content-center text-white ${bulletColorClass}`}
                style={{ 
                  left: '-32px', 
                  top: '0px', 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: isActive ? 'var(--primary-teal)' : undefined,
                  boxShadow: isActive ? '0 0 0 4px rgba(13, 148, 136, 0.2)' : undefined,
                  zIndex: 2
                }}
              >
                <i className={`bi ${icon}`} style={{ fontSize: '0.65rem' }}></i>
              </div>
              
              {/* Step Information */}
              <div className="ms-2">
                <span className={`d-block ${textColorClass}`} style={{ fontSize: '0.95rem' }}>
                  {step}
                </span>
                {isActive && (
                  <span className="badge bg-light text-dark border small mt-1">
                    Current Active Phase
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {onStatusUpdate && (
        <div className="d-flex gap-2 mt-4 pt-3 border-top">
          <button 
            type="button" 
            className="btn btn-sm btn-outline-secondary flex-fill" 
            onClick={handlePrevStep}
            disabled={currentIndex === 0}
          >
            <i className="bi bi-chevron-left me-1"></i> Undo
          </button>
          
          <button 
            type="button" 
            className="btn btn-sm text-white flex-fill" 
            style={{ backgroundColor: 'var(--primary-teal)' }}
            onClick={handleNextStep}
            disabled={currentIndex === TIMELINE_STEPS.length - 1}
          >
            Advance <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default StatusTimeline
export { TIMELINE_STEPS }
