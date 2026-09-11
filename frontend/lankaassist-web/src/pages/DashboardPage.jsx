import { getCurrentUser } from "../auth/auth";

export default function DashboardPage() {
  const user = getCurrentUser();

  return (
    <main className="page-container page-section">
      <h1>Dashboard</h1>

      <div className="card">
        <h2>Welcome to LankaAssist</h2>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Role:</strong> {user?.role}
        </p>

        {user?.role === "APPLICANT" && (
          <p>
            You can create and monitor financial or
            disaster assistance requests.
          </p>
        )}

        {user?.role === "DONOR" && (
          <p>
            You can provide money, goods or physical
            assistance.
          </p>
        )}

        {user?.role === "VOLUNTEER" && (
          <p>
            You can assist with relief coordination.
          </p>
        )}
      </div>
    </main>
  );
}

