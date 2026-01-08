import React from 'react'
import '../styles/Home.css'
import docImg from '../assets/images/docImg.png'
import backgroundImage from '../assets/images/background-image.png';
import ParticipantNavbar from './ParticipantNavbar';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function Home() {
  const navigate = useNavigate();

  return (
    <>
    <ParticipantNavbar/>
    <div className='home-page' style={{ backgroundImage: `url(${backgroundImage})`, height: '647px'  }}>
      <div className='home-hero'>
        <div className='home-hero__content'>
          <h1 className='home-hero__title'>Enroll for your</h1>
          <h1 className='home-hero__title-highlight'>Trails!!</h1>
          <p className='home-hero__description'>ClinTrack is a system designed for pharmaceutical companies and research organizations to manage clinical trials through a single, integrated platform.</p>
          <div className='home-hero__buttons'>
            <button onClick={() => navigate('/trails')} className='home-hero__button home-hero__button--primary'>Explore</button>
            <button onClick={() => navigate('/contact')} className='home-hero__button home-hero__button--secondary'>Contact</button>
          </div>
        </div>
        <div className='home-hero__card'>
          <div className='home-hero__card-content'>
            <img src={docImg} alt='DocImg' className='home-hero__card-image' />
            <div className='home-hero__card-footer'>
              <h1 className='home-hero__card-text'>All trials must comply with FDA and ICH-GCP guidelines.</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className='home-divider'>
        <hr className='home-divider__line' />
        <h1 className='home-divider__text'>Enrollment</h1>
        <hr className='home-divider__line' />
      </div>
      
      <div className='home-enrollment'>
        <div className="home-enrollment__wrapper">
          <div className="home-enrollment__content">
            <div className='home-enrollment__header'>
              <h1 className="home-enrollment__title">
                Participant Registration in ClinTrack
              </h1>
              <h1 className='home-enrollment__subtitle'>Compliant & Secure</h1>
            </div>
            <p className="home-enrollment__description">
              We ensure that all regulatory requirements are met and that the necessary foundational data is collected before a participant is officially screened or enrolled.
            </p>
            <div className="home-enrollment__gallery-wrapper">
              <div className="home-enrollment__gallery">
                <img className="home-enrollment__gallery-image" src='https://img.freepik.com/premium-photo/young-cool-man-smiling-cheerfully-pointing-with-forefinger_1187-93874.jpg' alt='participant' />
                <img className="home-enrollment__gallery-image" src='https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg' alt='participant' />
                <img className="home-enrollment__gallery-image" src='https://img.freepik.com/premium-photo/young-arab-man-isolated-blue-background-laughing_1368-242387.jpg' alt='participant' />
                <img className="home-enrollment__gallery-image" src='https://img.freepik.com/premium-photo/caucasian-handsome-man-beige-wall-laughing_1368-97190.jpg' alt='participant' />
                <img className="home-enrollment__gallery-image" src='https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg' alt='participant' />
                <img className="home-enrollment__gallery-image" src='https://img.freepik.com/free-photo/young-joyful-man-black-shirt-with-optical-glasses-points-side-looks-isolated-pink-wall_141793-35301.jpg' alt='participant' />
              </div>
            </div>
            <button onClick={() => navigate('/trails')} className="home-enrollment__button">Get Started</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
   
    </>
  )
}

export default Home
