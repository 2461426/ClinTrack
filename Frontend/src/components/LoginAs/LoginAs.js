import React from 'react'
import './LoginAs.css'
import pharmaLabIcon from '../../assets/icons/pharmaLabIcon.png'
import participantIcon from '../../assets/icons/participantIcon.png'
import arrowIcon from '../../assets/icons/arrowRightIcon.png'
import { BrowserRouter as  Route, Routes, NavLink } from 'react-router-dom';

function LoginAs() {
    return (
        <div className='login-as-page'>
            <div className='login-as-container'>
                <div className='login-as-header'>
                    <h1 className='login-as-header__subtitle'>Select</h1>
                    <h1 className='login-as-header__title'>Who you are...</h1>
                </div>
                <div className='login-as-options'>
                    <NavLink to="/PharmaLogin" className='login-as-option'>
                        <img src={pharmaLabIcon} alt="Pharma" className='login-as-option__icon' />
                        <div className='login-as-option__content'>
                            <h2 className='login-as-option__title'>Pharma Company</h2>
                            <p className='login-as-option__description'>Conduct trails and expiriment</p>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className='login-as-option__arrow' />
                    </NavLink>
                    <hr className='login-as-divider' />
                    <NavLink to="/" className='login-as-option'>
                        <img src={participantIcon} alt="Participant" className='login-as-option__icon' />
                        <div className='login-as-option__content'>
                            <h2 className='login-as-option__title'>Participant</h2>
                            <p className='login-as-option__description'>Willing to participate in trails</p>
                        </div>
                        <img src={arrowIcon} alt="Arrow" className='login-as-option__arrow' />
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default LoginAs
