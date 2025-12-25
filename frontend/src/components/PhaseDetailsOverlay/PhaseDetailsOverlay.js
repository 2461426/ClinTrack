import React, { useEffect, useState } from 'react';
import './PhaseDetailsOverlay.css';

function PhaseDetailsOverlay({ isOpen, onClose, trail, currentPhase }) {
  const [completedPhases, setCompletedPhases] = useState(0);

  useEffect(() => {
    if (trail && trail.phaseDates) {
      const today = new Date();
      let completed = 0;
      
      // Count how many phases have passed
      Object.entries(trail.phaseDates).forEach(([phase, date]) => {
        const phaseDate = new Date(date);
        if (phaseDate < today) {
          completed++;
        }
      });
      
      setCompletedPhases(completed);
    }
  }, [trail]);

  if (!isOpen || !trail) return null;

  const totalPhases = parseInt(trail.phase) || 4;
  const phaseDates = trail.phaseDates || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isPhaseCompleted = (phaseNum) => {
    const phaseDate = phaseDates[phaseNum];
    if (!phaseDate) return false;
    return new Date(phaseDate) < new Date();
  };

  return (
    <div className="phase-overlay" onClick={onClose}>
      <div className="phase-overlay__content" onClick={(e) => e.stopPropagation()}>
        <div className="phase-overlay__header">
          <div className="phase-overlay__header-left">
            <h2 className="phase-overlay__title">Phase Details</h2>
            <p className="phase-overlay__subtitle">Scheduled dates for each phase</p>
          </div>
          <div className="phase-overlay__header-right">
            <h3 className="phase-overlay__partner-title">Partner Hospital</h3>
            <div className="phase-overlay__hospital-tabs">
              <button className="hospital-tab active">Apollo Hospital</button>
              <button className="hospital-tab">KMCH</button>
              <button className="hospital-tab">AIMS</button>
            </div>
          </div>
        </div>

        <div className="phase-overlay__body">
          <div className="phase-overlay__congrats">
            <span>
              {completedPhases === 0 
                ? "Congrats you've successfully registered!" 
                : `Congrats you've completed ${completedPhases} phase${completedPhases > 1 ? 's' : ''} successfully!`}
            </span>
            <span className="phase-overlay__heart">💙</span>
          </div>

          <div className="phase-overlay__timeline">
            {[...Array(totalPhases)].map((_, index) => {
              const phaseNum = index + 1;
              const isCompleted = isPhaseCompleted(phaseNum.toString());
              const isActive = completedPhases === phaseNum - 1;
              
              return (
                <div key={phaseNum} className="phase-step">
                  <div className="phase-step__top">
                    <div className={`phase-step__circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                      {phaseNum}
                    </div>
                    {index < totalPhases - 1 && (
                      <div className={`phase-step__line ${isCompleted ? 'completed' : ''}`}></div>
                    )}
                  </div>
                  <div className="phase-step__date">
                    {formatDate(phaseDates[phaseNum.toString()])}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="phase-overlay__footer">
          <button className="phase-overlay__btn phase-overlay__btn-close" onClick={onClose}>
            Close
          </button>
          <button className="phase-overlay__btn phase-overlay__btn-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default PhaseDetailsOverlay;
