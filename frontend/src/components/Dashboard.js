
// src/pages/Dashboard.js
import { useEffect, useMemo, useState } from "react";
import participantService from "../services/ParticipantService";
import "../styles/Dashboard.css";

const TRIAL_LABELS = {
  COVID_19_VACCINE: "COVID‑19 Vaccine",
  HYPERTENSION_TRIAL: "Hypertension Trial",
  ONCOLOGY_THERAPY: "Oncology Therapy Trial",
};

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState({});

  // Determine current user by email stored at login
  const currentEmail = useMemo(
    () => (localStorage.getItem("currentUserEmail") || "").trim().toLowerCase(),
    []
  );

  useEffect(() => {
    async function init() {
      if (!currentEmail) return;

      // Get me by email
      const { data: myArray } = await participantService.getparticipantByemail(currentEmail);
      const myself = Array.isArray(myArray) && myArray[0] ? myArray[0] : null;
      setMe(myself);

      // Fetch participants for my trial
      if (myself?.trialType) {
        const { data: trialParticipants } =
          await participantService.getParticipantsByTrial(myself.trialType);
        setParticipants(trialParticipants);
      }
    }
    init();
  }, [currentEmail]);

  const trialName = me?.trialType ? TRIAL_LABELS[me.trialType] || me.trialType : "—";

  const openEdit = () => {
    setEdit({
      firstName: me?.firstName || "",
      lastName: me?.lastName || "",
      mobile: me?.mobile || "",
      trialType: me?.trialType || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!me?.id) return;
    await participantService.updateParticipant(me.id, edit);
    alert("Profile updated!");
    setEditOpen(false);

    // Refresh
    const { data: refreshed } = await participantService.getParticipantById(me.id);
    setMe(refreshed);

    if (refreshed?.trialType) {
      const { data: trialParticipants } =
        await participantService.getParticipantsByTrial(refreshed.trialType);
      setParticipants(trialParticipants);
    }
  };

  return (
    <>
      {/* Navbar (same visual style as your ClinTrack page) */}
      <header className="clintrack-page__header">
        <nav className="navbar clintrack-page__navbar">
          <div className="container d-flex align-items-center justify-content-center">
            <h1
              className="clintrack-page__title text-center m-0"
              aria-label="Clinical Trial Management and Compliance Management System"
            >
              Clinical Trial Management and Compliance Management System
            </h1>
          </div>
        </nav>
      </header>

      <main className="dashboard">
        <div className="dash-container">
          {/* Top actions: Back (left) + Go to Contact/About on right */}
          <div className="dash-actions">
            <button className="btn-back" onClick={() => window.location.assign("/")}>
              ← Back
            </button>
            <div className="dash-actions-right">
             <a> /contactContact</a>
             <a> /aboutAbout</a>
            </div>
          </div>

          {/* Profile card */}
          <section className="card glass profile-card">
            <div className="card-header">
              <h2>My Profile</h2>
              <button className="btn-edit" onClick={openEdit}>Edit</button>
            </div>
            <div className="card-body">
              {me ? (
                <ul className="facts">
                  <li><strong>Name:</strong> {me.firstName} {me.lastName}</li>
                  <li><strong>Email:</strong> {me.email}</li>
                  <li><strong>Mobile:</strong> {me.mobile}</li>
                  <li><strong>Date of Birth:</strong> {me.dateOfBirth}</li>
                  <li><strong>Trial:</strong> {trialName}</li>
                </ul>
              ) : (
                <p className="muted">No user loaded. Please log in.</p>
              )}
            </div>
          </section>

          {/* My Trial card */}
          <section className="card gradient trial-card">
            <div className="card-header">
              <h2>My Trial</h2>
            </div>
            <div className="card-body">
              <p className="lead">
                You are currently registered for <strong>{trialName}</strong>.
              </p>
              <p className="sublead">
                Review trial guidelines and participant updates here.
              </p>
            </div>
          </section>

          {/* Participants list (for my trial) */}
          <section className="card glass participants-card">
            <div className="card-header">
              <h2>Participants</h2>
              <span className="badge">{participants.length}</span>
            </div>
            <div className="card-body">
              {participants.length === 0 ? (
                <p className="muted">No participants yet for this trial.</p>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, idx) => (
                        <tr key={p.id}>
                          <td>{idx + 1}</td>
                          <td>{p.firstName} {p.lastName}</td>
                          <td>{p.email}</td>
                          <td>{p.mobile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Edit modal (lightweight) */}
      {editOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close" onClick={() => setEditOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>First Name</label>
                <input
                  value={edit.firstName}
                  onChange={(e) => setEdit({ ...edit, firstName: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>Last Name</label>
                <input
                  value={edit.lastName}
                  onChange={(e) => setEdit({ ...edit, lastName: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>Mobile</label>
                <input
                  value={edit.mobile}
                  onChange={(e) => setEdit({ ...edit, mobile: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>Trial</label>
                <select
                  value={edit.trialType}
                  onChange={(e) => setEdit({ ...edit, trialType: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  <option value="COVID_19_VACCINE">COVID‑19 Vaccine</option>
                  <option value="HYPERTENSION_TRIAL">Hypertension Trial</option>
                  <option value="ONCOLOGY_THERAPY">Oncology Therapy Trial</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="clintrack-page__footer">
        <div className="container-copyright">
          <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
        </div>
           </footer>
    </>
  );
}
