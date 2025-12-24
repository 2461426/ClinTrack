
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import participantService from "../services/ParticipantService";
import "../styles/Admindashboard.css";
import "../styles/UserDashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Menu from "./Menu";

const columns = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "dateOfBirth", label: "DOB" },
  { key: "trialType", label: "Trial Type" },
  { key: "obesityCategory", label: "Obesity" },
  { key: "bpCategory", label: "BP" },
  { key: "diabetesStatus", label: "Diabetes" },
  { key: "hasAsthma", label: "Asthma" },
  { key: "hasChronicIllnesses", label: "Chronic Illnesses" },
  { key: "acknowledgment", label: "Acknowledged" }
];

const ROLE_ADMIN = "ADMIN";

function AdminParticipants() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("trialType");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const raw = localStorage.getItem("logged_in_user");
  const currentUser = raw ? JSON.parse(raw) : null;
  const isAdmin = currentUser?.role === ROLE_ADMIN;

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    setErr("");
    participantService.getAllParticipants()
      .then((participants) => {
        const usersOnly = (participants || []).filter((p) => p.role !== "ADMIN");
        setData(usersOnly);
      })
      .catch(() => setErr("Unable to load participants."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((p) => {
      const cannon = [
        p.id, p.firstName, p.lastName, p.email, p.mobile, p.trialType
      ]
        .filter(Boolean)
        .map(String)
        .map((s) => s.toLowerCase());
      return cannon.some((s) => s.includes(term));
    });
  }, [data, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = (a[sortBy] ?? "").toString().toLowerCase();
      const vb = (b[sortBy] ?? "").toString().toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  if (!isAdmin) {
    return (
      <div className="admin-wrap">
        <div className="card">
          <h3>Admin Access Required</h3>
          <p className="text-muted">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      {/* Navbar */}
     <Menu/>

      {/* Page Header */}
      <div className="header-row" style={{ marginTop: 12 }}>
        <h2 className="page-title"><i className="bi bi-people-fill me-2" />Participants</h2>
        <div className="actions-inline">
          <input
            type="text"
            placeholder="Search participants…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
            <option value="trialType">Sort by Trial Type</option>
          </select>
          <button className="btn" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>
            <i className={`bi ${sortDir === "asc" ? "bi-sort-alpha-down" : "bi-sort-alpha-up"} me-1`} />
            {sortDir.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card"><p>Loading participants…</p></div>
      ) : err ? (
        <div className="card"><p className="error">{err}</p></div>
      ) : (
        <>
          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} onClick={() => toggleSort(col.key)}>
                      {col.label}
                      {sortBy === col.key && (
                        <i className={`bi ms-1 ${sortDir === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill"}`} />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPageRows.length === 0 ? (
                  <tr><td colSpan={columns.length} className="text-muted">No participants found.</td></tr>
                ) : currentPageRows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.firstName}</td>
                    <td>{p.lastName}</td>
                    <td>{p.email}</td>
                    <td>{p.mobile}</td>
                    <td>{p.dateOfBirth}</td>
                    <td>{p.trialType}</td>
                    <td>{p.obesityCategory}</td>
                    <td>{p.bpCategory}</td>
                    <td>{p.diabetesStatus}</td>
                    <td>{String(p.hasAsthma)}</td>
                    <td>{String(p.hasChronicIllnesses)}</td>
                    <td>{String(p.acknowledgment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pager">
            <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <i className="bi bi-chevron-left" /> Prev
            </button>
            <span className="text-muted">Page {page} of {totalPages}</span>
            <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next <i className="bi bi-chevron-right" />
            </button>
          </div>
        </>
      )}
      <Outlet />
    </div>
    
  );
}

export default AdminParticipants;



