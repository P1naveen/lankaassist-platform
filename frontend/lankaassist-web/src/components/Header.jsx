import { NavLink, useNavigate } from "react-router";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "../auth/auth";

export default function Header() {
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
          LankaAssist
        </NavLink>

        <nav className="navigation">
          <NavLink to="/">Home</NavLink>

          {!loggedIn && (
            <>
              <NavLink to="/login">
                Login
              </NavLink>

              <NavLink to="/register">
                Register
              </NavLink>
            </>
          )}

          {loggedIn && (
            <>
              <NavLink to="/dashboard">
                Dashboard
              </NavLink>

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

