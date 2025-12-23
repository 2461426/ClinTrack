
// src/pages/Usertrails.js
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/UserDashboard.css";
import scheduleService from "../services/ScheduleService";
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

  // ====== SCHEDULE LOGIC (same as in dashboard) ======
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
  // ===============================================

  return (
    <div>
      <Menu/>
    <main className="dashboard-content">
      <div className="header-row" style={{ marginTop: 12 }}>
        <h2 className="page-title">
          <i className="bi bi-heart-pulse-fill me-2" />
          Trials
        </h2>
      </div>

      {/* ====== Next Scheduled Visit (moved from dashboard) ====== */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div style={{ border: "1px solid #e9ecef", borderRadius: 12, padding: 16, background: "#fff", marginBottom:300 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
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
                background: !nextSchedule ? "#f1f5f9" :
                  nextSchedule.Status === "PLANNED" ? "#e6f4ff" : "#e8f5e9",
                color: !nextSchedule ? "#64748b" :
                  nextSchedule.Status === "PLANNED" ? "#0b74de" : "#2e7d32",
              }}
            >
              {loadingSchedule ? "Loading..." :
                scheduleError ? "Error" :
                nextSchedule ? nextSchedule.Status : "No Schedule"}
            </span>
          </div>

          {loadingSchedule ? (
            <p className="text-muted">Fetching your schedule…</p>
          ) : scheduleError ? (
            <p className="text-muted">{scheduleError}</p>
          ) : !nextSchedule ? (
            <p className="text-muted">No upcoming visit. Please check back later.</p>
          ) : (
            <div style={{ lineHeight: 1.8 }}>
              <div><strong>{nextSchedule.Phase}</strong></div>
              <div><i className="bi bi-clock" />{" "} {formatDate(nextSchedule.VisitDate)}</div>
              <div><i className="bi bi-hash" />{" "} ScheduleID: {nextSchedule.ScheduleID}</div>
              <div><i className="bi bi-flask" />{" "} Trial Type: {currentUser?.trialType}</div>
            </div>
          )}
        </div>
      </section>
      {/* =============================================== */}

      {/* (Optional) Below this, you can later render Upcoming / Current / Past trials lists */}
    </main>
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
}

export default Usertrails;
