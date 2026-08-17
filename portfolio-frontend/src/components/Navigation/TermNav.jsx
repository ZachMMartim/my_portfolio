import { useNavigate } from "react-router-dom";
import "./TermNav.css";

const LINKS = [
  { id: "home", label: "home", to: "/landing" },
  { id: "projects", label: "projects", to: "/projects" },
  { id: "resume", label: "resume", to: "/DigitalResume" },
  { id: "skills", label: "skills", to: "/Skills" },
];

// Window-header nav, shared by every terminal screen. `active` is the id of the
// screen rendering it; omit it on screens that are not nav destinations.
const TermNav = ({ active }) => {
  const navigate = useNavigate();

  return (
    <nav className="term-nav">
      {LINKS.map(({ id, label, to }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            className={`term-nav-link${isActive ? " is-active" : ""}`}
            type="button"
            onClick={isActive ? undefined : () => navigate(to)}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
};

export default TermNav;
