import React, { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import editText from '../../assets/icons/editText.png';
import closeIcon from '../../assets/icons/close.png';
import thumbsUpAnimation from '../../assets/animations/ThumbsUp.json';

function CreateTrailModal({ isOpen, onClose, pharmaId, onTrailCreated }) {
  // STEP 1: State Management - storing component data
  const [currentStep, setCurrentStep] = useState(1); // Tracks which step user is on (1 or 2)
  const [showSuccess, setShowSuccess] = useState(false); // Shows success animation when true
  
  // Form data - stores all input values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    phase: 1,
    participantsRequired: '100',
    image: ''
  });

  // Reference to the phase carousel for scrolling
  const phaseCarouselRef = useRef(null);

  // STEP 2: Setup - Hide scrollbar for phase carousel
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '.hide-scrollbar::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Available categories for selection
  const AVAILABLE_CATEGORIES = [
    'Cancer',
    'Diabetes',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Respiratory',
    'Other'
  ];

  const PHASE_ITEM_HEIGHT = 60; // Height of each phase item in pixels

  // STEP 3: Event Handlers - Functions that respond to user actions

  // Updates form data when user types in input fields
  const updateFormField = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  // Updates the selected phase number
  const updatePhase = (phaseNumber) => {
    setFormData({ ...formData, phase: parseInt(phaseNumber) });
  };

  // Scrolls the carousel to show the selected phase
  const scrollCarouselToPhase = (phaseNumber) => {
    if (phaseCarouselRef.current) {
      const scrollPosition = (phaseNumber - 1) * PHASE_ITEM_HEIGHT;
      phaseCarouselRef.current.scrollTop = scrollPosition;
    }
  };

  // Validates step 1 and moves to step 2
  const goToNextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Validation: Check if required fields are filled
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
    
    setCurrentStep(2); // Move to next step
  };

  // Goes back to step 1
  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

  // Resets form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      phase: 1,
      participantsRequired: '',
      image: ''
    });
    setCurrentStep(1);
  };

  // Creates the new trail when form is submitted
  const createNewTrail = async (e) => {
    e.preventDefault(); // Prevents page reload

    // Build trail object with all required data
    const trailData = {
      trailId: Date.now(), // Unique ID based on timestamp
      pharmaId: Number(pharmaId),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      phase: formData.phase.toString().padStart(2, '0'), // Format: "01", "02", etc.
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

    // Send trail data to parent component
    if (onTrailCreated) {
      await onTrailCreated(trailData);
    }

    // Show success animation
    setShowSuccess(true);

    // After 2 seconds: hide success, reset form, close modal
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
      onClose();
    }, 2000);
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // STEP 4: Render UI - Display the modal interface
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-[25px] shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
        
        {/* Success Animation Screen */}
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
            {/* Modal Header */}
            <div className='p-6 flex justify-between items-center'>
              <div className='flex flex-col items-start'>
                <h2 className='text-2xl font-light text-gray-800'>Create</h2>
                <h2 className='text-3xl font-bold text-indigo-600'>New Trail!..</h2>
              </div>
              <button onClick={onClose} className='hover:bg-gray-200 rounded-full p-2'>
                <img src={closeIcon} alt="close" className='w-4 h-4' /> 
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={createNewTrail} className='p-6'>
              
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className='space-y-4'>
                  
                  {/* Trail Title Input */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Title <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={updateFormField}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='Enter trail title'
                    />
                  </div>

                  {/* Trail Description Input */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={updateFormField}
                      required
                      rows='4'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='Enter trail description'
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      Category <span className='text-red-500'>*</span>
                    </label>
                    <div className='grid grid-cols-2 gap-3'>
                      {AVAILABLE_CATEGORIES.map((categoryName) => {
                        const isSelected = formData.category === categoryName;
                        return (
                          <label
                            key={categoryName}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type='radio'
                              name='category'
                              value={categoryName}
                              checked={isSelected}
                              onChange={updateFormField}
                              required
                              className='w-4 h-4 text-indigo-600 focus:ring-indigo-500'
                            />
                            <span className='ml-2 text-sm font-medium'>{categoryName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image URL Input (Optional) */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Image URL
                    </label>
                    <input
                      type='url'
                      name='image'
                      value={formData.image}
                      onChange={updateFormField}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      placeholder='Enter image URL (optional)'
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Participants and Phase Selection */}
              {currentStep === 2 && (
                <div className='w-auto flex justify-between'>
                  <div className='w-full flex justify-between items-center px-12'>
                    
                    {/* Participants Required Section */}
                    <div className='flex flex-col items-end'>
                      <label className='text-md font-medium'>
                        Participants Required
                      </label>
                      <input
                        type='number'
                        name='participantsRequired'
                        value={formData.participantsRequired}
                        onChange={updateFormField}
                        required
                        min='1'
                        className='w-48 text-right px-0 py-0 rounded-lg text-indigo-500 text-6xl font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                      />
                      <img src={editText} alt='edit' className='h-5 w-5 cursor-pointer' />
                    </div>

                    {/* Vertical Divider */}
                    <div className='h-[250px] w-0.5 bg-gray-200 mx-4 flex-none'></div>

                    {/* Phase Selection Carousel */}
                    <div className='flex flex-col bg-gray-100 p-4 rounded-lg items-center mr-8'>
                      <label className='block border-b border-gray-300 text-lg font-medium pb-1 mb-3'>
                        No of Phases
                      </label>
                      <div className='flex flex-col items-center'>
                        <div
                          ref={phaseCarouselRef}
                          className='h-[180px] w-32 rounded-lg overflow-y-scroll scroll-smooth hide-scrollbar'
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          onScroll={(e) => {
                            const scrollTop = e.target.scrollTop;
                            const calculatedPhase = Math.round(scrollTop / PHASE_ITEM_HEIGHT) + 1;
                            const isValidPhase = calculatedPhase >= 1 && calculatedPhase <= 10;
                            const isDifferentPhase = calculatedPhase !== formData.phase;
                            
                            if (isValidPhase && isDifferentPhase) {
                              updatePhase(calculatedPhase);
                            }
                          }}
                        >
                          <div className='py-[60px]'>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((phaseNumber) => {
                              const isCurrentPhase = formData.phase === phaseNumber;
                              return (
                                <div
                                  key={phaseNumber}
                                  onClick={() => {
                                    updatePhase(phaseNumber);
                                    scrollCarouselToPhase(phaseNumber);
                                  }}
                                  className={`h-[60px] flex items-center justify-center text-center cursor-pointer transition-all ${
                                    isCurrentPhase
                                      ? 'text-6xl font-black text-indigo-600'
                                      : 'text-2xl text-gray-400 hover:text-gray-600'
                                  }`}
                                >
                                  {phaseNumber}
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
              <div className='flex justify-between mt-12 pt-4 border-gray-200'>
                <button
                  type='button'
                  onClick={currentStep === 1 ? onClose : goToPreviousStep}
                  className='px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium'
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </button>
                
                {currentStep === 1 ? (
                  <button
                    type='button'
                    onClick={goToNextStep}
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