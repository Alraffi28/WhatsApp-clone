import React from 'react'

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Connecting to secure server...</p>
      {/* This text reassures users during the 50s Render wake-up */}
    </div>
  )
}
