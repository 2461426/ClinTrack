import React, { useState, useEffect } from 'react'
import image from '../../assets/images/docImg.png'

function ListOfParticipants() {
  const [approvedParticipants, setApprovedParticipants] = useState([])
  const [pendingParticipants, setPendingParticipants] = useState([])

  useEffect(() => {
    // Fetch data from data.json in public folder
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const participantData = data.participantData || []
        
        // Filter approved and pending participants
        const approved = participantData.filter(participant => participant.Approved === true)
        const pending = participantData.filter(participant => participant.Approved === false)
        
        setApprovedParticipants(approved)
        setPendingParticipants(pending)
      })
      .catch(error => console.error('Error fetching participant data:', error))
  }, [])

  return (
    <div className=''>
      {/* Approved Participants Section */}
      <div className='mx-4 sm:mx-6 my-4 py-4 px-4 rounded-lg w-auto bg-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
        <div className='flex flex-col items-start gap-0'>
          <h1 className='text-l sm:text-xl font-light'>Active</h1>
          <h1 className='text-xl sm:text-2xl font-bold text-indigo-500'>Participants</h1>
        </div>
        <div 
         
          className='flex flex-col items-end'
        > 
        <p className='text-xs font-light '>Approved</p>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-indigo-500'>{approvedParticipants.length}</h1>
          
        </div>
      </div>
      
      {/* Approved Participants List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mx-6'>
        {approvedParticipants.map(participant => (
          <div key={participant.id} className='w-40 h-auto border rounded-lg'>
            <img 
              src={participant.profilePicture} 
              alt={participant.name} 
              className="w-full h-40 rounded-t-lg object-cover"
            />
            <div className='flex items-center p-2 justify-between'>
              <div className="flex flex-col items-start">
                <h1 className='font-semibold'>{participant.name}</h1>
                <p className='text-xs font-light'>Age: {participant.age}</p>
              </div>
              <div className='bg-gray-100 rounded-md p-1 text-xs font-semibold text-indigo-500'>
                Approved
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Participants Section */}
      <div className='mx-4 sm:mx-6 my-4 py-4 px-4 rounded-lg w-auto bg-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
        <div className='flex flex-col items-start gap-0'>
          <h1 className='text-l sm:text-xl font-light'>Pending</h1>
          <h1 className='text-xl sm:text-2xl font-bold text-indigo-500'>Participants</h1>
        </div>
        <div 
         
          className='flex flex-col items-end'
        > 
        <p className='text-xs font-light '>Requests</p>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-indigo-500'>{pendingParticipants.length}</h1>
          
        </div>
      </div>
      
      {/* Pending Participants List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mx-6'>
        {pendingParticipants.map(participant => (
          <div key={participant.id} className='w-40 h-auto border rounded-lg'>
            <img 
              src={participant.profilePicture} 
              alt={participant.name} 
              className="w-full h-40 rounded-t-lg object-cover"
            />
            <div className='flex items-center p-2 justify-between'>
              <div className="flex flex-col items-start">
                <h1 className='font-semibold'>{participant.name}</h1>
                <p className='text-xs font-light'>Age: {participant.age}</p>
              </div>
              <div className='bg-gray-100 rounded-md p-1 font-semibold text-xs text-yellow-400'>
                Pending
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListOfParticipants