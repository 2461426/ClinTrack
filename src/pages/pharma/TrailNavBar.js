import React from 'react'
import DashboardIcon from '../../assets/icons/dashboardIcon.png'
import ScheduleIcon from '../../assets/icons/scheduleIcon.png'
import ReportIcon from '../../assets/icons/reportIcon.png'

function TrailNavBar() {
  return (
    <div className='flex flex-col h-screen gap-12 py-4 px-6 items-center'>
        <img src={DashboardIcon} alt='trail logo' className='h-8 w-8 object-cover'/>
        <img src={ScheduleIcon} alt='trail logo' className='h-8 w-8 object-cover'/>
        <img src={ReportIcon} alt='trail logo' className='h-8 w-8 object-cover'/>
        <img src={DashboardIcon} alt='trail logo' className='h-8 w-8 object-cover'/>

    </div>
  )
}

export default TrailNavBar