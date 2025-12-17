
// src/components/user/UserDashboard.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import UtilityService from "../services/UtilityService";

const getFirstName = (user) => {
  if (!user) return "User";

  // Prefer explicit firstName field
  if (user.firstName && String(user.firstName).trim().length > 0) {
    return String(user.firstName).trim();
  }

  // If you have full name / username, take the first "word"
  const candidates = [
    user.name,       // e.g., "Mahith Tumpala"
    user.username,   // e.g., "Mahith T"
    user.fullName,   // if you use this field
  ].filter(Boolean);

  if (candidates.length > 0) {
    const first = String(candidates[0]).trim();
    if (first.length > 0) {
      // split by whitespace and take first token
      return first.split(/\s+/)[0];
    }
  }

  // As a last resort, derive something from email (before @)
  if (user.email) {
    const localPart = String(user.email).split("@")[0];
    if (localPart) {
      // capitalize first token
      const token = localPart.split(/[.\-_]/)[0]; // splits on dot/underscore/hyphen
      if (token) {
        return token.charAt(0).toUpperCase() + token.slice(1);
      }
      return localPart;
    }
  }

  // Fallback
  return "User";
};

const UserDashboard = () => {
  const navigate = useNavigate();

  // Read the logged-in user object
  const raw = localStorage.getItem("logged_in_user");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    user = null;
  }

  const firstName = getFirstName(user);

  const onLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("logged_in_user");
    UtilityService.clearInformation();
    navigate("/login");
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
          <div className="brand" style={{ fontWeight: 600 }}>
            ClinTrack — User Dashboard
          </div>
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
        {/* ✅ Home content */}
        <section>
          <h2>Welcome, {firstName}</h2>
          <p>
            
          </p>
        </section>

        {/* Nested pages render here when navigating to /dashboard/about, etc. */}
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;

