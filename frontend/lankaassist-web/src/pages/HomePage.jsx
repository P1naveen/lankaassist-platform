import { Link } from "react-router";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="page-container">
          <p className="eyebrow">
            Financial and disaster support
          </p>

          <h1>
            Connecting people who need help with
            people ready to help
          </h1>

          <p className="hero-description">
            LankaAssist coordinates financial
            assistance, disaster relief, donations
            and physical support while protecting
            the privacy of applicants and donors.
          </p>

          <div className="button-group">
            <Link
              to="/register"
              className="button primary-button"
            >
              Request or offer help
            </Link>

            <Link
              to="/login"
              className="button secondary-button"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="page-container feature-section">
        <h2>How LankaAssist works</h2>

        <div className="card-grid">
          <article className="card">
            <h3>Request assistance</h3>
            <p>
              Individuals and groups can request
              support for financial difficulties
              or natural disasters.
            </p>
          </article>

          <article className="card">
            <h3>Make a contribution</h3>
            <p>
              Donors can offer money, goods or
              physical help and may remain anonymous.
            </p>
          </article>

          <article className="card">
            <h3>Coordinate delivery</h3>
            <p>
              Administrators and volunteers coordinate
              approved contributions with verified
              requests.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
