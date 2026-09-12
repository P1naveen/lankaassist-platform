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
    return null;
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);
}

function canReceiveContribution(status) {
  const closedStatuses = [
    "REJECTED",
    "FULFILLED",
    "COMPLETED",
    "CANCELLED",
  ];

  return !closedStatuses.includes(status);
}

export default function BrowseRequestsPage() {
  const user = getCurrentUser();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "/assistance"
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
    if (user?.role !== "DONOR") {
      return undefined;
    }

    let ignore = false;

    apiRequest("/assistance")
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

  if (user?.role !== "DONOR") {
    return (
      <main className="page-container page-section">
        <div className="empty-state">
          <span className="empty-state-mark">
            !
          </span>

          <h1>Donor access required</h1>

          <p>
            Only donor accounts can browse requests
            for contribution.
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
            Assistance requests
          </p>

          <h1>Choose where to help</h1>

          <p>
            Review requests and select one to support.
            Requester contact details remain private.
          </p>
        </div>

        <div className="privacy-note">
          <span className="privacy-icon">
            ✓
          </span>

          <div>
            <strong>Anonymous option</strong>
            <p>
              You may hide your donor identity.
            </p>
          </div>
        </div>
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
          <p>Loading assistance requests...</p>
        </div>
      )}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-mark">
              0
            </span>

            <h2>No requests available</h2>

            <p>
              New assistance requests will appear
              here when submitted.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        requests.length > 0 && (
          <section className="donor-requests-grid">
            {requests.map((request) => {
              const available =
                canReceiveContribution(
                  request.status
                );

              return (
                <article
                  className="donor-request-card"
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

                  <div className="request-tags">
                    <span>
                      {formatLabel(
                        request.crisisType
                      )}
                    </span>

                    <span>
                      {formatLabel(
                        request.assistanceType
                      )}
                    </span>
                  </div>

                  <h2>{request.title}</h2>

                  <p className="request-description">
                    {request.description}
                  </p>

                  <div className="donor-request-meta">
                    <div>
                      <span>District</span>
                      <strong>
                        {request.district}
                      </strong>
                    </div>

                    <div>
                      <span>Beneficiary</span>
                      <strong>
                        {formatLabel(
                          request.beneficiaryType
                        )}
                      </strong>
                    </div>

                    {request.requestedAmount != null && (
                      <div>
                        <span>Requested</span>
                        <strong>
                          {formatAmount(
                            request.requestedAmount
                          )}
                        </strong>
                      </div>
                    )}
                  </div>

                  {available ? (
                    <Link
                      to={`/contributions/new/${request.id}`}
                      state={{ request }}
                      className="button primary-button contribution-button"
                    >
                      Support this request
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="button contribution-button"
                      disabled
                    >
                      Request closed
                    </button>
                  )}
                </article>
              );
            })}
          </section>
        )}
    </main>
  );
}
