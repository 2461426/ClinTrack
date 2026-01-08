 
// src/components/user/UserContact.jsx
import React, { useState } from "react";
import ParticipantNavbar from "./ParticipantNavbar";
import Footer from "./Footer";
 
const UserContact = () => {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
 
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Wire to backend if needed
    setSubmitted(true);
  };
 
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <ParticipantNavbar />
 
      {/* Hero */}
      <section className="container" style={{paddingTop: '90px'}}>
        <div className="text-center">
          <h2 className="display-6 fw-semibold text-primary mb-2">Contact Us</h2>
          <p className="text-muted">
            We’d love to hear from you. Reach out for queries, support, or collaborations.
          </p>
        </div>
      </section>
 
      {/* Content Grid */}
      <section className="container pb-5 flex-grow-1">
        <div className="row g-4">
          {/* Info Card */}
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Get in Touch</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i className="bi bi-telephone-fill text-primary"></i>
                    <span className="fw-semibold">+91 7777788888</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i className="bi bi-globe2 text-primary"></i>
                  <a>  https://www.clintrials.com
                   
                    </a>
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i className="bi bi-envelope-fill text-primary"></i>
                    <span className="fw-semibold">clintrial@gmail.com</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt-fill text-primary"></i>
                    <span className="fw-semibold">Chennai, Tamil Nadu, India</span>
                  </li>
                </ul>
              </div>
              <div className="card-footer bg-white">
                <small className="text-muted">
                  Available Mon–Fri, 9:00 AM – 6:00 PM IST
                </small>
              </div>
            </div>
          </div>
 
          {/* Contact Form */}
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Send a Message</h5>
              </div>
              <div className="card-body">
                {!submitted ? (
                  <form onSubmit={onSubmit} className="needs-validation" noValidate>
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={onChange}
                        required
                      />
                      <div className="form-text">
                        Briefly describe what your message is about.
                      </div>
                    </div>
 
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        rows="6"
                        placeholder="Your message..."
                        value={form.message}
                        onChange={onChange}
                        required
                      ></textarea>
                    </div>
 
                    <div className="d-flex justify-content-end gap-2">
                      <button type="reset" className="btn btn-outline-secondary"
                        onClick={() => setForm({ subject: "", message: "" })}
                      >
                        Clear
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-send-fill me-1"></i>
                        Send
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>Thank you! Your message has been sent.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Banner / Footer */}
      <Footer />
    </div>
  );
};
 
export default UserContact;
 
 