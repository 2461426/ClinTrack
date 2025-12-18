
// src/components/user/UserDashboard.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import UtilityService from "../services/UtilityService";
import { useState } from "react";
import UserProfile from "./userprofile";


const getFirstName = (user) => {
  if (!user) return "User";

  if (user.firstName && String(user.firstName).trim().length > 0) {
    return String(user.firstName).trim();
  }

  const candidates = [user.name, user.username, user.fullName].filter(Boolean);
  if (candidates.length > 0) {
    const first = String(candidates[0]).trim();
    if (first.length > 0) {
      return first.split(/\s+/)[0];
    }
  }

  if (user.email) {
    const localPart = String(user.email).split("@")[0];
    if (localPart) {
      const token = localPart.split(/[.\-_]/)[0];
      if (token) return token.charAt(0).toUpperCase() + token.slice(1);
      return localPart;
    }
  }
  return "User";
};

const UserDashboard = () => {
  const navigate = useNavigate();

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

  const onLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("logged_in_user");
    UtilityService.clearInformation();
    navigate("/login");
  };

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    setIsProfileOpen(false);
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <nav
          className="dashboard-nav"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderBottom: "1px solid #eee",
          }}
        >
          {/* LEFT: Brand + Profile icon */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="brand" style={{ fontWeight: 600 }}>
              ClinTrack — User Dashboard
            </div>
            <button
              title="Open Profile"
              onClick={openProfile}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #ddd",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                cursor: "pointer",
                fontWeight: 700,
              }}
              aria-label="Open profile"
            >
              {avatarLetter}
            </button>
          </div>

          {/* CENTER: nav links */}
          <ul
            className="nav-links"
            style={{
              display: "flex",
              listStyle: "none",
              gap: 16,
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <NavLink to="/dashboard" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/trials">Trials</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/contact">Contact</NavLink>
            </li>
          </ul>

          {/* RIGHT: logout */}
          <button
            className="logout"
            onClick={onLogout}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-content" style={{ padding: 20 }}>
        {/* Home content */}
        <section>
          <h2 style={{ fontFamily: "Lucida, Arial, sans-serif" }}>
            Hello... {firstName}
          </h2>
          <p>
            Use the navigation above to explore About, Trials, and Contact. Click the
            profile icon to view or update your details.
          </p>
        </section>

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