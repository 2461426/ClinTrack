
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/LoginForm.css";

// Runtime fallback for react-router-dom (matches your pattern)
let RouterLink = null;
// name intentionally does NOT start with `use` so ESLint won't treat this as
// a React Hook (which must be called unconditionally).
let navigateHookFactory = null;
try {
  const rr = require("react-router-dom");
  RouterLink = rr && rr.Link ? rr.Link : null;
  navigateHookFactory = rr && rr.useNavigate ? rr.useNavigate : null;
} catch (e) {
  RouterLink = null;
  navigateHookFactory = null;
}

// Runtime load for ParticipantService (optional; falls back to fetching /data.json)
let ParticipantService = null;
try {
  const svc = require("../services/ParticipantService");
  ParticipantService = svc?.default ?? svc;
} catch (e) {
  ParticipantService = null;
}

// Fallback: read /data.json directly if service is not available
async function fetchParticipantsFallback() {
  try {
    const res = await fetch("/data.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Expecting shape { participants: [...] } or plain array
    return Array.isArray(data) ? data : (data.participants || []);
  } catch (err) {
    console.error("Failed to fetch participants:", err);
    return [];
  }
}

async function findByEmailAndPassword(email, password) {
  // First try service
  if (ParticipantService && ParticipantService.findByEmailAndPassword) {
    return await ParticipantService.findByEmailAndPassword(email, password);
  }
  // Fallback to fetching data.json and filtering
  const participants = await fetchParticipantsFallback();
  const normalizedEmail = (email || "").trim().toLowerCase();
  return (
    participants.find(
      (p) =>
        (p.email || "").trim().toLowerCase() === normalizedEmail &&
        (p.password || "") === password
    ) || null
  );
}

const LoginForm = () => {
  // Load remembered credentials (demo only; don't store passwords in production)
  const rememberedEmail = localStorage.getItem("remembered_email") || "";
  const rememberedPassword = localStorage.getItem("remembered_password") || "";
  const rememberedRole = localStorage.getItem("remembered_role") || "user";
  const rememberedRemember = localStorage.getItem("remember_me") === "true";

  // Manual validation (frontend field shape only)
  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(values.email)) {
      errors.email = "Please enter a valid email.";
    }
    if (!values.password || values.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    return errors;
  };

  const navigate = navigateHookFactory ? navigateHookFactory() : null;

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    setStatus(undefined);

    const { email, password, role, rememberMe } = values;

    // Check credentials strictly against data.json / ParticipantService
    const matchedUser = await findByEmailAndPassword(email, password);

    if (!matchedUser) {
      setSubmitting(false);
      setStatus("Invalid email or password. Please use the credentials you registered with.");
      return; // ❌ Block login
    }

    // ✅ Credentials valid: persist "remember me" info (demo only)
    localStorage.setItem("remember_me", rememberMe ? "true" : "false");
    localStorage.setItem("remembered_role", role);
    if (rememberMe) {
      localStorage.setItem("remembered_email", email);
      localStorage.setItem("remembered_password", password); // ⚠️ insecure; demo only
    } else {
      localStorage.removeItem("remembered_email");
      localStorage.removeItem("remembered_password");
    }

    // Optionally store the logged in user context/token (demo)
    localStorage.setItem("auth_token", "demo_token");
    localStorage.setItem("logged_in_user", JSON.stringify(matchedUser));

    // Redirect to dashboard (user/admin)
    if (role === "admin") {
      if (navigate) navigate("/admin/dashboard");
      else window.location.href = "/admin/dashboard";
    } else {
      if (navigate) navigate("/dashboard");
      else window.location.href = "/dashboard";
    }

    setSubmitting(false);
  };

  return (
    <>
    <div className="clintrack-page">
<header className="clintrack-page__header">
  <nav className="navbar clintrack-page__navbar">
    <div className="container d-flex align-items-center justify-content-center">
      {/* Centered Title (same as ClinTrackPage) */}
      <h1
        className="clintrack-page__title text-center m-0"
        aria-label="Clinical Trial Management and Compliance Management System"
      >
        Clinical Trial Management and Compliance Management System
      </h1>
    </div>
   </nav>
   </header>
    <section className="login">
      <Formik
        initialValues={{
          role: rememberedRole,
          email: rememberedEmail,
          password: rememberedPassword,
          rememberMe: rememberedRemember,
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, status }) => (
          <Form className="login-form" noValidate>
            <h2>Login</h2>

            {/* User/Admin segmented toggle */}
            <div className="segmented" role="tablist" aria-label="Select login role">
              <button
                type="button"
                className={`segment ${values.role === "user" ? "active" : ""}`}
                onClick={() => setFieldValue("role", "user")}
                aria-pressed={values.role === "user"}
                aria-selected={values.role === "user"}
                role="tab"
              >
                User
              </button>
              <button
                type="button"
                className={`segment ${values.role === "admin" ? "active" : ""}`}
                onClick={() => setFieldValue("role", "admin")}
                aria-pressed={values.role === "admin"}
                aria-selected={values.role === "admin"}
                role="tab"
              >
                Admin
              </button>
            </div>

            {/* Email */}
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
              />
              <ErrorMessage name="email" component="span" className="error" id="email-error" />
            </div>

            {/* Password */}
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="off"
              />
              <ErrorMessage name="password" component="span" className="error" id="password-error" />
            </div>

            {/* Actions: Remember & Forgot */}
            <div className="form-actions">
              <label className="remember">
                <Field type="checkbox" name="rememberMe" />
                <span>Remember me</span>
              </label>

              <a
                className="link"
                href="/forgot-password"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit (text reflects role) */}
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Checking…"
                : values.role === "admin"
                ? "Login as Admin"
                : "Login as User"}
            </button>

            {/* Global login error from server-side/JSON check */}
            {status && <div className="error" style={{ marginTop: 10 }}>{status}</div>}

            {/* Footer */}
            <div className="footer-links">
              <span className="muted">Don’t have an account?</span>
              {RouterLink ? (
                <RouterLink className="link" to="/register">
                  Register here
                </RouterLink>
              ) : (
                <a className="link" href="/register">
                  Register here
                </a>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </section>
    </div>
    </>
  );
};

export default LoginForm;