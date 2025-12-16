import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import user from '../assets/icons/user.png';

function ParticipantNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className='fixed w-full p-4 text-gray-500 font-medium bg-white border-gray-200 z-50'>
      <div className='flex justify-between items-center'>
        {/* Logo */}
        <span className='text-xl sm:text-2xl font-extrabold text-indigo-500'>
          Clin<span className='text-xl sm:text-2xl font-extralight'>Track</span>
        </span>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className='hidden lg:flex gap-8 xl:gap-20 items-center absolute left-1/2 transform -translate-x-1/2'>
          <NavLink
            to="/"
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/Trails"
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            Trails
          </NavLink>
          <NavLink
            to="/Contact"
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            Contact
          </NavLink>
          <NavLink
            to="/AboutUs"
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            About Us
          </NavLink>
        </div>

        {/* Right side - Login & Profile */}
        <div className='flex items-center gap-3 sm:gap-6'>
          <NavLink
            to="/LoginAs"
            className={({isActive}) => `px-3 sm:px-4 py-1 rounded-lg text-white text-sm sm:text-base ${isActive ? 'bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          >
            Login
          </NavLink>
          <NavLink
            to="/Profile"
            className={({isActive}) => `rounded-full ${isActive ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <img src={user} alt="User" className='h-7 w-7 sm:h-8 sm:w-8 rounded-full' />
          </NavLink>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label="Toggle menu"
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className='lg:hidden mt-4 pb-4 flex flex-col gap-2'>
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/Trails"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            Trails
          </NavLink>
          <NavLink
            to="/Contact"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            Contact
          </NavLink>
          <NavLink
            to="/AboutUs"
            onClick={() => setMobileMenuOpen(false)}
            className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
          >
            About Us
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default ParticipantNavbar;