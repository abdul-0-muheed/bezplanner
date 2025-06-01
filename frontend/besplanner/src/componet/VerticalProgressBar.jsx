import React from 'react';
import './VerticalProgressBar.css'

function VerticalProgressBar({ progress }) {
  const barHeight = progress * 100; // Height of the progress bar (0-100%)

  return (
    <div className="vertical-progress-bar-container">
      <div className="vertical-progress-bar" style={{ height: `${barHeight}%` }}></div>
    </div>
  );
}

export default VerticalProgressBar;