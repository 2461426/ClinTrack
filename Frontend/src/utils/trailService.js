// Trail Service for handling trail data operations with backend API

const API_URL = 'http://localhost:5000/trailDetails';

// API functions to interact with backend
export const createTrailAPI = async (newTrail) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrail)
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, trail: data };
    } else {
      return { success: false, error: 'Failed to create trail' };
    }
  } catch (error) {
    console.error('Error creating trail:', error);
    return { success: false, error: error.message };
  }
};

export const getTrailsAPI = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    // json-server returns the array directly, not wrapped in trailDetails
    return data;
  } catch (error) {
    console.error('Error fetching trails:', error);
    return null;
  }
};

export const updateTrailAPI = async (trailId, updates) => {
  try {
    const response = await fetch(`${API_URL}/${trailId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating trail:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTrailAPI = async (trailId) => {
  try {
    const response = await fetch(`${API_URL}/${trailId}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting trail:', error);
    return { success: false, error: error.message };
  }
};

// Legacy localStorage functions (kept for fallback)
export const saveTrailToLocalStorage = (newTrail, existingTrails) => {
  try {
    const updatedTrails = [...existingTrails, newTrail];
    localStorage.setItem('trailDetails', JSON.stringify({ trailDetails: updatedTrails }));
    return { success: true, trails: updatedTrails };
  } catch (error) {
    console.error('Error saving trail to localStorage:', error);
    return { success: false, error: error.message };
  }
};

export const getTrailsFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem('trailDetails');
    if (stored) {
      return JSON.parse(stored).trailDetails;
    }
    return null;
  } catch (error) {
    console.error('Error reading trails from localStorage:', error);
    return null;
  }
};

export const initializeTrailsInLocalStorage = (initialTrails) => {
  try {
    const existing = getTrailsFromLocalStorage();
    if (!existing) {
      localStorage.setItem('trailDetails', JSON.stringify({ trailDetails: initialTrails }));
    }
  } catch (error) {
    console.error('Error initializing trails in localStorage:', error);
  }
};
