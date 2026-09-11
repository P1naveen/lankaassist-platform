import { Link } from "react-router";
import { getCurrentUser } from "../auth/auth";

export default function DashboardPage() {
  const user = getCurrentUser();

  return (
    <main className="page-container page-section">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow dark-eyebrow">
            Account dashboard
          </p>

          <h1>Welcome back</h1>

          <p>
            Choose an available action for your account.
          </p>
        </div>

        <div className="profile-summary">
          <span className="profile-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </span>

          <div>
            <strong>{user?.email}</strong>
            <p>{user?.role}</p>
          </div>
        </div>
      </section>

      {user?.role === "APPLICANT" && (
        <section className="dashboard-grid">
          <article className="action-card primary-action">
            <span className="action-label">
              Main action
            </span>

            <h2>Request assistance</h2>

            <p>
              Submit a financial or natural-disaster
              assistance request.
            </p>

            <Link
              to="/assistance/new"
              className="button light-button"
            >
              Create request
            </Link>
          </article>

          <article className="action-card">
            <span className="card-number">02</span>
            <h2>Track requests</h2>
            <p>
              Request tracking will be added in the
              next frontend checkpoint.
            </p>
          </article>
        </section>
      )}

      {user?.role === "DONOR" && (
        <section className="dashboard-grid">
          <article className="action-card primary-action">
            <span className="action-label">
              Donor account
            </span>

            <h2>Find requests to support</h2>

            <p>
              Browse eligible requests and make a
              financial or physical contribution.
            </p>
          </article>

          <article className="action-card">
            <h2>Privacy preference</h2>

            <p>
              Anonymous donor status:{" "}
              <strong>
                {user?.anonymousDonor
                  ? "Enabled"
                  : "Disabled"}
              </strong>
            </p>
          </article>
        </section>
      )}

      {user?.role === "VOLUNTEER" && (
        <section className="dashboard-grid">
          <article className="action-card primary-action">
            <span className="action-label">
              Volunteer account
            </span>

            <h2>Coordination activities</h2>

            <p>
              View and manage assigned relief tasks.
            </p>
          </article>
        </section>
      )}
    </main>
  );
}


