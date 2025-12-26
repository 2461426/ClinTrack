import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PharmaProfile.css';

function PharmaProfile() {
    const [pharmaData, setPharmaData] = useState(null);
    const [trails, setTrails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get logged-in user from localStorage
        const storedUser = localStorage.getItem('logged_in_user');
        
        if (!storedUser) {
            setError('No user logged in');
            setLoading(false);
            navigate('/login');
            return;
        }

        const user = JSON.parse(storedUser);
        let currentPharma = null;

        // Fetch pharma profile data using axios
        axios.get('http://localhost:5000/participants')
            .then(response => {
                const participants = response.data;
                
                // Find the logged-in pharma user
                currentPharma = participants.find(
                    participant => participant.email === user.email && participant.role === 'ADMIN'
                );

                if (currentPharma) {
                    setPharmaData(currentPharma);
                    
                    // Fetch trails for this pharma
                    return axios.get('http://localhost:5000/trailDetails');
                } else {
                    setError('Pharma profile not found');
                    setLoading(false);
                    throw new Error('Profile not found');
                }
            })
            .then(response => {
                const allTrails = response.data;
                
                // Filter trails for this pharma
                const pharmaTrails = allTrails.filter(
                    trail => trail.pharmaId == currentPharma.pharmaId
                );
                
                setTrails(pharmaTrails);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
                if (err.message !== 'Profile not found') {
                    setError('Failed to load profile data');
                }
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return (
            <div className="pharma-profile__loading-container">
                <div className="pharma-profile__loading-text">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pharma-profile__error-container">
                <div className="pharma-profile__error-text">{error}</div>
            </div>
        );
    }

    if (!pharmaData) {
        return (
            <div className="pharma-profile__error-container">
                <div className="pharma-profile__error-text">No profile data available</div>
            </div>
        );
    }

    return (
        <div className="pharma-profile__container">
            <div className="pharma-profile__wrapper">
                <div className="pharma-profile__header">
                    <button 
                        className="pharma-profile__back-button"
                        onClick={() => navigate('/ListedTrails')}
                    >
                        ← Back
                    </button>
                    <div className="pharma-profile__image-wrapper">
                        <img 
                            src={pharmaData.profilePicture || 'https://via.placeholder.com/150'} 
                            alt={pharmaData.name}
                            className="pharma-profile__image"
                        />
                    </div>
                    <h1 className="pharma-profile__name">{pharmaData.name}</h1>
                    <p className="pharma-profile__email">{pharmaData.email}</p>
                </div>

                <div className="pharma-profile__body">
                    <h2 className="pharma-profile__section-title">Profile Information</h2>
                    <div className="pharma-profile__info-grid">
                        <div className="pharma-profile__info-card">
                            <div className="pharma-profile__info-label">Pharma ID</div>
                            <div className="pharma-profile__info-value">{pharmaData.pharmaId}</div>
                        </div>
                        <div className="pharma-profile__info-card">
                            <div className="pharma-profile__info-label">Total Trails</div>
                            <div className="pharma-profile__info-value">{trails.length}</div>
                        </div>
                        <div className="pharma-profile__info-card">
                            <div className="pharma-profile__info-label">Total Participants</div>
                            <div className="pharma-profile__info-value">
                                {trails.reduce((sum, trail) => sum + (trail.participantsEnrolled || 0), 0)}
                            </div>
                        </div>
                    </div>

                    <div className="pharma-profile__trails-section">
                        <h2 className="pharma-profile__section-title">My Clinical Trails</h2>
                        {trails.length > 0 ? (
                            <div className="pharma-profile__trails-grid">
                                {trails.map((trail) => (
                                    <div 
                                        key={trail.id}
                                        className="pharma-profile__trail-card"
                                        onClick={() => navigate(`/TrailDashboard/${trail.trailId}`)}
                                    >
                                        {trail.image && (
                                            <img 
                                                src={trail.image} 
                                                alt={trail.title}
                                                className="pharma-profile__trail-image"
                                            />
                                        )}
                                        <h3 className="pharma-profile__trail-title">{trail.title}</h3>
                                        <div>
                                            <span className="pharma-profile__trail-phase">Phase {trail.phase}</span>
                                        </div>
                                        <p className="pharma-profile__trail-description">{trail.description}</p>
                                        
                                        <div className="pharma-profile__trail-stats">
                                            <div className="pharma-profile__trail-stat">
                                                <div className="pharma-profile__trail-stat-value">
                                                    {trail.participantsEnrolled || 0}
                                                </div>
                                                <div className="pharma-profile__trail-stat-label">Enrolled</div>
                                            </div>
                                            <div className="pharma-profile__trail-stat">
                                                <div className="pharma-profile__trail-stat-value">
                                                    {trail.participantsRequired || 0}
                                                </div>
                                                <div className="pharma-profile__trail-stat-label">Required</div>
                                            </div>
                                            <div className="pharma-profile__trail-stat">
                                                <div className="pharma-profile__trail-stat-value">
                                                    {trail.progress || 0}%
                                                </div>
                                                <div className="pharma-profile__trail-stat-label">Progress</div>
                                            </div>
                                        </div>
                                        
                                        <div className="pharma-profile__progress-bar">
                                            <div 
                                                className="pharma-profile__progress-fill"
                                                style={{ width: `${trail.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="pharma-profile__no-trails">
                                No clinical trails found for this pharma company.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PharmaProfile;