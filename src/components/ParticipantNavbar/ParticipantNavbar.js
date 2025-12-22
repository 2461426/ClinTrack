import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './ParticipantNavbar.css';
import user from '../../assets/icons/user.png';

function ParticipantNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className='participant-navbar'>
      <div className='participant-navbar__container'>
        <span className='participant-navbar__logo'>
          Clin<span className='participant-navbar__logo-light'>Track</span>
        </span>

        <div className='participant-navbar__desktop-menu'>
          <NavLink
            to="/"
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
            to="/AboutUs"
            className={({isActive}) => `participant-navbar__link ${isActive ? 'participant-navbar__link--active' : ''}`}
          >
            About Us
          </NavLink>
        </div>

        <div className='participant-navbar__actions'>
          <NavLink
            to="/LoginAs"
            className={({isActive}) => `participant-navbar__login-btn ${isActive ? 'participant-navbar__login-btn--active' : ''}`}
          >
            Login
          </NavLink>
          <NavLink
            to="/Profile"
            className={({isActive}) => `participant-navbar__profile-link ${isActive ? 'participant-navbar__profile-link--active' : ''}`}
          >
            <img src={user} alt="User" className='participant-navbar__profile-pic' />
          </NavLink>
          
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
