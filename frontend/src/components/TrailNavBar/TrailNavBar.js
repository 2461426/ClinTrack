import React from 'react'
import './TrailNavBar.css'
import DashboardIcon from '../../assets/icons/dashboardIcon.png'
import ScheduleIcon from '../../assets/icons/scheduleIcon.png'
import ReportIcon from '../../assets/icons/reportIcon.png'
import BackIcon from '../../assets/icons/backIcon.png'
import settingsIcon from '../../assets/icons/settingsIcon.png'
import participantsIcon from '../../assets/icons/participantsIcon.png'
import { useLocation, useNavigate } from 'react-router-dom'

function TrailNavBar({ trailId, onNavigate, trailInfo }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which page is currently active
  const isActive = (pageName) => {
    if (pageName === 'dashboard') return location.pathname.includes('/TrailDashboard/');
    if (pageName === 'participants') return location.pathname.includes('/ListOfParticipants/');
    if (pageName === 'events') return location.pathname.includes('/updateevents');
    if (pageName === 'report') return location.pathname.includes('/generatereport');
    return false;
  };

  // Get current page name for subtitle
  const getCurrentPageName = () => {
    if (isActive('dashboard')) return 'Dashboard';
    if (isActive('participants')) return 'Participants';
    if (isActive('events')) return 'Update Events';
    if (isActive('report')) return 'Generate Report';
    return 'Dashboard';
  };
  
  return (
    <>
      {/* Top Navbar */}
      <nav className='trail-top-navbar'>
        <div className='trail-top-navbar__left'>
          <button 
            onClick={() => navigate('/ListedTrails')}
            className='trail-top-navbar__back-btn'
          >
            <img src={BackIcon} alt='back' className='trail-top-navbar__back-icon' />
          </button>
          {trailInfo && (
            <>
              <img src={trailInfo.image} alt={trailInfo.title} className='trail-top-navbar__trail-image' />
              <div className='trail-top-navbar__trail-info'>
                <h1 className='trail-top-navbar__trail-title'>{trailInfo.title}</h1>
                <p className='trail-top-navbar__trail-subtitle'>{getCurrentPageName()}</p>
              </div>
            </>
          )}
        </div>
        <div className='trail-top-navbar__right'>
          <div className='trail-top-navbar__support'>Support</div>
          <img src={settingsIcon} alt="setting" className='trail-top-navbar__settings-icon' />
        </div>
      </nav>

      {/* Side Navbar */}
      <div className='trail-navbar'>
        <button 
          className={`trail-navbar__button ${isActive('dashboard') ? 'trail-navbar__button--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
          title='Dashboard'
        >
          <img src={DashboardIcon} alt='Dashboard' className='trail-navbar__icon'/>
        </button>
        
        <button 
          className={`trail-navbar__button ${isActive('participants') ? 'trail-navbar__button--active' : ''}`}
          onClick={() => onNavigate('participants')}
          title='Participants'
        >
          <img src={participantsIcon} alt='Participants' className='trail-navbar__icon'/>
        </button>
        
        <button 
          className={`trail-navbar__button ${isActive('events') ? 'trail-navbar__button--active' : ''}`}
          onClick={() => onNavigate('events')}
          title='Update Events'
        >
          <img src={ScheduleIcon} alt='Update Events' className='trail-navbar__icon'/>
        </button>
        
        <button 
          className={`trail-navbar__button ${isActive('report') ? 'trail-navbar__button--active' : ''}`}
          onClick={() => onNavigate('report')}
          title='Generate Report'
        >
          <img src={ReportIcon} alt='Report' className='trail-navbar__icon'/>
        </button>
    </div>
    </>
  )
}

export default TrailNavBar
