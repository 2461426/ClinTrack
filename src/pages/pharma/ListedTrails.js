import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import settings from '../../assets/icons/settingsIcon.png'
import phaseIcon from '../../assets/icons/phaseIcon.png'
import trailDetailsData from '../../data/trailDetails.json'
import createIcon from '../../assets/icons/add.png'
import CreateTrailModal from './CreateTrailModal'
import { getTrailsAPI, createTrailAPI } from '../../utils/trailService'
import Lottie from 'lottie-react'
import LoaderAnimation from '../../assets/animations/Loader.json'

function ListedTrails({ pharma, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    // Load trails from backend API
    loadTrails();
  }, []);

  const loadTrails = async () => {
    const trailsFromAPI = await getTrailsAPI();
    setTrails(trailsFromAPI || trailDetailsData.trailDetails);
  };
  
  console.log('Pharma object:', pharma);
  console.log('Pharma ID:', pharma?.id);
  console.log('Trail details data:', trailDetailsData);
  console.log('All trails:', trailDetailsData?.trailDetails);
  
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
      
      // Optional: Show success message to user
      alert('Trail created successfully!');
    } else {
      console.error('Failed to save trail:', result.error);
      alert('Failed to create trail. Please make sure the backend server is running.');
    }
  };

  return (
    <div>
      <nav className={' w-full p-4 px-6 text-gray-500 font-medium items-center flex justify-between bg-white border-b border-gray-200'}>
        <div className='flex items-center gap-2'>
          <img src={pharma.profilePicture} alt={pharma.name} className=' border rounded h-12 w-12 object-cover' />
          <div className=' flex flex-col items-start '>
            <h1 className='text-xl font-bold text-[#353535]'>{pharma.name}</h1>
            <p className=' text-l font-light text-indigo-500'>Welcome❤️</p>

          </div>
        </div>
        <div className='flex gap-4 items-center'>
          <div>Support</div>
          <div className='relative'>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className='hover:opacity-75 transition-opacity focus:outline-none'
            >
              <img src={settings} alt="settings" className=' h-7 w-auto' />
            </button>
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    // Navigate to profile page when implemented
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

      <div className='mx-6 my-4 py-4 px-4 rounded-lg w-auto bg-gray-100 flex justify-between items-center'>
        <div className=' flex flex-col items-start gap-0'>
          <h1 className=' text-3xl font-light'>Active</h1>
          <h1 className=' text-3xl font-bold text-indigo-500 '>Ongoing Trails</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-white font-semibold hover:bg-indigo-600 transition-colors'
        >
          <img src={createIcon} className='h-5' alt='create' /> Create Trail
        </button>
      </div>
      {pharmaTrails.length === 0 ? (
        <div className='px-6 py-8'>
              <Lottie animationData={LoaderAnimation} className='h-[300px] w-auto' />
        </div>
      ) : (
        <div className='px-6 flex items-center justif-start gap-6 mb-6'>
          {pharmaTrails.map((trail) => (
            <div 
              key={trail.trailId}
              onClick={() => navigate(`/TrailDashboard/${trail.trailId}`)}
              className='border w-1/3 h-auto rounded-lg flex justify-start p-2 items-center cursor-pointer hover:shadow-lg transition-shadow'
            >
            <img src={trail.image} alt={trail.title} className='border rounded h-28 w-28 object-cover' />
            <div className='flex flex-col h-auto items-start w-full'>
              <div className='flex flex-col justify-start items-start px-4'>
                <h1 className='text-2xl font-bold text-[#353535]'>{trail.title}</h1>
                <p className='text-sm font-light text-gray-500'>{trail.description}</p>
              </div>
              <div className='flex px-4 justify-between items-end w-full'>
                <div className='flex items-center gap-2 text-sm border bg-gray-100 px-2 py-1 rounded-lg'>
                  <img src={phaseIcon} alt="phase" className='h-5 w-auto' />
                  Phase: {trail.phase}
                </div>
                <div className='flex flex-col justify-end items-end'>
                  <h1 className='text-2xl rounded-lg text-indigo-500 font-extrabold'>
                    {trail.participantsRequired.toLocaleString()}
                  </h1>
                  <p className='text-sm font-light text-gray-500'>Participants</p>
                </div>
              </div>
            </div>
            </div>
          ))}
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