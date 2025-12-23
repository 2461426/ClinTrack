import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import settings from '../../assets/icons/settingsIcon.png'
import phaseIcon from '../../assets/icons/phaseIcon.png'
import TrailNavBar from './TrailNavBar';
import BackIcon from '../../assets/icons/backIcon.png'

function TrailDashboard() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trail details from API using query parameter
    const fetchTrail = async () => {
      try {
        // Fetch all trails and filter by trailId since json-server uses 'id' field for direct lookup
        const response = await fetch(`http://localhost:5000/trailDetails?trailId=${trailId}`);
        if (response.ok) {
          const data = await response.json();
          // json-server returns an array when querying with parameters
          if (data && data.length > 0) {
            setTrail(data[0]);
          } else {
            setTrail(null);
          }
        } else {
          setTrail(null);
        }
      } catch (error) {
        console.error('Error fetching trail:', error);
        setTrail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTrail();
  }, [trailId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-500'>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-red-500'>Trail Not Found</h1>
          <button 
            onClick={() => navigate('/ListedTrails')}
            className='mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600'
          >
            Back to Trails
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className='fixed w-full p-4 px-6 text-gray-500 font-medium items-center flex justify-between bg-white border-b border-gray-200'>
        <div className='flex items-center gap-4'>
        <button 
          onClick={() => navigate('/ListedTrails')}
          className='text-indigo-500 hover:text-indigo-700 font-semibold'
        >
        <img src={BackIcon} alt='back' className=' h-auto w-8 object-cover' />
        </button>
                  <img src={trail.image} alt={trail.title} className='border rounded h-10 w-10 sm:h-12 sm:w-12 object-cover' />

        <div className='flex flex-col items-start'>
        <h1 className='text-lg sm:text-xl font-bold text-[#353535]'>{trail.title}</h1>
            <p className='text-sm sm:text-base font-regular text-indigo-500'>Dashboard</p>
            </div>
            </div>
        <div className='flex gap-4 items-center'>
          <div>Support</div>
          <img src={settings} alt="setting" className='h-7 w-auto' />
        </div>
      </nav>
      
      <div className='flex items-start pt-24 pr-6 pb-6'>
        
       <TrailNavBar />
        {/* Trail Header */}
        <div className='flex grid flex-1 flex-col'>
        {/* <div className='flex gap-6 mb-6'>
          <img src={trail.image} alt={trail.title} className='border rounded-lg h-48 w-48 object-cover' />
          <div className='flex flex-col justify-between flex-1'>
            <div>
              <h1 className='text-4xl font-bold text-[#353535]'>{trail.title}</h1>
              <p className='text-lg text-gray-500 mt-2'>{trail.description}</p>
            </div>
            <div className='flex gap-4 items-center'>
              <div className='flex items-center gap-2 text-lg border bg-gray-100 px-4 py-2 rounded-lg'>
                <img src={phaseIcon} alt="phase" className='h-6 w-auto' />
                Phase: {trail.phase}
              </div>
            </div>
          </div>
        </div> */}

        {/* Trail Details Grid */}
        <div className='grid grid-cols-2 gap-6 mb-6'>
          {/* Participants Card */}
          <div className='border rounded-lg p-6 bg-white shadow'>
            <h2 className='text-xl font-bold text-[#353535] mb-4'>Participants</h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Required:</span>
                <span className='font-semibold text-indigo-500'>{trail.participantsRequired.toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Enrolled:</span>
                <span className='font-semibold text-green-600'>{trail.participantsEnrolled.toLocaleString()}</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div 
                  className='bg-indigo-500 h-3 rounded-full' 
                  style={{ width: `${(trail.participantsEnrolled / trail.participantsRequired) * 100}%` }}
                ></div>
              </div>
              <div className='text-sm text-gray-500'>
                {Math.round((trail.participantsEnrolled / trail.participantsRequired) * 100)}% Enrolled
              </div>
            </div>
          </div>

          {/* Adverse Events Card */}
          <div className='border rounded-lg p-6 bg-white shadow'>
            <h2 className='text-xl font-bold text-[#353535] mb-4'>Adverse Events</h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Reported:</span>
                <span className='font-semibold'>{trail.adverseEventsReported}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>High Severity:</span>
                <span className='font-semibold text-red-600'>{trail.adverseEventsHigh}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Medium Severity:</span>
                <span className='font-semibold text-yellow-600'>{trail.adverseEventsMedium}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Low Severity:</span>
                <span className='font-semibold text-green-600'>{trail.adverseEventsLow}</span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className='border rounded-lg p-6 bg-white shadow'>
            <h2 className='text-xl font-bold text-[#353535] mb-4'>Progress</h2>
            <div className='flex items-center justify-center'>
              <div className='relative w-40 h-40'>
                <svg className='transform -rotate-90 w-40 h-40'>
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
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-3xl font-bold text-indigo-500'>{trail.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Dates Card */}
          <div className='border rounded-lg p-6 bg-white shadow'>
            <h2 className='text-xl font-bold text-[#353535] mb-4'>Phase Dates</h2>
            <div className='space-y-3'>
              {Object.entries(trail.phaseDates).map(([phase, date]) => (
                <div key={phase} className='flex justify-between'>
                  <span className='text-gray-600'>Phase {phase}:</span>
                  <span className='font-semibold'>{date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impacts Section */}
        <div className='grid grid-cols-2 gap-6'>
          {/* Negative Impacts */}
          <div className='border rounded-lg p-6 bg-white shadow'>
            <h2 className='text-xl font-bold text-[#353535] mb-4'>Negative Impacts</h2>
            <div className='space-y-2'>
              {trail.negativeImpacts.map((impact, index) => (
                <div key={index} className='flex justify-between items-center'>
                  <span className='text-gray-600'>Period {index + 1}:</span>
                  <span className='font-semibold text-red-600'>{impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Positive Impacts */}
          <div className='border rounded-lg p-6 bg-white shadow'>
            <h2 className='text-xl font-bold text-[#353535] mb-4'>Positive Impacts</h2>
            <div className='space-y-2'>
              {trail.positiveImpacts.map((impact, index) => (
                <div key={index} className='flex justify-between items-center'>
                  <span className='text-gray-600'>Period {index + 1}:</span>
                  <span className='font-semibold text-green-600'>{impact}</span>
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