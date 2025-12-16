
import axios from 'axios';

class ParticipantService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/participants';
  }

  getParticipantById(participantId) {
    return axios.get(`${this.apiUrl}/${participantId}`);
  }

  // Keep your existing method (but consider renaming for consistency)
  getparticipantByemail(email) {
    return axios.get(`${this.apiUrl}?email=${encodeURIComponent(email)}`);
  }

  postParticipant(participantData) {
    // Tip: store email in lowercase at registration to make lookups deterministic
    const payload = {
      ...participantData,
      email: (participantData.email || '').trim().toLowerCase(),
    };
    return axios.post(this.apiUrl, payload);
  }

  /** ✅ New: strict match by email + password */
  async findByEmailAndPassword(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    // JSON Server supports query params, e.g. /participants?email=foo@bar.com
    const { data } = await axios.get(
           `${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`
    );

    // JSON Server returns an array for filter queries
    if (!Array.isArray(data) || data.length === 0) return null;

    // If duplicates exist, prefer the first match
    const user = data[0];

    // Plain password compare (⚠️ dev/demo only; hash in production)
    if ((user.password || '') === password) {
      return user;
    }
    return null;
  }
}

const participantService = new ParticipantService();
export default participantService;