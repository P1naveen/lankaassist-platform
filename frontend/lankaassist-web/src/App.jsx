import { Route, Routes } from "react-router";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AssistanceRequestPage from "./pages/AssistanceRequestPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistance/new"
          element={
            <ProtectedRoute>
              <AssistanceRequestPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <strong>LankaAssist</strong>
            <p>
              Financial and disaster-relief coordination.
            </p>
          </div>

          <p>
            University Service-Oriented Computing Project
          </p>
        </div>
      </footer>
    </div>
  );
}

