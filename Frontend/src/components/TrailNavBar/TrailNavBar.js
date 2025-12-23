import React from 'react'
import './TrailNavBar.css'
import DashboardIcon from '../../assets/icons/dashboardIcon.png'
import ScheduleIcon from '../../assets/icons/scheduleIcon.png'
import ReportIcon from '../../assets/icons/reportIcon.png'

function TrailNavBar() {
  return (
    <div className='trail-navbar'>
        <img src={DashboardIcon} alt='Dashboard' title='Dashboard' className='trail-navbar__icon'/>
        <img src={ScheduleIcon} alt='Schedule' title='Schedule' className='trail-navbar__icon'/>
        <img src={ReportIcon} alt='Report' title='Report' className='trail-navbar__icon'/>
        <img src={DashboardIcon} alt='Dashboard' title='Dashboard' className='trail-navbar__icon'/>
    </div>
  )
}

export default TrailNavBar
