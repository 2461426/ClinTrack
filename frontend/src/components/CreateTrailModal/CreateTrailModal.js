import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './CreateTrailModal.css';
import Lottie from 'lottie-react';
import editText from '../../assets/icons/editText.png';
import closeIcon from '../../assets/icons/close.png';
import thumbsUpAnimation from '../../assets/animations/ThumbsUp.json';

function CreateTrailModal({ isOpen, onClose, pharmaId, onTrailCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const phaseCarouselRef = useRef(null);

  const initialValues = {
    title: '',
    description: '',
    category: '',
    phase: 1,
    participantsRequired: '100',
    image: ''
  };

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

  const validateForm = (values) => {
    const errors = {};
    if (!values.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!values.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!values.category) {
      errors.category = 'Category is required';
    }
    return errors;
  };

  const scrollCarouselToPhase = (phaseNumber) => {
    if (phaseCarouselRef.current) {
      const scrollPosition = (phaseNumber - 1) * PHASE_ITEM_HEIGHT;
      phaseCarouselRef.current.scrollTop = scrollPosition;
    }
  };

  const goToNextStep = (values) => {
    if (!values.title.trim() || !values.description.trim() || !values.category) {
      alert('Please fill all required fields');
      return;
    }
    setCurrentStep(2);
  };

  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (currentStep === 1) {
      goToNextStep(values);
      setSubmitting(false);
      return;
    }

    const trailData = {
      trailId: Date.now(),
      pharmaId: Number(pharmaId),
      title: values.title,
      description: values.description,
      category: values.category,
      phase: values.phase.toString().padStart(2, '0'),
      participantsRequired: Number(values.participantsRequired),
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
      image: values.image || 'https://img.freepik.com/free-photo/scientist-using-microscope-medical-research_23-2149084779.jpg'
    };

    axios.post('http://localhost:5000/trailDetails', trailData)
      .then(response => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCurrentStep(1);
          resetForm();
          onClose();
        }, 2000);
      })
      .catch(error => {
        console.error('Error creating trail:', error);
        alert('Failed to create trail. Please try again.');
      })
      .finally(() => {
        setSubmitting(false);
      });
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
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <>
                <div className='modal-header'>
                  <div className='modal-header__title-wrapper'>
                    <h2 className='modal-header__subtitle'>Create</h2>
                    <h2 className='modal-header__title'>New Trail!..</h2>
                  </div>
                  <button onClick={onClose} type='button' className='modal-header__close-btn'>
                    <img src={closeIcon} alt="close" className='modal-header__close-icon' /> 
                  </button>
                </div>

                <Form className='modal-form'>
              
                  {currentStep === 1 && (
                    <div className='modal-step'>
                      
                      <div className='form-field'>
                        <label className='form-field__label'>
                          Title <span className='form-field__required'>*</span>
                        </label>
                        <Field
                          type='text'
                          name='title'
                          className='form-field__input'
                          placeholder='Enter trail title'
                        />
                        <ErrorMessage name='title' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Description <span className='form-field__required'>*</span>
                        </label>
                        <Field
                          as='textarea'
                          name='description'
                          rows='4'
                          className='form-field__textarea'
                          placeholder='Enter trail description'
                        />
                        <ErrorMessage name='description' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label form-field__label--with-margin'>
                          Category <span className='form-field__required'>*</span>
                        </label>
                        <div className='category-grid'>
                          {AVAILABLE_CATEGORIES.map((categoryName) => (
                            <label
                              key={categoryName}
                              className={`category-option ${values.category === categoryName ? 'category-option--selected' : ''}`}
                            >
                              <Field
                                type='radio'
                                name='category'
                                value={categoryName}
                                className='category-option__radio'
                              />
                              <span className='category-option__label'>{categoryName}</span>
                            </label>
                          ))}
                        </div>
                        <ErrorMessage name='category' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Image URL
                        </label>
                        <Field
                          type='url'
                          name='image'
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
                          <Field
                            type='number'
                            name='participantsRequired'
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
                                if (calculatedPhase >= 1 && calculatedPhase <= 10 && calculatedPhase !== values.phase) {
                                  setFieldValue('phase', calculatedPhase);
                                }
                              }}
                            >
                              <div className='phase-carousel__padding'>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((phaseNumber) => (
                                  <div
                                    key={phaseNumber}
                                    onClick={() => {
                                      setFieldValue('phase', phaseNumber);
                                      scrollCarouselToPhase(phaseNumber);
                                    }}
                                    className={`phase-carousel__item ${values.phase === phaseNumber ? 'phase-carousel__item--active' : ''}`}
                                  >
                                    {phaseNumber}
                                  </div>
                                ))}
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
                    
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='modal-navigation__btn modal-navigation__btn--primary'
                    >
                      {isSubmitting ? 'Creating...' : currentStep === 1 ? 'Next' : 'Create Trail'}
                    </button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default CreateTrailModal;
