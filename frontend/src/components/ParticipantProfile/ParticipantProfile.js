import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParticipantProfile.css';
import ParticipantNavbar from '../ParticipantNavbar/ParticipantNavbar';

function ParticipantProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get logged-in user ID from localStorage
    const loggedInUser = localStorage.getItem('logged_in_user');
    
    if (!loggedInUser) {
      setError('No user logged in');
      setLoading(false);
      return;
    }

    let userId;
    try {
      const parsedUser = JSON.parse(loggedInUser);
      userId = parsedUser.id;
    } catch (e) {
      setError('Error reading user data');
      setLoading(false);
      return;
    }

    // Fetch user data from backend API
    axios.get(`http://localhost:5000/participants/${userId}`)
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <ParticipantNavbar />
        <div className="participant-profile">
          <div className="participant-profile__loading">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ParticipantNavbar />
        <div className="participant-profile">
          <div className="participant-profile__error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ParticipantNavbar />
      <div className="participant-profile">
        <div className="participant-profile__container">
          <h1 className="participant-profile__title">My Profile</h1>
          
          {/* Profile Picture and Basic Info */}
          <div className="participant-profile__header">
            <img 
              src={userData.profilePicture || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="participant-profile__picture"
            />
            <div className="participant-profile__basic-info">
              <h2 className="participant-profile__name">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="participant-profile__id">ID: {userData.id}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="participant-profile__section">
            <h3 className="participant-profile__section-title">Personal Information</h3>
            <div className="participant-profile__info-grid">
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Email:</span>
                <span className="participant-profile__value">{userData.email}</span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Mobile:</span>
                <span className="participant-profile__value">{userData.mobile}</span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Date of Birth:</span>
                <span className="participant-profile__value">{userData.dateOfBirth}</span>
              </div>
              {userData.gender && (
                <div className="participant-profile__info-item">
                  <span className="participant-profile__label">Gender:</span>
                  <span className="participant-profile__value">{userData.gender}</span>
                </div>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="participant-profile__section">
            <h3 className="participant-profile__section-title">Medical History</h3>
            <div className="participant-profile__info-grid">
              {userData.trialType && (
                <div className="participant-profile__info-item">
                  <span className="participant-profile__label">Trial Type:</span>
                  <span className="participant-profile__value">{userData.trialType.replace(/_/g, ' ')}</span>
                </div>
              )}
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Obesity Category:</span>
                <span className="participant-profile__value">{userData.obesityCategory.replace(/_/g, ' ')}</span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Blood Pressure:</span>
                <span className="participant-profile__value">{userData.bpCategory.replace(/_/g, ' ')}</span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Diabetes Status:</span>
                <span className="participant-profile__value">{userData.diabetesStatus.replace(/_/g, ' ')}</span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Has Asthma:</span>
                <span className="participant-profile__value">{userData.hasAsthma ? 'Yes' : 'No'}</span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Has Chronic Illnesses:</span>
                <span className="participant-profile__value">{userData.hasChronicIllnesses ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ParticipantProfile;
