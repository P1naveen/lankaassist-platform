import { Route, Routes } from "react-router";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AssistanceRequestPage from "./pages/AssistanceRequestPage";
import MyRequestsPage from "./pages/MyRequestsPage";
import BrowseRequestsPage from "./pages/BrowseRequestsPage";
import CreateContributionPage from "./pages/CreateContributionPage";
import MyContributionsPage from "./pages/MyContributionsPage";
import AllocationsPage from "./pages/AllocationsPage";

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
  path="/assistance/mine"
  element={
    <ProtectedRoute>
      <MyRequestsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/contributions/my"
  element={
    <ProtectedRoute>
      <MyContributionsPage />
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
        <Route
  path="/requests"
  element={
    <ProtectedRoute>
      <BrowseRequestsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/allocations"
  element={
    <ProtectedRoute>
      <AllocationsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/contributions/new/:requestId"
  element={
    <ProtectedRoute>
      <CreateContributionPage />
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

