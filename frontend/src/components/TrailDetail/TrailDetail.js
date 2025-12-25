// src/components/TrailDetail/TrailDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Menu from "../Menu";
import "./TrailDetail.css";

function TrailDetail() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState("");
  const [enrollmentRequest, setEnrollmentRequest] = useState(null);

  // Get current user from localStorage
  const raw = localStorage.getItem("logged_in_user");
  let currentUser = null;
  try {
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }

  useEffect(() => {
    // Reset enrollment request when trail changes
    setEnrollmentRequest(null);
    
    // Fetch trail details
    axios
      .get(`http://localhost:5000/trailDetails/${trailId}`)
      .then((response) => {
        setTrail(response.data);
        
        // Fetch enrollment request status if user is logged in
        if (currentUser && currentUser.id) {
          return axios.get(
            `http://localhost:5000/enrollmentRequests?trailId=${response.data.id}&participantId=${currentUser.id}`
          );
        }
        setLoading(false);
        return null;
      })
      .then((enrollmentResponse) => {
        if (enrollmentResponse && enrollmentResponse.data && enrollmentResponse.data.length > 0) {
          // Get the most recent enrollment request for THIS user and THIS trail
          const sortedRequests = enrollmentResponse.data.sort(
            (a, b) => new Date(b.requestDate) - new Date(a.requestDate)
          );
          setEnrollmentRequest(sortedRequests[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trail details:", error);
        setLoading(false);
      });
  }, [trailId]);

  const handleEnroll = () => {
    if (!currentUser || !currentUser.id) {
      setMessage("Please log in to enroll in this trail.");
      return;
    }

    // Check if already enrolled
    if (trail.participantsId && trail.participantsId.includes(currentUser.id)) {
      setMessage("You are already enrolled in this trail.");
      return;
    }

    setEnrolling(true);
    setMessage("");

    // Use trail.id (the actual database id) for enrollment requests
    const actualTrailId = trail.id;

    // Check if there's already a pending request
    axios
      .get(`http://localhost:5000/enrollmentRequests?trailId=${actualTrailId}&participantId=${currentUser.id}&status=pending`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setMessage("You already have a pending enrollment request for this trail.");
          setEnrolling(false);
          return;
        }

        // Create enrollment request
        const requestData = {
          trailId: actualTrailId,
          participantId: currentUser.id,
          participantName: `${currentUser.firstName} ${currentUser.lastName}`,
          participantEmail: currentUser.email,
          status: 'pending',
          requestDate: new Date().toISOString()
        };

        return axios.post('http://localhost:5000/enrollmentRequests', requestData);
      })
      .then((response) => {
        if (response) {
          setMessage("Enrollment request sent successfully! Waiting for admin approval.");
          setEnrollmentRequest(response.data);
          setEnrolling(false);
        }
      })
      .catch((error) => {
        console.error("Error sending enrollment request:", error);
        setMessage("Failed to send enrollment request. Please try again.");
        setEnrolling(false);
      });
  };

  const handleWithdraw = () => {
    if (!currentUser || !currentUser.id) {
      setMessage("Please log in to withdraw from this trail.");
      return;
    }

    // Check if not enrolled
    if (!trail.participantsId || !trail.participantsId.includes(currentUser.id)) {
      setMessage("You are not enrolled in this trail.");
      return;
    }

    if (!window.confirm("Are you sure you want to withdraw from this trail?")) {
      return;
    }

    setWithdrawing(true);
    setMessage("");

    // Remove participant from trail
    const updatedParticipantsId = trail.participantsId.filter(
      (id) => id !== currentUser.id
    );

    const updatedTrail = {
      ...trail,
      participantsId: updatedParticipantsId,
      participantsEnrolled: trail.participantsEnrolled - 1,
    };

    axios
      .put(`http://localhost:5000/trailDetails/${trailId}`, updatedTrail)
      .then((response) => {
        setTrail(response.data);
        setMessage("Successfully withdrawn from the trail.");
        setWithdrawing(false);
      })
      .catch((error) => {
        console.error("Error withdrawing from trail:", error);
        setMessage("Failed to withdraw. Please try again.");
        setWithdrawing(false);
      });
  };

  const isEnrolled =
    trail && trail.participantsId && trail.participantsId.includes(currentUser?.id);

  if (loading) {
    return (
      <div>
        <Menu />
        <div className="trail-detail-container">
          <p>Loading trail details...</p>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div>
        <Menu />
        <div className="trail-detail-container">
          <p>Trail not found.</p>
          <button onClick={() => navigate("/usertrails")} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Menu />
      <div className="trail-detail-container">
        <button onClick={() => navigate("/usertrails")} className="back-button">
          <i className="bi bi-arrow-left me-2" />
          Back to Trails
        </button>

        <div className="trail-detail-card">
          <img src={trail.image} alt={trail.title} className="trail-detail-image" />

          <div className="trail-detail-content">
            <h1 className="trail-detail-title">{trail.title}</h1>

            <div className="trail-detail-badges">
              <span className="badge badge-phase">Phase {trail.phase}</span>
              <span className="badge badge-category">
                <i className="bi bi-tag-fill me-1" />
                {trail.category}
              </span>
            </div>

            <p className="trail-detail-description">{trail.description}</p>

            <div className="trail-detail-info">
              <div className="info-item">
                <i className="bi bi-people-fill" />
                <div>
                  <strong>Participants</strong>
                  <p>
                    {trail.participantsEnrolled} / {trail.participantsRequired} enrolled
                  </p>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-graph-up" />
                <div>
                  <strong>Progress</strong>
                  <p>{trail.progress}% complete</p>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-exclamation-triangle-fill" />
                <div>
                  <strong>Adverse Events</strong>
                  <p>{trail.adverseEventsReported} reported</p>
                </div>
              </div>
            </div>

            <div className="trail-detail-phases">
              <h3>Phase Timeline</h3>
              <div className="phases-grid">
                {trail.phaseDates && Object.entries(trail.phaseDates).map(([phase, date]) => (
                  <div key={phase} className="phase-item">
                    <strong>Phase {phase}</strong>
                    <span>{date || "TBD"}</span>
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes("Success") || message.includes("withdrawn") ? "success" : "error"}`}>
                {message}
              </div>
            )}

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
            ) : enrollmentRequest && enrollmentRequest.status === 'pending' && enrollmentRequest.participantId === currentUser?.id ? (
              <button
                disabled
                className="enroll-button requested"
              >
                <i className="bi bi-clock-history me-2" />
                Requested
              </button>
            ) : enrollmentRequest && enrollmentRequest.status === 'approved' && enrollmentRequest.participantId === currentUser?.id ? (
              <button
                disabled
                className="enroll-button approved"
              >
                <i className="bi bi-check-circle me-2" />
                Approved
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

export default TrailDetail;
