
// src/pages/Usertrails.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const navigate = useNavigate();
  
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
  
  // ====== TRAILS LOGIC ======
  const [activeTab, setActiveTab] = useState("explore");
  const [trails, setTrails] = useState([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/trailDetails')
      .then(response => {
        setTrails(response.data || []);
        setLoadingTrails(false);
      })
      .catch(error => {
        console.error('Error fetching trails:', error);
        setTrails([]);
        setLoadingTrails(false);
      });
  }, []);

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

  const registeredTrails = trails.filter(trail => 
    trail.participantsId?.includes(currentUser?.id)
  );

  const exploreTrails = trails;

  const displayTrails = activeTab === "registered" ? registeredTrails : exploreTrails;

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

      {/* ====== Trails Section ====== */}
      <section style={{ marginTop: 24 }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 16, borderBottom: "2px solid #e9ecef" }}>
          <button
            onClick={() => setActiveTab("explore")}
            style={{
              padding: "12px 24px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "explore" ? "3px solid #0b74de" : "3px solid transparent",
              color: activeTab === "explore" ? "#0b74de" : "#64748b",
              fontWeight: activeTab === "explore" ? "600" : "400",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            <i className="bi bi-search me-2" />
            Explore Trails
          </button>
          <button
            onClick={() => setActiveTab("registered")}
            style={{
              padding: "12px 24px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "registered" ? "3px solid #0b74de" : "3px solid transparent",
              color: activeTab === "registered" ? "#0b74de" : "#64748b",
              fontWeight: activeTab === "registered" ? "600" : "400",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            <i className="bi bi-check-circle me-2" />
            Registered Trails
          </button>
        </div>

        {loadingTrails ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p>Loading trails...</p>
          </div>
        ) : displayTrails.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            <i className="bi bi-inbox" style={{ fontSize: 48, marginBottom: 16 }} />
            <p>{activeTab === "registered" ? "You haven't registered for any trails yet." : "No trails available."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {displayTrails.map((trail) => (
              <div 
                key={trail.id}
                onClick={() => navigate(`/traildetail/${trail.id}`)}
                style={{
                  border: "1px solid #e9ecef",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#fff",
                  transition: "box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <img 
                  src={trail.image} 
                  alt={trail.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover"
                  }}
                />
                <div style={{ padding: 16 }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600 }}>
                    {trail.title}
                  </h4>
                  <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                    {trail.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <span style={{
                      padding: "4px 12px",
                      background: "#e6f4ff",
                      color: "#0b74de",
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      Phase {trail.phase}
                    </span>
                    <span style={{ fontSize: 14, color: "#64748b" }}>
                      <i className="bi bi-people-fill me-1" />
                      {trail.participantsEnrolled}/{trail.participantsRequired}
                    </span>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: "#64748b" }}>
                    <i className="bi bi-tag-fill me-1" />
                    {trail.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
