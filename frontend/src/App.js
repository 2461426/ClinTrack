import ClinTrackPage from './components/ClinTrackPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserDashboard from './components/UserDashboard';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Contact from './components/contact';
import About from './components/About';

// Attempt to load react-router-dom at runtime; if it's not available (for
// lightweight test environments), fall back to simple passthrough components
// so the app still renders.
// Robustly load router components (support both ESM and CommonJS package shapes).
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
   
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClinTrackPage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<UserDashboard/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
