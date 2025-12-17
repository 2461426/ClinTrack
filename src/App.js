import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ParticipantNavbar from './components/ParticipantNavbar';
import Home from './pages/Home';
import ParticipantListOfTrails from './pages/ParticipantListOfTrails';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import LoginAs from './pages/LoginAs';
import PharmaLogin from './pages/PharmaLogin';
import ListedTrails from './pages/pharma/ListedTrails';
import TrailDashboard from './pages/pharma/TrailDashboard';
import ListOfParticipants from './pages/pharma/ListOfParticipants';

function App() {
  const [pharmaUser, setPharmaUser] = useState(() => {
    const stored = localStorage.getItem('pharmaUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (pharmaUser) {
      localStorage.setItem('pharmaUser', JSON.stringify(pharmaUser));
    } else {
      localStorage.removeItem('pharmaUser');
    }
  }, [pharmaUser]);

  const handlePharmaLogin = (user) => setPharmaUser(user);
  const handlePharmaLogout = () => setPharmaUser(null);
  const contentSpacing = pharmaUser ? '' : 'pt-16';

  return (
    <Router>
      {!pharmaUser && <ParticipantNavbar />}
      <div className={contentSpacing}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Trails" element={<ParticipantListOfTrails />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/LoginAs" element={<LoginAs />} />
          <Route path="/ListOfParticipants" element={<ListOfParticipants />} />
          <Route
            path="/PharmaLogin"
            element={
              pharmaUser ? <Navigate to="/ListedTrails" replace /> : <PharmaLogin onLogin={handlePharmaLogin} />
            }
          />
          <Route
            path="/ListedTrails"
            element={
              pharmaUser ? <ListedTrails pharma={pharmaUser} onLogout={handlePharmaLogout} /> : <Navigate to="/PharmaLogin" replace />
            }
          />
          <Route
            path="/TrailDashboard/:trailId"
            element={
              pharmaUser ? <TrailDashboard /> : <Navigate to="/PharmaLogin" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
