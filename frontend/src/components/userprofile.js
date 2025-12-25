
import React, { useState, useEffect, useMemo } from "react";
// ✅ Fix paths if services are under src/services
import participantService from "../services/ParticipantService";
import UtilityService from "../services/UtilityService"; 
import { useNavigate } from "react-router-dom";

const IN_PHONE_REGEX = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/; // India mobile rule

function normalizeIndianMobile(input) {
  // Remove all non-digits
  const digits = String(input || "").replace(/\D+/g, "");
  // Strip country code or leading 0 for validation
  const normalized = digits.replace(/^(\+?91|0)/, "");
  return { digits, normalized };
}

const UserProfile = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Use only if you plan to redirect post-update

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
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  }

  function validate() {
    const firstName = (form.firstName || "").trim();
    const lastName = (form.lastName || "").trim();
    const mobile = (form.mobile || "").trim();

    if (!firstName) return "First name is required.";
    if (!lastName) return "Last name is required.";

    // India mobile validation: accepts +91 / 0 prefix, enforces 10 digits starting 6–9
    if (!IN_PHONE_REGEX.test(mobile)) {
      return "Please enter a valid Indian mobile number (10 digits, starts with 6–9). You can optionally include +91 or 0.";
    }

    const { normalized } = normalizeIndianMobile(mobile);
    if (normalized.length !== 10) {
      return "Contact number must be exactly 10 digits after country/leading zero normalization.";
    }

    return null;
  }

  // Prevent saving when nothing changed
  const isChanged = useMemo(() => {
    if (!user) return false;
    const cleanForm = {
      firstName: (form.firstName || "").trim(),
      lastName: (form.lastName || "").trim(),
      mobile: (form.mobile || "").trim(),
    };
    const cleanUser = {
      firstName: (user.firstName || "").trim(),
      lastName: (user.lastName || "").trim(),
      mobile: (user.mobile || "").trim(),
    };
    return (
      cleanForm.firstName !== cleanUser.firstName ||
      cleanForm.lastName !== cleanUser.lastName ||
      cleanForm.mobile !== cleanUser.mobile
    );
  }, [form, user]);

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

    participantService
      .updateParticipant(user.id, payload)
      .then(() => {
        const updatedUser = { ...user, ...payload };

        // Persist updated user locally
        localStorage.setItem("logged_in_user", JSON.stringify(updatedUser));

        // Keep stored role consistent
        const role =
          localStorage.getItem("role") ||
          user.role ||
          "USER"; // Fallback to USER if absent

        // Handle both possible method names safely
        if (typeof UtilityService?.storeInformation === "function") {
          UtilityService.storeInformation(updatedUser.id, updatedUser.email, role);
        } else if (typeof UtilityService?.storeInforation === "function") {
          UtilityService.storeInforation(updatedUser.id, updatedUser.email, role);
        }

        setSuccess("Profile updated successfully.");
        setError("");

        // Notify parent
        if (typeof onUpdated === "function") onUpdated(updatedUser);

        // Optional: auto-close after success
        // return new Promise((resolve) => setTimeout(resolve, 1200))
        //   .then(() => { if (typeof onClose === "function") onClose(); });

        // Optional: navigate (Promise not needed)
        // navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Update participant failed:", err);
        const msg =
          (err && err.response && err.response.data && err.response.data.message) ||
          "Update failed. Please try again in a moment.";
        setError(msg);
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
      onClick={() => {
        if (typeof onClose === "function") onClose();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="profile-modal-title"
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
          <h3 id="profile-modal-title" style={{ margin: 0 }}>
            Your Profile
          </h3>
          <button
            onClick={() => {
              if (typeof onClose === "function") onClose();
            }}
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
          <div
            style={{ background: "#ffe8e8", padding: 8, marginBottom: 8 }}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{ background: "#e8ffe8", padding: 8, marginBottom: 8 }}
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="Enter first name"
                style={{ width: "100%", padding: 8 }}
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Enter last name"
                style={{ width: "100%", padding: 8 }}
                autoComplete="family-name"
                required
              />
            </div>

            <div>
              <label htmlFor="mobile">Contact</label>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={onChange}
                placeholder="Enter contact number (e.g., +91 9876543210)"
                style={{ width: "100%", padding: 8 }}
                inputMode="numeric"
                autoComplete="tel"
                pattern="^(?:\+91[-\s]?|0)?[6-9]\d{9}$"
                maxLength={16}
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
                opacity: saving || !isChanged ? 0.75 : 1,
              }}
              type="submit"
              disabled={saving || !isChanged}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
              type="button"
              onClick={() => {
                if (typeof onClose === "function") onClose();
              }}
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
