
import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";

/* ===== Seed trial data ===== */
const seedTrials = [
  {
    id: "t1",
    title: "Hypertension Medication Study",
    site: "City Hospital",
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    approved: true,
    status: "active",
    notes: "Phase II study",
  },
  {
    id: "t2",
    title: "Cardio Health Observational",
    site: "Central Clinic",
    start: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    approved: true,
    status: "upcoming",
    notes: "Observational study for 30 days",
  },
];

/* ===== Profile form initial fields ===== */
const profileInitials = {
  trialType: "",
  hypertensionCategory: "",
  bpCategory: "",
  diabetesStatus: "",
  hasAsthma: null,
  hasChronicIllnesses: null,
  phone: "",
  address: "",
};

/* ===== Utilities ===== */
function getInitials(user) {
  if (!user) return "U";
  const f = (user.firstName || "").charAt(0);
  const l = (user.lastName || "").charAt(0);
  return `${f}${l}`.toUpperCase() || "U";
}

function formatDateRange(startISO, endISO) {
  try {
    const s = new Date(startISO);
    const e = new Date(endISO);
    return `${s.toLocaleDateString()} – ${e.toLocaleDateString()}`;
  } catch {
    return "Invalid date";
  }
}

function getStatusBadge(trial) {
  if (!trial) return { label: "Unknown", className: "bg-secondary text-white" };
  if (trial.status === "withdrawn") return { label: "Withdrawn", className: "bg-danger text-white" };
  if (trial.status === "active") return { label: "Active", className: "bg-success text-white" };
  if (trial.status === "upcoming") return { label: "Upcoming", className: "bg-info text-dark" };
  return { label: "Past", className: "bg-secondary text-white" };
}

/* ===== Persistence helpers ===== */
function loadUser() {
  const saved = localStorage.getItem("user_profile");
  return (saved && JSON.parse(saved)) || {
    firstName: "Vivek",
    lastName: "Deshmukh",
    email: "vivek@example.com",
    phone: "",
    address: "",
  };
}
function saveUser(user) {
  localStorage.setItem("user_profile", JSON.stringify(user));
}
function loadTrials() {
  const saved = localStorage.getItem("user_trials");
  return saved ? JSON.parse(saved) : seedTrials;
}
function saveTrials(trials) {
  localStorage.setItem("user_trials", JSON.stringify(trials));
}

/* ===== Profile Modal (Formik + validations) ===== */
function ProfileModal({ user, onClose, onSave }) {
  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Profile</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <Formik
            initialValues={{ ...profileInitials, phone: user?.phone || "", address: user?.address || "" }}
            validate={(values) => {
              const errors = {};
              if (!values.phone) {
                errors.phone = "Phone is required";
              } else if (!/^[0-9]{10,15}$/.test(values.phone)) {
                errors.phone = "Phone must be 10–15 digits (numbers only)";
              }
              if (!values.address) {
                errors.address = "Address is required";
              } else if (values.address.trim().length < 10) {
                errors.address = "Address must be at least 10 characters";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              onSave({ ...user, phone: values.phone, address: values.address });
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form>
                <div className="modal-body">
                  <div className="container-fluid profile-form-max">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor="phone">Phone</label>
                            <Field id="phone" name="phone" className="form-control" />
                            <ErrorMessage name="phone" component="div" className="error" />
                          </div>
                          <div className="col-12">
                            <label className="form-label" htmlFor="address">Address</label>
                            <Field id="address" name="address" as="textarea" rows={3} className="form-control" />
                            <ErrorMessage name="address" component="div" className="error" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    Save Changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

/* ===== Trial Card (Withdraw = Delete) ===== */
function TrialCard({ trial, onWithdraw }) {
  const badge = getStatusBadge(trial);
  return (
    <div className="card trial-card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="card-title mb-1">{trial.title}</h6>
            <div className="text-muted small">{trial.site}</div>
          </div>
          <span className={`badge ${badge.className}`}>{badge.label}</span>
        </div>
        <div className="text-muted small mb-2">{formatDateRange(trial.start, trial.end)}</div>
        {trial.notes && <p className="card-text small mb-3">{trial.notes}</p>}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            title="Withdraw (permanently delete this trial)"
            onClick={() => onWithdraw(trial.id)}
          >
            Withdraw
          </button>
          <button className="btn btn-primary btn-sm" disabled>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Home Page (Welcome + preview) ===== */
function HomePage({ user, currentTrial, upcomingTrials, onWithdraw }) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User";
  return (
    <div className="container my-5">
      <div className="home-welcome text-center">
        <h2 className="fw-semibold">Welcome {name}</h2>
        <p className="text-muted">Your personalized dashboard is ready.</p>
      </div>

      {/* Preview of Active & Upcoming */}
      <div className="my-4">
        <h5 className="mb-3">Active Trials</h5>
        {currentTrial ? (
          <TrialCard trial={currentTrial} onWithdraw={onWithdraw} />
        ) : (
          <div className="alert alert-info">No active trial right now.</div>
        )}

        <h6 className="mt-4 mb-2">Upcoming Trials</h6>
        {upcomingTrials.length ? (
          <div className="row g-3">
            {upcomingTrials.map((t) => (
              <div key={t.id} className="col-12 col-md-6 col-lg-4">
                <TrialCard trial={t} onWithdraw={onWithdraw} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted">No upcoming approved trials.</div>
        )}
      </div>
    </div>
  );
}

/* ===== About & Contact pages ===== */
function AboutPage() {
  return (
    <div className="container my-4">
      <h4 className="mb-2">About</h4>
      <p className="text-muted">
        This portal helps you manage clinical trials participation and profile details.
      </p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="container my-4">
      <h4 className="mb-2">Contact</h4>
      <p className="text-muted">
        For assistance, contact support@example.com or visit our help center.
      </p>
    </div>
  );
}

/* ===== Trials page (registered trials) ===== */
function TrialsPage({ trials, onWithdraw }) {
  return (
    <div className="container my-4">
      <h5 className="mb-3">Your Registered Trials</h5>
      {trials.length ? (
        <div className="row g-3">
          {trials.map((t) => (
            <div key={t.id} className="col-12 col-md-6 col-lg-4">
              <TrialCard trial={t} onWithdraw={onWithdraw} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted">You have no registered trials.</div>
      )}
    </div>
  );
}

/* ===== Main Dashboard with Router ===== */
export default function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => loadUser());
  const [trials, setTrials] = useState(() => loadTrials());
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!e.target.closest) return;
      if (!e.target.closest(".user-menu")) setShowMenu(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Persist changes
  useEffect(() => saveTrials(trials), [trials]);
  useEffect(() => saveUser(user), [user]);

  const now = new Date();
  const approvedTrials = useMemo(
    () => trials.filter((t) => t.approved && t.status !== "withdrawn"),
    [trials]
  );
  const currentTrial = useMemo(
    () => approvedTrials.find((t) => new Date(t.start) <= now && new Date(t.end) >= now),
    [approvedTrials, now]
  );
  const upcomingTrials = useMemo(
    () =>
      approvedTrials
        .filter((t) => new Date(t.start) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start)),
    [approvedTrials, now]
  );

  // Withdraw = delete trial permanently
  function handleWithdraw(id) {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  }

  function handleLogout() {
    localStorage.removeItem("auth_token");
    navigate("/");
  }

  function handleProfileSave(values) {
    setUser(values);
    setShowProfileModal(false);
  }

  return (
    <section className="dashboard-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-light border-bottom sticky-top">
        <div className="container-fluid">
          <span className="navbar-brand fw-semibold">Dashboard</span>

          <button
            className="navbar-toggler"
            type="button"
            onClick={(e) => {
              const collapse = e.currentTarget
                .closest(".navbar")
                ?.querySelector(".navbar-collapse");
              if (collapse) collapse.classList.toggle("show");
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/about"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/contact"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  Contact
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/trials"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  Trials
                </NavLink>
              </li>
            </ul>

            <div className="user-menu position-relative">
              <button
                type="button"
                className="btn btn-light rounded-circle user-avatar"
                onClick={() => setShowMenu((s) => !s)}
                aria-expanded={showMenu}
              >
                {getInitials(user)}
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end ${showMenu ? "show" : ""}`}
                style={{ position: "absolute", right: 0 }}
              >
                <li>
                  <button className="dropdown-item" onClick={() => setShowProfileModal(true)}>
                    User Profile
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Pages */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              currentTrial={currentTrial}
              upcomingTrials={upcomingTrials}
              onWithdraw={handleWithdraw}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/trials"
          element={<TrialsPage trials={trials} onWithdraw={handleWithdraw} />}
        />
      </Routes>

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileSave}
               />
      )}
    </section>
  );
}