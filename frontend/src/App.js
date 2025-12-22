import ClinTrackPage from './components/ClinTrackPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserDashboard from './components/UserDashboard';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Contact from './components/contact';
import About from './components/About';
import { Navigate } from 'react-router-dom';
import ProtectedUserRoute from './components/Userroute';
import AdminDashboard from './components/Admindashboard';
import AdminSchedule from './components/AdminSchedule';
import Usertrails from './components/Usertrails';
import Logout from './components/Logout';
function App() {
  return (
<BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ClinTrackPage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/admin/dashboard" element={
          <AdminDashboard />} >
          <Route path="/admin/dashboard/schedule" element={<AdminSchedule />} />
          
        </Route> */}
        {/* ✅ Dashboard is the Home page (protected) */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
          
        > */}
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="admindashboard" element={<AdminDashboard />} />
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
