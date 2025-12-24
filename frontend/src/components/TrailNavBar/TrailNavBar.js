import React from 'react'
import './TrailNavBar.css'
import DashboardIcon from '../../assets/icons/dashboardIcon.png'
import ScheduleIcon from '../../assets/icons/scheduleIcon.png'
import ReportIcon from '../../assets/icons/reportIcon.png'
import { useNavigate } from 'react-router-dom'

function TrailNavBar({ trailId }) {
  const navigate = useNavigate();
  
  return (
    <div className='trail-navbar'>
        <img src={DashboardIcon} alt='Dashboard' title='Dashboard' className='trail-navbar__icon'/>
        <img src={ScheduleIcon} alt='Schedule' title='Schedule' className='trail-navbar__icon'/>
        <img src={ReportIcon} alt='Report' title='Report' className='trail-navbar__icon'/>
        <button onClick={() => navigate(`/ListOfParticipants/${trailId}`)}>
          <img src={DashboardIcon} alt='ListOfParticipants' title='ListOfParticipants' className='trail-navbar__icon'/>
        </button>
    </div>
  )
}

export default TrailNavBar
