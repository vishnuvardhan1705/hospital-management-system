
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileText,
  Search,
  RefreshCw,
  Plus,
  Send,
  CheckCircle,
  Users,
  AlertCircle,
} from "lucide-react";

import insuranceService from "../services/insuranceService";
import "../styles/insuranceManagement.css";

const getId = (value) => value?.id ?? value?.patientId ?? "";

const getPatientName = (patient) =>
  `${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim() ||
  patient?.name ||
  `Patient #${getId(patient)}`;

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Something went wrong. Please try again.";

const formatDate = (value) => {
  if (!value) return "—";
  return String(value).slice(0, 10);
};

const money = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const initialPolicy = {
  patientId: "",
  providerId: "",
  policyNumber: "",
  policyHolderName: "",
  policyType: "",
  coverageAmount: "",
  startDate: "",
  expiryDate: "",
};

const initialClaim = {
  patientId: "",
  admissionId: "",
  billId: "",
  patientInsuranceId: "",
  claimedAmount: "",
};

export default function InsuranceManagement() {
  const [activeTab, setActiveTab] = useState("policies");
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [policies, setPolicies] = useState([]);

  const [policyForm, setPolicyForm] = useState(initialPolicy);
  const [claimForm, setClaimForm] = useState(initialClaim);

  const [claimIdInput, setClaimIdInput] = useState("");
  const [claim, setClaim] = useState(null);
  const [settlement, setSettlement] = useState({
    approvedAmount: "",
    rejectedAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      const result = await insuranceService.getPatients();
      setPatients(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const loadPolicies = async (patientId) => {
    if (!patientId) {
      setPolicies([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result =
        await insuranceService.getPatientInsurance(patientId);
      setPolicies(Array.isArray(result) ? result : []);
    } catch (err) {
      setPolicies([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    loadPolicies(selectedPatientId);
  }, [selectedPatientId]);

  const clearNotices = () => {
    setMessage("");
    setError("");
  };

  const handleCreatePolicy = async (event) => {
    event.preventDefault();
    clearNotices();
    setSaving(true);

    try {
      const data = {
        patientId: Number(policyForm.patientId),
        providerId: Number(policyForm.providerId),
        policyNumber: policyForm.policyNumber.trim(),
        policyHolderName: policyForm.policyHolderName.trim(),
        policyType: policyForm.policyType.trim(),
        coverageAmount: Number(policyForm.coverageAmount),
        startDate: policyForm.startDate,
        expiryDate: policyForm.expiryDate,
      };

      const result = await insuranceService.createPolicy(data);

      setMessage(
        `Policy created successfully. Policy ID: ${getId(result) || "Created"}`
      );
      setPolicyForm(initialPolicy);
      setSelectedPatientId(String(data.patientId));
      await loadPolicies(data.patientId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClaim = async (event) => {
    event.preventDefault();
    clearNotices();
    setSaving(true);

    try {
      const data = {
        patientId: Number(claimForm.patientId),
        billId: Number(claimForm.billId),
        patientInsuranceId: Number(claimForm.patientInsuranceId),
        claimedAmount: Number(claimForm.claimedAmount),
      };

      if (claimForm.admissionId.trim()) {
        data.admissionId = Number(claimForm.admissionId);
      }

      const result = await insuranceService.createClaim(data);
      const newId = getId(result);

      setClaim(result);
      setClaimIdInput(String(newId || ""));
      setMessage(
        `Claim created successfully${result?.claimNumber ? `: ${result.claimNumber}` : ""}.`
      );
      setActiveTab("claims");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleFindClaim = async (event) => {
    event.preventDefault();
    clearNotices();

    if (!claimIdInput.trim()) {
      setError("Enter an insurance claim ID.");
      return;
    }

    setLoading(true);

    try {
      const result = await insuranceService.getClaim(
        Number(claimIdInput)
      );
      setClaim(result);
      setSettlement({
        approvedAmount: result?.approvedAmount ?? "",
        rejectedAmount: result?.rejectedAmount ?? "",
      });
    } catch (err) {
      setClaim(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async () => {
    if (!claim?.id) return;

    clearNotices();
    setSaving(true);

    try {
      const result = await insuranceService.submitClaim(claim.id);
      setClaim(result);
      setMessage("Claim submitted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSettleClaim = async (event) => {
    event.preventDefault();

    if (!claim?.id) return;

    clearNotices();
    setSaving(true);

    try {
      const result = await insuranceService.settleClaim(claim.id, {
        approvedAmount: Number(settlement.approvedAmount),
        rejectedAmount: Number(settlement.rejectedAmount),
      });

      setClaim(result);
      setMessage("Claim settled successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const patientNameById = (patientId) => {
    const patient = patients.find(
      (item) => String(getId(item)) === String(patientId)
    );
    return patient ? getPatientName(patient) : `Patient #${patientId ?? "—"}`;
  };

  return (
    <div className="insurance-page">
      <div className="insurance-page-header">
        <div>
          <h1>Insurance Management</h1>
          <p>Manage patient policies and process insurance claims.</p>
        </div>

        <button
          type="button"
          className="insurance-refresh-button"
          onClick={() => {
            clearNotices();
            loadPatients();
            if (selectedPatientId) loadPolicies(selectedPatientId);
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="insurance-alert insurance-alert-success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="insurance-alert insurance-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="insurance-stats">
        <div className="insurance-stat-card">
          <span className="insurance-stat-icon">
            <Users size={21} />
          </span>
          <div>
            <p>Patients Loaded</p>
            <h3>{patients.length}</h3>
          </div>
        </div>

        <div className="insurance-stat-card">
          <span className="insurance-stat-icon">
            <ShieldCheck size={21} />
          </span>
          <div>
            <p>Policies Displayed</p>
            <h3>{policies.length}</h3>
          </div>
        </div>

        <div className="insurance-stat-card">
          <span className="insurance-stat-icon">
            <FileText size={21} />
          </span>
          <div>
            <p>Selected Patient</p>
            <h3 className="insurance-stat-patient">
              {selectedPatientId
                ? patientNameById(selectedPatientId)
                : "None"}
            </h3>
          </div>
        </div>
      </div>

      <div className="insurance-tabs">
        <button
          type="button"
          className={activeTab === "policies" ? "active" : ""}
          onClick={() => {
            setActiveTab("policies");
            clearNotices();
          }}
        >
          <ShieldCheck size={17} />
          Patient Policies
        </button>

        <button
          type="button"
          className={activeTab === "claims" ? "active" : ""}
          onClick={() => {
            setActiveTab("claims");
            clearNotices();
          }}
        >
          <FileText size={17} />
          Insurance Claims
        </button>
      </div>

      {activeTab === "policies" && (
        <div className="insurance-content-grid">
          <section className="insurance-panel">
            <div className="insurance-panel-heading">
              <h2>Register Policy</h2>
              <p>Enter the policy and provider details.</p>
            </div>

            <form onSubmit={handleCreatePolicy}>
              <label>
                Patient
                <select
                  required
                  value={policyForm.patientId}
                  onChange={(event) =>
                    setPolicyForm({
                      ...policyForm,
                      patientId: event.target.value,
                    })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={getId(patient)} value={getId(patient)}>
                      {getPatientName(patient)} (ID: {getId(patient)})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Insurance Provider ID
                <input
                  type="number"
                  min="1"
                  required
                  value={policyForm.providerId}
                  onChange={(event) =>
                    setPolicyForm({
                      ...policyForm,
                      providerId: event.target.value,
                    })
                  }
                  placeholder="Enter existing provider ID"
                />
                <small>
                  Use an ID already present in the insurance_providers table.
                </small>
              </label>

              <label>
                Policy Number
                <input
                  required
                  value={policyForm.policyNumber}
                  onChange={(event) =>
                    setPolicyForm({
                      ...policyForm,
                      policyNumber: event.target.value,
                    })
                  }
                  placeholder="e.g. POL-2026-1042"
                />
              </label>

              <label>
                Policy Holder Name
                <input
                  required
                  value={policyForm.policyHolderName}
                  onChange={(event) =>
                    setPolicyForm({
                      ...policyForm,
                      policyHolderName: event.target.value,
                    })
                  }
                  placeholder="Full name of policy holder"
                />
              </label>

              <label>
                Policy Type
                <input
                  required
                  value={policyForm.policyType}
                  onChange={(event) =>
                    setPolicyForm({
                      ...policyForm,
                      policyType: event.target.value,
                    })
                  }
                  placeholder="e.g. FAMILY, INDIVIDUAL"
                />
              </label>

              <label>
                Coverage Amount (₹)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={policyForm.coverageAmount}
                  onChange={(event) =>
                    setPolicyForm({
                      ...policyForm,
                      coverageAmount: event.target.value,
                    })
                  }
                />
              </label>

              <div className="insurance-form-row">
                <label>
                  Start Date
                  <input
                    type="date"
                    required
                    value={policyForm.startDate}
                    onChange={(event) =>
                      setPolicyForm({
                        ...policyForm,
                        startDate: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Expiry Date
                  <input
                    type="date"
                    required
                    min={policyForm.startDate || undefined}
                    value={policyForm.expiryDate}
                    onChange={(event) =>
                      setPolicyForm({
                        ...policyForm,
                        expiryDate: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <button
                className="insurance-primary-button"
                type="submit"
                disabled={saving}
              >
                <Plus size={17} />
                {saving ? "Saving..." : "Create Policy"}
              </button>
            </form>
          </section>

          <section className="insurance-panel">
            <div className="insurance-panel-heading">
              <h2>Patient Policies</h2>
              <p>Select a patient to view registered policies.</p>
            </div>

            <form
              className="insurance-search-row"
              onSubmit={(event) => {
                event.preventDefault();
                loadPolicies(selectedPatientId);
              }}
            >
              <select
                value={selectedPatientId}
                onChange={(event) => setSelectedPatientId(event.target.value)}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={getId(patient)} value={getId(patient)}>
                    {getPatientName(patient)} (ID: {getId(patient)})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="insurance-secondary-button"
                disabled={!selectedPatientId || loading}
              >
                <Search size={16} />
                Search
              </button>
            </form>

            {loading ? (
              <p className="insurance-empty-state">Loading policies...</p>
            ) : policies.length === 0 ? (
              <p className="insurance-empty-state">
                Select a patient to view their policies. No policies are
                displayed until a patient is selected.
              </p>
            ) : (
              <div className="insurance-table-wrapper">
                <table className="insurance-table">
                  <thead>
                    <tr>
                      <th>Policy ID</th>
                      <th>Policy Number</th>
                      <th>Provider</th>
                      <th>Coverage</th>
                      <th>Expiry</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy) => (
                      <tr key={getId(policy)}>
                        <td>{getId(policy)}</td>
                        <td>{policy.policyNumber || "—"}</td>
                        <td>
                          {policy.provider?.providerName ||
                            policy.provider?.id ||
                            "—"}
                        </td>
                        <td>{money(policy.coverageAmount)}</td>
                        <td>{formatDate(policy.expiryDate)}</td>
                        <td>
                          <span
                            className={`insurance-status status-${String(
                              policy.status || "unknown"
                            ).toLowerCase()}`}
                          >
                            {policy.status || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="insurance-info-note">
              Policy creation sets its status in the backend based on its
              expiry date. The provider must already exist.
            </div>
          </section>
        </div>
      )}

      {activeTab === "claims" && (
        <div className="insurance-content-grid">
          <section className="insurance-panel">
            <div className="insurance-panel-heading">
              <h2>Create Insurance Claim</h2>
              <p>Connect a patient, bill, and insurance policy.</p>
            </div>

            <form onSubmit={handleCreateClaim}>
              <label>
                Patient
                <select
                  required
                  value={claimForm.patientId}
                  onChange={(event) =>
                    setClaimForm({
                      ...claimForm,
                      patientId: event.target.value,
                    })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={getId(patient)} value={getId(patient)}>
                      {getPatientName(patient)} (ID: {getId(patient)})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Patient Insurance Policy ID
                <input
                  type="number"
                  min="1"
                  required
                  value={claimForm.patientInsuranceId}
                  onChange={(event) =>
                    setClaimForm({
                      ...claimForm,
                      patientInsuranceId: event.target.value,
                    })
                  }
                  placeholder="ID from Patient Policies"
                />
              </label>

              <label>
                Bill ID
                <input
                  type="number"
                  min="1"
                  required
                  value={claimForm.billId}
                  onChange={(event) =>
                    setClaimForm({
                      ...claimForm,
                      billId: event.target.value,
                    })
                  }
                  placeholder="Enter existing bill ID"
                />
              </label>

              <label>
                Admission ID (optional)
                <input
                  type="number"
                  min="1"
                  value={claimForm.admissionId}
                  onChange={(event) =>
                    setClaimForm({
                      ...claimForm,
                      admissionId: event.target.value,
                    })
                  }
                  placeholder="Required only for an admission-related claim"
                />
              </label>

              <label>
                Claimed Amount (₹)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={claimForm.claimedAmount}
                  onChange={(event) =>
                    setClaimForm({
                      ...claimForm,
                      claimedAmount: event.target.value,
                    })
                  }
                />
              </label>

              <button
                type="submit"
                className="insurance-primary-button"
                disabled={saving}
              >
                <Plus size={17} />
                {saving ? "Creating..." : "Create Claim"}
              </button>
            </form>
          </section>

          <section className="insurance-panel">
            <div className="insurance-panel-heading">
              <h2>Find and Process Claim</h2>
              <p>Load a claim by its ID to submit or settle it.</p>
            </div>

            <form className="insurance-search-row" onSubmit={handleFindClaim}>
              <input
                type="number"
                min="1"
                required
                value={claimIdInput}
                onChange={(event) => setClaimIdInput(event.target.value)}
                placeholder="Enter claim ID"
              />
              <button
                type="submit"
                className="insurance-secondary-button"
                disabled={loading}
              >
                <Search size={16} />
                Find
              </button>
            </form>

            {claim ? (
              <div className="insurance-claim-details">
                <div className="insurance-claim-title">
                  <div>
                    <span>Claim Number</span>
                    <h3>{claim.claimNumber || `Claim #${claim.id}`}</h3>
                  </div>
                  <span
                    className={`insurance-status status-${String(
                      claim.status || "unknown"
                    ).toLowerCase()}`}
                  >
                    {claim.status || "UNKNOWN"}
                  </span>
                </div>

                <div className="insurance-detail-grid">
                  <div>
                    <span>Claim ID</span>
                    <strong>{claim.id ?? "—"}</strong>
                  </div>
                  <div>
                    <span>Patient</span>
                    <strong>
                      {claim.patient
                        ? getPatientName(claim.patient)
                        : `Patient #${claim.patient?.id ?? "—"}`}
                    </strong>
                  </div>
                  <div>
                    <span>Claimed Amount</span>
                    <strong>{money(claim.claimedAmount)}</strong>
                  </div>
                  <div>
                    <span>Approved Amount</span>
                    <strong>{money(claim.approvedAmount)}</strong>
                  </div>
                  <div>
                    <span>Rejected Amount</span>
                    <strong>{money(claim.rejectedAmount)}</strong>
                  </div>
                  <div>
                    <span>Submitted</span>
                    <strong>{formatDate(claim.submittedDate)}</strong>
                  </div>
                  <div>
                    <span>Settled</span>
                    <strong>{formatDate(claim.settlementDate)}</strong>
                  </div>
                </div>

                {claim.status === "CREATED" && (
                  <button
                    type="button"
                    className="insurance-primary-button"
                    onClick={handleSubmitClaim}
                    disabled={saving}
                  >
                    <Send size={16} />
                    {saving ? "Submitting..." : "Submit Claim"}
                  </button>
                )}

                {claim.status === "SUBMITTED" && (
                  <form
                    className="insurance-settlement-form"
                    onSubmit={handleSettleClaim}
                  >
                    <h3>Settle Claim</h3>
                    <p>
                      The combined approved and rejected amounts must not
                      exceed the claimed amount.
                    </p>

                    <label>
                      Approved Amount (₹)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={settlement.approvedAmount}
                        onChange={(event) =>
                          setSettlement({
                            ...settlement,
                            approvedAmount: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      Rejected Amount (₹)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={settlement.rejectedAmount}
                        onChange={(event) =>
                          setSettlement({
                            ...settlement,
                            rejectedAmount: event.target.value,
                          })
                        }
                      />
                    </label>

                    <button
                      type="submit"
                      className="insurance-primary-button"
                      disabled={saving}
                    >
                      <CheckCircle size={16} />
                      {saving ? "Settling..." : "Settle Claim"}
                    </button>
                  </form>
                )}

                {claim.status === "SETTLED" && (
                  <div className="insurance-info-note">
                    This claim is settled. The backend only permits settlement
                    for claims in SUBMITTED status.
                  </div>
                )}
              </div>
            ) : (
              <p className="insurance-empty-state">
                Search for a claim ID or create a claim to see its details and
                available actions.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
