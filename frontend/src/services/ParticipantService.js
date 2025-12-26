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
}

const participantService = new ParticipantService();
export default participantService;

