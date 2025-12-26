import ClinTrackPage from './components/ClinTrackPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserDashboard from './components/UserDashboard';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Contact from './components/contact';
import About from './components/About';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './components/Admindashboard';
import Usertrails from './components/UserTrails/UserTrails';
import Logout from './components/Logout';
import AdminSchedule from './components/AdminSchedule';
import ListedTrails from './components/ListedTrails/ListedTrails';
import TrailDashboard from './components/TrailDashboard/TrailDashboard';
import TrailDetail from './components/TrailDetail/TrailDetail';
import ListOfParticipants from './components/ListOfParticipants/ListOfParticipants';
import Home from './components/Home/Home';
import PharmaProfile from './components/PharmaProfile/PharmaProfile';
function App() {
  return (
<BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path='pharmaprofile' element={<PharmaProfile/>}/>
        <Route path="home" element={<Home />} />
        <Route path="admindashboard" element={<AdminDashboard />} />
        <Route path='adminschedule' element={<AdminSchedule/>}/>
        <Route path="/listedtrails" element={<ListedTrails />} />
        <Route path="/TrailDashboard/:trailId" element={<TrailDashboard />} />
        <Route path="/traildetail/:trailId" element={<TrailDetail />} />
        <Route path="/ListOfParticipants/:trailId" element={<ListOfParticipants />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path='trails' element={<Usertrails/>}/>
          <Route path="logout" element={<Logout />} />
       
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
       </BrowserRouter>


  );
}

export default App;
