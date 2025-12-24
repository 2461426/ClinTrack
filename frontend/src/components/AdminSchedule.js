
import React, { useEffect, useMemo, useState } from "react";
import participantService from "../services/ParticipantService";
import scheduleService from "../services/ScheduleService";
import "../styles/Admindashboard.css";
import Menu from "./Menu";

const ROLE_ADMIN = "ADMIN";
const TRIAL_TYPES = [
  { id: "HYPERTENSION_TRIAL", name: "Hypertension Trial" },
  { id: "COVID_19_VACCINE", name: "COVID‑19 Vaccine" },
  { id: "ONCOLOGY_THERAPY", name: "Oncology Therapy Trial" }
];

const isFutureDate = (d) => {
  if (!d) return false;
  const today = new Date().toISOString().slice(0, 10);
  return d > today;
};

function AdminSchedule() {
  const raw = localStorage.getItem("logged_in_user");
  const currentUser = raw ? JSON.parse(raw) : null;
  const isAdmin = currentUser?.role === ROLE_ADMIN;

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [trialType, setTrialType] = useState(TRIAL_TYPES[0].id);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [phase, setPhase] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [status, setStatus] = useState("PLANNED");

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Load participants using .then/.catch
  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    setErr("");

    participantService
      .getAllParticipants()
      .then((all) => {
        const usersOnly = (all || []).filter((p) => p.role !== "ADMIN");
        setParticipants(usersOnly);
      })
      .catch(() => setErr("Unable to load participants."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const filtered = useMemo(
    () => participants.filter((p) => p.trialType === trialType),
    [participants, trialType]
  );

  const submit = (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    // Validations
    if (!selectedParticipantId) return setSubmitError("Please select a participant.");
    if (!phase || phase.trim().length < 3) return setSubmitError("Please enter a valid phase (min 3 characters).");
    if (!visitDate) return setSubmitError("Please choose a VisitDate.");
    if (status === "PLANNED" && !isFutureDate(visitDate)) {
      return setSubmitError("VisitDate must be a future date for PLANNED.");
    }

    scheduleService
      .createSchedule({
        ParticipantID: selectedParticipantId,
        Phase: phase.trim(),
        VisitDate: visitDate,
        Status: status
      })
      .then((created) => {
        setSubmitSuccess(`✅ Scheduled ${created.ScheduleID} for participant ${created.ParticipantID} on ${created.VisitDate}.`);
        setPhase("");
        setVisitDate("");
        setStatus("PLANNED");
      })
      .catch(() => setSubmitError("Unable to create schedule. Please try again."));
  };

  if (!isAdmin) {
    return (
      <div className="admin-wrap">
        <div className="card">
          <h3>Admin Access Required</h3>
          <p className="text-muted">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Menu/>
  
    <div className="admin-wrap">
      <div className="header-row">
        <h2 className="page-title">
          <i className="bi bi-calendar2-plus me-2" />
          Schedule by Trial Type
        </h2>
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        {/* Trial type selector */}
        <div className="row">
          <label className="form-label">Trial Type</label>
          <select
            className="input"
            value={trialType}
            onChange={(e) => {
              setTrialType(e.target.value);
              setSelectedParticipantId("");
            }}
          >
            {TRIAL_TYPES.map((tt) => (
              <option key={tt.id} value={tt.id}>
                {tt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Participants dropdown */}
        <div className="row">
          <label className="form-label">Participant</label>
          <select
            className="input"
            value={selectedParticipantId}
            onChange={(e) => setSelectedParticipantId(e.target.value)}
          >
            <option value="">-- Select Participant --</option>
            {filtered.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {p.email} — {p.mobile}
              </option>
            ))}
          </select>
          <div className="text-muted" style={{ marginTop: 6 }}>
            {filtered.length} participant(s) found for <strong>{trialType}</strong>.
          </div>
        </div>

        {/* Schedule form */}
        <form onSubmit={submit} className="contact-form" style={{ marginTop: 8 }}>
          <div className="row">
            <label className="form-label">Phase</label>
            <input
              type="text"
              className="input"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              placeholder="e.g., Screening / Phase II"
            />
          </div>

          <div className="row">
            <label className="form-label">VisitDate</label>
            <input
              type="date"
              className="input"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>

          <div className="row">
            <label className="form-label">Status</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PLANNED">PLANNED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {submitError && <div className="error">{submitError}</div>}
          {submitSuccess && (
            <div className="alert-info" style={{ padding: "8px 12px" }}>
              {submitSuccess}
            </div>
          )}

          <div className="actions" style={{ textAlign: "right" }}>
            <button type="submit" className="btn-primary">
              <i className="bi bi-save2 me-2" />
              Create Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Quick view of filtered participants */}
      <div className="table-card" style={{ marginTop: 12 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>DOB</th>
              <th>Trial Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted">
                  No participants for selected trial type.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.email}</td>
                  <td>{p.mobile}</td>
                  <td>{p.dateOfBirth}</td>
                  <td>{p.trialType}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
      </>
  );
}

export default AdminSchedule;
