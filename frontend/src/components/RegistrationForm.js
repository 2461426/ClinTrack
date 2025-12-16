import { useFormik } from "formik";
import { useState } from "react";
import "../styles/RegistrationForm.css";
import participantService from "../services/ParticipantService";
 
/**
 * Controlled dropdown vocabularies (short, DB-friendly codes).
 */
const HYPERTENSION_CATEGORIES = [
  { value: "", label: "-- Select hypertension category --" },
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
 
/**
 * Type of trial dropdown — only a few options as requested.
 * Includes COVID-19 Vaccine plus 1–2 additional trials.
 */
const TRIAL_TYPES = [
  { value: "", label: "-- Select type of trial --" },
  { value: "COVID_19_VACCINE", label: "COVID‑19 Vaccine" },
  { value: "HYPERTENSION_TRIAL", label: "Hypertension Trial" },
  { value: "ONCOLOGY_THERAPY", label: "Oncology Therapy Trial" },
];
 
const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false); // 👁 keep original toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁 keep original toggle
 
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
 
      // RIGHT PANE — medical history (read-only + dropdowns + remaining radios) + checkbox at end
      trialType: "",              // NEW dropdown
      hypertensionCategory: "",  
      bpCategory: "",             // keep BP category dropdown (can remove if redundant)
      diabetesStatus: "",         // diabetes dropdown
      hasAsthma: null,            // radio (yes/no)
      hasChronicIllnesses: null,  // radio (yes/no)
 
      // Acknowledgment checkbox moved to RIGHT end
      acknowledgment: false,
    },
 
    onSubmit: (values) => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
    },
 
    validate: (values) => {
      const errors = {};
 
      // Basic validations
      if (!values.firstName) errors.firstName = "First name is required";
      if (!values.lastName) errors.lastName = "Last name is required";
 
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
      ) {
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
 
      // Password validations (eye icons unchanged)
      if (!values.password) {
        errors.password = "Password is required";
      } else if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(values.password)
      ) {
        errors.password =
          "Password must be minimum 6 characters and include at least one letter, one digit and one special character";
      }
 
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }
 
      // DROPDOWNS — required selection
      if (!values.trialType) errors.trialType = "Please select type of trial";
      if (!values.hypertensionCategory)
        errors.hypertensionCategory = "Please select hypertension category";
      if (!values.bpCategory) errors.bpCategory = "Please select BP category";
      if (!values.diabetesStatus)
        errors.diabetesStatus = "Please select diabetes status";
 
      // Remaining radios — required yes/no
      if (values.hasAsthma === null)
        errors.hasAsthma = "Please select yes or no";
      if (values.hasChronicIllnesses === null) {
        errors.hasChronicIllnesses = "Please select yes or no";
      }
 
      // Acknowledgment required
      if (!values.acknowledgment)
        errors.acknowledgment = "You must confirm the information is true";
 
      return errors;
    },
  });
 
  // Helper to set boolean from radios (yes/no)
  const setBool = (field, e) => {
    formik.setFieldValue(field, e.target.value === "yes");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    participantService.postParticipant(formik.values)
      .then((response) => {
        alert("Registration successful!");
        formik.resetForm();
      })
      .catch((error) => {
        console.error("There was an error registering the participant!", error);
        alert("Registration failed. Please try again.");
      });
  }

  return (
    <section className="registration">
      <form className="registrationForm" onSubmit={handleFormSubmit} noValidate>
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
            {formik.errors.firstName && (
              <span className="error">{formik.errors.firstName}</span>
            )}
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
            {formik.errors.lastName && (
              <span className="error">{formik.errors.lastName}</span>
            )}
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
            {formik.errors.email && (
              <span className="error">{formik.errors.email}</span>
            )}
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
            {formik.errors.mobile && (
              <span className="error">{formik.errors.mobile}</span>
            )}
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
            {formik.errors.dateOfBirth && (
              <span className="error">{formik.errors.dateOfBirth}</span>
            )}
          </div>

          {/* Passwords moved to LEFT (eye icons unchanged) */}
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
            {formik.errors.password && (
              <span className="error">{formik.errors.password}</span>
            )}
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
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowConfirmPassword(!showConfirmPassword)}
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
          {/* Read-only instruction using <p> */}
          <div className="formRow">
            <label>Medical History</label>
            <p className="readonlyText" aria-readonly="true">
              Give response to the below ones whether you are having that issue or not...
            </p>
          </div>

          {/* NEW Dropdown: Type of trial */}
          <div className="formRow">
            <label htmlFor="trialType">Type of trial</label>
            <select
              id="trialType"
              name="trialType"
              className="formInput"
              value={formik.values.trialType}
              onChange={formik.handleChange}
            >
              {TRIAL_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {formik.errors.trialType && (
              <span className="error">{formik.errors.trialType}</span>
            )}
          </div>

          {/* REPLACED: Hypertension category (instead of Sugar level) */}
          <div className="formRow">
            <label htmlFor="hypertensionCategory">Hypertension category</label>
            <select
              id="hypertensionCategory"
              name="hypertensionCategory"
              className="formInput"
              value={formik.values.hypertensionCategory}
              onChange={formik.handleChange}
            >
              {HYPERTENSION_CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {formik.errors.hypertensionCategory && (
              <span className="error">{formik.errors.hypertensionCategory}</span>
            )}
          </div>

          {/* Dropdown: BP category */}
          <div className="formRow">
            <label htmlFor="bpCategory">BP category</label>
            <select
              id="bpCategory"
              name="bpCategory"
              className="formInput"
              value={formik.values.bpCategory}
              onChange={formik.handleChange}
            >
              {HYPERTENSION_CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {formik.errors.bpCategory && (
              <span className="error">{formik.errors.bpCategory}</span>
            )}
          </div>

          {/* Dropdown: Diabetes status */}
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

          {/* (Optional) Acknowledgment at the end of right pane */}
          {/* <div className="formRow acknowledgment acknowledgment-right">
            <input
              id="acknowledge"
              type="checkbox"
              name="acknowledge"
              checked={formik.values.acknowledge}
              onChange={formik.handleChange}
            />
            <label htmlFor="acknowledge">The above information is true</label>
          </div> */}
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
            {formik.errors.hasAsthma && (
              <span className="error">{formik.errors.hasAsthma}</span>
            )}
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

          {/* Acknowledgment checkbox moved to RIGHT and placed at the end */}
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

      {/* Centered submit button */}
      <div className="submitRow">
        <button
          type="submit"
          className="submit"
          disabled={!formik.values.acknowledgment}
        >
          Register
        </button>
      </div>
    </form>
  </section>
);
};

export default RegistrationForm;