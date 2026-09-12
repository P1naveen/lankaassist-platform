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

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAmount(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);
}

export default function MyRequestsPage() {
  const user = getCurrentUser();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "/assistance/mine"
      );

      setRequests(
        Array.isArray(response) ? response : []
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role !== "APPLICANT") {
      return undefined;
    }

    let ignore = false;

    apiRequest("/assistance/mine")
      .then((response) => {
        if (!ignore) {
          setRequests(
            Array.isArray(response) ? response : []
          );
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.role]);

  if (user?.role !== "APPLICANT") {
    return (
      <main className="page-container page-section">
        <div className="empty-state">
          <span className="empty-state-mark">
            !
          </span>

          <h1>Applicant access required</h1>

          <p>
            Only applicant accounts can view this
            request history.
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
            Assistance history
          </p>

          <h1>My requests</h1>

          <p>
            Review your submitted requests and their
            current status.
          </p>
        </div>

        <Link
          to="/assistance/new"
          className="button primary-button"
        >
          Create new request
        </Link>
      </section>

      {error && (
        <div className="alert error-message">
          <strong>
            Requests could not be loaded.
          </strong>

          <span>{error}</span>

          <button
            type="button"
            className="retry-button"
            onClick={loadRequests}
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-panel">
          <span className="loading-spinner" />
          <p>Loading your requests...</p>
        </div>
      )}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-mark">
              +
            </span>

            <h2>No requests submitted</h2>

            <p>
              When you submit an assistance request,
              it will appear here.
            </p>

            <Link
              to="/assistance/new"
              className="button primary-button"
            >
              Create first request
            </Link>
          </div>
        )}

      {!loading &&
        !error &&
        requests.length > 0 && (
          <section className="requests-grid">
            {requests.map((request) => (
              <article
                className="request-card"
                key={request.id}
              >
                <div className="request-card-top">
                  <span className="request-reference">
                    Request #{request.id}
                  </span>

                  <span
                    className={`status-badge status-${request.status
                      ?.toLowerCase()
                      .replaceAll("_", "-")}`}
                  >
                    {formatLabel(request.status)}
                  </span>
                </div>

                <h2>{request.title}</h2>

                <p className="request-description">
                  {request.description}
                </p>

                <dl className="request-details">
                  <div>
                    <dt>Crisis</dt>
                    <dd>
                      {formatLabel(
                        request.crisisType
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>Support</dt>
                    <dd>
                      {formatLabel(
                        request.assistanceType
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>Beneficiary</dt>
                    <dd>
                      {formatLabel(
                        request.beneficiaryType
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>District</dt>
                    <dd>{request.district}</dd>
                  </div>

                  {request.requestedAmount != null && (
                    <div>
                      <dt>Requested amount</dt>
                      <dd>
                        {formatAmount(
                          request.requestedAmount
                        )}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt>Submitted</dt>
                    <dd>
                      {formatDate(request.createdAt)}
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
