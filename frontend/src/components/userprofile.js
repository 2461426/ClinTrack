
import React, { useState, useEffect } from "react";
// ✅ Fix paths if services are under src/services
import participantService from "../services/ParticipantService";
import UtilityService from "../services/UtilityService"; 
import { useNavigate } from "react-router-dom";


const UserProfile = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      mobile: user.mobile || "",
    });
  }, [user]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    const mobileDigits = (form.mobile || "").replace(/\D/g, "");
    if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      return "Contact number must be 10 digits";
    }
    return null;
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      mobile: form.mobile.trim(),
    };

    participantService.updateParticipant(user.id, payload)
      .then(() => {
        const updatedUser = { ...user, ...payload };

        // Persist updated user locally
        localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));

        // Keep stored role consistent
        const role = localStorage.getItem("role") || user.role || "USER";
        UtilityService.storeInforation(user.id, updatedUser.email, role);


        setSuccess("Profile updated successfully.");
        setError("");

        // Notify parent (dashboard or menu) to refresh greeting/avatar
        if (typeof onUpdated === "function") onUpdated(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        setError("Update failed. Please try again.");
        setSuccess("");
      })
      .finally(() => {
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
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
   );
};

export default UserProfile;
