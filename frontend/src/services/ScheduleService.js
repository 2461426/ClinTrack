
// src/services/ScheduleService.js
import axios from "axios";

class ScheduleService {
  constructor() {
    this.apiUrl = "http://localhost:5000/schedules";
  }

  /** All schedules for a participant (sorted by VisitDate asc) */
  async getSchedulesForParticipant(participantId) {
    const { data } = await axios.get(
      `${this.apiUrl}?ParticipantID=${encodeURIComponent(participantId)}&_sort=VisitDate&_order=asc`
    );
    return Array.isArray(data) ? data : [];
  }

  /** Next PLANNED schedule with future VisitDate */
  async getNextPlannedSchedule(participantId) {
    const schedules = await this.getSchedulesForParticipant(participantId);
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const upcoming = schedules.filter(
      (s) => s.Status === "PLANNED" && s.VisitDate >= today
    );
    return upcoming[0] || null;
  }

  /** Create a schedule (Admin) */
  async createSchedule({ ParticipantID, Phase, VisitDate, Status = "PLANNED" }) {
    const now = new Date();
    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, "");
    const id = `SCH-${yyyymmdd}-${Date.now().toString().slice(-6)}`;

    const payload = {
      id,                // JSON Server primary key
      ScheduleID: id,    // your domain ID
      ParticipantID,
      Phase,
      VisitDate,
      Status,
    };

    const { data } = await axios.post(this.apiUrl, payload);
    return data;
  }

  /** Update schedule (e.g., mark completed or reschedule) */
  async updateSchedule(id, partial) {
    const { data } = await axios.patch(`${this.apiUrl}/${encodeURIComponent(id)}`, partial);
    return data;
  }

  /** Convenience methods */
  markCompleted(id) {
    return this.updateSchedule(id, { Status: "COMPLETED" });
  }
  reschedule(id, newDate) {
    return this.updateSchedule(id, { VisitDate: newDate, Status: "PLANNED" });
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
