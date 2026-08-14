import ReactDOMClient from "react-dom/client";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/Navigation/NavBar";
import { WindowProvider } from "./context/WindowContext";
import Boot from "./Screens/Boot/Boot";
import DigitalResume from "./Screens/DigitalResume/DigitalResume";
import Landing from "./Screens/Landing/Landing";
import PrivacyPolicy from "./Screens/Privacy Policy/PrivacyPolicy";
import Projects from "./Screens/Projects/Projects";
import Skills from "./Screens/Skills/Skills";
import "./styles/global.css";

// Wrapper component to conditionally render NavBar
const AppLayout = ({ children }) => {
  const location = useLocation();

  // Conditionally exclude NavBar on specific routes
  // These screens render their own window chrome and title-bar nav
  const excludedRoutes = [
    "/",
    "/landing",
    "/projects",
    "/DigitalResume",
    "/Skills",
  ];

  return (
    <div className="app-wrapper">
      {/* Render NavBar only if the current route is NOT in excludedRoutes */}
      {!excludedRoutes.includes(location.pathname) && <NavBar />}
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  );
};

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <WindowProvider>
      <AppLayout>
        <Routes>
          {/* Boot terminal, then straight to /landing */}
          <Route path="/" element={<Boot />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Skills" element={<Skills />} />
          <Route path="/DigitalResume" element={<DigitalResume />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          {/* Redirect any unmatched routes to "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </WindowProvider>
  </Router>
);
