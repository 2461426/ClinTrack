import React, { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import editText from '../../assets/icons/editText.png';
import closeIcon from '../../assets/icons/close.png';
import thumbsUpAnimation from '../../assets/animations/ThumbsUp.json';

function CreateTrailModal({ isOpen, onClose, pharmaId, onTrailCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    phase: 1,
    participantsRequired: '100',
    image: ''
  });

  const carouselRef = useRef(null);

  // Add style to hide scrollbar for webkit browsers
  useEffect(() => {
    if (carouselRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, []);

  const categories = [
    'Cancer',
    'Diabetes',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Respiratory',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhaseChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phase: parseInt(value)
    }));
  };

  const scrollToPhase = (phase) => {
    if (carouselRef.current) {
      const itemHeight = 60; // Height of each phase item
      carouselRef.current.scrollTop = (phase - 1) * itemHeight;
    }
  };

  const handleNext = (e) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Validate step 1 fields before proceeding
    if (!formData.title.trim()) {
      alert('Please enter a trail title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a trail description');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate new trail ID based on timestamp to ensure uniqueness
    const newTrailId = Date.now();

    // Create new trail object (don't include 'id' - json-server will auto-generate it)
    const newTrail = {
      trailId: newTrailId,
      pharmaId: Number(pharmaId),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      phase: formData.phase.toString().padStart(2, '0'),
      participantsRequired: Number(formData.participantsRequired),
      participantsEnrolled: 0,
      adverseEventsReported: 0,
      adverseEventsHigh: 0,
      adverseEventsMedium: 0,
      adverseEventsLow: 0,
      progress: 0,
      negativeImpacts: [0, 0, 0],
      positiveImpacts: [0, 0, 0],
      participantsId: [],
      phaseDates: { '1': '', '2': '', '3': '', '4': '' },
      image: formData.image || ''
    };

    // Call the parent callback to handle saving
    if (onTrailCreated) {
      await onTrailCreated(newTrail);
    }

    // Show success animation
    setShowSuccess(true);

    // Auto-close modal after animation plays (2 seconds)
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        phase: 1,
        participantsRequired: '',
        image: ''
      });
      setCurrentStep(1);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-[25px] shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Success Animation */}
        {showSuccess ? (
          <div className='flex flex-col items-center justify-center py-20 px-6'>
            <Lottie 
              animationData={thumbsUpAnimation} 
              loop={false}
              style={{ width: 300, height: 300 }}
            />
            <h3 className='text-2xl font-bold text-indigo-600 mt-4'>Trail Created Successfully!</h3>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className='p-6 flex justify-between items-center'>
          <div className=' flex flex-col items-start '>
            <h2 className='text-2xl font-light text-gray-800'>Create</h2>
            <h2 className='text-3xl font-bold text-indigo-600'>New Trail!..</h2>
          </div>
          <button
            onClick={onClose}
            className='hover:bg-gray-200 rounded-full p-2'
          >
           <img src={closeIcon} alt="close" className=' w-4 h-4 ' /> 
          </button>
        </div>



        {/* Form Content */}
        <form onSubmit={handleSubmit} className='p-6'>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className='space-y-4'>
              {/* Title */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Enter trail title'
                />
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows='4'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Enter trail description'
                />
              </div>

              {/* Category */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Category <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.category === cat
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                    >
                      <input
                        type='radio'
                        name='category'
                        value={cat}
                        checked={formData.category === cat}
                        onChange={handleInputChange}
                        required
                        className='w-4 h-4 text-indigo-600 focus:ring-indigo-500'
                      />
                      <span className='ml-2 text-sm font-medium'>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Image URL
                </label>
                <input
                  type='url'
                  name='image'
                  value={formData.image}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Enter image URL (optional)'
                />
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className='w-auto flex justify-between'>
              <div className='w-full flex justify-between items-center px-12'>
                {/* Participants Required - Left */}
                <div className=' flex flex-col items-end '>
                  <label className=' text-md font-medium '>
                    Participants Required
                  </label>
                  <input
                    type='number'
                    name='participantsRequired'
                    value={formData.participantsRequired}
                    onChange={handleInputChange}
                    required
                    min='1'
                    className='w-48 text-right  px-0 py-0 rounded-lg text-indigo-500 text-6xl font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  />
                  <img src={editText} alt='edit' className='h-5 w-5 cursor-pointer' />
                </div>

                <div className='h-[250px] w-0.5 bg-gray-200 mx-4 flex-none'></div>

                {/* No of Phases - Right */}
                <div className=' flex flex-col bg-gray-100 p-4 rounded-lg items-center mr-8'>
                  <label className='block border-b border-gray-300 text-lg font-medium pb-1 mb-3'>
                    No of Phases
                  </label>
                  <div className='flex flex-col items-center'>
                    <div
                      ref={carouselRef}
                      className='h-[180px] w-32 rounded-lg overflow-y-scroll scroll-smooth hide-scrollbar'
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                      onScroll={(e) => {
                        const scrollTop = e.target.scrollTop;
                        const itemHeight = 60;
                        const newPhase = Math.round(scrollTop / itemHeight) + 1;
                        if (newPhase !== formData.phase && newPhase >= 1 && newPhase <= 10) {
                          handlePhaseChange(newPhase);
                        }
                      }}
                    >
                      <div className='py-[60px]'>
                        {[...Array(10)].map((_, index) => {
                          const phaseNum = index + 1;
                          return (
                            <div
                              key={phaseNum}
                              onClick={() => {
                                handlePhaseChange(phaseNum);
                                scrollToPhase(phaseNum);
                              }}
                              className={`h-[60px] flex items-center justify-center text-center cursor-pointer transition-all ${formData.phase === phaseNum
                                  ? 'text-6xl font-black text-indigo-600'
                                  : 'text-2xl text-gray-400 hover:text-gray-600'
                                }`}
                            >
                              {phaseNum}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-12 pt-4  border-gray-200'>
            <button
              type='button'
              onClick={currentStep === 1 ? onClose : handlePrevious}
              className='px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium'
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            {currentStep < 2 ? (
              <button
                type='button'
                onClick={handleNext}
                className='px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 font-medium'
              >
                Next
              </button>
            ) : (
              <button
                type='submit'
                className='px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 font-medium'
              >
                Create Trail
              </button>
            )}
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}

export default CreateTrailModal;