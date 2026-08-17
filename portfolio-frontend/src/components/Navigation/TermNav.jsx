import { useNavigate } from "react-router-dom";
import "./TermNav.css";

const LINKS = [
  { id: "home", label: "home", to: "/landing" },
  { id: "projects", label: "projects", to: "/projects", chip: "play" },
  { id: "resume", label: "resume", to: "/DigitalResume" },
  { id: "skills", label: "skills", to: "/Skills" },
];

// Window-header nav, shared by every terminal screen. `active` is the id of the
// screen rendering it; omit it on screens that are not nav destinations.
const TermNav = ({ active }) => {
  const navigate = useNavigate();

  return (
    <nav className="term-nav">
      {LINKS.map(({ id, label, to, chip }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            className={`term-nav-link${isActive ? " is-active" : ""}${
              chip ? " has-chip" : ""
            }`}
            type="button"
            onClick={isActive ? undefined : () => navigate(to)}
          >
            {label}
            {chip && <span className="nav-chip">{chip}</span>}
          </button>
        );
      })}
    </nav>
  );
};

export default TermNav;
