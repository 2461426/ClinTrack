import React from 'react'
import pharmaLabIcon from '../assets/icons/pharmaLabIcon.png'
import participantIcon from '../assets/icons/participantIcon.png'
import arrowIcon from '../assets/icons/arrowRightIcon.png'
import { BrowserRouter as  Route, Routes, NavLink } from 'react-router-dom';


function LoginAs() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className=' flex flex-col items-start gap-6 '>
                <div className=' flex flex-col items-start '>
                    <h1 className=' text-3xl font-light'>Select</h1>
                    <h1 className=' text-4xl font-bold text-indigo-500'>Who you are...</h1>
                </div>
                <div className=' border rounded-[25px]'>
                    <NavLink to="/PharmaLogin" className=' flex items-center justify-start p-5 gap-5'>
                        <img src={pharmaLabIcon} alt="Participant" className=' h-12 w-12' />
                        <div className=' flex flex-col items-start'>
                            <h2 className=' text-xl font-semibold'>Pharma Company</h2>
                            <p className=' text-gray-500 text-start'>Conduct trails and expiriment</p>
                        </div>
                        <img src={arrowIcon} alt="Participant" className=' ml-auto self-center h-5 w-5' />
                    </NavLink>
                    <hr className='border-t border-gray-200 w-auto mx-6' />
                    <NavLink to="/" className=' flex items-center justify-start p-5 gap-5'>
                        <img src={participantIcon} alt="Participant" className=' h-12 w-12' />
                        <div className=' flex flex-col items-start'>
                            <h2 className=' text-xl font-semibold'>Participant</h2>
                            <p className=' text-gray-500 text-start'>Willing to participate in trails</p>
                        </div>
                        <img src={arrowIcon} alt="Participant" className=' ml-auto self-center h-5 w-5' />
                    </NavLink>
                </div>

            </div>

        </div>
    )
}

export default LoginAs