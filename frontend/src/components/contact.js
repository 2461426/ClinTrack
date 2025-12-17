
// src/components/user/UserContact.jsx
import React, { useState } from "react";

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
    <section style={{ marginTop: 24 }}>
      <h3>Contact</h3>
      {!submitted ? (
        <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
          <div style={{ marginBottom: 12 }}>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={onChange}
              placeholder="Enter a short subject"
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Write your message here"
              rows={5}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <button type="submit">Send</button>
        </form>
      ) : (
        <div style={{ background: "#e8ffe8", padding: 12 }}>
          Thanks! Your message has been recorded.
        </div>
      )}
    </section>
  );
};

export default UserContact;