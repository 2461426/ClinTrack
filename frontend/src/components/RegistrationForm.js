
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add navigate
import "../styles/RegistrationForm.css";
import participantService from "../services/ParticipantService";
import ParticipantNavbar from "./ParticipantNavbar/ParticipantNavbar";
import Footer from "./Footer/Footer";

// ✅ Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const navigate = useNavigate(); // ✅ init navigate
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
      gender: "",
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
      } else if (!/^[6-9]{1}\d{9}$/.test(values.mobile)) {
        errors.mobile =
          "Mobile number must be exactly 10 digits and should be starts with 6-9 numbers only ";
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

      if (!values.gender) errors.gender = "Please select your gender";

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
      const normalizedEmail = (values.email || "").trim().toLowerCase();

      // 1) Check if email already exists
      participantService
        .getParticipantByEmail(normalizedEmail)
        .then((existing) => {
          if (existing && existing.length > 0) {
            toast.info("Email is already registered. Please use a different email or login.", {
              icon: "ℹ️",
            });
            return; // Stop further execution
          }

          // 2) Proceed with registration
          participantService
            .postParticipant(values)
            .then(() => {
              toast.success("Registration successful!", { icon: "✅" });
              resetForm();

              // ✅ Redirect to login after a short delay (1.5s)
              setTimeout(() => {
                navigate("/login", { replace: true });
              }, 1500);
            })
            .catch((error) => {
              console.error("Error during registration:", error);
              toast.error("Registration failed. Please try again.", { icon: "❌" });
            });
        })
        .catch((error) => {
          console.error("Error checking email:", error);
          toast.error("Could not verify email. Please try again.", { icon: "⚠️" });
        });
    },
  });

  // Helper to set boolean from radios (yes/no)
  const setBool = (field, e) => {
    formik.setFieldValue(field, e.target.value === "yes");
  };

  return (
    <>
      <div className="clintrack-page">
        <ParticipantNavbar />

        {/* Toast container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <section className="registration">
          <form className="registrationForm" onSubmit={formik.handleSubmit} noValidate>
            <div className="registration-header">
              <h1 className="registration-header__subtitle">Register</h1>
              <h1 className="registration-header__title">To Participate</h1>
            </div>

            <div className="formBody">
              {/* LEFT PANE */}
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

                <div className="formRow">
                  <label>Gender</label>
                  <div className="radioGroup">
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formik.values.gender === "Male"}
                        onChange={formik.handleChange}
                      />
                      Male
                    </label>
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formik.values.gender === "Female"}
                        onChange={formik.handleChange}
                      />
                      Female
                    </label>
                  </div>
                  {formik.errors.gender && <span className="error">{formik.errors.gender}</span>}
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
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") && setShowPassword(!showPassword)
                      }
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

              {/* RIGHT PANE */}
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
                  {formik.errors.profilePicture && (
                    <span className="error">{formik.errors.profilePicture}</span>
                  )}
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
                      <span>Yes</span>
                    </label>
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="hasAsthma"
                        value="no"
                        checked={formik.values.hasAsthma === false}
                        onChange={(e) => setBool("hasAsthma", e)}
                      />
                      <span>No</span>
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
                      <span>Yes</span>
                    </label>
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="hasChronicIllnesses"
                        value="no"
                        checked={formik.values.hasChronicIllnesses === false}
                        onChange={(e) => setBool("hasChronicIllnesses", e)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {formik.errors.hasChronicIllnesses && (
                    <span className="error">{formik.errors.hasChronicIllnesses}</span>
                  )}
                </div>

                {/* Acknowledgment checkbox */}
                <div className="formRow acknowledgment-right">
                  <label className="acknowledgment">
                    <input
                      type="checkbox"
                      name="acknowledgment"
                      checked={formik.values.acknowledgment}
                      onChange={formik.handleChange}
                      id="acknowledgment"
                    />
                    <span>The above information is true</span>
                  </label>
                  {formik.errors.acknowledgment && (
                    <span className="error">{formik.errors.acknowledgment}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions row: Login + Register */}
            <div className="actions-row">
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate("/login")}
                aria-label="Go to login page"
              >
                Login
              </button>

              <button
                type="submit"
                className="submit"
                disabled={!formik.values.acknowledgment || Object.keys(formik.errors).length > 0}
              >
                Register
              </button>
            </div>
          </form>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default RegistrationForm;

