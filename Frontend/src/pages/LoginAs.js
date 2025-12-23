import React from 'react'
import pharmaLabIcon from '../assets/icons/pharmaLabIcon.png'
import participantIcon from '../assets/icons/participantIcon.png'
import arrowIcon from '../assets/icons/arrowRightIcon.png'
import { BrowserRouter as  Route, Routes, NavLink } from 'react-router-dom';


function LoginAs() {
    return (
        <div className='flex items-center justify-center min-h-screen p-4'>
            <div className='flex flex-col items-start gap-4 sm:gap-6 w-auto max-w-2xl'>
                <div className='flex flex-col items-start'>
                    <h1 className='text-2xl sm:text-3xl font-light'>Select</h1>
                    <h1 className='text-3xl sm:text-4xl font-bold text-indigo-500'>Who you are...</h1>
                </div>
                <div className='border rounded-[25px] w-full'>
                    <NavLink to="/PharmaLogin" className='flex items-center justify-start p-4 sm:p-5 gap-3 sm:gap-5 hover:bg-gray-50 transition-colors'>
                        <img src={pharmaLabIcon} alt="Pharma" className='h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0' />
                        <div className='flex flex-col items-start flex-1 min-w-0'>
                            <h2 className='text-lg sm:text-xl font-semibold'>Pharma Company</h2>
                            <p className='text-sm sm:text-base text-gray-500 text-start truncate w-full'>Conduct trails and expiriment</p>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className='ml-auto self-center h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
                    </NavLink>
                    <hr className='border-t border-gray-200 w-auto mx-4 sm:mx-6' />
                    <NavLink to="/" className='flex items-center justify-start p-4 sm:p-5 gap-3 sm:gap-5 hover:bg-gray-50 transition-colors'>
                        <img src={participantIcon} alt="Participant" className='h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0' />
                        <div className='flex flex-col items-start flex-1 min-w-0'>
                            <h2 className='text-lg sm:text-xl font-semibold'>Participant</h2>
                            <p className='text-sm sm:text-base text-gray-500 text-start truncate w-full'>Willing to participate in trails</p>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className='ml-auto self-center h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default LoginAs