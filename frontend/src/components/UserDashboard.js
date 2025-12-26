 
// src/components/UserDashboard.js
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import scheduleService from "../services/ScheduleService";
import participantService from "../services/ParticipantService";
import trialService from "../services/TrialService";
import UserProfile from "./userprofile";
import Menu from "./Menu";
 
// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
/* === Helpers === */
const getFirstName = (user) => {
  if (!user) return "User";
  if (user.firstName && String(user.firstName).trim().length > 0) {
    return String(user.firstName).trim();
  }
  const candidates = [user.name, user.username, user.fullName].filter(Boolean);
  if (candidates.length > 0) {
    const first = String(candidates[0]).trim();
    if (first.length > 0) return first.split(/\s+/)[0];
  }
  return "User";
};
 
const formatDate = (dateStr) => {
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};
 
const TRIAL_TYPE_LABELS = {
  COVID_19_VACCINE: "COVID‑19 Vaccine",
  HYPERTENSION_TRIAL: "Hypertension Trial",
  ONCOLOGY_THERAPY: "Oncology Therapy Trial",
};
 
const UserDashboard = () => {
  // Read user from localStorage
  const raw = localStorage.getItem("logged_in_user");
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
 
  const navigate = useNavigate();
 
  // Profile modal + live user state
  const [currentUser, setCurrentUser] = useState(parsed);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
 
  const firstName = getFirstName(currentUser);
  const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : "U";
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    setIsProfileOpen(false);
  };
 
  /* ========= SCHEDULE LOGIC ========= */
  const [nextSchedule, setNextSchedule] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
 
  useEffect(() => {
    let cancelled = false;
 
    setLoadingSchedule(true);
    setScheduleError("");
 
    const participantId = currentUser?.id;
    if (!participantId) {
      setScheduleError("No logged-in user ID found.");
      setLoadingSchedule(false);
      return;
    }
 
    scheduleService
      .getNextPlannedSchedule(participantId)
      .then((sched) => {
        if (!cancelled) setNextSchedule(sched);
      })
      .catch((err) => {
        console.error("loadSchedule error:", err);
        if (!cancelled)
          setScheduleError("Unable to load schedule. Please try again later.");
        toast.error("Unable to load schedule. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSchedule(false);
      });
 
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);
 
  /* ========= UPCOMING TRIALS ========= */
  const [upcomingTrials, setUpcomingTrials] = useState([]);
  const [loadingTrials, setLoadingTrials] = useState(true);
  const [trialsError, setTrialsError] = useState("");
  const [enrollingTrialId, setEnrollingTrialId] = useState(null);
  const [withdrawingTrialId, setWithdrawingTrialId] = useState(null);
 
  useEffect(() => {
    let cancelled = false;
 
    setLoadingTrials(true);
    setTrialsError("");
 
    const participantId = currentUser?.id;
    trialService
      .getUpcomingTrials(participantId)
      .then((trials) => {
        if (!cancelled) setUpcomingTrials(Array.isArray(trials) ? trials : []);
      })
      .catch((err) => {
        console.error("loadUpcomingTrials error:", err);
        if (!cancelled)
          setTrialsError("Unable to load upcoming trials. Please try again later.");
        toast.error("Unable to load upcoming trials. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setLoadingTrials(false);
      });
 
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);
 
  const friendlyType = (code) => TRIAL_TYPE_LABELS[code] || code || "-";
 
  // Helper: is the user enrolled in ANY trial?
  const hasAnyEnrollment = upcomingTrials.some((t) => t.enrolled);
 
  // Helper: which trial is user enrolled in?
  const enrolledTrialId = hasAnyEnrollment
    ? upcomingTrials.find((t) => t.enrolled)?.id
    : null;
 
  // ENROLL: allow only ONE trial per user
  const handleEnroll = (trialId) => {
    if (!currentUser?.id) {
      toast.info("Please login again to enroll.");
      return;
    }
 
    if (hasAnyEnrollment) {
      if (enrolledTrialId === trialId) {
        toast.info("You are already enrolled in this trial.");
      } else {
        toast.warn(
          "You can only enroll for one trial at a time. Please withdraw from your current trial before enrolling in another."
        );
      }
      return;
    }
 
    setEnrollingTrialId(trialId);
 
    trialService
      .enroll(currentUser.id, trialId)
      .then(() => {
        // Mark only this trial as enrolled
        setUpcomingTrials((prev) =>
          prev.map((t) => (t.id === trialId ? { ...t, enrolled: true } : t))
        );
        toast.success("Enrollment successful! Admin dashboard will reflect your registration.");
      })
      .catch((err) => {
        console.error("Enroll error:", err);
        toast.error("Enrollment failed. Please try again.");
      })
      .finally(() => {
        setEnrollingTrialId(null);
      });
  };
 
  // WITHDRAW from enrolled trial (card-level)
  const handleWithdrawFromCard = (trialId) => {
    if (!currentUser?.id) return;
 
    const ok = window.confirm("Are you sure you want to withdraw from this trial?");
    if (!ok) return;
 
    setWithdrawingTrialId(trialId);
 
    trialService
      .withdraw(currentUser.id)
      .then(() => {
        // Since only one enrollment is allowed, clear all enrolled flags
        setUpcomingTrials((prev) => prev.map((t) => ({ ...t, enrolled: false })));
        toast.success("You have successfully withdrawn.");
      })
      .catch((err) => {
        console.error("Withdraw error:", err);
        toast.error("Failed to withdraw. Please try again.");
      })
      .finally(() => {
        setWithdrawingTrialId(null);
      });
  };
 
  /* ========= WITHDRAW (DELETE) APPLICATION ========= */
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawErr, setWithdrawErr] = useState("");
 
  const handleWithdrawApplication = () => {
    if (!currentUser?.id) return;
 
    const ok = window.confirm(
      "Are you sure you want to withdraw your application? This will permanently delete your registration."
    );
    if (!ok) return;
 
    setWithdrawing(true);
    setWithdrawErr("");
 
    participantService
      .deleteParticipant(currentUser.id)
      .then(() => {
        localStorage.removeItem("logged_in_user");
        setCurrentUser(null);
        toast.success("Your account has been deleted. Redirecting to login...");
        navigate("/login");
      })
      .catch((e) => {
        console.error(e);
        setWithdrawErr("Failed to withdraw your application. Please try again.");
        toast.error("Failed to withdraw your application. Please try again.");
      })
      .finally(() => {
        setWithdrawing(false);
      });
  };
 
  return (
    <div className="user-dashboard">
      {/* Toast container (global for this page) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
 
      {/* Top menu / avatar */}
      <Menu onOpenProfile={openProfile} avatarLetter={avatarLetter} />
 
      <main className="dashboard-content">
        {/* Welcome */}
        <section className="home-welcome">
          <h2 className="welcome-title">Hello... {firstName}</h2>
          <p>
            Welcome to your dashboard. Use the navigation links above to explore...
            Thank you for being a valued member of ClinTrack!
          </p>
        </section>
 
        {/* Registration details + upcoming trials */}
        {currentUser && (
          <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {/* Registration Details */}
            <div
              style={{
                border: "1px solid #e9ecef",
                borderRadius: 12,
                padding: 16,
                background: "#fff",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h3 style={{ margin: 0 }}>
                  <i className="bi bi-person-vcard" />{" "}
                  Registration Details
                </h3>
 
                <span
                  style={{
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "1px solid #e0e0e0",
                    background: currentUser.acknowledgment ? "#e6f4ff" : "#fff8e1",
                    color: currentUser.acknowledgment ? "#0b74de" : "#8a6d3b",
                  }}
                >
                  {currentUser.acknowledgment ? "Acknowledged" : "Pending"}
                </span>
              </div>
 
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  lineHeight: 1.8,
                }}
              >
                <div>
                  <div>
                    <strong>Name:</strong> {currentUser.firstName}{" "}
                    {currentUser.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {currentUser.email}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {currentUser.mobile}
                  </div>
                  <div>
                    <strong>DOB:</strong> {formatDate(currentUser.dateOfBirth)}
                  </div>
                </div>
                <div>
                  <div>
                    <strong>Obesity:</strong>{" "}
                    {currentUser.obesityCategory || "-"}
                  </div>
                  <div>
                    <strong>BP:</strong> {currentUser.bpCategory || "-"}
                  </div>
                  <div>
                    <strong>Diabetes:</strong>{" "}
                    {currentUser.diabetesStatus || "-"}
                  </div>
                  <div>
                    <strong>Asthma:</strong>{" "}
                    {currentUser.hasAsthma ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Chronic Illnesses:</strong>{" "}
                    {currentUser.hasChronicIllnesses ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
 
            {/* Upcoming Trials */}
            <div
              style={{
                border: "1px solid #e9ecef",
                borderRadius: 12,
                padding: 16,
                background: "#fff",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h3 style={{ margin: 0 }}>
                  <i className="bi bi-calendar2-event" />{" "}
                  Upcoming Trials
                </h3>
                {loadingTrials && (
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    Loading…
                  </span>
                )}
              </div>
 
              {trialsError && (
                <p className="error" style={{ marginTop: 8 }}>{trialsError}</p>
              )}
 
              {!loadingTrials &&
                upcomingTrials.length === 0 &&
                !trialsError && (
                  <p style={{ color: "#6b7280" }}>
                    No upcoming trials found.
                  </p>
                )}
 
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {upcomingTrials.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: 10,
                      padding: 12,
                      background: "#fdfdfd",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <h4 style={{ margin: 0 }}>
                        {t.name || friendlyType(t.code)}
                      </h4>
                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "#e6f4ff",
                          color: "#0b74de",
                          border: "1px solid #cfe0ff",
                        }}
                      >
                        {friendlyType(t.code)}
                      </span>
                    </div>
 
                    <div style={{ marginTop: 6, color: "#374151", lineHeight: 1.6 }}>
                      {t.startDate && (
                        <div>
                          <strong>Start:</strong> {formatDate(t.startDate)}
                        </div>
                      )}
                      {t.location && (
                        <div>
                          <strong>Location:</strong> {t.location}
                        </div>
                      )}
                      {t.description && (
                        <div style={{ marginTop: 6 }}>
                          <strong>About:</strong>{" "}
                          <span>{t.description}</span>
                        </div>
                      )}
                    </div>
 
                    {/* Actions: Enroll OR Withdraw (one trial per user) */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {!t.enrolled ? (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={enrollingTrialId === t.id}
                          onClick={() => handleEnroll(t.id)}
                          title={
                            hasAnyEnrollment
                              ? "You must withdraw before enrolling in another trial"
                              : "Enroll in this trial"
                          }
                        >
                          {enrollingTrialId === t.id ? (
                            <>
                              <i className="bi bi-hourglass-split me-1" />
                              Enrolling…
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check2-circle me-1" />
                              Enroll
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={withdrawingTrialId === t.id}
                          onClick={() => handleWithdrawFromCard(t.id)}
                          title="Withdraw from this trial"
                        >
                          {withdrawingTrialId === t.id ? (
                            <>
                              <i className="bi bi-hourglass-split me-1" />
                              Withdrawing…
                            </>
                          ) : (
                            <>
                              <i className="bi bi-trash3 me-1" />
                              Withdraw
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
 
        <Outlet />
      </main>
 
      {/* Profile Modal */}
      {isProfileOpen && currentUser && (
        <UserProfile
          user={currentUser}
          onClose={closeProfile}
          onUpdated={handleProfileUpdated}
        />
      )}
 
      {/* Footer banner */}
      <div className="clintrack-page__banner">
        <div className="container py-3 text-center">
          <p className="m-0 clintrack-page__banner-text">
            All the trials are conducted according to FDA and ICH-GCP guidelines.
          </p>
        </div>
        <div className="container-copyright">
          <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
        </div>
      </div>
    </div>
  );
};
 
export default UserDashboard;
 
 