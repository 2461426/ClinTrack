import React, { useState, useEffect } from 'react'
import './ListOfParticipants.css'
import image from '../../assets/images/docImg.png'

function ListOfParticipants() {
  const [approvedParticipants, setApprovedParticipants] = useState([])
  const [pendingParticipants, setPendingParticipants] = useState([])

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const participantData = data.participantData || []
        
        const approved = participantData.filter(participant => participant.Approved === true)
        const pending = participantData.filter(participant => participant.Approved === false)
        
        setApprovedParticipants(approved)
        setPendingParticipants(pending)
      })
      .catch(error => console.error('Error fetching participant data:', error))
  }, [])

  return (
    <div className='participants-page'>
      <div className='participants-header'>
        <div className='participants-header__text'>
          <h1 className='participants-header__subtitle'>Active</h1>
          <h1 className='participants-header__title'>Participants</h1>
        </div>
        <div className='participants-header__count'>
          <p className='participants-header__count-label'>Approved</p>
          <h1 className='participants-header__count-number'>{approvedParticipants.length}</h1>
        </div>
      </div>
      
      <div className='participants-grid'>
        {approvedParticipants.map(participant => (
          <div key={participant.id} className='participant-card'>
            <img 
              src={participant.profilePicture} 
              alt={participant.name} 
              className="participant-card__image"
            />
            <div className='participant-card__info'>
              <div className="participant-card__details">
                <h1 className='participant-card__name'>{participant.name}</h1>
                <p className='participant-card__age'>Age: {participant.age}</p>
              </div>
              <div className='participant-card__badge participant-card__badge--approved'>
                Approved
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='participants-header'>
        <div className='participants-header__text'>
          <h1 className='participants-header__subtitle'>Pending</h1>
          <h1 className='participants-header__title'>Participants</h1>
        </div>
        <div className='participants-header__count'>
          <p className='participants-header__count-label'>Requests</p>
          <h1 className='participants-header__count-number'>{pendingParticipants.length}</h1>
        </div>
      </div>
      
      <div className='participants-grid'>
        {pendingParticipants.map(participant => (
          <div key={participant.id} className='participant-card'>
            <img 
              src={participant.profilePicture} 
              alt={participant.name} 
              className="participant-card__image"
            />
            <div className='participant-card__info'>
              <div className="participant-card__details">
                <h1 className='participant-card__name'>{participant.name}</h1>
                <p className='participant-card__age'>Age: {participant.age}</p>
              </div>
              <div className='participant-card__badge participant-card__badge--pending'>
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
