
// src/components/user/UserProfile.jsx
import React, { useState, useEffect } from "react";
import participantService from "../../services/participantService";
import UtilityService from "../../services/UtilityService";

const UserProfile = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobile: user.mobile || "",
      dateOfBirth: user.dateOfBirth || "",
    });
  }, [user]);

  function onChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setForm(function (prev) {
      var next = { ...prev };
      next[name] = value;
      return next;
    });
  }

  function validate() {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Please enter a valid email.";
    var mobileDigits = form.mobile.replace(/\D/g, "");
    if (mobileDigits.length < 10 || mobileDigits.length > 15)
      return "Contact number must be 10–15 digits.";
    if (!form.dateOfBirth) return "Date of birth is required.";
    return "";
  }

  function onSubmit(e) {
    e.preventDefault();
    var v = validate();
    if (v) {
      setError(v);
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("");
    setSaving(true);

    var payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(), // keep deterministic email
      mobile: form.mobile.trim(),
      dateOfBirth: form.dateOfBirth,
    };

    participantService
      .updateParticipant(user.id, payload)
      .then(function (res) {
        var updatedUser = { ...user, ...payload };
        // Persist updated user locally
        localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));
        // Keep stored role consistent if you rely on UtilityService
        var role = localStorage.getItem("role") || (user.role || "USER");
        UtilityService.storeInforation(user.id, updatedUser.email, role);

        setSuccess("Profile updated successfully.");
        setError("");

        // Notify parent (dashboard) to refresh greeting/avatar
        if (typeof onUpdated === "function") onUpdated(updatedUser);
      })
      .catch(function (err) {
        console.error(err);
        setError("Update failed. Please try again.");
        setSuccess("");
      })
      .finally(function () {
        setSaving(false);
      });
  }

  return (
    <div
      className="profile-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="profile-modal"
        style={{
          background: "#fff",
          width: "min(90vw, 520px)",
          borderRadius: 8,
          padding: 16,
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>Your Profile</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
            }}
            aria-label="Close profile modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ background: "#ffe8e8", padding: 8, marginBottom: 8 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#e8ffe8", padding: 8, marginBottom: 8 }}>
            {success}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="Enter first name"
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Enter last name"
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Enter email"
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div>
              <label>Contact</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={onChange}
                placeholder="Enter contact number"
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={onChange}
                style={{ width: "100%", padding: 8 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;