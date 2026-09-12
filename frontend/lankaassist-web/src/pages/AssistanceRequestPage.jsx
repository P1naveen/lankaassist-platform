import { useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../services/api";
import { getCurrentUser } from "../auth/auth";

const initialForm = {
  beneficiaryType: "INDIVIDUAL",
  crisisType: "FINANCIAL_CRISIS",
  assistanceType: "MONEY",
  title: "",
  description: "",
  district: "",
  requestedAmount: "",
};

export default function AssistanceRequestPage() {
  const user = getCurrentUser();

  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (
      formData.assistanceType === "MONEY" &&
      Number(formData.requestedAmount) <= 0
    ) {
      setError(
        "Enter a requested amount greater than zero."
      );
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        ...formData,
        requestedAmount:
          formData.assistanceType === "MONEY"
            ? Number(formData.requestedAmount)
            : null,
      };

      const response = await apiRequest(
        "/assistance",
        {
          method: "POST",
          body: requestBody,
        }
      );

      setResult(response);
      setFormData(initialForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  if (user?.role !== "APPLICANT") {
    return (
      <main className="page-container page-section">
        <div className="empty-state">
          <span className="empty-state-mark">!</span>
          <h1>Applicant access required</h1>
          <p>
            Only applicant accounts can create
            assistance requests.
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
      <div className="page-heading">
        <div>
          <p className="eyebrow dark-eyebrow">
            Assistance request
          </p>

          <h1>Tell us what support you need</h1>

          <p>
            Provide clear information so an authorised
            coordinator can review the request.
          </p>
        </div>

        <div className="privacy-note">
          <span className="privacy-icon">✓</span>

          <div>
            <strong>Privacy protected</strong>
            <p>
              Your contact information is not shown
              publicly.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert error-message">
          {error}
        </div>
      )}

      {result && (
        <div className="alert success-message">
          <strong>
            Assistance request submitted successfully.
          </strong>

          {result.id && (
            <span>
              Request reference: #{result.id}
            </span>
          )}

          {result.status && (
            <span>
              Current status: {result.status}
            </span>
          )}
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
              <h2>Request category</h2>
              <p>
                Identify who requires help and the
                type of crisis.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="beneficiaryType">
                Beneficiary type
              </label>

              <select
                id="beneficiaryType"
                name="beneficiaryType"
                value={formData.beneficiaryType}
                onChange={handleChange}
              >
                <option value="INDIVIDUAL">
                  Individual person
                </option>

                <option value="GROUP">
                  Family or group
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="crisisType">
                Crisis type
              </label>

              <select
                id="crisisType"
                name="crisisType"
                value={formData.crisisType}
                onChange={handleChange}
              >
                <option value="FINANCIAL_CRISIS">
                  Financial crisis
                </option>

                <option value="NATURAL_DISASTER">
                  Natural disaster
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assistanceType">
                Required support
              </label>

              <select
                id="assistanceType"
                name="assistanceType"
                value={formData.assistanceType}
                onChange={handleChange}
              >
                <option value="MONEY">
                  Financial assistance
                </option>

                <option value="FOOD">
                  Food
                </option>

                <option value="MEDICAL">
                  Medical assistance
                </option>

                <option value="SHELTER">
                  Shelter
                </option>

                <option value="EDUCATION">
                  Education
                </option>

                <option value="PHYSICAL_HELP">
                  Physical assistance
                </option>

                <option value="OTHER">
                  Other support
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="district">
                District
              </label>

              <input
                id="district"
                name="district"
                type="text"
                placeholder="Example: Colombo"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading">
            <span>02</span>

            <div>
              <h2>Request details</h2>
              <p>
                Explain the situation briefly and
                accurately.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              Request title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              maxLength="150"
              placeholder="Example: Temporary financial support"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              maxLength="1000"
              placeholder="Describe the situation and the support required."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <span className="field-hint">
              {formData.description.length}/1000
              characters
            </span>
          </div>

          {formData.assistanceType === "MONEY" && (
            <div className="form-group amount-field">
              <label htmlFor="requestedAmount">
                Requested amount in LKR
              </label>

              <input
                id="requestedAmount"
                name="requestedAmount"
                type="number"
                min="1"
                step="0.01"
                placeholder="25000.00"
                value={formData.requestedAmount}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </section>

        <div className="form-actions">
          <Link
            to="/dashboard"
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
              ? "Submitting request..."
              : "Submit assistance request"}
          </button>
        </div>
      </form>
    </main>
  );
}
