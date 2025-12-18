import ClinTrackPage from './components/ClinTrackPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserDashboard from './components/UserDashboard';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Contact from './components/contact';
import About from './components/About';
import { Navigate } from 'react-router-dom';


import ProtectedUserRoute from './components/Userroute';
let BrowserRouterComp = ({ children }) => <>{children}</>;
let RoutesComp = ({ children }) => <>{children}</>;
let RouteComp = ({ element }) => element;
try {
  // Use require to allow CommonJS interop at build/runtime.
  // eslint-disable-next-line global-require
  const rr = require('react-router-dom');
  const lib = rr && (rr.default ? rr.default : rr);
  if (lib) {
    BrowserRouterComp = lib.BrowserRouter || lib.HashRouter || BrowserRouterComp;
    RoutesComp = lib.Routes || RoutesComp;
    RouteComp = lib.Route || RouteComp;
  }
} catch (e) {
  // keep passthrough fallbacks
}



function App() {
  return (
   
//  <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<ClinTrackPage />} />
//         <Route path="/register" element={<RegistrationForm />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/dashboard" element={<UserDashboard/>} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/about" element={<About />} />
//       </Routes>
//     </BrowserRouter>

<BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ClinTrackPage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />


        <Route
          path="admin/dashboard"

          
        >

 
        </Route>
        {/* ✅ Dashboard is the Home page (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
          
        >

 <Route path="about" element={<About />} />
          {/* <Route path="trials" element={<UserTrials />} /> */}
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
       </BrowserRouter>


  );
}

export default App;
