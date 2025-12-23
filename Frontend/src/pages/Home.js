import React from 'react'
import docImg from '../assets/images/docImg.png'
import backgroundImage from '../assets/images/background-image.png';

function Home() {
  return (
    <div className='bg-cover bg-center h-[647px]' 
      style={{ 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundAttachment: ''
      }}>
      <div className='p-6 sm:p-12 md:p-20 lg:p-28 pt-20 sm:pt-32 md:pt-40 lg:pt-52 w-full flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0'>
        <div className='flex flex-col justify-start items-start text-center lg:text-left'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold'>Enroll for your</h1>
          <h1 className='text-3xl sm:text-4xl md:text-5xl mt-2 font-bold text-indigo-500'>Trails!!</h1>
          <p className='text-xs sm:text-sm mt-4 font-light text-gray-500 max-w-md'>ClinTrack is a system designed for pharmaceutical companies and research organizations to manage clinical trials through a single, integrated platform.</p>
          <div className='flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto'>
            <button className='bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full font-medium w-full sm:w-auto'>Explore</button>
            <button className='bg-white hover:bg-gray-100 text-gray-500 px-6 py-2 rounded-full font-medium border border-gray-300 w-full sm:w-auto'>Contact</button>
          </div>
        </div>
        <div className='border w-full sm:w-[350px] h-[200px] sm:h-[220px] rounded-lg flex justify-end items-center'>
          <div className='flex flex-col justify-end h-full items-start w-full'>
            <img src={docImg} alt='DocImg' className='h-[250px] sm:h-[300px] w-auto mx-auto' />
            <div className='flex rounded-b-lg w-full justify-center bg-indigo-500 items-start px-4'>
              <h1 className='p-2 text-xs sm:text-sm font-regular text-center text-white'>All trials must comply with FDA and ICH-GCP guidelines.</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-32 sm:h-48 flex gap-4 sm:gap-6 justify-center items-center px-4'>
        <hr className='border w-full' />
        <h1 className='text-lg sm:text-2xl font-semibold whitespace-nowrap'>Enrollment</h1>
        <hr className='border w-full' />
      </div>
      <div className='w-full flex justify-center items-center px-4'>
        <div className="mt-5 mb-16 flex flex-col md:flex-row justify-between text-center rounded-xl">
          <div className="p-4 sm:p-6">
            <div className='flex flex-col items-center gap-3'>
              <h1 className="font-light text-2xl sm:text-3xl md:text-4xl block">
                Participant Registration in ClinTrack
              </h1>
              <h1 className='text-2xl sm:text-3xl md:text-4xl text-indigo-500 font-bold mb-6'>Compliant & Secure</h1>
            </div>
            <p className="p-3 m-0 text-gray-400 mb-8 font-light text-sm sm:text-base">
              We ensure that all regulatory requirements are met and that the necessary foundational data is collected before a participant is officially screened or enrolled.
            </p>
            <div className="flex justify-center">
              <div className="mx-4 sm:mx-10 max-w-fit border border-gray-200 bg-neutral-100 text-neutral-800 p-4 sm:p-6 rounded-2xl flex flex-wrap justify-center gap-4 sm:gap-8">
                <img className="shadow-lg shadow-black/6 w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-xl" src='https://img.freepik.com/premium-photo/young-cool-man-smiling-cheerfully-pointing-with-forefinger_1187-93874.jpg' alt='participant' />
                <img className="shadow-lg shadow-black/6 w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-xl" src='https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg' alt='participant' />
                <img className="shadow-lg shadow-black/6 w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-xl" src='https://img.freepik.com/premium-photo/young-arab-man-isolated-blue-background-laughing_1368-242387.jpg' alt='participant' />
                <img className="shadow-lg shadow-black/6 w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-xl" src='https://img.freepik.com/premium-photo/caucasian-handsome-man-beige-wall-laughing_1368-97190.jpg' alt='participant' />
                <img className="shadow-lg shadow-black/6 w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-xl" src='https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg' alt='participant' />
                <img className="shadow-lg shadow-black/6 w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-xl" src='https://img.freepik.com/free-photo/young-joyful-man-black-shirt-with-optical-glasses-points-side-looks-isolated-pink-wall_141793-35301.jpg' alt='participant' />
              </div>
            </div>
            <button className="mt-8 sm:mt-16 bg-white border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white px-6 py-2 rounded-full font-medium">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home