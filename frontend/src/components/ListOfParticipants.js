
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ListOfParticipants.css';
import TrailNavBar from './TrailNavBar';
import participantService from '../services/ParticipantService';

/** Enum → Label maps for friendly display */
const OBESITY_MAP = {
  NORMAL: 'Normal weight',
  OVERWEIGHT: 'Overweight',
  OBESITY_CLASS_1: 'Obesity class 1',
  OBESITY_CLASS_2: 'Obesity class 2',
  OBESITY_CLASS_3: 'Obesity class 3',
};
const BP_MAP = {
  NORMAL: 'Normal (<120 and <80)',
  ELEVATED: 'Elevated (120–129 and <80)',
  STAGE_1: 'Stage 1 (130–139 or 80–89)',
  STAGE_2: 'Stage 2 (≥140 or ≥90)',
  CRISIS: 'Hypertensive Crisis (≥180 and/or ≥120)',
  UNKNOWN: 'Unknown / Not measured',
};
const DIABETES_MAP = {
  NONE: 'No diabetes',
  PREDIABETES: 'Prediabetes',
  TYPE_1: 'Type 1 diabetes',
  TYPE_2: 'Type 2 diabetes',
  GESTATIONAL: 'Gestational diabetes',
  UNKNOWN: 'Unknown / Not sure',
};

/** Helpers */
const dash = '—';
const toYesNo = (val) => (val === true ? 'Yes' : val === false ? 'No' : dash);
const calcAge = (dateStr) => {
  if (!dateStr) return dash;
  const dob = new Date(dateStr);
  if (Number.isNaN(dob.getTime())) return dash;
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return isFinite(age) ? age : dash;
};
// For numeric check
const calcAgeNumber = (dateStr) => {
  const a = calcAge(dateStr);
  return typeof a === 'number' ? a : null;
};

function ListOfParticipants() {
  const { trailId } = useParams();
  const navigate = useNavigate();

  const [trail, setTrail] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [requests, setRequests] = useState([]); // all requests (approved/pending/rejected) for this trail
  const [loading, setLoading] = useState(true);

  const handleNavigation = (page) => {
    if (page === 'dashboard') {
      navigate(`/TrailDashboard/${trailId}`);
    } else if (page === 'participants') {
      return; // already here
    } else if (page === 'events') {
      navigate(`/updateevents/${trailId}`);
    } else if (page === 'report') {
      navigate(`/generatereport/${trailId}`);
    }
  };

  const fetchData = () => {
    setLoading(true);

    // Try fetching trail by direct id, fallback to query by trailId
    axios
      .get(`http://localhost:5000/trailDetails/${trailId}`)
      .then((res) => {
        const trailData = res.data;
        setTrail(trailData);
        const actualTrailId = trailData?.id ?? trailId;
        return Promise.all([
          participantService.getAllParticipants(), // sanitized (no password fields)
          axios.get(`http://localhost:5000/enrollmentRequests?trailId=${actualTrailId}`), // all statuses
        ]).then(([participantsRes, reqRes]) => ({ trailData, participantsRes, reqRes }));
      })
      .catch(() => {
        return axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`).then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          if (data.length === 0) throw new Error('Trail not found');
          const trailData = data[0];
          setTrail(trailData);
          const actualTrailId = trailData.id;
          return Promise.all([
            participantService.getAllParticipants(),
            axios.get(`http://localhost:5000/enrollmentRequests?trailId=${actualTrailId}`),
          ]).then(([participantsRes, reqRes]) => ({ trailData, participantsRes, reqRes }));
        });
      })
      .then(({ trailData, participantsRes, reqRes }) => {
        setParticipants(Array.isArray(participantsRes) ? participantsRes : []);
        setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setTrail(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (trailId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trailId]);

  /** Build participant status per THIS trail:
   * - approved: in trail.participantsId OR has an approved request
   * - pending: has a pending request
   * - rejected: has a rejected request
   * Precedence: approved > pending > rejected
   */
  const statusMap = useMemo(() => {
    const map = new Map();

    // Approved by enrollment list
    (trail?.participantsId || []).forEach((pid) => {
      map.set(pid, 'approved');
    });

    // Apply by request statuses
    requests.forEach((req) => {
      const pid = req.participantId;
      const current = map.get(pid);
      if (req.status === 'approved') {
        map.set(pid, 'approved');
      } else if (req.status === 'pending') {
        if (current !== 'approved') map.set(pid, 'pending');
      } else if (req.status === 'rejected') {
        if (current !== 'approved' && current !== 'pending') map.set(pid, 'rejected');
      }
    });

    return map;
  }, [requests, trail]);

  /** Filter participants to ONLY those relevant to this trail */
  const participantsForTrail = useMemo(() => {
    const relevantIds = new Set([
      ...(trail?.participantsId || []),
      ...requests.map((r) => r.participantId),
    ]);
    return participants.filter((p) => relevantIds.has(p.id));
  }, [participants, requests, trail]);

  /** Split into tables by status */
  const approvedParticipants = useMemo(
    () => participantsForTrail.filter((p) => statusMap.get(p.id) === 'approved'),
    [participantsForTrail, statusMap]
  );
  const pendingParticipants = useMemo(
    () => participantsForTrail.filter((p) => statusMap.get(p.id) === 'pending'),
    [participantsForTrail, statusMap]
  );
  const rejectedParticipants = useMemo(
    () => participantsForTrail.filter((p) => statusMap.get(p.id) === 'rejected'),
    [participantsForTrail, statusMap]
  );

  /** Eligibility evaluation against trail criteria */
  const meetsEligibility = (p) => {
    if (!trail) return { eligible: false, reasons: ['Trail not loaded'] };

    const reasons = [];

    // Gender
    const reqGender = (trail.gender || 'ANY').toUpperCase();
    const pGender = (p.gender || '').toUpperCase();
    if (reqGender !== 'ANY' && pGender && pGender !== reqGender) {
      reasons.push(`Gender must be ${reqGender}`);
    }

    // Min Age
    const ageNum = calcAgeNumber(p.dateOfBirth);
    if (typeof trail.minAge === 'number' && trail.minAge > 0) {
      if (ageNum == null || ageNum < trail.minAge) {
        reasons.push(`Minimum age is ${trail.minAge}`);
      }
    }

    // Obesity Category
    if (trail.obesityCategory && p.obesityCategory !== trail.obesityCategory) {
      reasons.push(`Obesity must be ${OBESITY_MAP[trail.obesityCategory] || trail.obesityCategory}`);
    }

    // BP Category
    if (trail.bpCategory && p.bpCategory !== trail.bpCategory) {
      reasons.push(`BP must be ${BP_MAP[trail.bpCategory] || trail.bpCategory}`);
    }

    // Diabetes Status
    if (trail.diabetesStatus && p.diabetesStatus !== trail.diabetesStatus) {
      reasons.push(`Diabetes status must be ${DIABETES_MAP[trail.diabetesStatus] || trail.diabetesStatus}`);
    }

    // Asthma requirement (if explicitly set to true/false)
    if (typeof trail.hasAsthma === 'boolean') {
      if (p.hasAsthma !== trail.hasAsthma) {
        reasons.push(`Asthma: ${trail.hasAsthma ? 'Required (Yes)' : 'Must be No'}`);
      }
    }

    // Chronic illnesses requirement (if explicitly set to true/false)
    if (typeof trail.hasChronicIllnesses === 'boolean') {
      if (p.hasChronicIllnesses !== trail.hasChronicIllnesses) {
        reasons.push(`Chronic illnesses: ${trail.hasChronicIllnesses ? 'Required (Yes)' : 'Must be No'}`);
      }
    }

    return { eligible: reasons.length === 0, reasons };
  };

  /** Get the pending request id for Approve/Reject actions */
  const getPendingRequestIdForParticipant = (participantId) => {
    const req = requests.find((r) => r.participantId === participantId && r.status === 'pending');
    return req?.id;
  };

  /** Actions */
  const handleApprove = (requestId, participantId) => {
    if (!trail?.id) {
      alert('Trail not ready. Please try again.');
      return;
    }
    const actualTrailId = trail.id;

    axios
      .get(`http://localhost:5000/trailDetails/${actualTrailId}`)
      .then((response) => {
        const currentTrail = response.data;
        const alreadyEnrolled =
          Array.isArray(currentTrail.participantsId) && currentTrail.participantsId.includes(participantId);

        // Check if participant capacity is reached
        const participantsRequired = currentTrail.participantsRequired || 0;
        const participantsEnrolled = currentTrail.participantsEnrolled || 0;

        if (!alreadyEnrolled && participantsEnrolled >= participantsRequired) {
          alert(`Cannot approve more participants. The trial has reached its capacity (${participantsRequired}/${participantsRequired} participants enrolled).`);
          return Promise.reject(new Error('Capacity reached'));
        }

        const updatedParticipantsId = alreadyEnrolled
          ? currentTrail.participantsId
          : currentTrail.participantsId
          ? [...currentTrail.participantsId, participantId]
          : [participantId];

        const updatedTrail = {
          ...currentTrail,
          participantsId: updatedParticipantsId,
          participantsEnrolled: alreadyEnrolled
            ? currentTrail.participantsEnrolled
            : currentTrail.participantsEnrolled + 1,
        };

        return axios.put(`http://localhost:5000/trailDetails/${actualTrailId}`, updatedTrail);
      })
      .then(() => axios.patch(`http://localhost:5000/enrollmentRequests/${requestId}`, { status: 'approved' }))
      .then(() => {
        alert('Request approved successfully!');
        fetchData();
      })
      .catch((error) => {
        if (error.message !== 'Capacity reached') {
          console.error('Error approving request:', error);
          alert('Failed to approve request. Please try again.');
        }
      });
  };

  const handleReject = (requestId) => {
    axios
      .patch(`http://localhost:5000/enrollmentRequests/${requestId}`, { status: 'rejected' })
      .then(() => {
        alert('Request rejected.');
        fetchData();
      })
      .catch((error) => {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request. Please try again.');
      });
  };

  if (loading) {
    return (
      <div className="participants-page">
        <p>Loading participants...</p>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="participants-page">
        <p>Trail not found.</p>
        <button onClick={() => navigate('/listedtrails')}>Back to Trails</button>
      </div>
    );
  }

  /** Friendly getters for panel */
  const friendlyGender = (g) => (!g || g === 'ANY' ? 'Any' : g);
  const friendlyObesity = (o) => (o ? OBESITY_MAP[o] || o : 'Any');
  const friendlyBp = (b) => (b ? BP_MAP[b] || b : 'Any');
  const friendlyDiabetes = (d) => (d ? DIABETES_MAP[d] || d : 'Any');
  const friendlyBool = (v) => (typeof v === 'boolean' ? (v ? 'Yes' : 'No') : 'Any');

  return (
    <div className="participants-layout">
      <TrailNavBar trailId={trailId} onNavigate={handleNavigation} trailInfo={trail} />

      <div className="participants-with-navbar">
        <div className="participants-page">
          {/* Header */}
          <div className="participants-header">
            <div className="participants-header__text">
              <h1 className="participants-header__subtitle">{trail.title}</h1>
              <h1 className="participants-header__title">Enrollment Management</h1>
            </div>
            <div className="participants-header__count">
              <p className="participants-header__count-label">Approved</p>
              <h1 className="participants-header__count-number">{approvedParticipants.length}</h1>
            </div>
          </div>

          {/* 🔎 Eligibility Criteria Panel */}
          <div className="eligibility-panel">
            <div className="eligibility-panel__title">Eligibility Criteria (Admin Reference)</div>
            <ul className="criteria-list">
              <li><strong>Gender:</strong> {friendlyGender(trail.gender)}</li>
              <li><strong>Minimum Age:</strong> {typeof trail.minAge === 'number' ? trail.minAge : 'Any'}</li>
              <li><strong>Obesity:</strong> {friendlyObesity(trail.obesityCategory)}</li>
              <li><strong>Blood Pressure:</strong> {friendlyBp(trail.bpCategory)}</li>
              <li><strong>Diabetes:</strong> {friendlyDiabetes(trail.diabetesStatus)}</li>
              <li><strong>Asthma Required:</strong> {friendlyBool(trail.hasAsthma)}</li>
              <li><strong>Chronic Illnesses Allowed:</strong> {friendlyBool(trail.hasChronicIllnesses)}</li>
            </ul>
            <p className="criteria-hint">
              Review participant eligibility before approving or rejecting requests.
            </p>
          </div>

          {/* Approved Table */}
          <h2 className="section-title">Approved Participants ({approvedParticipants.length})</h2>
          {approvedParticipants.length === 0 ? (
            <div className="empty-state"><p>No approved participants yet.</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Obesity Classification</th>
                    <th>BP Category</th>
                    <th>Diabetes Status</th>
                    <th>Asthma</th>
                    <th>Chronic Illnesses</th>
                    <th>Eligibility</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedParticipants.map((p) => {
                    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || dash;
                    const avatar = p.profilePicture || 'https://via.placeholder.com/64';
                    const { eligible, reasons } = meetsEligibility(p);

                    return (
                      <tr key={p.id}>
                        <td><img src={avatar} alt={fullName} className="participants-table__avatar" /></td>
                        <td>{fullName}</td>
                        <td>{p.email || dash}</td>
                        <td>{p.mobile || dash}</td>
                        <td>{calcAge(p.dateOfBirth)}</td>
                        <td>{p.gender || dash}</td>
                        <td>{OBESITY_MAP[p.obesityCategory] || dash}</td>
                        <td>{BP_MAP[p.bpCategory] || dash}</td>
                        <td>{DIABETES_MAP[p.diabetesStatus] || dash}</td>
                        <td>{toYesNo(p.hasAsthma)}</td>
                        <td>{toYesNo(p.hasChronicIllnesses)}</td>
                        <td>
                          <span className={`eligibility-badge ${eligible ? 'eligibility-badge--pass' : 'eligibility-badge--fail'}`}>
                            {eligible ? 'Eligible' : 'Not eligible'}
                          </span>
                          {!eligible && reasons.length > 0 && (
                            <div className="eligibility-reasons" title={reasons.join('; ')}>
                              {reasons.join('; ')}
                            </div>
                          )}
                        </td>
                        <td><span className="badge badge--approved">Approved</span></td>
                        <td><span className="muted">—</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending Table */}
          <h2 className="section-title">Pending Participants ({pendingParticipants.length})</h2>
          {pendingParticipants.length === 0 ? (
            <div className="empty-state"><p>No pending requests right now.</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Obesity Classification</th>
                    <th>BP Category</th>
                    <th>Diabetes Status</th>
                    <th>Asthma</th>
                    <th>Chronic Illnesses</th>
                    <th>Eligibility</th>
                    <th>Status</th>
                    <th style={{ width: '220px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingParticipants.map((p) => {
                    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || dash;
                    const avatar = p.profilePicture || 'https://via.placeholder.com/64';
                    const pendingReqId = getPendingRequestIdForParticipant(p.id);
                    const { eligible, reasons } = meetsEligibility(p);

                    return (
                      <tr key={p.id}>
                        <td><img src={avatar} alt={fullName} className="participants-table__avatar" /></td>
                        <td>{fullName}</td>
                        <td>{p.email || dash}</td>
                        <td>{p.mobile || dash}</td>
                        <td>{calcAge(p.dateOfBirth)}</td>
                        <td>{p.gender || dash}</td>
                        <td>{OBESITY_MAP[p.obesityCategory] || dash}</td>
                        <td>{BP_MAP[p.bpCategory] || dash}</td>
                        <td>{DIABETES_MAP[p.diabetesStatus] || dash}</td>
                        <td>{toYesNo(p.hasAsthma)}</td>
                        <td>{toYesNo(p.hasChronicIllnesses)}</td>
                        <td>
                          <span className={`eligibility-badge ${eligible ? 'eligibility-badge--pass' : 'eligibility-badge--fail'}`}>
                            {eligible ? 'Eligible' : 'Not eligible'}
                          </span>
                          {!eligible && reasons.length > 0 && (
                            <div className="eligibility-reasons" title={reasons.join('; ')}>
                              {reasons.join('; ')}
                            </div>
                          )}
                        </td>
                        <td><span className="badge badge--pending">Pending</span></td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn--approve"
                              onClick={() => handleApprove(pendingReqId, p.id)}
                              disabled={!pendingReqId}
                              title={pendingReqId ? 'Approve request' : 'No pending request found'}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn--reject"
                              onClick={() => handleReject(pendingReqId)}
                              disabled={!pendingReqId}
                              title={pendingReqId ? 'Reject request' : 'No pending request found'}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Rejected Table */}
          <h2 className="section-title">Rejected Participants ({rejectedParticipants.length})</h2>
          {rejectedParticipants.length === 0 ? (
            <div className="empty-state"><p>No rejected requests.</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="participants-table">
                <thead>
                  <tr>
                   
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Obesity Classification</th>
                    <th>BP Category</th>
                    <th>Diabetes Status</th>
                    <th>Asthma</th>
                    <th>Chronic Illnesses</th>
                    <th>Eligibility</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedParticipants.map((p) => {
                    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || dash;
                    const avatar = p.profilePicture || 'https://via.placeholder.com/64';
                    const { eligible, reasons } = meetsEligibility(p);

                    return (
                      <tr key={p.id}>
                        <td>{fullName}</td>
                        <td>{p.email || dash}</td>
                        <td>{p.mobile || dash}</td>
                        <td>{calcAge(p.dateOfBirth)}</td>
                        <td>{p.gender || dash}</td>
                        <td>{OBESITY_MAP[p.obesityCategory] || dash}</td>
                        <td>{BP_MAP[p.bpCategory] || dash}</td>
                        <td>{DIABETES_MAP[p.diabetesStatus] || dash}</td>
                        <td>{toYesNo(p.hasAsthma)}</td>
                        <td>{toYesNo(p.hasChronicIllnesses)}</td>
                        <td>
                          <span className={`eligibility-badge ${eligible ? 'eligibility-badge--pass' : 'eligibility-badge--fail'}`}>
                            {eligible ? 'Eligible' : 'Not eligible'}
                          </span>
                          {!eligible && reasons.length > 0 && (
                            <div className="eligibility-reasons" title={reasons.join('; ')}>
                              {reasons.join('; ')}
                            </div>
                          )}
                        </td>
                        <td><span className="badge badge--rejected">Rejected</span></td>
                        <td><span className="muted">No actions</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListOfParticipants;
