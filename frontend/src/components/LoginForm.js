import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/LoginForm.css";
import UtilityService from "../services/UtilityService";
import participantService from "../services/ParticipantService";
import { Link, useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import pharmaLoginAnimation from '../assets/animations/pharmaLoginAnimation.json';
import ParticipantNavbar from "./ParticipantNavbar";
import Footer from "./Footer";

const LoginForm = () => {
  // Restore remembered values
  const rememberedEmail = localStorage.getItem("remembered_email") || "";
  const rememberedPassword = localStorage.getItem("remembered_password") || "";
  const rememberedRole = localStorage.getItem("remembered_role") || "user";
  // Turn stored string into boolean; default to false if not set
  const rememberedRemember = localStorage.getItem("remember_me") === "true";

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(values.email)) {
      errors.email = "Please enter a valid email.";
    }
    if (!values.password || values.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
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
            "Invalid email or password."
          );
          return;
        }

        // Store token + user info
        localStorage.setItem("auth_token", "demo_token");
        localStorage.setItem("logged_in_user", JSON.stringify(matchedUser));
        
        // Ensure role exists and is uppercase
        const userRole = matchedUser.role ? matchedUser.role.toUpperCase() : "USER";
        
        UtilityService.storeInforation(
          matchedUser.id,
          matchedUser.email,
          userRole
        );

        // Navigate by role
        if (UtilityService.isAdmin()) {
          navigate("/listedtrails");
        } else {
          navigate("/home");
        }

        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Login error:", error);
        setStatus("Login failed. Please check your credentials and try again.");
        setSubmitting(false);
      });
  };
 
  return (
    <div className="clintrack-page">
      <ParticipantNavbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-header__subtitle">Login as</h1>
            <h1 className="login-header__title">Pharma or Participant...</h1>
          </div>

          <div className="login-card">
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
                <Form className="login-card__content" noValidate>
                  <div className="login-animation">
                    <Lottie animationData={pharmaLoginAnimation} className="login-animation__lottie" />
                  </div>
                  
                  <div className="login-divider"></div>

                  <div className="login-form">
                    <div className="login-form__fields">
                      {/* Email */}
                      <div className="form-field">
                        <label htmlFor="email" className="form-field__label">Email ID</label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter Email"
                          className="form-field__input"
                          autoComplete="new-email"
                        />
                        <ErrorMessage name="email" component="span" className="form-field__error" id="email-error" />
                      </div>

                      {/* Password with Show/Hide toggle */}
                      <div className="form-field">
                        <label htmlFor="password" className="form-field__label">Password</label>
                        <div className="form-field__password-wrapper">
                          <Field
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter Password"
                            className="form-field__input form-field__input--password"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="form-field__toggle"
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <ErrorMessage name="password" component="span" className="form-field__error" id="password-error" />
                      </div>

                      {/* Global login error */}
                      {status && <div className="form-field__error form-field__error--auth">{status}</div>}

                      {/* Submit */}
                      <button className="login-form__submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <button onClick={() => navigate('/register')} className="login-goback">
            Register
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default LoginForm;
