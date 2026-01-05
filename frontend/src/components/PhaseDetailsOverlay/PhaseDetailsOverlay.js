import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PhaseDetailsOverlay.css';

function PhaseDetailsOverlay({ isOpen, onClose, trail, currentPhase, onWithdraw }) {
  const [completedPhases, setCompletedPhases] = useState(0);
  const [withdrawing, setWithdrawing] = useState(false);

  // Get current user from localStorage
  const raw = localStorage.getItem("logged_in_user");
  let currentUser = null;
  try {
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }

  const handleWithdraw = () => {
    if (!currentUser || !currentUser.id) {
      toast.info('Please log in to withdraw from this trail.');
      return;
    }

    if (!trail || !trail.id) {
      toast.error('Trail information not found.');
      return;
    }

    const ok = window.confirm('Are you sure you want to withdraw from this trail?');
    if (!ok) return;

    setWithdrawing(true);

    // Find the enrollment request for this trail
    axios.get(`http://localhost:5000/enrollmentRequests?trailId=${trail.id}&participantId=${currentUser.id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const enrollmentRequest = response.data[0];
          return axios.delete(`http://localhost:5000/enrollmentRequests/${enrollmentRequest.id}`);
        } else {
          throw new Error('Enrollment request not found.');
        }
      })
      .then(() => {
        toast.success('You have successfully withdrawn from the trail.');
        setWithdrawing(false);
        if (onWithdraw) {
          onWithdraw();
        }
        onClose();
      })
      .catch((error) => {
        console.error('Withdrawal error:', error);
        toast.error('Failed to withdraw. Please try again.');
        setWithdrawing(false);
      });
  };

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
  const hospitals = trail.hospitals || ['Apollo Hospital', 'KMCH', 'AIMS'];

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
            <h3 className="phase-overlay__partner-title">Partner Hospital{hospitals.length > 1 ? 's' : ''}</h3>
            <div className="phase-overlay__hospital-tabs">
              {hospitals.map((hospital, index) => (
                <button key={index} className={`hospital-tab ${index === 0 ? 'active' : ''}`}>
                  {hospital}
                </button>
              ))}
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
          <button 
            className="phase-overlay__btn phase-overlay__btn-close" 
            onClick={handleWithdraw}
            disabled={withdrawing}
          >
            {withdrawing ? 'Withdrawing...' : 'Withdraw'}
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
