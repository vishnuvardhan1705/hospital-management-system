
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  RefreshCw,
  Ticket,
  UserCheck,
} from "lucide-react";

import {
  checkInVisit,
  createVisit,
  getVisits,
} from "../services/visitService";
import { generateQueueToken } from "../services/queueService";
import "../styles/visits.css";

const initialForm = {
  patientId: "",
  appointmentId: "",
  doctorId: "",
  departmentId: "",
  visitType: "OPD",
};

const getList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const getPatientName = (visit) => {
  const patient = visit.patient;
  if (!patient) return "—";

  return (
    [patient.firstName, patient.lastName].filter(Boolean).join(" ") ||
    patient.fullName ||
    `Patient #${patient.id ?? "—"}`
  );
};

const getErrorMessage = (error, fallback) => {
  const body = error.response?.data;
  if (typeof body === "string") return body;
  return body?.message || body?.error || fallback;
};

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadVisits = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getVisits();
      setVisits(getList(data));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load visits."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const visitData = {
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      departmentId: Number(form.departmentId),
      visitType: form.visitType.trim(),
    };

    if (form.appointmentId.trim()) {
      visitData.appointmentId = Number(form.appointmentId);
    }

    try {
      const created = await createVisit(visitData);

      setForm(initialForm);
      setMessage(
        `Visit created successfully. Visit ID: ${created?.id ?? "created"}`
      );
      await loadVisits();
    } catch (err) {
  console.error("Create visit error:", {
    status: err.response?.status,
    response: err.response?.data,
    message: err.message,
  });

  const responseData = err.response?.data;

  setError(
    typeof responseData === "string"
      ? responseData
      : responseData?.message ||
        responseData?.error ||
        `Failed to create visit. HTTP ${err.response?.status ?? "network error"}`
  );
} finally {
  setSaving(false);
}
  };

  const handleCheckIn = async (visitId) => {
    setError("");
    setMessage("");

    try {
      await checkInVisit(visitId);
      setMessage(`Visit ${visitId} checked in successfully.`);
      await loadVisits();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to check in this visit."));
    }
  };

  const handleToken = async (visitId) => {
    setError("");
    setMessage("");

    try {
      const result = await generateQueueToken(visitId);
      const tokenNumber =
        result?.tokenNumber ??
        result?.queueToken ??
        result?.token ??
        "Request completed";

      setMessage(`Queue token: ${tokenNumber}`);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to generate queue token."));
    }
  };

  return (
    <div className="visits-page">
      <div className="visits-heading">
        <div>
          <h1>Patient Visits</h1>
          <p>Create visits, check in patients, and generate queue tokens.</p>
        </div>

        <button
          type="button"
          className="visit-refresh-button"
          onClick={loadVisits}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="visit-alert visit-alert-error">{error}</div>
      )}
      {message && (
        <div className="visit-alert visit-alert-success">{message}</div>
      )}

      <section className="visit-panel">
        <div className="visit-panel-heading">
          <Activity size={20} />
          <div>
            <h2>Create Patient Visit</h2>
            <p>Enter valid IDs from your database.</p>
          </div>
        </div>

        <form className="visit-form" onSubmit={handleCreate}>
          <label>
            Patient ID *
            <input
              type="number"
              min="1"
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Appointment ID
            <input
              type="number"
              min="1"
              name="appointmentId"
              value={form.appointmentId}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>

          <label>
            Doctor ID *
            <input
              type="number"
              min="1"
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Department ID *
            <input
              type="number"
              min="1"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Visit Type *
            <input
              name="visitType"
              value={form.visitType}
              onChange={handleChange}
              required
            />
          </label>

          <div className="visit-form-actions">
            <button type="submit" disabled={saving}>
              <ClipboardList size={16} />
              {saving ? "Creating..." : "Create Visit"}
            </button>
          </div>
        </form>
      </section>

      <section className="visit-panel">
        <div className="visit-panel-heading">
          <UserCheck size={20} />
          <div>
            <h2>Visit Records</h2>
            <p>{visits.length} visit(s)</p>
          </div>
        </div>

        {loading ? (
          <p className="visit-empty">Loading visits...</p>
        ) : visits.length === 0 ? (
          <p className="visit-empty">No visits found.</p>
        ) : (
          <div className="visit-table-wrapper">
            <table className="visit-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Appointment</th>
                  <th>Visit Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.id}</td>
                    <td>{getPatientName(visit)}</td>
                    <td>{visit.doctor?.name ?? "—"}</td>
                    <td>{visit.department?.departmentName ?? "—"}</td>
                    <td>{visit.appointment?.appointmentNumber ?? "—"}</td>
                    <td>{visit.visitDate ?? "—"}</td>
                    <td>{visit.visitType ?? "—"}</td>
                    <td>
                      <span className="visit-status">
                        {visit.status ?? "—"}
                      </span>
                    </td>
                    <td>
                      <div className="visit-row-actions">
                        <button
                          type="button"
                          onClick={() => handleCheckIn(visit.id)}
                          disabled={
                            !visit.id ||
                            ["CHECKED_IN", "COMPLETED", "CANCELLED"].includes(
                              String(visit.status).toUpperCase()
                            )
                          }
                        >
                          Check In
                        </button>

                        <button
                          type="button"
                          className="visit-token-button"
                          onClick={() => handleToken(visit.id)}
                          disabled={!visit.id}
                        >
                          <Ticket size={14} />
                          Token
                        </button>

                        <Link to={`/visits/${visit.id}`}>
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
