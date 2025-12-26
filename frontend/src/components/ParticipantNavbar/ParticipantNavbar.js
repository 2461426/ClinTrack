import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './ParticipantNavbar.css';
import user from '../../assets/icons/user.png';
import UtilityService from '../../services/UtilityService';

function ParticipantNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = UtilityService.isLoggedIn();

  // Get logged-in user's profile picture and name from localStorage
  const userProfilePicture = useMemo(() => {
    if (!isLoggedIn) return user;
    
    const raw = localStorage.getItem("logged_in_user");
    try {
      const userData = raw ? JSON.parse(raw) : null;
      return userData?.profilePicture || user;
    } catch {
      return user;
    }
  }, [isLoggedIn]);

  const userName = useMemo(() => {
    if (!isLoggedIn) return '';
    
    const raw = localStorage.getItem("logged_in_user");
    try {
      const userData = raw ? JSON.parse(raw) : null;
      return userData?.firstName || userData?.name || 'User';
    } catch {
      return 'User';
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    // Clear all user information
    localStorage.removeItem('userid');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('logged_in_user');
    
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <nav className='participant-navbar'>
      <div className='participant-navbar__container'>
        <span className='participant-navbar__logo'>
          Clin<span className='participant-navbar__logo-light'>Track</span>
        </span>

        <div className='participant-navbar__desktop-menu'>
          <NavLink
            to="/home"
            className={({isActive}) => `participant-navbar__link ${isActive ? 'participant-navbar__link--active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/Trails"
            className={({isActive}) => `participant-navbar__link ${isActive ? 'participant-navbar__link--active' : ''}`}
          >
            Trails
          </NavLink>
          <NavLink
            to="/Contact"
            className={({isActive}) => `participant-navbar__link ${isActive ? 'participant-navbar__link--active' : ''}`}
          >
            Contact
          </NavLink>
          <NavLink
            to="/About"
            className={({isActive}) => `participant-navbar__link ${isActive ? 'participant-navbar__link--active' : ''}`}
          >
            About Us
          </NavLink>
        </div>

        <div className='participant-navbar__actions'>
          {!isLoggedIn && (
            <NavLink
              to="/login"
              className={({isActive}) => `participant-navbar__login-btn ${isActive ? 'participant-navbar__login-btn--active' : ''}`}
            >
              Login
            </NavLink>
          )}
          {isLoggedIn && (
            <>
              <div className='participant-navbar__greeting'>
                <div className='participant-navbar__greeting-hello'>Hello!</div>
                <div className='participant-navbar__greeting-name'>{userName}</div>
              </div>
              <div className='participant-navbar__profile-wrapper'>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className='participant-navbar__profile-btn'
                >
                  <img src={userProfilePicture} alt="User Profile" className='participant-navbar__profile-pic' />
                </button>
                {profileDropdownOpen && (
                  <div className='participant-navbar__profile-dropdown'>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/Profile');
                      }}
                      className='participant-navbar__dropdown-item'
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className='participant-navbar__dropdown-item participant-navbar__dropdown-item--logout'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='participant-navbar__mobile-toggle'
            aria-label="Toggle menu"
          >
            <svg className='participant-navbar__mobile-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className='participant-navbar__mobile-menu'>
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `participant-navbar__mobile-link ${isActive ? 'participant-navbar__mobile-link--active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/Trails"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `participant-navbar__mobile-link ${isActive ? 'participant-navbar__mobile-link--active' : ''}`}
          >
            Trails
          </NavLink>
          <NavLink
            to="/Contact"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `participant-navbar__mobile-link ${isActive ? 'participant-navbar__mobile-link--active' : ''}`}
          >
            Contact
          </NavLink>
          <NavLink
            to="/AboutUs"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `participant-navbar__mobile-link ${isActive ? 'participant-navbar__mobile-link--active' : ''}`}
          >
            About Us
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default ParticipantNavbar;
