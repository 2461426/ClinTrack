
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
  const [activeTab, setActiveTab] = useState("explore");
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
        setTrails([]);
        setLoadingTrails(false);
      });
  }, []);

  // Get trails where user is enrolled OR has an enrollment request
  const registeredTrails = trails.filter(trail => {
    // Only show if user is logged in
    if (!currentUser || !currentUser.id) return false;
    
    // Check if user is already enrolled
    const isEnrolled = trail.participantsId?.includes(currentUser.id);
    // Check if user has an enrollment request for THIS specific trail
    const hasRequest = enrollmentRequests.some(req => 
      req.trailId === trail.id && req.participantId === currentUser.id
    );
    return isEnrolled || hasRequest;
  });

  const exploreTrails = trails;

  const displayTrails = activeTab === "registered" ? registeredTrails : exploreTrails;

  // Helper function to get enrollment status for a trail
  const getEnrollmentStatus = (trailId) => {
    const request = enrollmentRequests.find(req => 
      req.trailId === trailId && req.participantId === currentUser?.id
    );
    return request ? request.status : null;
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
        <ParticipantNavbar/>
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
          <p className="empty-text">{activeTab === "registered" ? "You haven't registered for any trails yet." : "No trails available."}</p>
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
      />
    </div>
    </>
  );
}

export default Usertrails;
