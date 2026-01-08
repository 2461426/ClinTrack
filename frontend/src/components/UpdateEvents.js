import React, { useState, useEffect } from 'react';
import '../styles/UpdateEvents.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TrailNavBar from './TrailNavBar';

function UpdateEvents() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [previousNegativeCount, setPreviousNegativeCount] = useState(0);
  const [nullCount, setNullCount] = useState(0);
  const [hospitalAssigned, setHospitalAssigned] = useState('');
  const [adverseEventsToAdd, setAdverseEventsToAdd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const handleNavigation = (page) => {
    if (page === 'dashboard') {
      navigate(`/TrailDashboard/${trailId}`);
    } else if (page === 'participants') {
      navigate(`/ListOfParticipants/${trailId}`);
    } else if (page === 'events') {
      // Already on events
      return;
    } else if (page === 'report') {
      navigate(`/generatereport/${trailId}`);
    }
  };

  useEffect(() => {
    if (trailId) {
      setLoading(true);
      axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`)
        .then(response => {
          if (response.data && response.data.length > 0) {
            setSelectedTrail(response.data[0]);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching trail:', error);
          setMessage('Failed to load trail');
          setLoading(false);
        });
    }
  }, [trailId]);

  const handleUpdateClick = (phaseNumber) => {
    setSelectedPhase(phaseNumber);
    setShowUpdateModal(true);
    
    // Initialize counts from the trail data
    const phaseIndex = phaseNumber - 1;
    const positive = selectedTrail.positiveImpacts?.[phaseIndex] || 0;
    const negative = selectedTrail.negativeImpacts?.[phaseIndex] || 0;
    const total = selectedTrail.participantsEnrolled || 0;
    const null_count = total - (positive + negative);
    
    setPositiveCount(positive);
    setNegativeCount(negative);
    setPreviousNegativeCount(negative);
    setNullCount(null_count >= 0 ? null_count : 0);
    setHospitalAssigned(getHospitalForPhase(phaseNumber));
    setAdverseEventsToAdd([]);
  };

  const getHospitalForPhase = (phaseNumber) => {
    if (selectedTrail.hospitals && selectedTrail.hospitals.length > 0) {
      const hospitalIndex = (phaseNumber - 1) % selectedTrail.hospitals.length;
      return selectedTrail.hospitals[hospitalIndex];
    }
    // Fallback to default hospitals if not set
    const hospitals = ['Apollo Hospital', 'Max Hospital', 'Fortis Hospital', 'AIIMS Hospital'];
    return hospitals[(phaseNumber - 1) % hospitals.length];
  };

  const handleNegativeCountChange = (newCount) => {
    const increase = newCount - previousNegativeCount;
    if (increase > 0) {
      // Initialize array for new adverse events
      const newEvents = [];
      for (let i = 0; i < increase; i++) {
        newEvents.push({ severity: 'medium' }); // default to medium
      }
      setAdverseEventsToAdd(newEvents);
      setShowSeverityModal(true);
    }
    setNegativeCount(newCount);
  };

  const handleSeverityChange = (index, severity) => {
    const updated = [...adverseEventsToAdd];
    updated[index].severity = severity;
    setAdverseEventsToAdd(updated);
  };

  const handleSeverityConfirm = () => {
    setShowSeverityModal(false);
    setPreviousNegativeCount(negativeCount);
  };

  const handleSaveUpdate = async () => {
    if (!selectedTrail || !selectedPhase) return;

    try {
      // Calculate severity counts from adverseEventsToAdd
      const severityCounts = adverseEventsToAdd.reduce((acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1;
        return acc;
      }, { high: 0, medium: 0, low: 0 });

      // Clone the trail data with deep copy of arrays
      const numPhases = parseInt(selectedTrail.phase);
      const positiveImpacts = [...(selectedTrail.positiveImpacts || new Array(numPhases).fill(0))];
      const negativeImpacts = [...(selectedTrail.negativeImpacts || new Array(numPhases).fill(0))];
      
      // Ensure arrays are the right length
      while (positiveImpacts.length < numPhases) positiveImpacts.push(0);
      while (negativeImpacts.length < numPhases) negativeImpacts.push(0);
      
      const phaseIndex = selectedPhase - 1;
      positiveImpacts[phaseIndex] = positiveCount;
      negativeImpacts[phaseIndex] = negativeCount;
      
      const updatedTrail = {
        ...selectedTrail,
        positiveImpacts,
        negativeImpacts,
        adverseEventsReported: negativeImpacts.reduce((a, b) => a + b, 0),
        adverseEventsHigh: (selectedTrail.adverseEventsHigh || 0) + severityCounts.high,
        adverseEventsMedium: (selectedTrail.adverseEventsMedium || 0) + severityCounts.medium,
        adverseEventsLow: (selectedTrail.adverseEventsLow || 0) + severityCounts.low
      };

      console.log('Updating trail with data:', updatedTrail);

      // Update trail in the database
      await axios.put(`http://localhost:5000/trailDetails/${selectedTrail.id}`, updatedTrail);
      
      // Fetch fresh data from server
      const refreshedResponse = await axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`);
      if (refreshedResponse.data && refreshedResponse.data.length > 0) {
        setSelectedTrail(refreshedResponse.data[0]);
      }
      
      setMessage('Update saved successfully!');
      setShowUpdateModal(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating trail:', error);
      setMessage('Error updating trail data');
    }
  };

  const getPhaseStatus = (phaseNumber) => {
    if (!selectedTrail.phaseDates) return 'upcoming';
    
    const phaseDate = selectedTrail.phaseDates[phaseNumber];
    if (!phaseDate) return 'upcoming';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const phaseDateObj = new Date(phaseDate);
    phaseDateObj.setHours(0, 0, 0, 0);
    
    if (phaseDateObj > today) {
      return 'upcoming';
    } else if (phaseDateObj.toDateString() === today.toDateString()) {
      return 'in-progress';
    } else {
      return 'ended';
    }
  };

  const renderPhaseCards = () => {
    const numPhases = parseInt(selectedTrail.phase);
    const cards = [];
    
    for (let i = 1; i <= numPhases; i++) {
      const phaseIndex = i - 1;
      const positive = selectedTrail.positiveImpacts?.[phaseIndex] || 0;
      const negative = selectedTrail.negativeImpacts?.[phaseIndex] || 0;
      const total = selectedTrail.participantsEnrolled || 0;
      const null_count = total - (positive + negative);
      const status = getPhaseStatus(i);
      
      cards.push(
        <div key={i} className="phase-card">
          <div className="phase-card-header">
            <div>
              <h4>{selectedTrail.title}</h4>
              <span className="phase-label">Phase {i}</span>
            </div>
            <span className={`status-badge ${status}`}>
              {status === 'in-progress' ? '🟡 In Progress' : 
               status === 'ended' ? '✅ Ended' : 
               status === 'upcoming' ? '🔜 Upcoming' : ''}
            </span>
          </div>
          
          <div className="phase-stats">
            <div className="stat-item">
              <span className="stat-label">Positive</span>
              <span className="stat-dash">-</span>
              <span className="stat-value">{positive}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Negative</span>
              <span className="stat-dash">-</span>
              <span className="stat-value">{negative}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Null</span>
              <span className="stat-dash">:</span>
              <span className="stat-value">{null_count >= 0 ? null_count : 0}</span>
            </div>
          </div>
          
          <div className="phase-hospitals">
            {selectedTrail.hospitals && selectedTrail.hospitals.length > 0 ? (
              selectedTrail.hospitals.map((hospital, idx) => (
                <span key={idx} className="hospital-tag">{hospital}</span>
              ))
            ) : (
              <span className="hospital-tag">{getHospitalForPhase(i)}</span>
            )}
          </div>
          
          <div className="phase-impact">
            <span className={`impact-badge ${negative > positive ? 'negative' : 'positive'}`}>
              {negative > positive ? '🔻 Negative' : '🔺 Positive'}
            </span>
          </div>
          
          <button 
            className="update-button"
            onClick={() => handleUpdateClick(i)}
          >
            Update
          </button>
        </div>
      );
    }
    
    return cards;
  };

  return (
    <div className='update-events-layout'>
      <TrailNavBar trailId={trailId} onNavigate={handleNavigation} trailInfo={selectedTrail} />
      
      <div className='update-events-with-navbar'>
        <div className="update-events-container">
          {loading ? (
            <div className="loading-message">Loading trail...</div>
          ) : !selectedTrail ? (
            <div className="no-trails-message">Trail not found</div>
          ) : (
            <div className="trail-detail-view">
              <div className="phase-cards-container">
                {renderPhaseCards()}
              </div>
            
              
              {message && (
                <div className="message-toast success">
                  {message}
                </div>
              )}
            </div>
          )}
      
      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Phase {selectedPhase} - {selectedTrail.title}</h3>
              <button className="modal-close" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-field">
                <label>Partner Hospitals:</label>
                <div className="hospital-capsules">
                  {selectedTrail.hospitals && selectedTrail.hospitals.length > 0 ? (
                    selectedTrail.hospitals.map((hospital, idx) => (
                      <span key={idx} className="hospital-capsule">{hospital}</span>
                    ))
                  ) : (
                    <span className="hospital-capsule">{hospitalAssigned}</span>
                  )}
                </div>
              </div>
              
              <div className="modal-field">
                <label>Positive Responses:</label>
                <input 
                  type="number" 
                  min="0"
                  value={positiveCount}
                  onChange={(e) => setPositiveCount(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="modal-field">
                <label>Negative Responses:</label>
                <input 
                  type="number" 
                  min="0"
                  value={negativeCount}
                  onChange={(e) => handleNegativeCountChange(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="modal-field">
                <label>Null (No Response):</label>
                <input 
                  type="number" 
                  min="0"
                  value={nullCount}
                  onChange={(e) => setNullCount(parseInt(e.target.value) || 0)}
                  disabled
                />
                <small>Calculated automatically: Total - (Positive + Negative)</small>
              </div>
              
              <div className="modal-info">
                <p><strong>Total Participants:</strong> {selectedTrail.participantsEnrolled}</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </button>
              <button className="modal-save" onClick={handleSaveUpdate}>
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showSeverityModal && (
        <div className="modal-overlay" onClick={() => setShowSeverityModal(false)}>
          <div className="update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Classify Adverse Events Severity</h3>
              <button className="modal-close" onClick={() => setShowSeverityModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p>
                Please classify the severity for each new adverse event:
              </p>
              {adverseEventsToAdd.map((event, index) => (
                <div key={index} className="modal-field">
                  <label>Adverse Event {index + 1}:</label>
                  <select 
                    value={event.severity}
                    onChange={(e) => handleSeverityChange(index, e.target.value)}
                  >
                    <option value="low">Low Severity</option>
                    <option value="medium">Medium Severity</option>
                    <option value="high">High Severity</option>
                  </select>
                </div>
              ))}
            </div>
            
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowSeverityModal(false)}>
                Cancel
              </button>
              <button className="modal-save" onClick={handleSeverityConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

export default UpdateEvents;
