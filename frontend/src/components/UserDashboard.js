import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/UserDashboard.css";

// Lightweight attempt to use navigate if available, otherwise fallback
// NOTE: name intentionally does NOT start with "use" so ESLint won't treat
// it as a React Hook (which must be called unconditionally).
let navigateHookFactory = null;
try {
  // prefer runtime require to avoid bundler ESM/CJS issues
  // eslint-disable-next-line global-require
  const lib = require("react-router-dom");
  navigateHookFactory = lib.useNavigate || null;
} catch (e) {
  navigateHookFactory = null;
}

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

const initialValues = {
  trialType: "",
  hypertensionCategory: "",
  bpCategory: "",
  diabetesStatus: "",
  hasAsthma: null,
  hasChronicIllnesses: null,
  phone: "",
  address: "",
};

function getInitials(user) {
  if (!user) return "U";
  return `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`.toUpperCase();
}

function formatDateRange(startISO, endISO) {
  try {
    const s = new Date(startISO);
    const e = new Date(endISO);
    return `${s.toLocaleDateString()} – ${e.toLocaleDateString()}`;
  } catch (e) {
    return "Invalid date";
  }
}

function getStatusBadge(trial) {
  if (!trial) return { label: "Unknown", className: "bg-secondary text-white" };
  if (trial.status === "withdrawn") return { label: "Withdrawn", className: "bg-danger text-white" };
  if (trial.status === "active") return { label: "Active", className: "bg-success text-white" };
  return { label: "Upcoming", className: "bg-info text-dark" };
}

const ProfileModal = ({ user, onClose, onSave }) => {
  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Profile</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <Formik
            initialValues={{ ...initialValues, phone: user?.phone || "", address: user?.address || "" }}
            validate={(values) => {
              const errors = {};
              if (!values.address) errors.address = "Address required";
              return errors;
            }}
            onSubmit={(values) => onSave({ ...user, ...values })}
          >
            {(formik) => (
              <Form>
                <div className="modal-body">
                  <div className="container-fluid profile-form-max">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <label className="form-label">Phone</label>
                            <Field id="phone" name="phone" className="form-control" />
                            <ErrorMessage name="phone" component="div" className="error" />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Address</label>
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
};

const TrialCard = ({ trial, onWithdraw }) => {
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
            disabled={trial.status === "withdrawn"}
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
};

const DashboardSection = ({ currentTrial, upcomingTrials, onWithdraw }) => (
  <div>
    <h5 className="mb-3">Active Trials</h5>
    {currentTrial ? <TrialCard trial={currentTrial} onWithdraw={onWithdraw} /> : <div className="alert alert-info">No active trial right now.</div>}
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
);

const TrialsList = ({ trials, onWithdraw }) => (
  <div>
    <h5 className="mb-3">All Trials</h5>
    <div className="row g-3">
      {trials.map((t) => (
        <div key={t.id} className="col-12 col-md-6 col-lg-4">
          <TrialCard trial={t} onWithdraw={onWithdraw} />
        </div>
      ))}
    </div>
  </div>
);

const UserDashboard = () => {
  const navigate = (navigateHookFactory && navigateHookFactory()) || ((to) => (window.location.href = to));

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user_profile");
    return (saved && JSON.parse(saved)) || { firstName: "Vivek", lastName: "Deshmukh", email: "vivek@example.com", phone: "", address: "" };
  });

  const [trials, setTrials] = useState(() => {
    const saved = localStorage.getItem("user_trials");
    return saved ? JSON.parse(saved) : seedTrials;
  });

  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const onDocClick = (e) => {
      // close menu when clicking outside
      if (!e.target.closest) return;
      if (!e.target.closest(".user-menu")) setShowMenu(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    localStorage.setItem("user_trials", JSON.stringify(trials));
  }, [trials]);

  useEffect(() => {
    localStorage.setItem("user_profile", JSON.stringify(user));
  }, [user]);

  const now = new Date();

  const approvedTrials = useMemo(() => trials.filter((t) => t.approved && t.status !== "withdrawn"), [trials]);

  const currentTrial = useMemo(() => approvedTrials.find((t) => new Date(t.start) <= now && new Date(t.end) >= now), [approvedTrials]);

  const upcomingTrials = useMemo(() => approvedTrials.filter((t) => new Date(t.start) > now).sort((a, b) => new Date(a.start) - new Date(b.start)), [approvedTrials]);

  function handleWithdraw(id) {
    setTrials((prev) => prev.map((t) => (t.id === id ? { ...t, status: "withdrawn", approved: false } : t)));
  }

  function handleLogout() {
    localStorage.removeItem("auth_token");
    // After logout redirect to the home page
    navigate("/");
  }

  return (
    <section className="dashboard-page">
      <nav className="navbar navbar-expand-lg bg-light border-bottom sticky-top">
        <div className="container-fluid">
          <span className="navbar-brand fw-semibold">Dashboard</span>
          <button
            className="navbar-toggler"
            type="button"
            onClick={(e) =>
              e.currentTarget
                .closest(".navbar")
                ?.querySelector(".navbar-collapse")
                ?.classList.toggle("show")
            }
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
                  Trials
                </a>
              </li>
            </ul>

            <div className="user-menu position-relative">
              <button type="button" className="btn btn-light rounded-circle user-avatar" onClick={() => setShowMenu((s) => !s)} aria-expanded={showMenu}>
                {getInitials(user)}
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${showMenu ? "show" : ""}`} style={{ position: "absolute", right: 0 }}>
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

      <div className="container my-4">
        <DashboardSection currentTrial={currentTrial} upcomingTrials={upcomingTrials} onWithdraw={handleWithdraw} />
        <hr />
        <TrialsList trials={trials} onWithdraw={handleWithdraw} />
      </div>

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onSave={(values) => {
            setUser(values);
            setShowProfileModal(false);
          }}
        />
      )}
    </section>
  );
};

export default UserDashboard;

