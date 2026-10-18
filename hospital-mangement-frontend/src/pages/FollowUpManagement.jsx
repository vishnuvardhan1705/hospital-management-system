
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Clock,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

import followUpService from "../services/followUpService";
import "../styles/followUpManagement.css";

const getId = (item) => item?.id ?? "";

const patientName = (patient) =>
  `${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim() ||
  patient?.name ||
  `Patient #${getId(patient) || "—"}`;

const doctorName = (doctor) =>
  `${doctor?.firstName ?? ""} ${doctor?.lastName ?? ""}`.trim() ||
  doctor?.name ||
  `Doctor #${getId(doctor) || "—"}`;

const getError = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Something went wrong. Please try again.";

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
};

const emptyForm = {
  patientId: "",
  doctorId: "",
  consultationId: "",
  dischargeId: "",
  followUpDate: "",
  reason: "",
  notes: "",
};

export default function FollowUpManagement() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [patientFollowUps, setPatientFollowUps] = useState([]);

  const [patientSearchId, setPatientSearchId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const clearNotices = () => {
    setError("");
    setMessage("");
  };

  const loadReferenceData = async () => {
    const results = await Promise.allSettled([
      followUpService.getPatients(),
      followUpService.getDoctors(),
    ]);

    if (results[0].status === "fulfilled") {
      setPatients(Array.isArray(results[0].value) ? results[0].value : []);
    }

    if (results[1].status === "fulfilled") {
      setDoctors(Array.isArray(results[1].value) ? results[1].value : []);
    }

    const failed = results.find((result) => result.status === "rejected");
    if (failed) {
      setError(`Could not load some reference data: ${getError(failed.reason)}`);
    }
  };

  const loadUpcoming = async () => {
    setLoading(true);
    clearNotices();

    try {
      const result = await followUpService.getUpcomingFollowUps();
      setUpcoming(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const searchPatientFollowUps = async (event) => {
    event?.preventDefault();
    clearNotices();

    if (!patientSearchId) {
      setError("Select a patient to view their follow-up history.");
      return;
    }

    setLoading(true);

    try {
      const result = await followUpService.getPatientFollowUps(patientSearchId);
      setPatientFollowUps(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    clearNotices();
    await Promise.all([loadReferenceData(), loadUpcoming()]);

    if (patientSearchId) {
      await searchPatientFollowUps();
    }
  };

  useEffect(() => {
    loadReferenceData();
    loadUpcoming();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearNotices();
    setSaving(true);

    const payload = {
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      consultationId: form.consultationId
        ? Number(form.consultationId)
        : null,
      dischargeId: form.dischargeId ? Number(form.dischargeId) : null,
      followUpDate: form.followUpDate,
      reason: form.reason.trim(),
      notes: form.notes.trim(),
    };

    try {
      if (editingId) {
        await followUpService.updateFollowUp(editingId, payload);
        setMessage("Follow-up updated successfully.");
      } else {
        await followUpService.createFollowUp(payload);
        setMessage("Follow-up scheduled successfully.");
      }

      resetForm();
      await loadUpcoming();

      if (patientSearchId) {
        await searchPatientFollowUps();
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    if (item.status !== "SCHEDULED") {
      setError("Only scheduled follow-ups can be edited.");
      return;
    }

    clearNotices();
    setActiveTab("schedule");
    setEditingId(getId(item));
    setForm({
      patientId: String(getId(item.patient) || ""),
      doctorId: String(getId(item.doctor) || ""),
      consultationId: String(getId(item.consultation) || ""),
      dischargeId: String(getId(item.discharge) || ""),
      followUpDate: item.followUpDate || "",
      reason: item.reason || "",
      notes: item.notes || "",
    });
  };

  const handleStatusAction = async (item, action) => {
    const id = getId(item);

    if (!id || item.status !== "SCHEDULED") return;

    const isCancel = action === "cancel";
    const confirmed = window.confirm(
      isCancel
        ? `Cancel follow-up #${id}?`
        : `Mark follow-up #${id} as completed?`
    );

    if (!confirmed) return;

    clearNotices();
    setSaving(true);

    try {
      if (isCancel) {
        await followUpService.cancelFollowUp(id);
        setMessage("Follow-up cancelled.");
      } else {
        await followUpService.completeFollowUp(id);
        setMessage("Follow-up marked as completed.");
      }

      await loadUpcoming();

      if (patientSearchId) {
        await searchPatientFollowUps();
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const renderTable = (items, showPatient = false) => {
    if (loading) {
      return <p className="follow-up-empty">Loading follow-ups...</p>;
    }

    if (!items.length) {
      return (
        <p className="follow-up-empty">
          No follow-up records found.
        </p>
      );
    }

    return (
      <div className="follow-up-table-wrap">
        <table className="follow-up-table">
          <thead>
            <tr>
              <th>ID</th>
              {showPatient && <th>Patient</th>}
              <th>Doctor</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={getId(item)}>
                <td>{getId(item)}</td>

                {showPatient && (
                  <td>
                    {item.patient
                      ? patientName(item.patient)
                      : "—"}
                  </td>
                )}

                <td>{item.doctor ? doctorName(item.doctor) : "—"}</td>
                <td>{item.followUpDate || "—"}</td>
                <td className="follow-up-reason">{item.reason || "—"}</td>
                <td>
                  <span
                    className={`follow-up-status status-${String(
                      item.status || "unknown"
                    ).toLowerCase()}`}
                  >
                    {item.status || "UNKNOWN"}
                  </span>
                </td>

                <td>
                  <div className="follow-up-actions">
                    {item.status === "SCHEDULED" && (
                      <>
                        <button
                          type="button"
                          className="follow-up-icon-button"
                          title="Edit follow-up"
                          aria-label="Edit follow-up"
                          onClick={() => startEdit(item)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="follow-up-icon-button complete"
                          title="Complete follow-up"
                          aria-label="Complete follow-up"
                          disabled={saving}
                          onClick={() => handleStatusAction(item, "complete")}
                        >
                          <CheckCircle size={16} />
                        </button>

                        <button
                          type="button"
                          className="follow-up-icon-button cancel"
                          title="Cancel follow-up"
                          aria-label="Cancel follow-up"
                          disabled={saving}
                          onClick={() => handleStatusAction(item, "cancel")}
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                    {item.status !== "SCHEDULED" && "—"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="follow-up-page">
      <header className="follow-up-header">
        <div>
          <h1>Follow-up Management</h1>
          <p>Schedule follow-up visits and track patient follow-up status.</p>
        </div>

        <button
          type="button"
          className="follow-up-secondary-button"
          onClick={refreshAll}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {message && (
        <div className="follow-up-alert success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="follow-up-alert error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="follow-up-summary">
        <div className="follow-up-summary-card">
          <span><CalendarDays size={21} /></span>
          <div>
            <p>Upcoming Follow-ups</p>
            <h3>{upcoming.length}</h3>
          </div>
        </div>

        <div className="follow-up-summary-card">
          <span><UserRound size={21} /></span>
          <div>
            <p>Patients Loaded</p>
            <h3>{patients.length}</h3>
          </div>
        </div>

        <div className="follow-up-summary-card">
          <span><ClipboardList size={21} /></span>
          <div>
            <p>Doctors Loaded</p>
            <h3>{doctors.length}</h3>
          </div>
        </div>
      </div>

      <nav className="follow-up-tabs">
        <button
          type="button"
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => {
            setActiveTab("upcoming");
            clearNotices();
          }}
        >
          <Clock size={17} />
          Upcoming
        </button>

        <button
          type="button"
          className={activeTab === "patient" ? "active" : ""}
          onClick={() => {
            setActiveTab("patient");
            clearNotices();
          }}
        >
          <Search size={17} />
          Patient History
        </button>

        <button
          type="button"
          className={activeTab === "schedule" ? "active" : ""}
          onClick={() => {
            setActiveTab("schedule");
            clearNotices();
          }}
        >
          <Plus size={17} />
          {editingId ? "Edit Follow-up" : "Schedule Follow-up"}
        </button>
      </nav>

      {activeTab === "upcoming" && (
        <section className="follow-up-panel">
          <div className="follow-up-panel-heading">
            <div>
              <h2>Upcoming Follow-ups</h2>
              <p>Scheduled follow-ups from today onwards.</p>
            </div>
            <button
              type="button"
              className="follow-up-secondary-button"
              onClick={loadUpcoming}
              disabled={loading}
            >
              <RefreshCw size={15} />
              Reload
            </button>
          </div>

          {renderTable(upcoming, true)}
        </section>
      )}

      {activeTab === "patient" && (
        <section className="follow-up-panel">
          <div className="follow-up-panel-heading">
            <div>
              <h2>Patient Follow-up History</h2>
              <p>Search for all follow-up records belonging to one patient.</p>
            </div>
          </div>

          <form className="follow-up-search" onSubmit={searchPatientFollowUps}>
            <label>
              Patient
              <select
                required
                value={patientSearchId}
                onChange={(event) => setPatientSearchId(event.target.value)}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={getId(patient)} value={getId(patient)}>
                    {patientName(patient)} (ID: {getId(patient)})
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="follow-up-primary-button"
              disabled={loading}
            >
              <Search size={16} />
              Search
            </button>
          </form>

          {renderTable(patientFollowUps)}
        </section>
      )}

      {activeTab === "schedule" && (
        <section className="follow-up-panel follow-up-form-panel">
          <div className="follow-up-panel-heading">
            <div>
              <h2>{editingId ? `Edit Follow-up #${editingId}` : "Schedule a Follow-up"}</h2>
              <p>
                Enter the patient, doctor, date, and reason for the follow-up.
              </p>
            </div>
          </div>

          <form className="follow-up-form" onSubmit={handleSubmit}>
            <div className="follow-up-form-grid">
              <label>
                Patient
                <select
                  required
                  value={form.patientId}
                  onChange={(event) =>
                    setForm({ ...form, patientId: event.target.value })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={getId(patient)} value={getId(patient)}>
                      {patientName(patient)} (ID: {getId(patient)})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Doctor
                <select
                  required
                  value={form.doctorId}
                  onChange={(event) =>
                    setForm({ ...form, doctorId: event.target.value })
                  }
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={getId(doctor)} value={getId(doctor)}>
                      {doctorName(doctor)} (ID: {getId(doctor)})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Follow-up Date
                <input
                  type="date"
                  required
                  min={today()}
                  value={form.followUpDate}
                  onChange={(event) =>
                    setForm({ ...form, followUpDate: event.target.value })
                  }
                />
              </label>

              <label>
                Consultation ID (Optional)
                <input
                  type="number"
                  min="1"
                  value={form.consultationId}
                  onChange={(event) =>
                    setForm({ ...form, consultationId: event.target.value })
                  }
                  placeholder="Existing consultation ID"
                />
              </label>

              <label>
                Discharge ID (Optional)
                <input
                  type="number"
                  min="1"
                  value={form.dischargeId}
                  onChange={(event) =>
                    setForm({ ...form, dischargeId: event.target.value })
                  }
                  placeholder="Existing discharge ID"
                />
              </label>

              <label className="follow-up-full-width">
                Reason
                <input
                  required
                  value={form.reason}
                  onChange={(event) =>
                    setForm({ ...form, reason: event.target.value })
                  }
                  placeholder="e.g. Post-operative review"
                />
              </label>

              <label className="follow-up-full-width">
                Notes
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                  placeholder="Additional instructions or notes"
                />
              </label>
            </div>

            <div className="follow-up-form-actions">
              <button
                type="submit"
                className="follow-up-primary-button"
                disabled={saving}
              >
                <CheckCircle size={17} />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Follow-up"
                    : "Schedule Follow-up"}
              </button>

              <button
                type="button"
                className="follow-up-secondary-button"
                onClick={() => {
                  resetForm();
                  clearNotices();
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
