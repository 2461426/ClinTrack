
// import React from "react";
// import "../styles/ClinTrackPage.css";
// import Menu from "./Menu";

// let RouterLink = null;
// try {
//   const rr = require("react-router-dom");
//   RouterLink = rr && rr.Link ? rr.Link : null;
// } catch (e) {
//   RouterLink = null;
// }

// const ClinTrackPage = () => {

//   return (
//     <div className="clintrack-page">
//       {/* NAVBAR */}
//       {/* <header className="clintrack-page__header">
//         <nav className="navbar clintrack-page__navbar">
//           <div className="container d-flex align-items-center justify-content-center">
//             {Centered Title }
//             <h1 className="clintrack-page__title text-center m-0" aria-label="Clinical Trial Management and Compliance Management System">
//               Clinical Trial Management and Compliance Management System
//             </h1>
//           </div>
//         </nav>
//       </header> */}
//       <Menu/>
//       {/* MAIN CONTENT */}
//       <main className="clintrack-page__main">
//         <div className="container py-4">
//           <div className="row g-4">
//             {/* LEFT COLUMN: Image + Message */}
//             <section className="col-lg-8" aria-labelledby="clintrack-left-title">
//               <h2 id="clintrack-left-title" className="clintrack-page__visually-hidden">
//                 Clinical Trial Guidelines
//               </h2>

//               <div className="card shadow-sm">
//                 <div className="ratio ratio-16x9">
//                   {/* Replace src with your actual image */}
//                   <img
//                     src="https://clipart-library.com/2023/Clinical-trials-illustration.png"
//                     alt="Clinical trials illustration"
//                     className="img-fluid rounded-top object-fit-cover"
//                     loading="lazy"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* RIGHT COLUMN: Register & Login */}
//             <aside className="col-lg-4" aria-label="Account actions">
//               <div className="card shadow-sm">
//                 <div className="card-body d-flex flex-column align-items-center">
//                   <h3 className="h5 mb-3 text-center">Get Started</h3>
//                   <div className="clintrack-page__actions d-flex flex-column align-items-center gap-3 w-100">
//                     {RouterLink ? (
//                       <RouterLink
                      
//                         className="btn clintrack-page__btn clintrack-page__btn--register w-100"
//                         to="/register"
//                         aria-label="Register for Clin Track"
//                       >
//                         Register
//                       </RouterLink>
//                     ) : (
//                       <button
//                         type="button"
//                         className="btn clintrack-page__btn clintrack-page__btn--register"
//                         onClick={() => window.location.assign("/register")}
//                         aria-label="Register for Clin Track"
//                       >
//                         Register
//                       </button>
//                     )}

//                     {RouterLink ? (
//                       <RouterLink
//                         className="btn clintrack-page__btn clintrack-page__btn--login w-100"
//                         to="/login"
//                         aria-label="Login to Clin Track"
//                       >
//                         Login
//                       </RouterLink>
//                     ) : (
//                       <button
//                         type="button"
//                         className="btn clintrack-page__btn clintrack-page__btn--login"
//                         onClick={() => window.location.assign("/login")}
//                         aria-label="Login to Clin Track"
//                       >
//                         Login
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </div>

//         {/* BOTTOM BANNER */}
//         <div className="clintrack-page__banner">
//           <div className="container py-3 text-center">
//             <p className="m-0 clintrack-page__banner-text">
//               All the trials are conducted according to FDA and ICH-GCP guidelines.
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="clintrack-page__footer">
//         <div className="container-copyright">
//           <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ClinTrackPage;



import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ClinTrackPage.css";
import Menu from "./Menu";
import UtilityService from "../services/UtilityService";

const ClinTrackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as admin and redirect to ListedTrails
    if (UtilityService.isLoggedIn() && UtilityService.isAdmin()) {
      navigate("/listedtrails");
    }
  }, [navigate]);

  return (
    <div className="clintrack-page">
      {/* NAVBAR */}
      <Menu />

      {/* MAIN CONTENT: Full-cover hero image */}
      <main className="clintrack-page__main">
        <section
          className="clintrack-hero"
          aria-labelledby="clintrack-left-title"
        >
          <h2 id="clintrack-left-title" className="clintrack-page__visually-hidden">
            Clinical Trial Guidelines
          </h2>

          <div className="clintrack-hero__media">
            <img
              src="https://www.clinicaltrialsarena.com/wp-content/uploads/sites/22/2023/05/GettyImages-1382981225.jpg"
              alt="Clinical trials illustration"
              className="clintrack-hero__img"
            />
          </div>
        </section>

        {/* BOTTOM BANNER */}
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
      </main>
    </div>
  );
};

export default ClinTrackPage;


