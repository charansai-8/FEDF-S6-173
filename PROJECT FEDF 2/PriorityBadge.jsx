import React from 'react'

/**
 * Reusable badge component to display emergency priority levels with appropriate colors.
 * @param {Object} props
 * @param {string} props.priority - "Critical", "High", "Medium", "Low"
 */
function PriorityBadge({ priority }) {
  let badgeClass = 'bg-secondary'
  let iconClass = 'bi-exclamation-triangle'

  switch (priority) {
    case 'Critical':
      badgeClass = 'bg-danger'
      iconClass = 'bi-exclamation-octagon-fill'
      break
    case 'High':
      badgeClass = 'bg-warning text-dark'
      iconClass = 'bi-exclamation-triangle-fill'
      break
    case 'Medium':
      badgeClass = 'bg-primary'
      iconClass = 'bi-info-circle-fill'
      break
    case 'Low':
      badgeClass = 'bg-success'
      iconClass = 'bi-check-circle-fill'
      break
    default:
      badgeClass = 'bg-secondary'
      iconClass = 'bi-question-circle'
  }

  return (
    <span className={`badge ${badgeClass} d-inline-flex align-items-center gap-1 shadow-sm px-2 py-1`}>
      <i className={`bi ${iconClass}`} style={{ fontSize: '0.85rem' }}></i>
      {priority}
    </span>
  )
}

export default PriorityBadge
