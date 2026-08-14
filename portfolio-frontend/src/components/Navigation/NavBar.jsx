import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDownloadResume = () => {
    const resumeUrl = "/assets/Files/ZachMartimResume-2026Q3.pdf";
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "ZachMartimResume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/")}>
        <span>{`<Z/M>`}</span>
      </div>

      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <button className="nav-link" onClick={() => navigate("/landing")}>
          Home
        </button>
        <button className="nav-link" onClick={() => navigate("/projects")}>
          Projects
        </button>
        <button className="nav-link" onClick={() => navigate("/DigitalResume")}>
          Digital Resume
        </button>
        <button className="nav-link" onClick={() => navigate("/Skills")}>
          Skills
        </button>
        <button className="download-button" onClick={handleDownloadResume}>
          Resume
        </button>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? "active" : ""}`}></div>
      </div>
    </nav>
  );
};

export default NavBar;
