
// src/pages/Usertrails.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserTrails.css";
import phaseIcon from '../../assets/icons/phaseIcon.png';
import Lottie from 'lottie-react';
import LoaderAnimation from '../../assets/animations/Loader.json';
import Menu from "../Menu";
import PhaseDetailsOverlay from "../PhaseDetailsOverlay/PhaseDetailsOverlay";
import ParticipantNavbar from "../ParticipantNavbar/ParticipantNavbar";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Usertrails() {
  const navigate = useNavigate();
  
  // Read user from localStorage (same approach as dashboard)
  const raw = localStorage.getItem("logged_in_user");
  let currentUser = null;
  try {
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }

  // ====== TRAILS LOGIC ======
  const [activeTab, setActiveTab] = useState("explore"); // "explore" | "registered"
  const [trails, setTrails] = useState([]);
  const [loadingTrails, setLoadingTrails] = useState(true);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/trailDetails')
      .then(response => {
        setTrails(response.data || []);
        
        // Fetch enrollment requests if user is logged in
        if (currentUser && currentUser.id) {
          return axios.get(
            `http://localhost:5000/enrollmentRequests?participantId=${currentUser.id}`
          );
        }
        return null;
      })
      .then(enrollmentResponse => {
        if (enrollmentResponse && enrollmentResponse.data) {
          setEnrollmentRequests(enrollmentResponse.data);
        }
        setLoadingTrails(false);
      })
      .catch(error => {
        console.error('Error fetching trails:', error);
        toast.error('Unable to load trails. Please try again later.');
        setTrails([]);
        setLoadingTrails(false);
      });
  }, []);

  // Helper function to get enrollment status for a trail
  const getEnrollmentStatus = (trailId) => {
    const request = enrollmentRequests.find(req => 
      // loose equality to tolerate number/string ids
      req.trailId == trailId && req.participantId == currentUser?.id
    );
    return request ? request.status : null; // 'pending' | 'approved' | 'rejected' | null
  };

  // Show trails where user has any enrollment request (pending/approved/rejected) for this trail
  const registeredTrails = trails.filter(trail => {
    if (!currentUser || !currentUser.id) return false;
    const status = getEnrollmentStatus(trail.id);
    return status === 'pending' || status === 'approved' || status === 'rejected';
  });

  const exploreTrails = trails;
  const displayTrails = activeTab === "registered" ? registeredTrails : exploreTrails;

  // Check if user has any active enrollment (pending or approved)
  const hasAnyEnrollment = enrollmentRequests.some(req => 
    req.participantId == currentUser?.id && 
    (req.status === 'pending' || req.status === 'approved')
  );

  // Get the currently enrolled trail ID (pending/approved)
  const enrolledTrailId = hasAnyEnrollment
    ? enrollmentRequests.find(req => 
        req.participantId == currentUser?.id && 
        (req.status === 'pending' || req.status === 'approved')
      )?.trailId
    : null;

  // Handle enrollment for a trail
  const handleEnroll = (trailId) => {
    if (!currentUser || !currentUser.id) {
      toast.info('Please login to enroll in a trail.');
      return;
    }

    if (hasAnyEnrollment) {
      if (enrolledTrailId == trailId) {
        toast.info('You are already enrolled in this trail.');
      } else {
        toast.warn(
          'You can only enroll for one trail at a time. Please withdraw from your current trail before enrolling in another.'
        );
      }
      return;
    }

    // Create enrollment request (pending)
    axios.post('http://localhost:5000/enrollmentRequests', {
      participantId: currentUser.id,
      trailId: trailId,
      status: 'pending',
      requestDate: new Date().toISOString()
    })
    .then(response => {
      // Update enrollment requests list
      setEnrollmentRequests(prev => [...prev, response.data]);
      toast.success('Enrollment request submitted successfully! Awaiting admin approval.');
    })
    .catch(error => {
      console.error('Enrollment error:', error);
      toast.error('Enrollment failed. Please try again.');
    });
  };

  // Handle withdrawal from a trail (removes request)
  const handleWithdraw = (trailId) => {
    if (!currentUser || !currentUser.id) return;

    const ok = window.confirm('Are you sure you want to withdraw from this trail?');
    if (!ok) return;

    const enrollmentRequest = enrollmentRequests.find(req => 
      req.trailId == trailId && req.participantId == currentUser.id
    );

    if (!enrollmentRequest) {
      toast.error('Enrollment request not found.');
      return;
    }

    axios.delete(`http://localhost:5000/enrollmentRequests/${enrollmentRequest.id}`)
      .then(() => {
        setEnrollmentRequests(prev => prev.filter(req => req.id !== enrollmentRequest.id));
        toast.success('You have successfully withdrawn from the trail.');
      })
      .catch(error => {
        console.error('Withdrawal error:', error);
        toast.error('Failed to withdraw. Please try again.');
      });
  };

  // Handle trail card click
  const handleTrailClick = (trail) => {
    const enrollmentStatus = getEnrollmentStatus(trail.id);
    
    // If in registered tab and status is approved, show phase modal
    if (activeTab === "registered" && enrollmentStatus === "approved") {
      setSelectedTrail(trail);
      setShowPhaseModal(true);
    } else {
      // Otherwise navigate to trail detail page
      navigate(`/traildetail/${trail.id}`);
    }
  };

  return (
    <>
      <ParticipantNavbar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="user-trails-page">
        <div className='page-header'>
          <div className='page-header__text'>
            <h1 className='page-header__subtitle'>
              {activeTab === "registered" ? "My" : "Explore"}
            </h1>
            <h1 className='page-header__title'>
              {activeTab === "registered" ? "Registered Trails" : "Available Trails"}
            </h1>
          </div>
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab("explore")}
              className={`tab-button ${activeTab === "explore" ? "active" : ""}`}
            >
              Explore Trails
            </button>
            <button
              onClick={() => setActiveTab("registered")}
              className={`tab-button ${activeTab === "registered" ? "active" : ""}`}
            >
              Registered Trails
            </button>
          </div>
        </div>

        {loadingTrails ? (
          <div className='trails-loader'>
            <Lottie animationData={LoaderAnimation} className='trails-loader__animation' />
          </div>
        ) : displayTrails.length === 0 ? (
          <div className='trails-loader'>
            <p className="empty-text">
              {activeTab === "registered" ? "You haven't registered for any trails yet." : "No trails available."}
            </p>
          </div>
        ) : (
          <div className='trails-grid'>
            {displayTrails.map((trail) => (
              <div 
                key={trail.id}
                onClick={() => handleTrailClick(trail)}
                className='trail-card'
              >
                <img src={trail.image} alt={trail.title} className='trail-card__image' />
                <div className='trail-card__content'>
                  <div className='trail-card__header'>
                    <h1 className='trail-card__title'>{trail.title}</h1>
                    <p className='trail-card__description'>{trail.description}</p>
                  </div>
                  <div className='trail-card__footer'>
                    {activeTab === "registered" ? (
                      <>
                        {getEnrollmentStatus(trail.id) === 'pending' && (
                          <span className='status-badge status-pending'>
                            <i className='bi bi-clock-history' style={{marginRight: '5px'}} />
                            Pending
                          </span>
                        )}
                        {getEnrollmentStatus(trail.id) === 'approved' && (
                          <span className='status-badge status-approved'>
                            <i className='bi bi-check-circle' style={{marginRight: '5px'}} />
                            Approved
                          </span>
                        )}
                        {getEnrollmentStatus(trail.id) === 'rejected' && (
                          <span className='status-badge status-rejected'>
                            <i className='bi bi-x-octagon' style={{marginRight: '5px'}} />
                            Rejected
                          </span>
                        )}
                      </>
                    ) : (
                      <div className='trail-card__phase'>
                        <img src={phaseIcon} alt="phase" className='trail-card__phase-icon' />
                        Phase: {trail.phase}
                      </div>
                    )}
                    <div className='trail-card__participants'>
                      <h1 className='trail-card__participants-count'>
                        {trail.participantsRequired?.toLocaleString() || 0}
                      </h1>
                      <p className='trail-card__participants-label'>Participants</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <PhaseDetailsOverlay 
          isOpen={showPhaseModal}
          onClose={() => setShowPhaseModal(false)}
          trail={selectedTrail}
          onWithdraw={() => {
            // Refresh enrollment requests after withdrawal
            if (currentUser && currentUser.id) {
              axios.get(`http://localhost:5000/enrollmentRequests?participantId=${currentUser.id}`)
                .then(response => {
                  setEnrollmentRequests(response.data);
                })
                .catch(error => {
                  console.error('Error refreshing enrollment requests:', error);
                });
            }
          }}
        />
      </div>
    </>
  );
}

export default Usertrails;
