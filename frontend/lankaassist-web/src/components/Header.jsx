import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";

import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "../auth/auth";

export default function Header() {
  useLocation();

  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="header-content">
        <NavLink to="/" className="brand">
          <span className="brand-mark">LA</span>

          <span>
            LankaAssist
            <small>Relief coordination</small>
          </span>
        </NavLink>

        <nav
          className="navigation"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            className="nav-link"
          >
            Home
          </NavLink>

          {!loggedIn && (
            <>
              <NavLink
                to="/login"
                className="nav-link"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="button header-button"
              >
                Create account
              </NavLink>
            </>
          )}

          {loggedIn && (
            <>
              <NavLink
                to="/dashboard"
                className="nav-link"
              >
                Dashboard
              </NavLink>

              {user?.role === "APPLICANT" && (
  <>
    <NavLink
      to="/assistance/new"
      className="nav-link"
    >
      Request help
    </NavLink>

    <NavLink
      to="/assistance/mine"
      className="nav-link"
    >
      My requests
    </NavLink>
  </>
)}
{user?.role === "DONOR" && (
  <NavLink
    to="/requests"
    className="nav-link"
  >
    Browse requests
  </NavLink>
)}
              <span className="user-role">
                {user?.role}
              </span>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
