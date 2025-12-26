
// import React, { useMemo, useState } from "react";
// import { NavLink } from "react-router-dom";
// import utilityService from "../services/UtilityService";
// import UserProfile from "./userprofile";


// const getFirstName = (u) => {
//   if (!u) return "User";
//   if (u.firstName && String(u.firstName).trim().length > 0) return String(u.firstName).trim();
//   const candidates = [u.name, u.username, u.fullName].filter(Boolean);
//   if (candidates.length > 0) {
//     const first = String(candidates[0]).trim();
//     if (first.length > 0) return first.split(/\s+/)[0];
//   }
//   return "User";
// };

// const Menu = ({ onOpenProfile, avatarLetter: avatarProp }) => {
//   const isLoggedIn = utilityService.isLoggedIn();
//   const isUser = utilityService.isUser();
//   const isAdmin = utilityService.isAdmin();

//   // Read current user from localStorage to compute avatar & feed modal
//   const raw = localStorage.getItem("logged_in_user");
//   let parsed = null;
//   try {
//     parsed = raw ? JSON.parse(raw) : null;
//   } catch {
//     parsed = null;
//   }

//   const [currentUser, setCurrentUser] = useState(parsed);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const firstName = useMemo(() => getFirstName(currentUser), [currentUser]);

//   // Use avatar from props if provided; otherwise compute from local user
//   const avatarLetter =
//     avatarProp || (firstName ? firstName.charAt(0).toUpperCase() : "U");

//   // Open handler: prefer prop; fall back to local modal
//   const openProfile = () => {
//     if (typeof onOpenProfile === "function") {
//       onOpenProfile();
//     } else {
//       setIsProfileOpen(true);
//     }
//   };

//   const closeProfile = () => setIsProfileOpen(false);

//   const handleProfileUpdated = (updatedUser) => {
//     setCurrentUser(updatedUser);
//     localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));
//     setIsProfileOpen(false);
//   };

//   return (
//     <>
//       <header className="dashboard-header">
//         <nav className="dashboard-nav">
//           {/* LEFT: Brand */}
//           <div className="dashboard-left">
//             <div className="brand"><NavLink to="/"/>ClinTrial</div>
//           </div>

//           {/* CENTER: nav links */}
//           <ul className="nav-links">
//             {!isLoggedIn && (
//               <>
//                 <li>
//                   <NavLink to="/register">
//                     <i className="bi bi-person-plus-fill" /> Registration
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink to="/login">
//                     <i className="bi bi-box-arrow-in-right" /> Login
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {isUser && (
//               <>
//                 <li>
//                   <NavLink to="/dashboard" end>
//                     <i className="bi bi-house-fill" /> Home
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink to="/trails">
//                     <i className="bi bi-heart-pulse-fill" /> Trials
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             <li>
//               <NavLink to="/about">
//                 <i className="bi bi-info-circle-fill" /> About
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/contact">
//                 <i className="bi bi-telephone-fill" /> Contact
//               </NavLink>
//             </li>

//             {isLoggedIn && isAdmin && (
//               <li>
//                 <NavLink to="/admin/profile">
//                   <i className="bi bi-shield-lock-fill" /> Admin Profile
//                 </NavLink>
//               </li>
//             )}

//             {isLoggedIn && (
//               <li>
//                 <NavLink to="/logout">
//                   <i className="bi bi-box-arrow-right" /> Logout
//                 </NavLink>
//               </li>
//             )}
//           </ul>
          

//           {/* RIGHT: Profile avatar button (shown when logged in) */}
//           {isLoggedIn && (
//             <button
//               title="View Profile"
//               onClick={openProfile}
//               className="profile-button"
//               aria-label="Open profile"
//             >
//               {avatarLetter}
//             </button>
//           )}
//         </nav>
//       </header>

//       {/* Global Profile Modal (works on every page that renders Menu) */}
//       {isProfileOpen && currentUser && (
//         <UserProfile
//           user={currentUser}
//           onClose={closeProfile}
//           onUpdated={handleProfileUpdated}
//         />
//       )}
//       <footer>
//       <div className="container py-3 text-center">
//             <p className="m-0 clintrack-page__banner-text">
//               All the trials are conducted according to FDA and ICH-GCP guidelines.
//             </p>
//           </div>
//           <div className="container-copyright">
//           <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
//         </div>
//         </footer>
//     </>
//   );
// };

// export default Menu;



import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import utilityService from "../services/UtilityService";
import UserProfile from "./userprofile";

const getFirstName = (u) => {
  if (!u) return "User";
  if (u.firstName && String(u.firstName).trim().length > 0) return String(u.firstName).trim();
  const candidates = [u.name, u.username, u.fullName].filter(Boolean);
  if (candidates.length > 0) {
    const first = String(candidates[0]).trim();
    if (first.length > 0) return first.split(/\s+/)[0];
  }
  return "User";
};

const Menu = ({ onOpenProfile, avatarLetter: avatarProp }) => {
  const isLoggedIn = utilityService.isLoggedIn();
  const isUser = utilityService.isUser();
  const isAdmin = utilityService.isAdmin();

  // Read current user from localStorage to compute avatar & feed modal
  const raw = localStorage.getItem("logged_in_user");
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  const [currentUser, setCurrentUser] = useState(parsed);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const firstName = useMemo(() => getFirstName(currentUser), [currentUser]);

  // Use avatar from props if provided; otherwise compute from local user
  const avatarLetter =
    avatarProp || (firstName ? firstName.charAt(0).toUpperCase() : "U");

  // Open handler: prefer prop; fall back to local modal
  const openProfile = () => {
    if (typeof onOpenProfile === "function") {
      onOpenProfile();
    } else {
      setIsProfileOpen(true);
    }
  };

  const closeProfile = () => setIsProfileOpen(false);

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));
    setIsProfileOpen(false);
  };

  return (
    <>
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          {/* LEFT: Brand */}
          <div className="dashboard-left">
            <div className="brand">
              <NavLink to="/" style={{textDecoration:"none"}}>ClinTrial</NavLink>
            </div>
          </div>

          {/* CENTER: nav links */}
          <ul className="nav-links">
            {!isLoggedIn && (
              <>
                <li>
                  <NavLink to="/register">
                    <i className="bi bi-person-plus-fill" /> Registration
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login">
                    <i className="bi bi-box-arrow-in-right" /> Login
                  </NavLink>
                </li>
              </>
            )}

            {isUser && (
              <>
                <li>
                  <NavLink to="/home" end>
                    <i className="bi bi-house-fill" /> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/trails">
                    <i className="bi bi-heart-pulse-fill" /> Trials
                  </NavLink>
                </li>
              </>
            )}

            {/* <li>
              <NavLink to="/about">
                <i className="bi bi-info-circle-fill" /> About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact">
                <i className="bi bi-telephone-fill" /> Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/adminschedule">
                <i className="bi bi-calendar" /> Schedule
              </NavLink>
            </li> */}

            {isLoggedIn && isAdmin && (
              <li>
                <NavLink to="/ListedTrials">
                  <i className="bi bi-shield-lock-fill" /> Admin Dashboard
                </NavLink>
              </li>
            )}

            {isLoggedIn && (
              <li>
                <NavLink to="/logout">
                  <i className="bi bi-box-arrow-right" /> Logout
                </NavLink>
              </li>
            )}
          </ul>

          {/* RIGHT: Profile avatar button (shown when logged in) */}
          {isLoggedIn && (
            <button
              title="View Profile"
              onClick={openProfile}
              className="profile-button"
              aria-label="Open profile"
            >
              {avatarLetter}
            </button>
          )}
        </nav>
      </header>

      {/* Global Profile Modal (works on every page that renders Menu) */}
      {isProfileOpen && currentUser && (
        <UserProfile
          user={currentUser}
          onClose={closeProfile}
          onUpdated={handleProfileUpdated}
        />
      )}
    </>
  );
};

export default Menu;
