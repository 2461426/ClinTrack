import React from 'react';
import { NavLink } from 'react-router-dom';
import user from '../assets/icons/user.png';

function ParticipantNavbar() {
  return (
    <nav className={'fixed w-full p-4 text-gray-500 font-medium items-center flex justify-between bg-white shadow shadow-xl shadow-white border-gray-200'}>
      <span className='text-2xl font-extrabold text-indigo-500'>Clin<span className=' text-2xl font-extralight '>Track</span></span>
      <div className='absolute left-1/2 transform -translate-x-1/2 flex gap-20 items-center'>
        <NavLink
          to="/"
          className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/Trails"
          className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
        >
          Trails
        </NavLink>
        <NavLink
          to="/Contact"
          className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
        >
          Contact
        </NavLink>
        <NavLink
          to="/AboutUs"
          className={({isActive}) => `hover:text-indigo-500 hover:bg-neutral-100 px-3 py-1 rounded-full ${isActive ? 'bg-neutral-100 text-indigo-500' : ''}`}
        >
          About Us
        </NavLink>
      </div>
      <div className='flex items-center gap-6'>
        <NavLink
          to="/LoginAs"
          className={({isActive}) => `px-4 py-1 rounded-lg text-white ${isActive ? 'bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          Login
        </NavLink>
        <NavLink
          to="/Profile"
          className={({isActive}) => `rounded-full ${isActive ? 'ring-2 ring-indigo-500' : ''}`}
        >
          <img src={user} alt="User" className={'h-8 w-8 rounded-full'} />
        </NavLink>
      </div>
    </nav>
  );
}

export default ParticipantNavbar;