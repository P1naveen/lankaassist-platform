import { useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router";

import { apiRequest } from "../services/api";
import { getCurrentUser } from "../auth/auth";

export default function CreateContributionPage() {
  const { requestId } = useParams();
  const location = useLocation();
  const selectedRequest = location.state?.request;
  const user = getCurrentUser();

  const [formData, setFormData] = useState({
    contributionType: "MONEY",
    amount: "",
    description: "",
    anonymousDonor:
      Boolean(user?.anonymousDonor),
  });

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const numericRequestId = Number(requestId);

    if (!Number.isInteger(numericRequestId)) {
      setError("Invalid assistance request.");
      return;
    }

    if (
      formData.contributionType === "MONEY" &&
      Number(formData.amount) <= 0
    ) {
      setError(
        "Enter a contribution amount greater than zero."
      );
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        assistanceRequestId: numericRequestId,
        contributionType:
          formData.contributionType,
        amount:
          formData.contributionType === "MONEY"
            ? Number(formData.amount)
            : null,
        description:
          formData.description.trim(),
        anonymousDonor:
          formData.anonymousDonor,
      };

      const response = await apiRequest(
        "/contributions",
        {
          method: "POST",
          body: requestBody,
        }
      );

      setResult(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  if (user?.role !== "DONOR") {
    return (
      <main className="page-container page-section">
        <div className="empty-state">
          <span className="empty-state-mark">
            !
          </span>

          <h1>Donor access required</h1>

          <p>
            Only donor accounts can create
            contributions.
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

  if (result) {
    return (
      <main className="page-container page-section">
        <div className="success-panel">
          <span className="success-panel-mark">
            ✓
          </span>

          <p className="eyebrow dark-eyebrow">
            Contribution recorded
          </p>

          <h1>Thank you for supporting this request.</h1>

          <p>
            Your contribution has been securely
            registered with LankaAssist.
          </p>

          {result.id && (
            <p className="result-reference">
              Contribution reference: #{result.id}
            </p>
          )}

          <div className="button-group centered-buttons">
            <Link
              to="/requests"
              className="button primary-button"
            >
              Browse more requests
            </Link>

            <Link
              to="/dashboard"
              className="button ghost-button"
            >
              Return to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container page-section">
      <section className="page-heading">
        <div>
          <p className="eyebrow dark-eyebrow">
            Contribution
          </p>

          <h1>Support request #{requestId}</h1>

          <p>
            Choose how you want to provide assistance.
          </p>
        </div>

        <div className="privacy-note">
          <span className="privacy-icon">
            ✓
          </span>

          <div>
            <strong>Privacy choice</strong>
            <p>
              Anonymous donations hide your public
              identity.
            </p>
          </div>
        </div>
      </section>

      {selectedRequest && (
        <section className="selected-request">
          <span>Selected request</span>
          <h2>{selectedRequest.title}</h2>
          <p>{selectedRequest.description}</p>
        </section>
      )}

      {error && (
        <div className="alert error-message">
          {error}
        </div>
      )}

      <form
        className="request-form"
        onSubmit={handleSubmit}
      >
        <section className="form-section">
          <div className="form-section-heading">
            <span>01</span>

            <div>
              <h2>Contribution type</h2>
              <p>
                Select the form of assistance you
                can provide.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contributionType">
              Type of support
            </label>

            <select
              id="contributionType"
              name="contributionType"
              value={formData.contributionType}
              onChange={handleChange}
            >
              <option value="MONEY">
                Financial contribution
              </option>

              <option value="GOODS">
                Goods and supplies
              </option>

              <option value="PHYSICAL_HELP">
                Physical assistance
              </option>
            </select>
          </div>

          {formData.contributionType ===
            "MONEY" && (
            <div className="form-group amount-field">
              <label htmlFor="amount">
                Contribution amount in LKR
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="10000.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="form-section-heading">
            <span>02</span>

            <div>
              <h2>Contribution details</h2>
              <p>
                Briefly describe the support being
                offered.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              maxLength="500"
              placeholder={
                formData.contributionType === "MONEY"
                  ? "Example: Contribution towards household expenses."
                  : "Describe the goods or physical assistance."
              }
              value={formData.description}
              onChange={handleChange}
              required
            />

            <span className="field-hint">
              {formData.description.length}/500
              characters
            </span>
          </div>

          <label className="privacy-choice">
            <input
              name="anonymousDonor"
              type="checkbox"
              checked={formData.anonymousDonor}
              onChange={handleChange}
            />

            <span>
              <strong>
                Keep this contribution anonymous
              </strong>

              <small>
                Your name and contact information will
                not be shown to the requester or public.
              </small>
            </span>
          </label>
        </section>

        <div className="form-actions">
          <Link
            to="/requests"
            className="button ghost-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="button submit-button"
            disabled={loading}
          >
            {loading
              ? "Recording contribution..."
              : "Confirm contribution"}
          </button>
        </div>
      </form>
    </main>
  );
}