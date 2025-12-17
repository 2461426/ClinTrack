
// src/pages/Contact.js
import "../styles/contact.css";

export default function Contact() {
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

      <main className="contact">
        <section className="hero">
          <h2>Contact ClinTrack</h2>
          <p>We’re here to help with trials, onboarding, and compliance.</p>
        </section>

        <section className="contact-grid">
          <div className="card glass">
            <h3>Send us a message</h3>
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We’ll reach out soon.");
              }}
            >
              <div className="row">
                <label>Name</label>
                <input required placeholder="Your name" />
              </div>
              <div className="row">
                <label>Email</label>
                <input required type="email" placeholder="you@example.com" />
              </div>
              <div className="row">
                <label>Message</label>
                <textarea rows={4} required placeholder="How can we help?" />
              </div>
              <div className="actions">
                <button className="btn-primary" type="submit">Send</button>
              </div>
            </form>
          </div>

          <div className="card gradient">
            <h3>Reach us</h3>
            <ul className="reach">
              <li><strong>Email:</strong> support@clintrack.example</li>
              <li><strong>Phone:</strong> +91 44 4000 0000</li>
              <li><strong>Address:</strong> Chennai, TN</li>
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