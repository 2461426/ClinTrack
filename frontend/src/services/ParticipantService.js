
import axios from 'axios';

class ParticipantService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/participants';
    this.enrollmentsUrl = 'http://localhost:5000/enrollmentRequests';
    this.trailsUrl = 'http://localhost:5000/trailDetails';
  }

  normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  sanitizeParticipant(p) {
    if (!p || typeof p !== 'object') return p;
    const { password, confirmPassword, hashedPassword, ...safe } = p;
    return safe;
  }

  sanitizeArray(data) {
    return Array.isArray(data) ? data.map(this.sanitizeParticipant) : [];
  }

  getParticipantById(participantId) {
    return axios.get(`${this.apiUrl}/${participantId}`)
      .then(res => this.sanitizeParticipant(res.data));
  }

  getParticipantByEmail(email) {
    const normalizedEmail = this.normalizeEmail(email);
    return axios.get(`${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`)
      .then(res => this.sanitizeArray(res.data));
  }

  getAllParticipants() {
    return axios.get(`${this.apiUrl}?role_ne=ADMIN`)
      .then(res => this.sanitizeArray(res.data));
  }

  postParticipant(participantData) {
    const { confirmPassword, ...rest } = participantData || {};
    const payload = {
      ...rest,
      email: this.normalizeEmail(rest.email),
    };
    return axios.post(this.apiUrl, payload)
      .then(res => this.sanitizeParticipant(res.data));
  }

  deleteParticipant(id) {
    return axios.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Generic patch, but we still strip sensitive keys.
   */
  updateParticipant(id, partialData) {
    const { password, confirmPassword, hashedPassword, ...safePatch } = partialData || {};
    // 💡 Even if email sneaks in, we drop it in the stricter profile updater below.
    return axios.patch(`${this.apiUrl}/${id}`, safePatch)
      .then(res => this.sanitizeParticipant(res.data));
  }

  /**
   * 🔒 Strict profile update: allow ONLY firstName, lastName, mobile.
   * - Email is NOT updatable.
   * - Strips everything else (including email).
   */
  async updateParticipantProfile(id, payload) {
    const safePatch = {};
    if (typeof payload?.firstName === 'string') safePatch.firstName = payload.firstName.trim();
    if (typeof payload?.lastName === 'string') safePatch.lastName = payload.lastName.trim();
    if (typeof payload?.mobile === 'string') safePatch.mobile = payload.mobile.trim();

    // Block email updates explicitly
    if ('email' in payload) {
      console.warn('Attempted email update blocked by updateParticipantProfile');
    }

    if (Object.keys(safePatch).length === 0) {
      // Nothing to update
      return this.getParticipantById(id);
    }

    return this.updateParticipant(id, safePatch);
  }

  // Demo-only auth (not secure)
  findByEmailAndPassword(email, password) {
    const normalizedEmail = this.normalizeEmail(email);
    return axios.get(`${this.apiUrl}?email=${encodeURIComponent(normalizedEmail)}`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        if (data.length === 0) return null;
        const user = data[0];
        return (user.password || '') === password ? this.sanitizeParticipant(user) : null;
      })
      .catch(() => null);
  }

  // Enrollment helpers
  createEnrollmentRequest(requestData) {
    return axios.post(this.enrollmentsUrl, requestData);
  }

  getEnrollmentRequestsByTrail(trailId) {
    return axios.get(`${this.enrollmentsUrl}?trailId=${trailId}`);
  }

  approveEnrollmentRequest(requestId, participantId, trailId) {
    return axios.get(`${this.trailsUrl}/${trailId}`)
      .then(response => {
        const trail = response.data;
        const alreadyEnrolled = Array.isArray(trail.participantsId) && trail.participantsId.includes(participantId);

        const updatedParticipantsId = alreadyEnrolled
          ? trail.participantsId
          : (trail.participantsId ? [...trail.participantsId, participantId] : [participantId]);

        const updatedTrail = {
          ...trail,
          participantsId: updatedParticipantsId,
          participantsEnrolled: alreadyEnrolled ? trail.participantsEnrolled : (trail.participantsEnrolled + 1),
        };

        return axios.put(`${this.trailsUrl}/${trailId}`, updatedTrail);
      })
      .then(() => axios.patch(`${this.enrollmentsUrl}/${requestId}`, { status: 'approved' }));
  }

  rejectEnrollmentRequest(requestId) {
    return axios.patch(`${this.enrollmentsUrl}/${requestId}`, { status: 'rejected' });
  }
}

const participantService = new ParticipantService();
export default participantService;
