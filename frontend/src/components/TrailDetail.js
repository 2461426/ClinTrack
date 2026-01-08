
// src/components/TrailDetail/TrailDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TrailDetail.css";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ParticipantNavbar from "./ParticipantNavbar";
import utilityService from "../services/UtilityService";
import Footer from "./Footer";

function TrailDetail() {
  const { trailId } = useParams();
  const navigate = useNavigate();

  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [enrollmentRequest, setEnrollmentRequest] = useState(null);
  const [allEnrollmentRequests, setAllEnrollmentRequests] = useState([]);

  // Get current user from localStorage
  const raw = localStorage.getItem("logged_in_user");
  let currentUser = null;
  try {
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }

  useEffect(() => {
    // Reset state when trail changes
    setEnrollmentRequest(null);
    setAllEnrollmentRequests([]);

    // Fetch trail details
    axios
      .get(`http://localhost:5000/trailDetails/${trailId}`)
      .then((response) => {
        const fetchedTrail = response.data;
        setTrail(fetchedTrail);

        // Fetch ALL enrollment requests for this user
        if (currentUser && currentUser.id) {
          return axios
            .get(
              `http://localhost:5000/enrollmentRequests?participantId=${currentUser.id}`
            )
            .then((enrollmentResponse) => ({
              trail: fetchedTrail,
              enrollments: enrollmentResponse.data,
            }));
        }
        setLoading(false);
        return null;
      })
      .then((result) => {
        if (result && result.enrollments) {
          setAllEnrollmentRequests(result.enrollments);

          // Find enrollment request for THIS specific trail
          // Using loose equality (==) to handle string/number mismatches
          const thisTrailRequest = result.enrollments.find(
            (req) =>
              req.trailId == result.trail.id &&
              req.participantId == currentUser?.id
          );
          if (thisTrailRequest) {
            setEnrollmentRequest(thisTrailRequest);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trail details:", error);
        toast.error("Unable to load trail details. Please try again later.");
        setLoading(false);
      });
  }, [trailId]);

  const handleEnroll = () => {
    if (!currentUser || !currentUser.id) {
      toast.info("Please log in to enroll in this trail.");
      return;
    }

    // Check if user has any enrollment (pending or approved) in ANY trail
    const hasAnyEnrollment = allEnrollmentRequests.some(
      (req) =>
        req.participantId == currentUser.id &&
        (req.status === "pending" || req.status === "approved")
    );

    if (hasAnyEnrollment) {
      // Check if it's this trail
      const thisTrailEnrollment = allEnrollmentRequests.find(
        (req) =>
          req.trailId == trail.id &&
          req.participantId == currentUser.id &&
          (req.status === "pending" || req.status === "approved")
      );

      if (thisTrailEnrollment) {
        toast.info("You are already enrolled in this trail.");
      } else {
        toast.warn(
          "You can only enroll for one trail at a time. Please withdraw from your current trail before enrolling in another."
        );
      }
      return;
    }

    setEnrolling(true);
    setMessage("");

    const actualTrailId = trail.id;

    // Create enrollment request
    const requestData = {
      trailId: actualTrailId,
      participantId: currentUser.id,
      participantName: `${currentUser.firstName} ${currentUser.lastName}`,
      participantEmail: currentUser.email,
      status: "pending",
      requestDate: new Date().toISOString(),
    };

    axios
      .post("http://localhost:5000/enrollmentRequests", requestData)
      .then((response) => {
        setEnrollmentRequest(response.data);
        setAllEnrollmentRequests((prev) => [...prev, response.data]);
        toast.success(
          "Enrollment request submitted successfully! Awaiting admin approval."
        );
        setEnrolling(false);
      })
      .catch((error) => {
        console.error("Error sending enrollment request:", error);
        toast.error("Enrollment failed. Please try again.");
        setEnrolling(false);
      });
  };

  const handleWithdraw = () => {
    if (!currentUser || !currentUser.id) {
      toast.info("Please log in to withdraw from this trail.");
      return;
    }

    if (!enrollmentRequest) {
      toast.error("You are not enrolled in this trail.");
      return;
    }

    if (!window.confirm("Are you sure you want to withdraw from this trail?")) {
      return;
    }

    setWithdrawing(true);
    setMessage("");

    // Delete the enrollment request
    axios
      .delete(
        `http://localhost:5000/enrollmentRequests/${enrollmentRequest.id}`
      )
      .then(() => {
        // Refresh enrollment requests
        return axios.get(
          `http://localhost:5000/enrollmentRequests?participantId=${currentUser.id}`
        );
      })
      .then((response) => {
        setEnrollmentRequest(null);
        setAllEnrollmentRequests(response.data || []);
        toast.success("You have successfully withdrawn from the trail.");
        setWithdrawing(false);
      })
      .catch((error) => {
        console.error("Error withdrawing from trail:", error);
        toast.error("Failed to withdraw. Please try again.");
        setWithdrawing(false);
      });
  };

  const isEnrolled =
    enrollmentRequest &&
    (enrollmentRequest.status === "pending" ||
      enrollmentRequest.status === "approved");

  // 👉 Single status string for the “Registered Trials” display
  const registeredStatus = (() => {
    if (!enrollmentRequest) return null;
    const s = enrollmentRequest.status;
    if (s === "pending") return "pending";
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    return null;
  })();

  // Calculate progress based on phase dates
  const calculatedProgress = trail?.phaseDates
    ? utilityService.calculateTrailProgress(trail.phaseDates)
    : 0;

  if (loading) {
    return (
      <div>
        <ParticipantNavbar />
        <div className="trail-detail-container">
          <p>Loading trail details...</p>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div>
        <ParticipantNavbar />
        <div className="trail-detail-container">
          <p>Trail not found.</p>
          <button onClick={() => navigate("/trails")} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ParticipantNavbar />
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
      />
      <div className="trail-detail-container">
        <button onClick={() => navigate("/trails")} className="back-button">
          <i className="bi bi-arrow-left me-2" />
          Back to Trails
        </button>

        <div className="trail-detail-card">
          <img
            src={trail.image}
            alt={trail.title}
            className="trail-detail-image"
          />

          <div className="trail-detail-content">
            <h1 className="trail-detail-title">{trail.title}</h1>

            <div className="trail-detail-badges">
              <span className="badge badge-phase">Phase {trail.phase}</span>
              <span className="badge badge-category">
                <i className="bi bi-tag-fill me-1" />
                {trail.category}
              </span>

              {/* Status pills under title */}
              {registeredStatus === "approved" && (
                <span className="badge badge-approved">Approved</span>
              )}
              {registeredStatus === "pending" && (
                <span className="badge badge-pending">Pending</span>
              )}
              {registeredStatus === "rejected" && (
                <span className="badge badge-rejected">Rejected</span>
              )}
            </div>

            <p className="trail-detail-description">{trail.description}</p>

            {/* Info Grid (includes Registered Trials status) */}
            <div className="trail-detail-info">
              <div className="info-item">
                <i className="bi bi-people-fill" />
                <div>
                  <strong>Participants</strong>
                  <p>
                    {trail.participantsEnrolled} / {trail.participantsRequired}{" "}
                    enrolled
                  </p>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-graph-up" />
                <div>
                  <strong>Progress</strong>
                  <p>{calculatedProgress}% complete</p>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-exclamation-triangle-fill" />
                <div>
                  <strong>Adverse Events</strong>
                  <p>{trail.adverseEventsReported} reported</p>
                </div>
              </div>

              {/* ✅ Registered Trials Status */}
              <div className="info-item">
                <i className="bi bi-person-badge-fill" />
                <div>
                  <strong>Registered Status</strong>
                  <p>
                    {registeredStatus === "approved" && (
                      <span className="status-pill status-pill--approved">
                        Approved
                      </span>
                    )}
                    {registeredStatus === "pending" && (
                      <span className="status-pill status-pill--pending">
                        Pending
                      </span>
                    )}
                    {registeredStatus === "rejected" && (
                      <span className="status-pill status-pill--rejected">
                        Rejected
                      </span>
                    )}
                    {!registeredStatus && <span>Not registered</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="trail-detail-phases">
              <h3>Phase Timeline</h3>
              <div className="phases-grid">
                {trail.phaseDates &&
                  Object.entries(trail.phaseDates).map(([phase, date]) => (
                    <div key={phase} className="phase-item">
                      <strong>Phase {phase}</strong>
                      <span>{date || "TBD"}</span>
                    </div>
                  ))}
              </div>
            </div>

            {message && (
              <div
                className={`message ${
                  message.includes("Success") || message.includes("withdrawn")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

            {/* CTA section */}
            {isEnrolled ? (
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="withdraw-button"
              >
                {withdrawing ? (
                  "Withdrawing..."
                ) : (
                  <>
                    <i className="bi bi-x-circle me-2" />
                    Withdraw from Trail
                  </>
                )}
              </button>
            ) : enrollmentRequest &&
              enrollmentRequest.status === "pending" &&
              enrollmentRequest.participantId === currentUser?.id ? (
              <button disabled className="enroll-button requested">
                <i className="bi bi-clock-history me-2" />
                Requested
              </button>
            ) : enrollmentRequest &&
              enrollmentRequest.status === "approved" &&
              enrollmentRequest.participantId === currentUser?.id ? (
              <button disabled className="enroll-button approved">
                <i className="bi bi-check-circle me-2" />
                Approved
              </button>
            ) : enrollmentRequest &&
              enrollmentRequest.status === "rejected" &&
              enrollmentRequest.participantId === currentUser?.id ? (
              <button disabled className="enroll-button rejected">
                <i className="bi bi-x-octagon me-2" />
                Rejected
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="enroll-button"
              >
                {enrolling ? (
                  "Enrolling..."
                ) : (
                  <>
                    <i className="bi bi-clipboard-check me-2" />
                    Enroll in Trail
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TrailDetail;
