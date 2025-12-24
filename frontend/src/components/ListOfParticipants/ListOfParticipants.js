import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ListOfParticipants.css'
import image from '../../assets/images/docImg.png'

function ListOfParticipants() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [enrolledParticipants, setEnrolledParticipants] = useState([]);
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trail details
    axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`)
      .then(response => {
        if (response.data && response.data.length > 0) {
          const trailData = response.data[0];
          setTrail(trailData);
          
          // Fetch all participants
          return axios.get('http://localhost:5000/participants');
        } else {
          throw new Error('Trail not found');
        }
      })
      .then(response => {
        const allParticipants = response.data || [];
        
        // Filter participants enrolled in this trail
        const enrolled = allParticipants.filter(participant => 
          trail?.participantsId?.includes(participant.id)
        );
        
        setEnrolledParticipants(enrolled);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [trailId, trail?.participantsId])

  if (loading) {
    return (
      <div className='participants-page'>
        <p>Loading participants...</p>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className='participants-page'>
        <p>Trail not found.</p>
        <button onClick={() => navigate('/listedtrails')}>Back to Trails</button>
      </div>
    );
  }

  return (
    <div className='participants-page'>
      <button 
        onClick={() => navigate(`/TrailDashboard/${trailId}`)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Back to Trail Dashboard
      </button>

      <div className='participants-header'>
        <div className='participants-header__text'>
          <h1 className='participants-header__subtitle'>{trail.title}</h1>
          <h1 className='participants-header__title'>Enrolled Participants</h1>
        </div>
        <div className='participants-header__count'>
          <p className='participants-header__count-label'>Total</p>
          <h1 className='participants-header__count-number'>{enrolledParticipants.length}</h1>
        </div>
      </div>
      
      {enrolledParticipants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <p>No participants enrolled in this trail yet.</p>
        </div>
      ) : (
        <div className='participants-grid'>
          {enrolledParticipants.map(participant => (
            <div key={participant.id} className='participant-card'>
              <img 
                src={participant.profilePicture || 'https://via.placeholder.com/150'} 
                alt={participant.firstName} 
                className="participant-card__image"
              />
              <div className='participant-card__info'>
                <div className="participant-card__details">
                  <h1 className='participant-card__name'>
                    {participant.firstName} {participant.lastName}
                  </h1>
                  <p className='participant-card__age'>Email: {participant.email}</p>
                  <p className='participant-card__age'>Mobile: {participant.mobile}</p>
                </div>
                <div className='participant-card__badge participant-card__badge--approved'>
                  Enrolled
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListOfParticipants
