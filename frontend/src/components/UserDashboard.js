
// // src/components/user/UserDashboard.jsx
// import React, { useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import UserProfile from "./userprofile";
// import "../styles/UserDashboard.css";
// import 'bootstrap-icons/font/bootstrap-icons.css';

// const getFirstName = (user) => {
//   if (!user) return "User";

//   if (user.firstName && String(user.firstName).trim().length > 0) {
//     return String(user.firstName).trim();
//   }

//   const candidates = [user.name, user.username, user.fullName].filter(Boolean);
//   if (candidates.length > 0) {
//     const first = String(candidates[0]).trim();
//     if (first.length > 0) {
//       return first.split(/\s+/)[0];
//     }
//   }
// };

// const UserDashboard = () => {
//   // Read user from localStorage
//   const raw = localStorage.getItem("logged_in_user");
//   let parsed = null;
//   try {
//     parsed = raw ? JSON.parse(raw) : null;
//   } catch {
//     parsed = null;
//   }

//   // Manage profile modal + live user state
//   const [currentUser, setCurrentUser] = useState(parsed);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const firstName = getFirstName(currentUser);
//   const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : "U";
//   const openProfile = () => setIsProfileOpen(true);
//   const closeProfile = () => setIsProfileOpen(false);
//   const handleProfileUpdated = (updatedUser) => {
//     setCurrentUser(updatedUser);
//     setIsProfileOpen(false);
//   };

//   return (
//     <div className="user-dashboard">
//       <header className="dashboard-header">
//         <nav className="dashboard-nav">
//           {/* LEFT: Brand + Profile icon */}
//           <div className="dashboard-left">
//             <div className="brand">ClinTrial</div>
//             <button
//               title="View Profile"
//               onClick={openProfile}
//               className="profile-button" // no button-specific styles added beyond default
//               aria-label="Open profile"
//             >
//               {avatarLetter}
//             </button>
//           </div>

//           {/* CENTER: nav links */}
//           <ul className="nav-links">
//             <li>
//               <NavLink to="/dashboard" end>
//                 <i class="bi bi-house-fill"></i>
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/about">
//               <i class="bi bi-info-circle-fill"></i>
//               About</NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/trials">
//               <i class="bi bi-heart-pulse-fill"></i>
//               Trials</NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/contact">
//               <i class="bi bi-telephone-fill"></i>
//               Contact</NavLink>
//             </li>
//           </ul>
//         </nav>
//       </header>

//       <main className="dashboard-content">
//         {/* Home content */}
//         <section className="home-welcome">
//           <h2 className="welcome-title">Hello... {firstName}</h2>
//           <p>
//             Welcome to your dashboard. Use the navigation links above to explore...
//             Thank you for being a valued member of ClinTrack!
//           </p>
//         </section>

//         {/* Nested pages show here */}
//         <Outlet />
//       </main>

//       {/* Profile Modal */}
//       {isProfileOpen && currentUser && (
//         <UserProfile
//           user={currentUser}
//           onClose={closeProfile}
//           onUpdated={handleProfileUpdated}
//         />
//       )}
//     </div>
//   );
// };

// export default UserDashboard;



// src/components/user/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import UserProfile from "./userprofile";
import "../styles/UserDashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import scheduleService from "../services/ScheduleService";// <-- add this import (adjust path if needed)

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

  /* ========= SCHEDULE LOGIC (Add this) ========= */
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
    loadSchedule();
    return () => { cancelled = true; };
  }, [currentUser?.id]);
  /* ============================================= */

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          {/* LEFT: Brand + Profile icon */}
          <div className="dashboard-left">
            <div className="brand">ClinTrial</div>
            <button
              title="View Profile"
              onClick={openProfile}
              className="profile-button" // keep minimal styles per your request
              aria-label="Open profile"
            >
              {avatarLetter}
            </button>
          </div>

          {/* CENTER: nav links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/dashboard" end>
                <i className="bi bi-house-fill" />
                {" "}Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/about">
                <i className="bi bi-info-circle-fill" />
                {" "}About
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/trials">
                <i className="bi bi-heart-pulse-fill" />
                {" "}Trials
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/contact">
                <i className="bi bi-telephone-fill" />
                {" "}Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="dashboard-content">
        {/* Home content */}
        <section className="home-welcome">
          <h2 className="welcome-title">Hello... {firstName}</h2>
          <p>
            Welcome to your dashboard. Use the navigation links above to explore...
            Thank you for being a valued member of ClinTrack!
          </p>
        </section>

        {/* ====== Scheduled Trial Card (render here) ====== */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div style={{ border: "1px solid #e9ecef", borderRadius: 12, padding: 16, background: "#fff" }}>
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

        {/* Nested pages show here */}
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
    </div>
  );
};

export default UserDashboard;

// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import UserProfile from "./userprofile";
// import "../styles/UserDashboard.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import scheduleService from "../services/ScheduleService";

// const getFirstName = (user) => {
//   if (!user) return "User";
//   if (user.firstName && String(user.firstName).trim().length > 0) {
//     return String(user.firstName).trim();
//   }
//   const candidates = [user.name, user.username, user.fullName].filter(Boolean);
//   if (candidates.length > 0) {
//     const first = String(candidates[0]).trim();
//     if (first.length > 0) return first.split(/\s+/)[0];
//   }
//   return "User";
// };

// const formatDate = (dateStr) => {
//   try {
//     const d = new Date(`${dateStr}T00:00:00`);
//     return d.toLocaleDateString(undefined, {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   } catch {
//     return dateStr;
//   }
// };

// const UserDashboard = () => {
//   // Read user from localStorage
//   const raw = localStorage.getItem("logged_in_user");
//   let parsed = null;
//   try {
//     parsed = raw ? JSON.parse(raw) : null;
//   } catch {
//     parsed = null;
//   }

//   // Manage profile modal + live user state
//   const [currentUser, setCurrentUser] = useState(parsed);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const firstName = getFirstName(currentUser);
//   const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : "U";
//   const openProfile = () => setIsProfileOpen(true);
//   const closeProfile = () => setIsProfileOpen(false);
//   const handleProfileUpdated = (updatedUser) => {
//     setCurrentUser(updatedUser);
//     setIsProfileOpen(false);
//     // optional: localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));
//   };

//   // ====== SCHEDULE LOGIC ======
//   const [nextSchedule, setNextSchedule] = useState(null);
//   const [loadingSchedule, setLoadingSchedule] = useState(true);
//   const [scheduleError, setScheduleError] = useState("");

//   useEffect(() => {
//     let cancelled = false;
//     async function loadSchedule() {
//       setLoadingSchedule(true);
//       setScheduleError("");
//       try {
//         const participantId = currentUser?.id;
//         if (!participantId) throw new Error("No logged-in user ID found.");
//         const sched = await scheduleService.getNextPlannedSchedule(participantId);
//         if (!cancelled) setNextSchedule(sched);
//       } catch (err) {
//         if (!cancelled) setScheduleError("Unable to load schedule. Please try again later.");
//         console.error("loadSchedule error:", err);
//       } finally {
//         if (!cancelled) setLoadingSchedule(false);
//       }
//     }
//     loadSchedule();
//     return () => { cancelled = true; };
//   }, [currentUser?.id]);
//   // =============================

//   return (
//     <div className="user-dashboard">
//       {/* Header with minimal nav (optional) */}
//       <header className="dashboard-header">
//         <nav className="dashboard-nav">
//           <div className="dashboard-left">
//             <div className="brand">ClinTrial</div>
//             <button
//               title="View Profile"
//               onClick={openProfile}
//               className="profile-button"
//               aria-label="Open profile"
//             >
//               {avatarLetter}
//             </button>
//           </div>

//           {/* Keep links if you still want to navigate away from Home */}
//           <ul className="nav-links">
//             <li>
//               <NavLink to="/dashboard" end>
//                 <i className="bi bi-house-fill" />{" "}
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/about">
//                 <i className="bi bi-info-circle-fill" />{" "}
//                 About
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/trials">
//                 <i className="bi bi-heart-pulse-fill" />{" "}
//                 Trials
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/contact">
//                 <i className="bi bi-telephone-fill" />{" "}
//                 Contact
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
//       </header>

//       {/* HOME CONTENT ONLY */}
//       <main className="dashboard-content">
//         <section className="home-welcome">
//           <h2 className="welcome-title">Hello... {firstName}</h2>
//           <p>
//             Welcome to your dashboard. Use the navigation links above to explore...
//             Thank you for being a valued member of ClinTrack!
//           </p>
//         </section>

//         {/* Scheduled Trial Card */}
//         <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
//           <div style={{ border: "1px solid #e9ecef", borderRadius: 12, padding: 16, background: "#fff" }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
//               <h3 style={{ margin: 0 }}>
//                 <i className="bi bi-calendar2-event" />{" "}
//                 Next Scheduled Visit
//               </h3>
//               <span
//                 style={{
//                   fontSize: 12,
//                   padding: "4px 8px",
//                   borderRadius: 999,
//                   border: "1px solid #e0e0e0",
//                   background: !nextSchedule ? "#f1f5f9" :
//                     nextSchedule.Status === "PLANNED" ? "#e6f4ff" : "#e8f5e9",
//                   color: !nextSchedule ? "#64748b" :
//                     nextSchedule.Status === "PLANNED" ? "#0b74de" : "#2e7d32",
//                 }}
//               >
//                 {loadingSchedule ? "Loading..." :
//                 scheduleError ? "Error" :
//                 nextSchedule ? nextSchedule.Status : "No Schedule"}
//               </span>
//             </div>

//             {loadingSchedule ? (
//               <p className="text-muted">Fetching your schedule…</p>
//             ) : scheduleError ? (
//               <p className="text-muted">{scheduleError}</p>
//             ) : !nextSchedule ? (
//               <p className="text-muted">No upcoming visit. Please check back later.</p>
//             ) : (
//               <div style={{ lineHeight: 1.8 }}>
//                 <div><strong>{nextSchedule.Phase}</strong></div>
//                 <div><i className="bi bi-clock" />{" "} {formatDate(nextSchedule.VisitDate)}</div>
//                 <div><i className="bi bi-hash" />{" "} ScheduleID: {nextSchedule.ScheduleID}</div>
//                 <div><i className="bi bi-flask" />{" "} Trial Type: {currentUser?.trialType}</div>
//               </div>
//             )}
//           </div>
//         </section>
//       </main>

//       {/* Profile Modal */}
//       {isProfileOpen && currentUser && (
//         <UserProfile
//           user={currentUser}
//           onClose={closeProfile}
//           onUpdated={handleProfileUpdated}
//         />
//       )}
//     </div>
//   );
// };

// export default UserDashboard;


