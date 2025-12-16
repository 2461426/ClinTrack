import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import settings from '../../assets/icons/settingsIcon.png'
import phaseIcon from '../../assets/icons/phaseIcon.png'
import createIcon from '../../assets/icons/add.png'
import CreateTrailModal from './CreateTrailModal'
import { getTrailsAPI, createTrailAPI, deleteTrailAPI } from '../../utils/trailService'
import Lottie from 'lottie-react'
import LoaderAnimation from '../../assets/animations/Loader.json'

function ListedTrails({ pharma, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trails, setTrails] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, trailId: null });

  useEffect(() => {
    // Load trails from backend API
    loadTrails();
    
    // Close context menu when clicking anywhere
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, trailId: null });
    document.addEventListener('click', handleClick);
    
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const loadTrails = async () => {
    const trailsFromAPI = await getTrailsAPI();
    setTrails(trailsFromAPI || []);
  };
  
  console.log('Pharma object:', pharma);
  console.log('Pharma ID:', pharma?.id);
  console.log('All trails:', trails);
  
  if (!pharma) {
    return <div className='p-6'>Error: No pharma data provided</div>;
  }
  
  if (!trails) {
    return <div className='p-6'>Error: No trail details data found</div>;
  }
  
  const pharmaTrails = trails.filter(trail => {
    console.log(`Comparing: trail.pharmaId (${trail.pharmaId}) === pharma.id (${pharma.id})`, trail.pharmaId === pharma.id);
    return Number(trail.pharmaId) === Number(pharma.id);
  });
  
  console.log('Filtered pharma trails:', pharmaTrails);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/Home');
  };

  const handleTrailCreated = async (newTrail) => {
    // Save to backend API
    const result = await createTrailAPI(newTrail);
    
    if (result.success) {
      // Reload trails from backend to get updated data
      await loadTrails();
      console.log('New trail created and saved to trailDetails.json:', newTrail);
    } else {
      console.error('Failed to save trail:', result.error);
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
      trailId: trailId
    });
  };

  const handleDeleteTrail = async (e, trailId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this trail?')) {
      try {
        // Find the trail's auto-generated id from json-server
        const trail = trails.find(t => t.trailId === trailId);
        if (!trail || !trail.id) {
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
        console.error('Error deleting trail:', error);
        alert('Failed to delete trail. Please make sure the backend server is running.');
      }
    }
    
    setContextMenu({ visible: false, x: 0, y: 0, trailId: null });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='w-full p-4 px-4 sm:px-6 text-gray-500 font-medium items-center flex justify-between bg-white border-b border-gray-200'>
        <div className='flex items-center gap-2'>
          <img src={pharma.profilePicture} alt={pharma.name} className='border rounded h-10 w-10 sm:h-12 sm:w-12 object-cover' />
          <div className='flex flex-col items-start'>
            <h1 className='text-lg sm:text-xl font-bold text-[#353535]'>{pharma.name}</h1>
            <p className='text-sm sm:text-base font-light text-indigo-500'>Welcome❤️</p>
          </div>
        </div>
        <div className='flex gap-2 sm:gap-4 items-center'>
          <div className='hidden sm:block'>Support</div>
          <div className='relative'>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className='hover:opacity-75 transition-opacity focus:outline-none'
            >
              <img src={settings} alt="settings" className='h-6 sm:h-7 w-auto' />
            </button>
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    console.log('Navigate to profile');
                  }}
                  className='w-full text-left px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100'
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className='w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className='mx-4 sm:mx-6 my-4 py-4 px-4 rounded-lg w-auto bg-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
        <div className='flex flex-col items-start gap-0'>
          <h1 className='text-2xl sm:text-3xl font-light'>Active</h1>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-indigo-500'>Ongoing Trails</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-white font-semibold hover:bg-indigo-600 transition-colors whitespace-nowrap'
        >
          <img src={createIcon} className='h-5' alt='create' /> 
          <span className='hidden sm:inline'>Create Trail</span>
          <span className='sm:hidden'>Create</span>
        </button>
      </div>
      {pharmaTrails.length === 0 ? (
        <div className='px-4 sm:px-6 py-8 flex justify-center'>
          <Lottie animationData={LoaderAnimation} className='h-[200px] sm:h-[300px] w-auto' />
        </div>
      ) : (
        <div className='px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6'>
          {pharmaTrails.map((trail) => (
            <div 
              key={trail.trailId}
              onClick={() => navigate(`/TrailDashboard/${trail.trailId}`)}
              onContextMenu={(e) => handleContextMenu(e, trail.trailId)}
              className='border w-full h-auto rounded-lg flex flex-col sm:flex-row justify-start p-2 items-start sm:items-center cursor-pointer hover:shadow-lg transition-shadow bg-white relative'
            >
              <img src={trail.image} alt={trail.title} className='border rounded h-28 w-full sm:w-28 object-cover flex-shrink-0' />
              <div className='flex flex-col h-auto items-start w-full mt-2 sm:mt-0'>
                <div className='flex flex-col justify-start items-start px-2 sm:px-4'>
                  <h1 className='text-lg sm:text-2xl font-bold text-[#353535] line-clamp-1'>{trail.title}</h1>
                  <p className='text-xs sm:text-sm font-light text-gray-500 line-clamp-2'>{trail.description}</p>
                </div>
                <div className='flex px-2 sm:px-4 justify-between items-end w-full mt-2'>
                  <div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm border bg-gray-100 px-2 py-1 rounded-lg'>
                    <img src={phaseIcon} alt="phase" className='h-4 sm:h-5 w-auto' />
                    Phase: {trail.phase}
                  </div>
                  <div className='flex flex-col justify-end items-end'>
                    <h1 className='text-xl sm:text-2xl rounded-lg text-indigo-500 font-extrabold'>
                      {trail.participantsRequired.toLocaleString()}
                    </h1>
                    <p className='text-xs sm:text-sm font-light text-gray-500'>Participants</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className='fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50'
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => handleDeleteTrail(e, contextMenu.trailId)}
            className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
            </svg>
            Delete Trail
          </button>
        </div>
      )}
      
      {/* Create Trail Modal */}
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