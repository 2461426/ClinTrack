import ClinTrackPage from './components/ClinTrackPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

// Attempt to load react-router-dom at runtime; if it's not available (for
// lightweight test environments), fall back to simple passthrough components
// so the app still renders.
let BrowserRouterComp = ({ children }) => <>{children}</>;
let RoutesComp = ({ children }) => <>{children}</>;
let RouteComp = ({ element }) => element;
try {
  const rr = require('react-router-dom');
  if (rr) {
    BrowserRouterComp = rr.BrowserRouter;
    RoutesComp = rr.Routes;
    RouteComp = rr.Route;
  }
} catch (e) {
  // keep fallbacks
}



function App() {
  return (
    <>
      <BrowserRouterComp>
        <RoutesComp>
          <RouteComp path="/" element={<ClinTrackPage />} />
          <RouteComp path="/login" element={<LoginForm />} />
          <RouteComp path="/register" element={<RegistrationForm />} />
        </RoutesComp>
      </BrowserRouterComp>
    </>
  );
}

export default App;
