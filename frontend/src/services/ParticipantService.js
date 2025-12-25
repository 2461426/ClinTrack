import axios from 'axios';

class ParticipantService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/participants';
  }

  getParticipantById(participantId) {
    return axios.get(`${this.apiUrl}/${participantId}`);
  }

  getParticipantByEmail(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    return axios
      .get(`${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`)
      .then(res => Array.isArray(res.data) ? res.data : [])
      .catch(err => {
        console.error("Error fetching participant by email:", err);
        throw err;
      });
  }

  getAllParticipants() {
    return axios.get(`${this.apiUrl}?role_ne=ADMIN`).then(res => res.data);
  }

  postParticipant(participantData) {
    const { confirmPassword, ...rest } = participantData;
    const payload = {
      ...rest,
      email: (rest.email || '').trim().toLowerCase(),
    };
    return axios.post(this.apiUrl, payload);
  }

  deleteParticipant(id) {
    return axios.delete(`${this.apiUrl}/${id}`);
  }

  updateParticipant(id, partialData) {
    return axios.patch(`${this.apiUrl}/${id}`, partialData);
  }

  // ⬇️ Add back for LoginForm
  findByEmailAndPassword(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    return axios
      .get(`${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        if (data.length === 0) return null;

        const user = data[0];
        return (user.password || '') === password ? user : null;
      })
      .catch((error) => {
        console.error('findByEmailAndPassword error:', error);
        return null;
      });
  }

  // Enrollment request methods
  createEnrollmentRequest(requestData) {
    return axios.post('http://localhost:5000/enrollmentRequests', requestData);
  }

  getEnrollmentRequestsByTrail(trailId) {
    return axios.get(`http://localhost:5000/enrollmentRequests?trailId=${trailId}`);
  }

  approveEnrollmentRequest(requestId, participantId, trailId) {
    // First, get the trail details
    return axios.get(`http://localhost:5000/trailDetails/${trailId}`)
      .then(response => {
        const trail = response.data;
        const updatedParticipantsId = trail.participantsId ? [...trail.participantsId, participantId] : [participantId];
        const updatedTrail = {
          ...trail,
          participantsId: updatedParticipantsId,
          participantsEnrolled: trail.participantsEnrolled + 1
        };
        
        // Update the trail with new participant
        return axios.put(`http://localhost:5000/trailDetails/${trailId}`, updatedTrail);
      })
      .then(() => {
        // Update the request status to approved
        return axios.patch(`http://localhost:5000/enrollmentRequests/${requestId}`, { status: 'approved' });
      });
  }

  rejectEnrollmentRequest(requestId) {
    return axios.patch(`http://localhost:5000/enrollmentRequests/${requestId}`, { status: 'rejected' });
  }
}

const participantService = new ParticipantService();
export default participantService;

