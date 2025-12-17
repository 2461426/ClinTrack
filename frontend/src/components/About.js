
// src/pages/About.js
import "../styles/About.css";

export default function About() {
  return (
    <>
      {/* Navbar */}
      <header className="clintrack-page__header">
        <nav className="navbar clintrack-page__navbar">
          <div className="container d-flex align-items-center justify-content-center">
            <h1 className="clintrack-page__title text-center m-0">
              Clinical Trial Management and Compliance Management System
            </h1>
          </div>
        </nav>
      </header>

      <main className="about">
        <section className="hero">
          <h2>About ClinTrack</h2>
          <p>Purpose-built to simplify clinical trial operations and compliance.</p>
        </section>

        <section className="about-grid">
          <div className="card glass">
            <h3>Our Mission</h3>
            <p>
              To enable research organizations to design, enroll, and monitor trials through a single,
              integrated platform with strong compliance and participant-centric workflows.
            </p>
          </div>

          <div className="card gradient">
            <h3>Compliance</h3>
            <p>
              All trials are conducted according to the guidelines of FDA and ICH-GCP. We embed
              quality processes and audit trails to ensure data integrity throughout the trial lifecycle.
            </p>
          </div>

          <div className="card glass">
            <h3>What we offer</h3>
            <ul className="features">
              <li>Streamlined enrollment</li>
              <li>Participant dashboards</li>
              <li>Trial oversight & reporting</li>
              <li>Secure data and privacy-first design</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="clintrack-page__footer">
        <div className="container-copyright">
          <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
        </div>
      </footer>
    </>
  );
}
