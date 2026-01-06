import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ListOfParticipants.css'
import image from '../../assets/images/docImg.png'
import TrailNavBar from '../TrailNavBar/TrailNavBar'

function ListOfParticipants() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [enrolledParticipants, setEnrolledParticipants] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (page) => {
    if (page === 'dashboard') {
      navigate(`/TrailDashboard/${trailId}`);
    } else if (page === 'participants') {
      // Already on participants
      return;
    } else if (page === 'events') {
      navigate(`/updateevents/${trailId}`);
    } else if (page === 'report') {
      navigate(`/generatereport/${trailId}`);
    }
  };

  const fetchData = () => {
    setLoading(true);
    
    console.log('Fetching trail with ID:', trailId);
    
    // Try fetching by id first, then by trailId if that fails
    axios.get(`http://localhost:5000/trailDetails/${trailId}`)
      .then(response => {
        console.log('Trail response:', response.data);
        const trailData = response.data;
        setTrail(trailData);
        
        // Fetch all participants and enrollment requests
        return Promise.all([
          axios.get('http://localhost:5000/participants'),
          axios.get(`http://localhost:5000/enrollmentRequests?trailId=${trailId}&status=pending`)
        ]).then(results => ({ trailData, results }));
      })
      .catch(error => {
        // If fetching by id fails, try by trailId query
        console.log('First fetch failed, trying query method...');
        return axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`)
          .then(response => {
            if (response.data && response.data.length > 0) {
              const trailData = response.data[0];
              setTrail(trailData);
              
              return Promise.all([
                axios.get('http://localhost:5000/participants'),
                axios.get(`http://localhost:5000/enrollmentRequests?trailId=${trailData.id}&status=pending`)
              ]).then(results => ({ trailData, results }));
            } else {
              throw new Error('Trail not found');
            }
          });
      })
      .then(({ trailData, results }) => {
        const [participantsResponse, requestsResponse] = results;
        console.log('Pending requests:', requestsResponse.data);
        
        const allParticipants = participantsResponse.data || [];
        
        // Filter participants enrolled in this trail
        const enrolled = allParticipants.filter(participant => 
          trailData?.participantsId?.includes(participant.id)
        );
        
        setEnrolledParticipants(enrolled);
        setPendingRequests(requestsResponse.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setTrail(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (trailId) {
      fetchData();
    }
  }, [trailId]);

  const handleApprove = (requestId, participantId) => {
    // Use trail.id (the actual database id) instead of URL parameter
    const actualTrailId = trail.id;
    
    axios.get(`http://localhost:5000/trailDetails/${actualTrailId}`)
      .then(response => {
        const currentTrail = response.data;
        const updatedParticipantsId = currentTrail.participantsId ? [...currentTrail.participantsId, participantId] : [participantId];
        const updatedTrail = {
          ...currentTrail,
          participantsId: updatedParticipantsId,
          participantsEnrolled: currentTrail.participantsEnrolled + 1
        };
        
        return axios.put(`http://localhost:5000/trailDetails/${actualTrailId}`, updatedTrail);
      })
      .then(() => {
        return axios.patch(`http://localhost:5000/enrollmentRequests/${requestId}`, { status: 'approved' });
      })
      .then(() => {
        alert('Request approved successfully!');
        fetchData();
      })
      .catch(error => {
        console.error('Error approving request:', error);
        alert('Failed to approve request. Please try again.');
      });
  };

  const handleReject = (requestId) => {
    axios.patch(`http://localhost:5000/enrollmentRequests/${requestId}`, { status: 'rejected' })
      .then(() => {
        alert('Request rejected.');
        fetchData();
      })
      .catch(error => {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request. Please try again.');
      });
  };

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
    <div className='participants-layout'>
      <TrailNavBar trailId={trailId} onNavigate={handleNavigation} trailInfo={trail} />
      
      <div className='participants-with-navbar'>
      <div className='participants-page'>
      <div className='participants-header'>
        <div className='participants-header__text'>
          <h1 className='participants-header__subtitle'>{trail.title}</h1>
          <h1 className='participants-header__title'>Enrollment Management</h1>
        </div>
        <div className='participants-header__count'>
          <p className='participants-header__count-label'>Enrolled</p>
          <h1 className='participants-header__count-number'>{enrolledParticipants.length}</h1>
        </div>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <>
          <h2 style={{ marginTop: '30px', marginBottom: '20px', color: '#1e293b' }}>
            Pending Enrollment Requests ({pendingRequests.length})
          </h2>
          <div className='participants-grid'>
            {pendingRequests.map(request => (
              <div key={request.id} className='participant-card' style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className='participant-card__info'>
                  <div className="participant-card__details">
                    <h1 className='participant-card__name'>{request.participantName}</h1>
                    <p className='participant-card__age'>Email: {request.participantEmail}</p>
                    <p className='participant-card__age'>
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='participant-card__badge' style={{ background: '#f59e0b' }}>
                    Pending
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => handleApprove(request.id, request.participantId)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Enrolled Participants Section */}
      <h2 style={{ marginTop: '30px', marginBottom: '20px', color: '#1e293b' }}>
        Enrolled Participants
      </h2>
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
      </div>
    </div>
  )
}

export default ListOfParticipants
