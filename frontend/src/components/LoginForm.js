import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/LoginForm.css";
import UtilityService from "../services/UtilityService";
import participantService from "../services/ParticipantService";
import { Link, useNavigate } from "react-router-dom";
import Menu from "./Menu";

const LoginForm = () => {
  // Restore remembered values
  const rememberedEmail = localStorage.getItem("remembered_email") || "";
  const rememberedPassword = localStorage.getItem("remembered_password") || "";
  const rememberedRole = localStorage.getItem("remembered_role") || "user";
  // Turn stored string into boolean; default to false if not set
  const rememberedRemember = localStorage.getItem("remember_me") === "true";

  const navigate = useNavigate();

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
  const handleSubmit = (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    setStatus(undefined);
    const { email, password, role, rememberMe } = values;
    participantService.findByEmailAndPassword(email, password)
      .then((matchedUser) => {
        if (!matchedUser) {
          setSubmitting(false);
          setStatus(
            "Invalid email or password. Please use the credentials you registered with."
          );
          return;
        }

        // Store token + user info
        localStorage.setItem("auth_token", "demo_token");
        localStorage.setItem("logged_in_user", JSON.stringify(matchedUser));
        UtilityService.storeInforation(
          matchedUser.id,
          matchedUser.email,
          matchedUser.role.toUpperCase()
        );

        // Navigate by role
        if (UtilityService.isAdmin()) {
          navigate("/listedtrails");

        } else {
          navigate("/dashboard");
        }

        setSubmitting(false);
      })
      .catch((error) => {
        console.error(error);
        setStatus("Login failed due to server error.");
        setSubmitting(false);
      });
  };
 
return (
  <div className="clintrack-page">
    {/* <header className="clintrack-page__header">
      <nav className="navbar clintrack-page__navbar">
        <div className="container d-flex align-items-center justify-content-center">
          <h1
            className="clintrack-page__title text-center m-0"
            aria-label="Clinical Trial Management and Compliance Management System"
          >
            Clinical Trial Management and Compliance Management System
          </h1>
        </div>
      </nav>
    </header> */}
   <Menu/>
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

            {/* Role segmented toggle */}
            {/* <div className="segmented" role="tablist" aria-label="Select login role">
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
            </div> */}

            {/* Email */}
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="new-email"
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
                autoComplete="new-password"
              />
              <ErrorMessage name="password" component="span" className="error" id="password-error" />
            </div>

            {/* Actions */}
            <div className="form-actions">
              {/* <label className="remember">
                <Field type="checkbox" name="rememberMe" />
                <span>Remember me</span>
              </label> */}

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* Global login error */}
            {status && <div className="error" style={{ marginTop: 10 }}>{status}</div>}

            {/* Footer */}
            <div className="footer-links">
              <span className="muted">Don’t have an account?</span>
              <Link className="link" to="/register">
                Register here
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </section>
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
  </div>
);

}
export default LoginForm;
