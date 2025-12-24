import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './TrailDashboard.css'
import settings from '../../assets/icons/settingsIcon.png'
import phaseIcon from '../../assets/icons/phaseIcon.png'
import TrailNavBar from '../TrailNavBar/TrailNavBar';
import BackIcon from '../../assets/icons/backIcon.png'

function TrailDashboard() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trail details from backend using axios
    axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`)
      .then(response => {
        // Check if data exists
        if (response.data && response.data.length > 0) {
          setTrail(response.data[0]);
        } else {
          setTrail(null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching trail:', error);
        setTrail(null);
        setLoading(false);
      });
  }, [trailId]);

  if (loading) {
    return (
      <div className='dashboard-loading'>
        <div className='dashboard-loading__content'>
          <h1 className='dashboard-loading__text'>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className='dashboard-error'>
        <div className='dashboard-error__content'>
          <h1 className='dashboard-error__title'>Trail Not Found</h1>
          <button 
            onClick={() => navigate('/ListedTrails')}
            className='dashboard-error__button'
          >
            Back to Trails
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className='dashboard-navbar'>
        <div className='dashboard-navbar__left'>
          <button 
            onClick={() => navigate('/ListedTrails')}
            className='dashboard-navbar__back-btn'
          >
            <img src={BackIcon} alt='back' className='dashboard-navbar__back-icon' />
          </button>
          <img src={trail.image} alt={trail.title} className='dashboard-navbar__trail-image' />
          <div className='dashboard-navbar__trail-info'>
            <h1 className='dashboard-navbar__trail-title'>{trail.title}</h1>
            <p className='dashboard-navbar__trail-subtitle'>Dashboard</p>
          </div>
        </div>
        <div className='dashboard-navbar__right'>
          <div className='dashboard-navbar__support'>Support</div>
          <img src={settings} alt="setting" className='dashboard-navbar__settings-icon' />
        </div>
      </nav>
      
      <div className='dashboard-content'>
        <TrailNavBar trailId={trailId} />
        
        <div className='dashboard-main'>
          <div className='dashboard-grid'>
            <div className='dashboard-card'>
              <h2 className='dashboard-card__title'>Participants</h2>
              <div className='dashboard-card__content'>
                <div className='dashboard-stat'>
                  <span className='dashboard-stat__label'>Required:</span>
                  <span className='dashboard-stat__value dashboard-stat__value--primary'>{trail.participantsRequired.toLocaleString()}</span>
                </div>
                <div className='dashboard-stat'>
                  <span className='dashboard-stat__label'>Enrolled:</span>
                  <span className='dashboard-stat__value dashboard-stat__value--success'>{trail.participantsEnrolled.toLocaleString()}</span>
                </div>
                <div className='progress-bar'>
                  <div 
                    className='progress-bar__fill' 
                    style={{ width: `${(trail.participantsEnrolled / trail.participantsRequired) * 100}%` }}
                  ></div>
                </div>
                <div className='progress-percentage'>
                  {Math.round((trail.participantsEnrolled / trail.participantsRequired) * 100)}% Enrolled
                </div>
              </div>
            </div>

            <div className='dashboard-card'>
              <h2 className='dashboard-card__title'>Adverse Events</h2>
              <div className='dashboard-card__content'>
                <div className='dashboard-stat'>
                  <span className='dashboard-stat__label'>Total Reported:</span>
                  <span className='dashboard-stat__value'>{trail.adverseEventsReported}</span>
                </div>
                <div className='dashboard-stat'>
                  <span className='dashboard-stat__label'>High Severity:</span>
                  <span className='dashboard-stat__value dashboard-stat__value--danger'>{trail.adverseEventsHigh}</span>
                </div>
                <div className='dashboard-stat'>
                  <span className='dashboard-stat__label'>Medium Severity:</span>
                  <span className='dashboard-stat__value dashboard-stat__value--warning'>{trail.adverseEventsMedium}</span>
                </div>
                <div className='dashboard-stat'>
                  <span className='dashboard-stat__label'>Low Severity:</span>
                  <span className='dashboard-stat__value dashboard-stat__value--success'>{trail.adverseEventsLow}</span>
                </div>
              </div>
            </div>

            <div className='dashboard-card'>
              <h2 className='dashboard-card__title'>Progress</h2>
              <div className='dashboard-card__content dashboard-card__content--centered'>
                <div className='circular-progress'>
                  <svg className='circular-progress__svg'>
                    <circle
                      cx='80'
                      cy='80'
                      r='70'
                      stroke='#e5e7eb'
                      strokeWidth='12'
                      fill='none'
                    />
                    <circle
                      cx='80'
                      cy='80'
                      r='70'
                      stroke='#6366f1'
                      strokeWidth='12'
                      fill='none'
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - trail.progress / 100)}`}
                      strokeLinecap='round'
                    />
                  </svg>
                  <div className='circular-progress__label'>
                    <span className='circular-progress__percentage'>{trail.progress}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='dashboard-card'>
              <h2 className='dashboard-card__title'>Phase Dates</h2>
              <div className='dashboard-card__content'>
                {Object.entries(trail.phaseDates).map(([phase, date]) => (
                  <div key={phase} className='dashboard-stat'>
                    <span className='dashboard-stat__label'>Phase {phase}:</span>
                    <span className='dashboard-stat__value'>{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='dashboard-impacts'>
            <div className='dashboard-card'>
              <h2 className='dashboard-card__title'>Negative Impacts</h2>
              <div className='dashboard-card__content'>
                {trail.negativeImpacts.map((impact, index) => (
                  <div key={index} className='dashboard-stat'>
                    <span className='dashboard-stat__label'>Period {index + 1}:</span>
                    <span className='dashboard-stat__value dashboard-stat__value--danger'>{impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='dashboard-card'>
              <h2 className='dashboard-card__title'>Positive Impacts</h2>
              <div className='dashboard-card__content'>
                {trail.positiveImpacts.map((impact, index) => (
                  <div key={index} className='dashboard-stat'>
                    <span className='dashboard-stat__label'>Period {index + 1}:</span>
                    <span className='dashboard-stat__value dashboard-stat__value--success'>{impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrailDashboard
