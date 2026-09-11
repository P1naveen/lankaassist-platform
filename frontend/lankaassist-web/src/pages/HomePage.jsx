import { Link } from "react-router";
import { isAuthenticated } from "../auth/auth";

export default function HomePage() {
  const loggedIn = isAuthenticated();

  return (
    <main>
      <section className="hero">
        <div className="page-container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">
              Secure relief coordination
            </p>

            <h1>
              Help reaches the right people when
              coordination is clear.
            </h1>

            <p className="hero-description">
              LankaAssist connects people affected by
              financial hardship or natural disasters
              with donors and volunteers while
              protecting personal information.
            </p>

            <div className="button-group">
              <Link
                to={
                  loggedIn
                    ? "/dashboard"
                    : "/register"
                }
                className="button light-button"
              >
                {loggedIn
                  ? "Open dashboard"
                  : "Create an account"}
              </Link>

              <Link
                to={loggedIn ? "/dashboard" : "/login"}
                className="button outline-button"
              >
                {loggedIn
                  ? "View available actions"
                  : "Login securely"}
              </Link>
            </div>

            <div className="trust-row">
              <span>Protected identities</span>
              <span>Anonymous donations</span>
              <span>Role-based access</span>
            </div>
          </div>

          <aside className="hero-panel">
            <p className="panel-label">
              How support moves
            </p>

            <div className="process-item">
              <span>01</span>
              <div>
                <strong>Request</strong>
                <p>
                  Submit financial or disaster-relief
                  needs.
                </p>
              </div>
            </div>

            <div className="process-item">
              <span>02</span>
              <div>
                <strong>Review</strong>
                <p>
                  Authorised users examine the request.
                </p>
              </div>
            </div>

            <div className="process-item">
              <span>03</span>
              <div>
                <strong>Coordinate</strong>
                <p>
                  Donors and volunteers provide support.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="page-container feature-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark-eyebrow">
              One simple platform
            </p>

            <h2>
              Support for financial and natural crises
            </h2>
          </div>

          <p>
            Each service has one clear responsibility,
            keeping LankaAssist simple and loosely
            coupled.
          </p>
        </div>

        <div className="card-grid">
          <article className="feature-card">
            <span className="card-number">01</span>
            <h3>Request assistance</h3>
            <p>
              Individuals and groups can request money,
              essential supplies or physical support.
            </p>
          </article>

          <article className="feature-card featured">
            <span className="card-number">02</span>
            <h3>Contribute privately</h3>
            <p>
              Donors can provide support without
              displaying their identity publicly.
            </p>
          </article>

          <article className="feature-card">
            <span className="card-number">03</span>
            <h3>Coordinate delivery</h3>
            <p>
              Volunteers and authorised administrators
              coordinate approved relief activities.
            </p>
          </article>
        </div>
      </section>

      <section className="privacy-section">
        <div className="page-container privacy-grid">
          <div>
            <p className="eyebrow">
              Privacy by design
            </p>

            <h2>
              Personal information stays protected.
            </h2>
          </div>

          <div className="privacy-list">
            <p>
              <span>✓</span>
              Passwords are stored as secure hashes.
            </p>

            <p>
              <span>✓</span>
              JWT authentication protects private APIs.
            </p>

            <p>
              <span>✓</span>
              Anonymous donor identities are hidden.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
