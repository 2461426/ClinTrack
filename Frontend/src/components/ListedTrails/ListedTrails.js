import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ListedTrails.css'
import settings from '../../assets/icons/settingsIcon.png'
import phaseIcon from '../../assets/icons/phaseIcon.png'
import createIcon from '../../assets/icons/add.png'
import CreateTrailModal from '../CreateTrailModal/CreateTrailModal'
import { getTrailsAPI, createTrailAPI } from '../../utils/trailService'
import Lottie from 'lottie-react'
import LoaderAnimation from '../../assets/animations/Loader.json'
 
function ListedTrails({ pharma, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trails, setTrails] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, trailId: null });
 
  useEffect(() => {
    loadTrails();
   
    const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, trailId: null });
    document.addEventListener('click', closeContextMenu);
   
    return () => document.removeEventListener('click', closeContextMenu);
  }, []);
 
  const loadTrails = async () => {
    const trailsFromAPI = await getTrailsAPI();
    setTrails(trailsFromAPI || []);
  };
 
  if (!pharma) {
    return <div className='error-message'>Error: No pharma data provided</div>;
  }
 
  const pharmaTrails = trails.filter(trail => Number(trail.pharmaId) === Number(pharma.id));
 
  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/Home');
  };
 
  const handleTrailCreated = async (newTrail) => {
    const result = await createTrailAPI(newTrail);
   
    if (result.success) {
      await loadTrails();
    } else {
      alert('Failed to create trail. Please make sure the backend server is running.');
    }
  };
 
  const handleContextMenu = (e, trailId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      trailId
    });
  };
 
  const handleDeleteTrail = async (e, trailId) => {
    e.stopPropagation();
   
    if (!window.confirm('Are you sure you want to delete this trail?')) {
      setContextMenu({ visible: false, x: 0, y: 0, trailId: null });
      return;
    }
   
    try {
      const trail = trails.find(t => t.trailId === trailId);
      if (!trail?.id) {
        alert('Trail not found');
        return;
      }
     
      const response = await fetch(`http://localhost:5000/trailDetails/${trail.id}`, {
        method: 'DELETE'
      });
     
      if (response.ok) {
        await loadTrails();
        alert('Trail deleted successfully!');
      } else {
        alert('Failed to delete trail');
      }
    } catch (error) {
      alert('Failed to delete trail. Please make sure the backend server is running.');
    }
   
    setContextMenu({ visible: false, x: 0, y: 0, trailId: null });
  };
 
  return (
    <div className='listed-trails-page'>
      <nav className='navbar'>
        <div className='navbar__profile'>
          <img src={pharma.profilePicture} alt={pharma.name} className='navbar__profile-pic' />
          <div className='navbar__profile-info'>
            <h1 className='navbar__profile-name'>{pharma.name}</h1>
            <p className='navbar__welcome'>Welcome❤️</p>
          </div>
        </div>
        <div className='navbar__actions'>
          <div className='navbar__support'>Support</div>
          <div className='navbar__settings-wrapper'>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className='navbar__settings-btn'
            >
              <img src={settings} alt="settings" className='navbar__settings-icon' />
            </button>
            {dropdownOpen && (
              <div className='navbar__dropdown'>
                <button
                  onClick={() =>{ setDropdownOpen(false)
 
                    navigate('/PharmaProfile')
                  }}
                  className='navbar__dropdown-item'
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className='navbar__dropdown-item navbar__dropdown-item--logout'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
 
      <div className='page-header'>
        <div className='page-header__text'>
          <h1 className='page-header__subtitle'>Active</h1>
          <h1 className='page-header__title'>Ongoing Trails</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='page-header__create-btn'
        >
          <img src={createIcon} className='page-header__create-icon' alt='create' />
          <span className='page-header__create-text'>Create Trail</span>
          <span className='page-header__create-text-mobile'>Create</span>
        </button>
      </div>
     
      {pharmaTrails.length === 0 ? (
        <div className='trails-loader'>
          <Lottie animationData={LoaderAnimation} className='trails-loader__animation' />
        </div>
      ) : (
        <div className='trails-grid'>
          {pharmaTrails.map((trail) => (
            <div
              key={trail.trailId}
              onClick={() => navigate(`/TrailDashboard/${trail.trailId}`)}
              onContextMenu={(e) => handleContextMenu(e, trail.trailId)}
              className='trail-card'
            >
              <img src={trail.image} alt={trail.title} className='trail-card__image' />
              <div className='trail-card__content'>
                <div className='trail-card__header'>
                  <h1 className='trail-card__title'>{trail.title}</h1>
                  <p className='trail-card__description'>{trail.description}</p>
                </div>
                <div className='trail-card__footer'>
                  <div className='trail-card__phase'>
                    <img src={phaseIcon} alt="phase" className='trail-card__phase-icon' />
                    Phase: {trail.phase}
                  </div>
                  <div className='trail-card__participants'>
                    <h1 className='trail-card__participants-count'>
                      {trail.participantsRequired.toLocaleString()}
                    </h1>
                    <p className='trail-card__participants-label'>Participants</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {contextMenu.visible && (
        <div
          className='context-menu'
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => handleDeleteTrail(e, contextMenu.trailId)}
            className='context-menu__item'
          >
            <svg className='context-menu__icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
            </svg>
            Delete Trail
          </button>
        </div>
      )}
     
      <CreateTrailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pharmaId={pharma.id}
        onTrailCreated={handleTrailCreated}
      />
    </div>
  )
}
 
export default ListedTrails
 
 