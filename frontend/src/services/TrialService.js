
// src/services/TrialService.js
import axios from "axios";

class TrialService {
  constructor() {
    this.apiUrl = "http://localhost:5000"; // json-server base
  }

  normalizeId(id) {
    // Your data.json stores ids as strings; keep them consistent
    return String(id);
  }

  getUpcomingTrials(participantIdRaw) {
    const participantId = participantIdRaw != null ? this.normalizeId(participantIdRaw) : null;

    return axios
      .get(`${this.apiUrl}/trials`)
      .then((res) => {
        const trials = Array.isArray(res.data) ? res.data : [];

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const upcoming = trials.filter((t) => {
          if (!t.startDate) return true;
          const d = new Date(`${t.startDate}T00:00:00`);
          return d >= startOfToday;
        });

        if (!participantId) return upcoming;

        return axios
          .get(`${this.apiUrl}/enrollments?participantId=${encodeURIComponent(participantId)}`)
          .then((enrRes) => {
            const enrollments = Array.isArray(enrRes.data) ? enrRes.data : [];
            const enrolledIds = new Set(enrollments.map((e) => this.normalizeId(e.trialId)));
            return upcoming.map((t) => ({
              ...t,
              enrolled: enrolledIds.has(this.normalizeId(t.id)),
            }));
          })
          .catch((e) => {
            console.error("Error loading enrollments:", e);
            return upcoming;
          });
      })
      .catch((err) => {
        console.error("Error loading trials:", err);
        return [];
      });
  }

  enroll(participantIdRaw, trialIdRaw) {
    const payload = {
      participantId: this.normalizeId(participantIdRaw),
      trialId: this.normalizeId(trialIdRaw),
      enrolledAt: new Date().toISOString(),
    };

    return axios
      .post(`${this.apiUrl}/enrollments`, payload)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Enrollment POST failed:", err);
        throw err;
      });
  }

  /**
   * Withdraw the participant from their trial(s).
   * If you want exactly one enrollment per participant, we delete the first (or all) we find.
   */
  withdraw(participantIdRaw) {
    const participantId = this.normalizeId(participantIdRaw);

    // First fetch enrollments for this participant, then delete them
    return axios
      .get(`${this.apiUrl}/enrollments?participantId=${encodeURIComponent(participantId)}`)
      .then((enrRes) => {
        const enrollments = Array.isArray(enrRes.data) ? enrRes.data : [];

        if (enrollments.length === 0) {
          // Nothing to withdraw
          return [];
        }

        // If you want to allow only one enrollment, you can delete just the first.
        // To delete ALL enrollments for participant, use Promise.all:
        return Promise.all(
          enrollments.map((e) =>
            axios
              .delete(`${this.apiUrl}/enrollments/${encodeURIComponent(e.id)}`)
              .then(() => e)
          )
        );
      })
      .catch((err) => {
        console.error("Withdraw failed:", err);
        throw err;
      });
  }
}

const trialService = new TrialService();
export default trialService;
