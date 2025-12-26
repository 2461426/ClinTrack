import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './CreateTrailModal.css';
import Lottie from 'lottie-react';
import editText from '../../assets/icons/editText.png';
import closeIcon from '../../assets/icons/close.png';
import thumbsUpAnimation from '../../assets/animations/ThumbsUp.json';

function CreateTrailModal({ isOpen, onClose, pharmaId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const phaseCarouselRef = useRef(null);

  const initialValues = {
    title: '',
    description: '',
    gender: '',
    minAge: '',
    obesityCategory: '',
    bpCategory: '',
    diabetesStatus: '',
    hasAsthma: '',
    hasChronicIllnesses: '',
    phase: 1,
    participantsRequired: '100',
    image: '',
    phaseDates: {}
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '.hide-scrollbar::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const OBESITY_CATEGORIES = [
    { value: '', label: '-- Select obesity category --' },
    { value: 'NORMAL', label: 'Normal weight' },
    { value: 'OVERWEIGHT', label: 'Overweight' },
    { value: 'OBESITY_CLASS_1', label: 'Obesity class 1' },
    { value: 'OBESITY_CLASS_2', label: 'Obesity class 2' },
    { value: 'OBESITY_CLASS_3', label: 'Obesity class 3' },
  ];

  const BP_CATEGORIES = [
    { value: '', label: '-- Select BP category --' },
    { value: 'NORMAL', label: 'Normal (<120 and <80)' },
    { value: 'ELEVATED', label: 'Elevated (120–129 and <80)' },
    { value: 'STAGE_1', label: 'Stage 1 (130–139 or 80–89)' },
    { value: 'STAGE_2', label: 'Stage 2 (≥140 or ≥90)' },
    { value: 'CRISIS', label: 'Hypertensive Crisis (≥180 and/or ≥120)' },
    { value: 'UNKNOWN', label: 'Unknown / Not measured' },
  ];

  const DIABETES_STATUS = [
    { value: '', label: '-- Select diabetes status --' },
    { value: 'NONE', label: 'No diabetes' },
    { value: 'PREDIABETES', label: 'Prediabetes' },
    { value: 'TYPE_1', label: 'Type 1 diabetes' },
    { value: 'TYPE_2', label: 'Type 2 diabetes' },
    { value: 'GESTATIONAL', label: 'Gestational diabetes' },
    { value: 'UNKNOWN', label: 'Unknown / Not sure' },
  ];

  const GENDER_OPTIONS = [
    { value: '', label: '-- Select gender --' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'ANY', label: 'Any' },
  ];

  const PHASE_ITEM_HEIGHT = 60;

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validate = (values) => {
    const errors = {};
    if (currentStep === 1) {
      if (!values.title.trim()) errors.title = 'Title is required';
      if (!values.description.trim()) errors.description = 'Description is required';
      if (!values.gender) errors.gender = 'Please select gender';
      if (!values.minAge) {
        errors.minAge = 'Minimum age is required';
      } else if (values.minAge < 18 || values.minAge > 100) {
        errors.minAge = 'Minimum age must be between 18 and 100';
      }
      if (!values.obesityCategory) errors.obesityCategory = 'Please select obesity category';
      if (!values.bpCategory) errors.bpCategory = 'Please select BP category';
      if (!values.diabetesStatus) errors.diabetesStatus = 'Please select diabetes status';
      if (!values.hasAsthma) errors.hasAsthma = 'Please select an option';
      if (!values.hasChronicIllnesses) errors.hasChronicIllnesses = 'Please select an option';
    }
    if (currentStep === 3) {
      const today = getTodayDate();
      if (!errors.phaseDates) errors.phaseDates = {};
      for (let i = 1; i <= values.phase; i++) {
        const phaseDate = values.phaseDates[i];
        if (phaseDate && phaseDate < today) {
          errors.phaseDates[i] = 'Cannot select past dates';
        }
      }
    }
    return errors;
  };

  const scrollCarouselToPhase = (phaseNumber) => {
    if (phaseCarouselRef.current) {
      phaseCarouselRef.current.scrollTop = (phaseNumber - 1) * PHASE_ITEM_HEIGHT;
    }
  };

  const handleSubmit = (values, { setSubmitting, resetForm, setFieldValue }) => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setSubmitting(false);
      return;
    }

    if (currentStep === 2) {
      const dates = {};
      for (let i = 1; i <= values.phase; i++) {
        dates[i] = '';
      }
      setFieldValue('phaseDates', dates);
      setCurrentStep(3);
      setSubmitting(false);
      return;
    }

    const trailData = {
      trailId: Date.now(),
      pharmaId: Number(pharmaId),
      title: values.title,
      description: values.description,
      gender: values.gender,
      minAge: Number(values.minAge),
      obesityCategory: values.obesityCategory,
      bpCategory: values.bpCategory,
      diabetesStatus: values.diabetesStatus,
      hasAsthma: values.hasAsthma === 'true',
      hasChronicIllnesses: values.hasChronicIllnesses === 'true',
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
      phaseDates: values.phaseDates,
      image: values.image || 'https://img.freepik.com/free-photo/scientist-using-microscope-medical-research_23-2149084779.jpg'
    };

    axios.post('http://localhost:5000/trailDetails', trailData)
      .then((response) => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCurrentStep(1);
          resetForm();
          onClose();
        }, 2000);
      })
      .catch((error) => {
        console.error('Error:', error);
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
          <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
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
                        <Field type='text' name='title' className='form-field__input' placeholder='Enter trail title' />
                        <ErrorMessage name='title' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Description <span className='form-field__required'>*</span>
                        </label>
                        <Field as='textarea' name='description' rows='4' className='form-field__textarea' placeholder='Enter trail description' />
                        <ErrorMessage name='description' component='div' className='form-field__error' />
                      </div>

                      <h3 className='eligibility-criteria-title'>Eligibility Criteria</h3>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Gender <span className='form-field__required'>*</span>
                        </label>
                        <Field as='select' name='gender' className='form-field__select'>
                          {GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Field>
                        <ErrorMessage name='gender' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Minimum Age <span className='form-field__required'>*</span>
                        </label>
                        <Field type='number' name='minAge' className='form-field__input' placeholder='Enter minimum age (18-100)' min='18' max='100' />
                        <ErrorMessage name='minAge' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Obesity Category <span className='form-field__required'>*</span>
                        </label>
                        <Field as='select' name='obesityCategory' className='form-field__select'>
                          {OBESITY_CATEGORIES.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Field>
                        <ErrorMessage name='obesityCategory' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Blood Pressure Category <span className='form-field__required'>*</span>
                        </label>
                        <Field as='select' name='bpCategory' className='form-field__select'>
                          {BP_CATEGORIES.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Field>
                        <ErrorMessage name='bpCategory' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Diabetes Status <span className='form-field__required'>*</span>
                        </label>
                        <Field as='select' name='diabetesStatus' className='form-field__select'>
                          {DIABETES_STATUS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Field>
                        <ErrorMessage name='diabetesStatus' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Asthma History <span className='form-field__required'>*</span>
                        </label>
                        <div className='radio-group'>
                          <label className='radio-label'>
                            <Field type='radio' name='hasAsthma' value='true' />
                            Required
                          </label>
                          <label className='radio-label'>
                            <Field type='radio' name='hasAsthma' value='false' />
                            Not Required
                          </label>
                        </div>
                        <ErrorMessage name='hasAsthma' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>
                          Chronic Illnesses <span className='form-field__required'>*</span>
                        </label>
                        <div className='radio-group'>
                          <label className='radio-label'>
                            <Field type='radio' name='hasChronicIllnesses' value='true' />
                            Required
                          </label>
                          <label className='radio-label'>
                            <Field type='radio' name='hasChronicIllnesses' value='false' />
                            Not Required
                          </label>
                        </div>
                        <ErrorMessage name='hasChronicIllnesses' component='div' className='form-field__error' />
                      </div>

                      <div className='form-field'>
                        <label className='form-field__label'>Image URL</label>
                        <Field type='url' name='image' className='form-field__input' placeholder='Enter image URL (optional)' />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className='modal-step-two'>
                      <div className='modal-step-two__content'>
                        <div className='participants-section'>
                          <label className='participants-section__label'>Participants Required</label>
                          <Field type='number' name='participantsRequired' min='1' className='participants-section__input' />
                          <img src={editText} alt='edit' className='participants-section__edit-icon' />
                        </div>

                        <div className='vertical-divider'></div>

                        <div className='phase-selector'>
                          <label className='phase-selector__label'>No of Phases</label>
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

                  {currentStep === 3 && (
                    <div className='modal-step-three'>
                      <h3 className='phase-dates-title'>Set Phase Dates</h3>
                      <div className='phase-dates-grid'>
                        {Array.from({ length: values.phase }, (_, i) => i + 1).map((phaseNum) => (
                          <div key={phaseNum} className='form-field'>
                            <label className='form-field__label'>Phase {phaseNum} Date</label>
                            <Field 
                              type='date' 
                              name={`phaseDates.${phaseNum}`} 
                              className='form-field__input'
                              min={getTodayDate()}
                            />
                            <ErrorMessage name={`phaseDates.${phaseNum}`} component='div' className='form-field__error' />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='modal-navigation'>
                    <button
                      type='button'
                      onClick={currentStep === 1 ? onClose : () => setCurrentStep(currentStep - 1)}
                      className='modal-navigation__btn modal-navigation__btn--secondary'
                    >
                      {currentStep === 1 ? 'Cancel' : 'Previous'}
                    </button>
                    
                    <button type='submit' disabled={isSubmitting} className='modal-navigation__btn modal-navigation__btn--primary'>
                      {isSubmitting ? 'Creating...' : currentStep === 3 ? 'Create Trail' : 'Next'}
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
