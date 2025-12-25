
// src/pages/Usertrails.js
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/UserDashboard.css";
import scheduleService from "../services/ScheduleService";
import trialService from "../services/TrialService";
import Menu from "./Menu";

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

function Usertrails() {
  // Read user from localStorage (same approach as dashboard)
  const raw = localStorage.getItem("logged_in_user");
  let currentUser = null;
  try {
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }

  /* ====== SCHEDULE LOGIC ====== */
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
        if (!cancelled) setNextSchedule(sched || null);
      })
      .catch((err) => {
        console.error("loadSchedule error:", err);
        if (!cancelled)
          setScheduleError("Unable to load schedule. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSchedule(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);

  /* ====== ENROLLED TRIAL (via upcoming trials annotated with enrolled flag) ====== */
  const [upcomingTrials, setUpcomingTrials] = useState([]);
  const [loadingTrials, setLoadingTrials] = useState(true);
  const [trialsError, setTrialsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoadingTrials(true);
    setTrialsError("");

    const participantId = currentUser?.id;
    if (!participantId) {
      setLoadingTrials(false);
      return;
    }

    trialService
      .getUpcomingTrials(participantId)
      .then((trials) => {
        if (!cancelled) setUpcomingTrials(Array.isArray(trials) ? trials : []);
      })
      .catch((err) => {
        console.error("loadUpcomingTrials error:", err);
        if (!cancelled)
          setTrialsError("Unable to load trials. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setLoadingTrials(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);

  // Derive enrolled trial from annotated upcoming trials
  const enrolledTrial = upcomingTrials.find((t) => t.enrolled) || null;

  return (
    <div>
      <Menu />
      <main className="dashboard-content">
        <div className="header-row" style={{ marginTop: 12 }}>
          <h2 className="page-title">
            <i className="bi bi-heart-pulse-fill me-2" />
            Trials
          </h2>
        </div>

        {/* ====== Enrolled Trial ====== */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div
            style={{
              border: "1px solid #e9ecef",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
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
                <i className="bi bi-check2-circle" /> Enrolled Trial
              </h3>
              {loadingTrials && (
                <span style={{ fontSize: 12, color: "#6b7280" }}>Loading…</span>
              )}
            </div>

            {trialsError ? (
              <p className="text-muted">{trialsError}</p>
            ) : loadingTrials ? (
              <p className="text-muted">Fetching trial info…</p>
            ) : !enrolledTrial ? (
              <p className="text-muted">
                You are not enrolled in any trial currently.
              </p>
            ) : (
              <div
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
                    {enrolledTrial.name || enrolledTrial.code}
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
                    {enrolledTrial.code}
                  </span>
                </div>

                <div style={{ marginTop: 6, color: "#374151", lineHeight: 1.6 }}>
                  {enrolledTrial.startDate && (
                    <div>
                      <strong>Start:</strong>{" "}
                      {formatDate(enrolledTrial.startDate)}
                    </div>
                  )}
                  {enrolledTrial.location && (
                    <div>
                      <strong>Location:</strong> {enrolledTrial.location}
                    </div>
                  )}
                  {enrolledTrial.description && (
                    <div style={{ marginTop: 6 }}>
                      <strong>About:</strong>{" "}
                      <span>{enrolledTrial.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ====== Next Scheduled Visit ====== */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div
            style={{
              border: "1px solid #e9ecef",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
              marginTop:10,
              marginBottom:290
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
                Next Scheduled Visit
              </h3>
              <span
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #e0e0e0",
                  background: !nextSchedule
                    ? "#f1f5f9"
                    : nextSchedule.Status === "PLANNED"
                    ? "#e6f4ff"
                    : "#e8f5e9",
                  color: !nextSchedule
                    ? "#64748b"
                    : nextSchedule.Status === "PLANNED"
                    ? "#0b74de"
                    : "#2e7d32",
                }}
              >
                {loadingSchedule
                  ? "Loading..."
                  : scheduleError
                  ? "Error"
                  : nextSchedule
                  ? nextSchedule.Status
                  : "No Schedule"}
              </span>
            </div>

            {loadingSchedule ? (
              <p className="text-muted">Fetching your schedule…</p>
            ) : scheduleError ? (
              <p className="text-muted">{scheduleError}</p>
            ) : !nextSchedule ? (
              <p className="text-muted">
                No upcoming visit. Please check back later.
              </p>
            ) : (
              <div style={{ lineHeight: 1.8 }}>
                <div>
                  <strong>{nextSchedule.Phase}</strong>
                </div>
                <div>
                  <i className="bi bi-clock" />{" "}
                  {formatDate(nextSchedule.VisitDate)}
                </div>
                <div>
                  <i className="bi bi-hash" />{" "}
                  ScheduleID: {nextSchedule.ScheduleID}
                </div>
                {/* If you want to show the enrolled trial code next to the schedule */}
                {enrolledTrial && (
                  <div>
                    <i className="bi bi-flask" />{" "}
                    Trial: {enrolledTrial.name || enrolledTrial.code}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="clintrack-page__banner">
        <div className="container py-3 text-center">
          <p className="m-0 clintrack-page__banner-text">
            All the trials are conducted according to FDA and ICH-GCP guidelines.
          </p>
        </div>
        <div className="container-copyright">
          <small>
            © {new Date().getFullYear()} Clin Track. All rights reserved.
          </small>
        </div>
      </div>
    </div>
  );
}

export default Usertrails;
