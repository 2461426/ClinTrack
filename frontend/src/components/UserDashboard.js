
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import scheduleService from "../services/ScheduleService";
import participantService from "../services/ParticipantService";
import UserProfile from "./userprofile";
import Menu from "./Menu";

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

  // Manage profile modal + live user state
  const [currentUser, setCurrentUser] = useState(parsed);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const firstName = getFirstName(currentUser);
  const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : "U";
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    setIsProfileOpen(false);
    // optional: localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));
  };

  /* ========= SCHEDULE LOGIC ========= */
  const [nextSchedule, setNextSchedule] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleError, setScheduleError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadSchedule() {
      setLoadingSchedule(true);
      setScheduleError("");
      try {
        const participantId = currentUser?.id;
        if (!participantId) throw new Error("No logged-in user ID found.");
        const sched = await scheduleService.getNextPlannedSchedule(participantId);
        if (!cancelled) setNextSchedule(sched);
      } catch (err) {
        if (!cancelled) setScheduleError("Unable to load schedule. Please try again later.");
        console.error("loadSchedule error:", err);
      } finally {
        if (!cancelled) setLoadingSchedule(false);
      }
    }
    if (currentUser?.id) loadSchedule();
    return () => { cancelled = true; };
  }, [currentUser?.id]);
  /* ================================== */

  /* ========= WITHDRAW (DELETE) LOGIC ========= */
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawErr, setWithdrawErr] = useState("");

  const handleWithdraw = async () => {
    if (!currentUser?.id) return;

    const ok = window.confirm(
      "Are you sure you want to withdraw your application? This will permanently delete your registration."
    );
    if (!ok) return;

    try {
      setWithdrawing(true);
      setWithdrawErr("");
      await participantService.deleteParticipant(currentUser.id);

      // Clear local session and redirect
      localStorage.removeItem("logged_in_user");
      setCurrentUser(null);
      navigate("/login");
    } catch (e) {
      console.error(e);
      setWithdrawErr("Failed to withdraw your application. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };
  /* =========================================== */

  return (
    <div className="user-dashboard">
      {/* Pass avatar + open handler into Menu */}
      <Menu onOpenProfile={openProfile} avatarLetter={avatarLetter} />

      <main className="dashboard-content">
        {/* Home content */}
        <section className="home-welcome">
          <h2 className="welcome-title">Hello... {firstName}</h2>
          <p>
            Welcome to your dashboard. Use the navigation links above to explore...
            Thank you for being a valued member of ClinTrack!
          </p>
        </section>

        {/* ====== Registration Details ====== */}
        {currentUser && (
          <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <div style={{
              border: "1px solid #e9ecef",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
              marginBottom:130
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8
              }}>
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

              {/* Details rows */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, lineHeight: 1.8 }}>
                <div>
                  <div><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</div>
                  <div><strong>Email:</strong> {currentUser.email}</div>
                  <div><strong>Mobile:</strong> {currentUser.mobile}</div>
                  <div><strong>DOB:</strong> {formatDate(currentUser.dateOfBirth)}</div>
                  <div><strong>Trial Type:</strong> {currentUser.trialType}</div>
                </div>
                <div>
                  <div><strong>Obesity:</strong> {currentUser.obesityCategory || "-"}</div>
                  <div><strong>BP:</strong> {currentUser.bpCategory || "-"}</div>
                  <div><strong>Diabetes:</strong> {currentUser.diabetesStatus || "-"}</div>
                  <div><strong>Asthma:</strong> {currentUser.hasAsthma ? "Yes" : "No"}</div>
                  <div><strong>Chronic Illnesses:</strong> {currentUser.hasChronicIllnesses ? "Yes" : "No"}</div>
                </div>
              </div>

              {/* Withdraw button */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-danger"
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  title="Withdraw (delete) your application"
                >
                  {withdrawing ? (
                    <>
                      <i className="bi bi-hourglass-split me-1" />
                      Withdrawing…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash3 me-1" />
                      Withdraw Application
                    </>
                  )}
                </button>

                <NavLink className="btn btn-primary" to="/trails">
                  <i className="bi bi-diagram-3 me-1" />
                  View Trials
                </NavLink>
              </div>

              {/* Error line */}
              {withdrawErr && (
                <p className="error" style={{ marginTop: 8 }}>{withdrawErr}</p>
              )}
            </div>
          </section>
        )}
        <Outlet />
      </main>

      {/* Profile Modal */}
      {isProfileOpen && currentUser && (
        // If your UserProfile path is /components/user/UserProfile.jsx adjust the import accordingly in your project.
        // Here we assume you have it in src/components/user/UserProfile.jsx and imported where needed.
        <UserProfile
          user={currentUser}
          onClose={closeProfile}
          onUpdated={handleProfileUpdated}
        />
      )}
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
