import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "../auth/auth";
import { apiRequest } from "../services/api";

const STATUS_OPTIONS = [
  "ASSIGNED",
  "IN_PROGRESS",
  "DELIVERED",
  "CANCELLED",
];

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState([]);
  const [form, setForm] = useState({
    assistanceRequestId: "",
    contributionId: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const role = getCurrentUser()?.role;
  const canCreate = role === "ADMIN";
  const canUpdate =
    role === "ADMIN" || role === "VOLUNTEER";

  const loadAllocations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/allocations");

      setAllocations(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    apiRequest("/allocations")
      .then((data) => {
        if (!ignore) {
          setAllocations(
            Array.isArray(data) ? data : []
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
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest("/allocations", {
        method: "POST",
        body: {
            assistanceRequestId: Number(
              form.assistanceRequestId
            ),
            contributionId: Number(
              form.contributionId
            ),
            notes: form.notes.trim(),
        },
      });

      setSuccess("Allocation created successfully.");

      setForm({
        assistanceRequestId: "",
        contributionId: "",
        notes: "",
      });

      await loadAllocations();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(allocationId, status) {
    setUpdatingId(allocationId);
    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/allocations/${allocationId}/status`,
        {
          method: "PATCH",
          body: { status },
        }
      );

      setSuccess(
        `Allocation #${allocationId} changed to ${formatStatus(
          status
        )}.`
      );

      await loadAllocations();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="allocation-page">
      <section className="allocation-hero">
        <div>
          <p className="allocation-eyebrow">
            RELIEF COORDINATION
          </p>

          <h1>Resource Allocations</h1>

          <p>
            Coordinate approved assistance requests with
            available contributions while protecting personal
            information.
          </p>
        </div>

        <div className="allocation-summary">
          <span>{allocations.length}</span>
          <p>Total allocations</p>
        </div>
      </section>

      {error && (
        <div className="allocation-message allocation-error">
          {error}
        </div>
      )}

      {success && (
        <div className="allocation-message allocation-success">
          {success}
        </div>
      )}

      {canCreate && (
        <section className="allocation-form-card">
          <div className="allocation-section-heading">
            <div>
              <p className="allocation-eyebrow">
                ADMINISTRATION
              </p>

              <h2>Create an allocation</h2>
            </div>

            <span className="privacy-label">
              Identity protected
            </span>
          </div>

          <form
            className="allocation-form"
            onSubmit={handleCreate}
          >
            <label>
              Assistance request ID

              <input
                type="number"
                name="assistanceRequestId"
                min="1"
                value={form.assistanceRequestId}
                onChange={handleInputChange}
                placeholder="Example: 1"
                required
              />
            </label>

            <label>
              Contribution ID

              <input
                type="number"
                name="contributionId"
                min="1"
                value={form.contributionId}
                onChange={handleInputChange}
                placeholder="Example: 1"
                required
              />
            </label>

            <label className="allocation-notes-field">
              Coordination notes

              <textarea
                name="notes"
                maxLength="500"
                rows="4"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Add a short message about this allocation."
              />
            </label>

            <button
              className="allocation-primary-button"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating..."
                : "Create allocation"}
            </button>
          </form>
        </section>
      )}

      <section className="allocation-list-section">
        <div className="allocation-section-heading">
          <div>
            <p className="allocation-eyebrow">
              CURRENT ACTIVITY
            </p>

            <h2>Allocation records</h2>
          </div>

          <button
            type="button"
            className="allocation-refresh-button"
            onClick={loadAllocations}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="allocation-empty">
            Loading allocations...
          </div>
        ) : allocations.length === 0 ? (
          <div className="allocation-empty">
            <h3>No allocations yet</h3>
            <p>
              New resource allocations will appear here.
            </p>
          </div>
        ) : (
          <div className="allocation-grid">
            {allocations.map((allocation) => (
              <article
                className="allocation-card"
                key={allocation.id}
              >
                <div className="allocation-card-top">
                  <div>
                    <span className="allocation-number">
                      Allocation #{allocation.id}
                    </span>

                    <h3>
                      Request #{allocation.assistanceRequestId}
                    </h3>
                  </div>

                  <span
                    className={`allocation-status status-${allocation.status?.toLowerCase()}`}
                  >
                    {formatStatus(allocation.status)}
                  </span>
                </div>

                <div className="allocation-details">
                  <div>
                    <span>Contribution</span>
                    <strong>
                      #{allocation.contributionId}
                    </strong>
                  </div>

                  <div>
                    <span>Created</span>
                    <strong>
                      {formatDate(allocation.createdAt)}
                    </strong>
                  </div>
                </div>

                <div className="allocation-notes">
                  <span>Coordination notes</span>
                  <p>
                    {allocation.notes ||
                      "No additional notes provided."}
                  </p>
                </div>

                {canUpdate && (
                  <label className="allocation-status-control">
                    Update status

                    <select
                      value={allocation.status}
                      disabled={updatingId === allocation.id}
                      onChange={(event) =>
                        updateStatus(
                          allocation.id,
                          event.target.value
                        )
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          value={status}
                          key={status}
                        >
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString();
}
