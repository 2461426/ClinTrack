import React from 'react'
import docImg from '../assets/images/docImg.png'
import backgroundImage from '../assets/images/background-image.png';

function Home() {
  return (
    <div className='bg-cover bg-center h-[640px] ' 
      style={{ 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundAttachment: ''
      }}>
      <div className=' p-28 pt-52 w-full flex justify-between items-center'>
        <div className=' flex flex-col justify-start items-start '>
          <h1 className=' text-5xl font-extrabold'>Enroll for your</h1>
          <h1 className=' text-5xl mt-2 font-bold text-indigo-500'>Trails!!</h1>
          <p className=' text-sm mt-4  font-light text-left	 text-gray-500 '>ClinTrack is a system designed for pharmaceutical companies and <br />
            research organizations to manage clinical trials through a single, integrated platform.</p>
          <div className=' flex items-center gap-4 mt-6'>
            <button className='bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full font-medium'>Explore</button>
            <button className='bg-white hover:bg-gray-100 text-gray-500 px-6 py-2 rounded-full font-medium border border-gray-300'>Contact</button>
          </div>
        </div>
        <div className='  border w-[350px] h-[220px] rounded-lg flex justify-end items-center'>
          <div className=' flex flex-col justify-end h-full items-start w-full'>
            <img src={docImg} alt='DocImg' className=' h-[300px] w-auto' />
            <div className='flex rounded-b-lg w-full justify-center bg-indigo-500 items-start px-4'>
              <h1 className='p-2 text-sm font-regural text-center text-white'>All trials must comply with FDA and ICH-GCP guidelines.</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-48 flex gap-6 justify-center items-center'>
        <hr className='border w-full' />
        <h1 className=' text-2xl font-semibold'>Enrollment</h1>
        <hr className='border w-full' />
      </div>
      <div className=' w-full flex justify-center items-center'>
      <div class="mt-5 mb-16 flex flex-col md:flex-row justify-between text-center rounded-xl">
    <div class="p-6">
      <div className='flex flex-col items-center gap-3'>
        <h1 class="font-light text-4xl md:text-4xl block">
            Participant Registration in ClinTrack
        </h1>
        <h1 className='text-4xl text-indigo-500 font-bold mb-6'>Compliant & Secure</h1>
        </div>
        <p class="p-3 m-0 text-gray-400 mb-8 font-light text-base">
            We ensure that all regulatory requirements are met and that the necessary foundational data is collected  <br /> before a participant is officially screened or enrolled.
        </p>
        <div class="flex justify-center">
            <div class="mx-10 max-w-fit border border-gray-200 bg-neutral-100 text-neutral-800 p-6 rounded-2xl flex flex-wrap justify-center gap-8">
                <img class="shadow-lg shadow-black/6  w-32 h-32 object-cover rounded-xl" src='https://img.freepik.com/premium-photo/young-cool-man-smiling-cheerfully-pointing-with-forefinger_1187-93874.jpg' />
                <img class="shadow-lg shadow-black/6  w-32 h-32 object-cover rounded-xl" src='https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg' />
                <img class="shadow-lg shadow-black/6  w-32 h-32 object-cover rounded-xl" src='https://img.freepik.com/premium-photo/young-arab-man-isolated-blue-background-laughing_1368-242387.jpg' />
                <img class="shadow-lg shadow-black/6  w-32 h-32 object-cover rounded-xl" src='https://img.freepik.com/premium-photo/caucasian-handsome-man-beige-wall-laughing_1368-97190.jpg' />
                <img class="shadow-lg shadow-black/6  w-32 h-32 object-cover rounded-xl" src='https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg' />
                <img class="shadow-lg shadow-black/6  w-32 h-32 object-cover rounded-xl" src='https://img.freepik.com/free-photo/young-joyful-man-black-shirt-with-optical-glasses-points-side-looks-isolated-pink-wall_141793-35301.jpg' />
            </div>
        </div>
        <button class="mt-16 bg-white border  border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white px-6 py-2 rounded-full font-medium">Get Started</button>
    </div>
    </div>
</div>
    </div>
  )
}

export default Home