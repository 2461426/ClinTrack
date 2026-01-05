
// src/components/ParticipantProfile/ParticipantProfile.jsx
import React, { useState, useEffect } from 'react';
import './ParticipantProfile.css';
import ParticipantNavbar from '../ParticipantNavbar/ParticipantNavbar';
import participantService from '../../services/ParticipantService'; // <-- adjust path if needed

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ParticipantProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loggedInUser = localStorage.getItem('logged_in_user');

    if (!loggedInUser) {
      setError('No user logged in');
      setLoading(false);
      toast.error('No user logged in', { toastId: 'no-user' });
      return;
    }

    let userId;
    try {
      const parsedUser = JSON.parse(loggedInUser);
      userId = parsedUser.id;
    } catch (e) {
      setError('Error reading user data');
      setLoading(false);
      toast.error('Error reading user data', { toastId: 'parse-error' });
      return;
    }

    participantService
      .getParticipantById(userId)
      .then((data) => {
        setUserData(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          mobile: data.mobile || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
        toast.error('Failed to load profile data', { toastId: 'load-error' });
      });
  }, []);

  const handleEditToggle = () => {
    setFormErrors({});
    if (editMode) {
      // Leaving edit mode (Cancel)
      if (dirty) {
        toast.info('Changes discarded');
      }
      // Reset form to current user data
      setForm({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        mobile: userData?.mobile || '',
      });
      setDirty(false);
      setEditMode(false);
    } else {
      // Enter edit mode
      setEditMode(true);
      setDirty(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (
        next.firstName !== (userData?.firstName || '') ||
        next.lastName !== (userData?.lastName || '') ||
        next.mobile !== (userData?.mobile || '')
      ) {
        setDirty(true);
      } else {
        setDirty(false);
      }
      return next;
    });
  };

  const validate = () => {
    const errors = {};
    const firstName = (form.firstName || '').trim();
    const lastName = (form.lastName || '').trim();
    const mobile = (form.mobile || '').trim();

    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';

    // Indian mobile validation: 10 digits, starts with 6–9
    const mobileIN = /^[6-9]\d{9}$/;
    if (!mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!mobileIN.test(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile (starts with 6–9).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const noChanges = () => {
    return (
      (form.firstName || '').trim() === (userData?.firstName || '').trim() &&
      (form.lastName || '').trim() === (userData?.lastName || '').trim() &&
      (form.mobile || '').trim() === (userData?.mobile || '').trim()
    );
  };

  const handleSave = async () => {
    if (!userData) return;

    if (!validate()) {
      toast.error('Please fix the errors before saving.');
      return;
    }

    if (noChanges()) {
      toast.info('No changes to save.');
      setEditMode(false);
      setDirty(false);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await participantService.updateParticipantProfile(userData.id, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        mobile: form.mobile.trim(),
      });

      // Merge updated values into userData
      setUserData((prev) => ({
        ...prev,
        ...updated,
      }));

      setEditMode(false);
      setDirty(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err);
      setError('Failed to update profile. Please try again.');
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <ParticipantNavbar />
        <div className="participant-profile">
          <div className="participant-profile__loading">Loading...</div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  if (error && !editMode && !saving) {
    return (
      <>
        <ParticipantNavbar />
        <div className="participant-profile">
          <div className="participant-profile__error">{error}</div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  return (
    <>
      <ParticipantNavbar />
      <div className="participant-profile">
        <div className="participant-profile__container">

          <div className="participant-profile__title-row">
            <h1 className="participant-profile__title">My Profile</h1>

            {/* Update / Save / Cancel */}
            <div className="participant-profile__actions">
              {!editMode ? (
                <button
                  className="participant-profile__update-btn"
                  onClick={handleEditToggle}
                >
                  Update Profile
                </button>
              ) : (
                <div className="participant-profile__edit-actions">
                  <button
                    className="participant-profile__save-btn"
                    onClick={handleSave}
                    disabled={saving}
                    title="Save changes"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    className="participant-profile__cancel-btn"
                    onClick={handleEditToggle}
                    disabled={saving}
                    title="Discard changes"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="participant-profile__header">
            <img
              src={userData?.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="participant-profile__picture"
            />
            <div className="participant-profile__basic-info">
              {!editMode ? (
                <>
                  <h2 className="participant-profile__name">
                    {userData?.firstName} {userData?.lastName}
                  </h2>
                  <p className="participant-profile__id">ID: {userData?.id}</p>
                </>
              ) : (
                <div className="participant-profile__edit-grid">
                  <div className="participant-profile__edit-item">
                    <label className="participant-profile__label" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`participant-profile__input ${formErrors.firstName ? 'has-error' : ''}`}
                      placeholder="Enter first name"
                      autoComplete="given-name"
                    />
                    {formErrors.firstName && (
                      <div className="participant-profile__field-error">{formErrors.firstName}</div>
                    )}
                  </div>

                  <div className="participant-profile__edit-item">
                    <label className="participant-profile__label" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`participant-profile__input ${formErrors.lastName ? 'has-error' : ''}`}
                      placeholder="Enter last name"
                      autoComplete="family-name"
                    />
                    {formErrors.lastName && (
                      <div className="participant-profile__field-error">{formErrors.lastName}</div>
                    )}
                  </div>

                  <div className="participant-profile__edit-item">
                    <label className="participant-profile__label" htmlFor="mobile">
                      Mobile
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={handleChange}
                      className={`participant-profile__input ${formErrors.mobile ? 'has-error' : ''}`}
                      placeholder="10-digit mobile (starts with 6–9)"
                      inputMode="numeric"
                      maxLength={10}
                    />
                    {formErrors.mobile && (
                      <div className="participant-profile__field-error">{formErrors.mobile}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="participant-profile__section">
            <h3 className="participant-profile__section-title">Personal Information</h3>
            {!editMode ? (
              <div className="participant-profile__info-grid">
                <div className="participant-profile__info-item">
                  <span className="participant-profile__label">Email:</span>
                  <span className="participant-profile__value">{userData?.email}</span>
                </div>
                <div className="participant-profile__info-item">
                  <span className="participant-profile__label">Mobile:</span>
                  <span className="participant-profile__value">{userData?.mobile}</span>
                </div>
                <div className="participant-profile__info-item">
                  <span className="participant-profile__label">Date of Birth:</span>
                  <span className="participant-profile__value">{userData?.dateOfBirth}</span>
                </div>
                {userData?.gender && (
                  <div className="participant-profile__info-item">
                    <span className="participant-profile__label">Gender:</span>
                    <span className="participant-profile__value">{userData?.gender}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="participant-profile__edit-note">
                <em>Email cannot be updated here.</em>
              </div>
            )}
          </div>

          {/* Medical History */}
          <div className="participant-profile__section">
            <h3 className="participant-profile__section-title">Medical History</h3>
            <div className="participant-profile__info-grid">
              {userData?.trialType && (
                <div className="participant-profile__info-item">
                  <span className="participant-profile__label">Trial Type:</span>
                  <span className="participant-profile__value">
                    {userData?.trialType?.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Obesity Category:</span>
                <span className="participant-profile__value">
                  {userData?.obesityCategory?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Blood Pressure:</span>
                <span className="participant-profile__value">
                  {userData?.bpCategory?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Diabetes Status:</span>
                <span className="participant-profile__value">
                  {userData?.diabetesStatus?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Has Asthma:</span>
                <span className="participant-profile__value">
                  {userData?.hasAsthma ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="participant-profile__info-item">
                <span className="participant-profile__label">Has Chronic Illnesses:</span>
                <span className="participant-profile__value">
                  {userData?.hasChronicIllnesses ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {error && editMode && (
            <div className="participant-profile__inline-error">{error}</div>
          )}
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ParticipantProfile;
