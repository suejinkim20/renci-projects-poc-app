import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-title">RENCI Projects Matrix</div>

        <div className="navbar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            View projects by research group
          </NavLink>

          <NavLink
            to="/partners-funders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            View partners and funders
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
