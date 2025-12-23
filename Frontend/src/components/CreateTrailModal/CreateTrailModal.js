import React, { useState, useRef, useEffect } from 'react';
import './CreateTrailModal.css';
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

  const phaseCarouselRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '.hide-scrollbar::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const AVAILABLE_CATEGORIES = [
    'Cancer',
    'Diabetes',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Respiratory',
    'Other'
  ];

  const PHASE_ITEM_HEIGHT = 60;

  const updateFormField = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const updatePhase = (phaseNumber) => {
    setFormData({ ...formData, phase: parseInt(phaseNumber) });
  };

  const scrollCarouselToPhase = (phaseNumber) => {
    if (phaseCarouselRef.current) {
      const scrollPosition = (phaseNumber - 1) * PHASE_ITEM_HEIGHT;
      phaseCarouselRef.current.scrollTop = scrollPosition;
    }
  };

  const goToNextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
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

  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

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

  const createNewTrail = async (e) => {
    e.preventDefault();

    const trailData = {
      trailId: Date.now(),
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

    if (onTrailCreated) {
      await onTrailCreated(trailData);
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        
        {showSuccess ? (
          <div className='modal-success'>
            <Lottie 
              animationData={thumbsUpAnimation} 
              loop={false}
              style={{ width: 300, height: 300 }}
            />
            <h3 className='modal-success__title'>Trail Created Successfully!</h3>
          </div>
        ) : (
          <>
            <div className='modal-header'>
              <div className='modal-header__title-wrapper'>
                <h2 className='modal-header__subtitle'>Create</h2>
                <h2 className='modal-header__title'>New Trail!..</h2>
              </div>
              <button onClick={onClose} className='modal-header__close-btn'>
                <img src={closeIcon} alt="close" className='modal-header__close-icon' /> 
              </button>
            </div>

            <form onSubmit={createNewTrail} className='modal-form'>
              
              {currentStep === 1 && (
                <div className='modal-step'>
                  
                  <div className='form-field'>
                    <label className='form-field__label'>
                      Title <span className='form-field__required'>*</span>
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={updateFormField}
                      required
                      className='form-field__input'
                      placeholder='Enter trail title'
                    />
                  </div>

                  <div className='form-field'>
                    <label className='form-field__label'>
                      Description <span className='form-field__required'>*</span>
                    </label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={updateFormField}
                      required
                      rows='4'
                      className='form-field__textarea'
                      placeholder='Enter trail description'
                    />
                  </div>

                  <div className='form-field'>
                    <label className='form-field__label form-field__label--with-margin'>
                      Category <span className='form-field__required'>*</span>
                    </label>
                    <div className='category-grid'>
                      {AVAILABLE_CATEGORIES.map((categoryName) => {
                        const isSelected = formData.category === categoryName;
                        return (
                          <label
                            key={categoryName}
                            className={`category-option ${isSelected ? 'category-option--selected' : ''}`}
                          >
                            <input
                              type='radio'
                              name='category'
                              value={categoryName}
                              checked={isSelected}
                              onChange={updateFormField}
                              required
                              className='category-option__radio'
                            />
                            <span className='category-option__label'>{categoryName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className='form-field'>
                    <label className='form-field__label'>
                      Image URL
                    </label>
                    <input
                      type='url'
                      name='image'
                      value={formData.image}
                      onChange={updateFormField}
                      className='form-field__input'
                      placeholder='Enter image URL (optional)'
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className='modal-step-two'>
                  <div className='modal-step-two__content'>
                    
                    <div className='participants-section'>
                      <label className='participants-section__label'>
                        Participants Required
                      </label>
                      <input
                        type='number'
                        name='participantsRequired'
                        value={formData.participantsRequired}
                        onChange={updateFormField}
                        required
                        min='1'
                        className='participants-section__input'
                      />
                      <img src={editText} alt='edit' className='participants-section__edit-icon' />
                    </div>

                    <div className='vertical-divider'></div>

                    <div className='phase-selector'>
                      <label className='phase-selector__label'>
                        No of Phases
                      </label>
                      <div className='phase-selector__wrapper'>
                        <div
                          ref={phaseCarouselRef}
                          className='phase-carousel hide-scrollbar'
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
                          <div className='phase-carousel__padding'>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((phaseNumber) => {
                              const isCurrentPhase = formData.phase === phaseNumber;
                              return (
                                <div
                                  key={phaseNumber}
                                  onClick={() => {
                                    updatePhase(phaseNumber);
                                    scrollCarouselToPhase(phaseNumber);
                                  }}
                                  className={`phase-carousel__item ${isCurrentPhase ? 'phase-carousel__item--active' : ''}`}
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

              <div className='modal-navigation'>
                <button
                  type='button'
                  onClick={currentStep === 1 ? onClose : goToPreviousStep}
                  className='modal-navigation__btn modal-navigation__btn--secondary'
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </button>
                
                {currentStep === 1 ? (
                  <button
                    type='button'
                    onClick={goToNextStep}
                    className='modal-navigation__btn modal-navigation__btn--primary'
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='modal-navigation__btn modal-navigation__btn--primary'
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
