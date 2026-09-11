import { NavLink } from "react-router";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <NavLink to="/" className="brand">
          LankaAssist
        </NavLink>

        <nav className="navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}
