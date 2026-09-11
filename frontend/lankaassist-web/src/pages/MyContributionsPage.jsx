import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../services/api";
import { getCurrentUser } from "../auth/auth";

function formatLabel(value) {
  if (!value) {
    return "Not available";
  }

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatAmount(value) {
  if (value === null || value === undefined) {
    return "Not applicable";
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MyContributionsPage() {
  const user = getCurrentUser();

  const [contributions, setContributions] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContributions() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "/contributions/mine"
      );

      setContributions(
        Array.isArray(response) ? response : []
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContributions();
  }, []);

  if (user?.role !== "DONOR") {
    return (
      <main className="page-container page-section">
        <div className="empty-state">
          <span className="empty-state-mark">
            !
          </span>

          <h1>Donor access required</h1>

          <p>
            Only donor accounts can view contribution
            history.
          </p>

          <Link
            to="/dashboard"
            className="button primary-button"
          >
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container page-section">
      <section className="requests-header">
        <div>
          <p className="eyebrow dark-eyebrow">
            Contribution history
          </p>

          <h1>My contributions</h1>

          <p>
            Review the support you have offered and
            its current status.
          </p>
        </div>

        <Link
          to="/requests"
          className="button primary-button"
        >
          Browse requests
        </Link>
      </section>

      {error && (
        <div className="alert error-message">
          <strong>
            Contributions could not be loaded.
          </strong>

          <span>{error}</span>

          <button
            type="button"
            className="retry-button"
            onClick={loadContributions}
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-panel">
          <span className="loading-spinner" />
          <p>Loading your contributions...</p>
        </div>
      )}

      {!loading &&
        !error &&
        contributions.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-mark">
              0
            </span>

            <h2>No contributions yet</h2>

            <p>
              Contributions you make will appear here.
            </p>

            <Link
              to="/requests"
              className="button primary-button"
            >
              Browse requests
            </Link>
          </div>
        )}

      {!loading &&
        !error &&
        contributions.length > 0 && (
          <section className="contributions-list">
            {contributions.map((contribution) => (
              <article
                className="contribution-history-card"
                key={contribution.id}
              >
                <div className="request-card-top">
                  <span className="request-reference">
                    Contribution #{contribution.id}
                  </span>

                  <span
                    className={`status-badge status-${contribution.status
                      ?.toLowerCase()
                      .replaceAll("_", "-")}`}
                  >
                    {formatLabel(
                      contribution.status
                    )}
                  </span>
                </div>

                <div className="contribution-title-row">
                  <div>
                    <p className="contribution-type">
                      {formatLabel(
                        contribution.contributionType
                      )}
                    </p>

                    <h2>
                      Request #
                      {contribution.assistanceRequestId}
                    </h2>
                  </div>

                  <span
                    className={
                      contribution.anonymousDonor
                        ? "identity-badge anonymous"
                        : "identity-badge identified"
                    }
                  >
                    {contribution.anonymousDonor
                      ? "Anonymous"
                      : "Identified"}
                  </span>
                </div>

                <p className="request-description">
                  {contribution.description}
                </p>

                <dl className="request-details">
                  <div>
                    <dt>Contribution type</dt>
                    <dd>
                      {formatLabel(
                        contribution.contributionType
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>Amount</dt>
                    <dd>
                      {formatAmount(
                        contribution.amount
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>Created</dt>
                    <dd>
                      {formatDate(
                        contribution.createdAt
                      )}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        )}
    </main>
  );
}
