import React, { useState } from 'react';

function CreateTrailModal({ isOpen, onClose, pharmaId, onTrailCreated }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: '01',
    participantsRequired: '',
    image: '',
    phaseDates: { '1': '', '2': '', '3': '', '4': '' }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhaseDateChange = (phase, value) => {
    setFormData(prev => ({
      ...prev,
      phaseDates: {
        ...prev.phaseDates,
        [phase]: value
      }
    }));
  };

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
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
      phase: formData.phase,
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
      phaseDates: formData.phaseDates,
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
      phase: '01',
      participantsRequired: '',
      image: '',
      phaseDates: { '1': '', '2': '', '3': '', '4': '' }
    });
    setCurrentPage(1);
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
          <div className='flex justify-between items-center'>
            <div className={`flex items-center ${currentPage >= 1 ? 'text-indigo-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className='ml-2 text-sm font-medium'>Basic Info</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentPage >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentPage >= 2 ? 'text-indigo-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className='ml-2 text-sm font-medium'>Details</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentPage >= 3 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentPage >= 3 ? 'text-indigo-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage >= 3 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className='ml-2 text-sm font-medium'>Timeline</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className='p-6'>
          {/* Page 1: Basic Info */}
          {currentPage === 1 && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trail Title <span className='text-red-500'>*</span>
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

          {/* Page 2: Details */}
          {currentPage === 2 && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phase <span className='text-red-500'>*</span>
                </label>
                <select
                  name='phase'
                  value={formData.phase}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                >
                  <option value='01'>Phase 01</option>
                  <option value='02'>Phase 02</option>
                  <option value='03'>Phase 03</option>
                  <option value='04'>Phase 04</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Participants Required <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='participantsRequired'
                  value={formData.participantsRequired}
                  onChange={handleInputChange}
                  required
                  min='1'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Enter number of participants'
                />
              </div>
            </div>
          )}

          {/* Page 3: Timeline */}
          {currentPage === 3 && (
            <div className='space-y-4'>
              <div className='mb-4'>
                <p className='text-sm text-gray-600 mb-4'>Set the target dates for each phase of the trial</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phase 1 Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.phaseDates['1']}
                  onChange={(e) => handlePhaseDateChange('1', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phase 2 Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.phaseDates['2']}
                  onChange={(e) => handlePhaseDateChange('2', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phase 3 Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.phaseDates['3']}
                  onChange={(e) => handlePhaseDateChange('3', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phase 4 Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.phaseDates['4']}
                  onChange={(e) => handlePhaseDateChange('4', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-6 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={currentPage === 1 ? onClose : handlePrevious}
              className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium'
            >
              {currentPage === 1 ? 'Cancel' : 'Previous'}
            </button>
            {currentPage < 3 ? (
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