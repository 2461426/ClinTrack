import React, { useState, useRef, useEffect } from 'react';

function CreateTrailModal({ isOpen, onClose, pharmaId, onTrailCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    phase: 1,
    participantsRequired: '',
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

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate new trail ID based on timestamp to ensure uniqueness
    const newTrailId = Date.now();
    
    // Create new trail object
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
      image: formData.image || 'https://img.freepik.com/free-photo/scientist-using-microscope-medical-research_23-2149084779.jpg'
    };
    
    // Call the parent callback to handle saving
    if (onTrailCreated) {
      onTrailCreated(newTrail);
    }
    
    // Reset form and close modal
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
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='border-b border-gray-200 p-6 flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-800'>Create New Trail</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
          >
            ×
          </button>
        </div>

        {/* Progress Indicator */}
        <div className='px-6 pt-4 pb-2'>
          <div className='flex justify-between items-center max-w-md mx-auto'>
            <div className={`flex items-center ${currentStep >= 1 ? 'text-indigo-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className='ml-2 text-sm font-medium'>Basic Info</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-indigo-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className='ml-2 text-sm font-medium'>Details</span>
            </div>
          </div>
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
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.category === cat
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
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-6'>
                {/* Participants Required - Left */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Participants Required
                  </label>
                  <input
                    type='number'
                    name='participantsRequired'
                    value={formData.participantsRequired}
                    onChange={handleInputChange}
                    required
                    min='1'
                    className='w-full px-4 py-2 rounded-lg text-indigo-500 text-6xl font-black'
                    placeholder='Enter number'
                  />
                </div>

                {/* No of Phases - Right */}
                <div className=' flex flex-col items-center '>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    No of Phases 
                  </label>
                  <div className='flex flex-col items-center'>
                    <div
                      ref={carouselRef}
                      className='h-[180px] w-full rounded-lg overflow-y-scroll scroll-smooth hide-scrollbar'
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
                              className={`h-[60px] flex items-center justify-center cursor-pointer transition-all ${
                                formData.phase === phaseNum
                                  ? 'text-6xl font-black text-indigo-600'
                                  : 'text-lg text-gray-400 hover:text-gray-600'
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
          <div className='flex justify-between mt-6 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={currentStep === 1 ? onClose : handlePrevious}
              className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium'
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            {currentStep < 2 ? (
              <button
                type='button'
                onClick={handleNext}
                className='px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium'
              >
                Next
              </button>
            ) : (
              <button
                type='submit'
                className='px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium'
              >
                Create Trail
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrailModal;