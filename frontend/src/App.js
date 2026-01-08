import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Contact from './components/contact';
import About from './components/About';
import { Navigate } from 'react-router-dom';
import Usertrails from './components/UserTrails';
import Logout from './components/Logout';
import ListedTrails from './components/ListedTrails';
import TrailDashboard from './components/TrailDashboard';
import TrailDetail from './components/TrailDetail';
import ListOfParticipants from './components/ListOfParticipants';
import Home from './components/Home';
import PharmaProfile from './components/PharmaProfile';
import ParticipantProfile from './components/ParticipantProfile';
import UpdateEvents from './components/UpdateEvents';
import GenerateReport from './components/GenerateReport';
function App() {
  return (
<BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='pharmaprofile' element={<PharmaProfile/>}/>
        <Route path='profile' element={<ParticipantProfile/>}/>
        <Route path="home" element={<Home />} />
        <Route path="/listedtrails" element={<ListedTrails />} />
        <Route path="/TrailDashboard/:trailId" element={<TrailDashboard />} />
        <Route path="/traildetail/:trailId" element={<TrailDetail />} />
        <Route path="/ListOfParticipants/:trailId" element={<ListOfParticipants />} />
        <Route path="/updateevents/:trailId" element={<UpdateEvents />} />
        <Route path="about" element={<About />} />
        <Route path='/generatereport/:trailId' element={<GenerateReport/>}/>
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
