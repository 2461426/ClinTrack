
import { useFormik } from "formik";
import { useState } from "react";
import "../styles/RegistrationForm.css";
import participantService from "../services/ParticipantService";
import Menu from "./Menu";

/** Controlled dropdown vocabularies */
const OBESITY_CATEGORIES = [
  { value: "", label: "-- Select obesity category --" },
  { value: "NORMAL", label: "Normal weight" },
  { value: "OVERWEIGHT", label: "Overweight" },
  { value: "OBESITY_CLASS_1", label: "Obesity class 1" },
  { value: "OBESITY_CLASS_2", label: "Obesity class 2" },
  { value: "OBESITY_CLASS_3", label: "Obesity class 3" },
];

const BP_CATEGORIES = [
  { value: "", label: "-- Select BP category --" },
  { value: "NORMAL", label: "Normal (<120 and <80)" },
  { value: "ELEVATED", label: "Elevated (120–129 and <80)" },
  { value: "STAGE_1", label: "Stage 1 (130–139 or 80–89)" },
  { value: "STAGE_2", label: "Stage 2 (≥140 or ≥90)" },
  { value: "CRISIS", label: "Hypertensive Crisis (≥180 and/or ≥120)" },
  { value: "UNKNOWN", label: "Unknown / Not measured" },
];

const DIABETES_STATUS = [
  { value: "", label: "-- Select diabetes status --" },
  { value: "NONE", label: "No diabetes" },
  { value: "PREDIABETES", label: "Prediabetes" },
  { value: "TYPE_1", label: "Type 1 diabetes" },
  { value: "TYPE_2", label: "Type 2 diabetes" },
  { value: "GESTATIONAL", label: "Gestational diabetes" },
  { value: "UNKNOWN", label: "Unknown / Not sure" },
];

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      // LEFT PANE — basic details + passwords
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",

      // RIGHT PANE — medical history + dropdowns + radios
      profilePicture: "",
      obesityCategory: "",
      bpCategory: "",
      diabetesStatus: "",
      hasAsthma: null,
      hasChronicIllnesses: null,

      // Acknowledgment checkbox
      acknowledgment: false,
    },

    validate: (values) => {
      const errors = {};

      // Basic validations
      if (!values.firstName) errors.firstName = "First name is required";
      if (!values.lastName) errors.lastName = "Last name is required";

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)) {
        errors.email = "Invalid email format";
      }

      if (!values.mobile) {
        errors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(values.mobile)) {
        errors.mobile = "Mobile number must be exactly 10 digits";
      }

      if (!values.dateOfBirth) {
        errors.dateOfBirth = "Date of Birth is required";
      } else {
        const dob = new Date(values.dateOfBirth);
        const ageDiff = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age < 18) errors.dateOfBirth = "You must be at least 18 years old";
      }

      // Password validations
      if (!values.password) {
        errors.password = "Password is required";
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(values.password)) {
        errors.password =
          "Password must be minimum 6 characters and include at least one letter, one digit and one special character";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }

      // Profile picture - optional URL validation
      if (values.profilePicture && !/^https?:\/\/.+/.test(values.profilePicture)) {
        errors.profilePicture = "Please enter a valid URL (starting with http:// or https://)";
      }

      // Dropdowns — required selection
      if (!values.obesityCategory) errors.obesityCategory = "Please select obesity category";
      if (!values.bpCategory) errors.bpCategory = "Please select BP category";
      if (!values.diabetesStatus) errors.diabetesStatus = "Please select diabetes status";

      // Radios — required yes/no
      if (values.hasAsthma === null) errors.hasAsthma = "Please select yes or no";
      if (values.hasChronicIllnesses === null) errors.hasChronicIllnesses = "Please select yes or no";

      // Acknowledgment required
      if (!values.acknowledgment) errors.acknowledgment = "You must confirm the information is true";

      return errors;
    },

   
onSubmit: (values, { resetForm }) => {
  const normalizedEmail = (values.email || '').trim().toLowerCase();

  // 1) Check if email already exists
  participantService.getParticipantByEmail(normalizedEmail)
    .then(existing => {
      if (existing && existing.length > 0) {
        alert("Email is already registered. Please use a different email or login.");
        return; // Stop further execution
      }

      // 2) Proceed with registration
      participantService.postParticipant(values)
        .then(() => {
          alert("Registration successful!");
          resetForm();
        })
        .catch(error => {
          console.error("Error during registration:", error);
          alert("Registration failed. Please try again.");
        });
    })
    .catch(error => {
      console.error("Error checking email:", error);
      alert("Could not verify email. Please try again.");
    });
},

  });

  // Helper to set boolean from radios (yes/no)
  const setBool = (field, e) => {
    formik.setFieldValue(field, e.target.value === "yes");
  };

  return (
    <>
      {/* === ClinTrack Navbar (same as ClinTrackPage) === */}
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
        <section className="registration">
          {/* IMPORTANT: Let Formik control submit with its validation */}
          <form className="registrationForm" onSubmit={formik.handleSubmit} noValidate>
            <h2>Clinical Trial Registration Form</h2>

            {/* TWO-PANE layout — aligned equally */}
            <div className="formBody">
              {/* LEFT PANE — Details + Passwords */}
              <div className="pane leftPane">
                <div className="formRow">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    className="formInput"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.firstName && <span className="error">{formik.errors.firstName}</span>}
                </div>

                <div className="formRow">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    className="formInput"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.lastName && <span className="error">{formik.errors.lastName}</span>}
                </div>

                <div className="formRow">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    className="formInput"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    autoComplete="email"
                  />
                  {formik.errors.email && <span className="error">{formik.errors.email}</span>}
                </div>

                <div className="formRow">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    id="mobile"
                    type="text"
                    name="mobile"
                    className="formInput"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {formik.errors.mobile && <span className="error">{formik.errors.mobile}</span>}
                </div>

                <div className="formRow">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    className="formInput"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.dateOfBirth && <span className="error">{formik.errors.dateOfBirth}</span>}
                </div>

                {/* Passwords with eye toggles */}
                <div className="formRow">
                  <label htmlFor="password">Enter Password</label>
                  <div className="passwordField">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="formInput"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      autoComplete="new-password"
                    />
                    <span
                      className="eyeIcon"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowPassword(!showPassword)}
                    >
                      👁
                    </span>
                  </div>
                  {formik.errors.password && <span className="error">{formik.errors.password}</span>}
                </div>

                <div className="formRow">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="passwordField">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="formInput"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      autoComplete="new-password"
                    />
                    <span
                      className="eyeIcon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") && setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      👁
                    </span>
                  </div>
                  {formik.errors.confirmPassword && (
                    <span className="error">{formik.errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              {/* RIGHT PANE — Medical History + Acknowledgment at end */}
              <div className="pane rightPane">
                <div className="formRow">
                  <label htmlFor="profilePicture">Profile Picture URL (Optional)</label>
                  <input
                    id="profilePicture"
                    type="text"
                    name="profilePicture"
                    className="formInput"
                    placeholder="Enter profile picture URL"
                    value={formik.values.profilePicture}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.profilePicture && <span className="error">{formik.errors.profilePicture}</span>}
                </div>

                <div className="formRow">
                  <label>Medical History</label>
                  <p className="readonlyText" aria-readonly="true">
                    Give response to the below ones whether you are having that issue or not...
                  </p>
                </div>

                {/* Obesity classification */}
                <div className="formRow">
                  <label htmlFor="obesityCategory">Obesity Classification</label>
                  <select
                    id="obesityCategory"
                    name="obesityCategory"
                    className="formInput"
                    value={formik.values.obesityCategory}
                    onChange={formik.handleChange}
                  >
                    {OBESITY_CATEGORIES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {formik.errors.obesityCategory && (
                    <span className="error">{formik.errors.obesityCategory}</span>
                  )}
                </div>

                {/* BP category */}
                <div className="formRow">
                  <label htmlFor="bpCategory">BP category</label>
                  <select
                    id="bpCategory"
                    name="bpCategory"
                    className="formInput"
                    value={formik.values.bpCategory}
                    onChange={formik.handleChange}
                  >
                    {BP_CATEGORIES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {formik.errors.bpCategory && <span className="error">{formik.errors.bpCategory}</span>}
                </div>

                {/* Diabetes status */}
                <div className="formRow">
                  <label htmlFor="diabetesStatus">Diabetes status</label>
                  <select
                    id="diabetesStatus"
                    name="diabetesStatus"
                    className="formInput"
                    value={formik.values.diabetesStatus}
                    onChange={formik.handleChange}
                  >
                    {DIABETES_STATUS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {formik.errors.diabetesStatus && (
                    <span className="error">{formik.errors.diabetesStatus}</span>
                  )}
                </div>

                {/* Radio: Asthma */}
                <div className="formRow">
                  <label>Asthma</label>
                  <div className="radioGroup">
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="hasAsthma"
                        value="yes"
                        checked={formik.values.hasAsthma === true}
                        onChange={(e) => setBool("hasAsthma", e)}
                      />
                      Yes
                    </label>
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="hasAsthma"
                        value="no"
                        checked={formik.values.hasAsthma === false}
                        onChange={(e) => setBool("hasAsthma", e)}
                      />
                      No
                    </label>
                  </div>
                  {formik.errors.hasAsthma && <span className="error">{formik.errors.hasAsthma}</span>}
                </div>

                {/* Radio: Chronic illnesses */}
                <div className="formRow">
                  <label>Chronic illnesses</label>
                  <div className="radioGroup">
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="hasChronicIllnesses"
                        value="yes"
                        checked={formik.values.hasChronicIllnesses === true}
                        onChange={(e) => setBool("hasChronicIllnesses", e)}
                      />
                      Yes
                    </label>
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="hasChronicIllnesses"
                        value="no"
                        checked={formik.values.hasChronicIllnesses === false}
                        onChange={(e) => setBool("hasChronicIllnesses", e)}
                      />
                      No
                    </label>
                  </div>
                  {formik.errors.hasChronicIllnesses && (
                    <span className="error">{formik.errors.hasChronicIllnesses}</span>
                  )}
                </div>

                {/* Acknowledgment checkbox */}
                <div className="formRow acknowledgment acknowledgment-right">
                  <input
                    type="checkbox"
                    name="acknowledgment"
                    checked={formik.values.acknowledgment}
                    onChange={formik.handleChange}
                    id="acknowledgment"
                  />
                  <label htmlFor="acknowledgment">The above information is true</label>
                </div>
                {formik.errors.acknowledgment && (
                  <div className="error">{formik.errors.acknowledgment}</div>
                )}
              </div>
            </div>

            {/* Actions row: Back + Register */}
            <div className="actions-row">
              <button
                type="button"
                className="btn-back"
                onClick={() => window.location.assign("/")}
                aria-label="Go back to ClinTrack main page"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="submit"
                disabled={
                  !formik.values.acknowledgment ||
                  Object.keys(formik.errors).length > 0
                }
              >
                Register
              </button>
            </div>
          </form>
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
    </>
  );
};
export default RegistrationForm;

