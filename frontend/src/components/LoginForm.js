import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/LoginForm.css";

const LoginForm = () => {
  // Load remembered credentials (demo only; don't store passwords in production)
  const rememberedEmail = localStorage.getItem("remembered_email") || "";
  const rememberedPassword = localStorage.getItem("remembered_password") || "";
  const rememberedRole = localStorage.getItem("remembered_role") || "user";
  const rememberedRemember = localStorage.getItem("remember_me") === "true";

  // Manual validation function
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

  const handleSubmit = (values) => {
    const { email, password, role, rememberMe } = values;

    // Persist credentials if rememberMe is checked
    localStorage.setItem("remember_me", rememberMe ? "true" : "false");
    localStorage.setItem("remembered_role", role);
    if (rememberMe) {
      localStorage.setItem("remembered_email", email);
      localStorage.setItem("remembered_password", password); // ⚠️ insecure; demo only
    } else {
      localStorage.removeItem("remembered_email");
      localStorage.removeItem("remembered_password");
    }

    alert(`Login successful as ${role === "admin" ? "Admin" : "User"}!`);
    // Example redirect:
    // window.location.href = role === "admin" ? "/admin/dashboard" : "/dashboard";
  };

  return (
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
      {({ values, setFieldValue }) => (
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
              autoComplete="email"
            />
            <ErrorMessage
              name="email"
              component="span"
              className="error"
              id="email-error"
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <ErrorMessage
              name="password"
              component="span"
              className="error"
              id="password-error"
            />
          </div>

          {/* Actions: Remember & Forgot */}
          <div className="form-actions">
            <label className="remember">
              <Field type="checkbox" name="rememberMe" />
              <span>Remember me</span>
            </label>

            <a href="/forgot-password" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {/* Submit (text reflects role) */}
          <button type="submit">
            {values.role === "admin" ? "Login as Admin" : "Login as User"}
          </button>

          {/* Footer */}
          <div className="footer-links">
            <span className="muted">Don’t have an account?</span>
            <a href="/register" onClick={(e) => e.preventDefault()}>
              Register now
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
