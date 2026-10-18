
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ClipboardList,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import auditLogService from "../services/auditLogService";
import "../styles/auditLogManagement.css";

const initialForm = {
  userId: "",
  action: "VIEW",
  entityName: "Patient",
  entityId: "",
  oldValue: "",
  newValue: "",
  ipAddress: "",
};

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong."
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString();
}

export default function AuditLogManagement() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userId, setUserId] = useState("");
  const [entityName, setEntityName] = useState("Patient");
  const [entityId, setEntityId] = useState("");
  const [patientId, setPatientId] = useState("");

  const loadAllLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await auditLogService.getAll();
      setLogs(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllLogs();
  }, [loadAllLogs]);

  const loadFilteredLogs = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let result;

      if (filter === "USER") {
        if (!userId.trim()) {
          throw new Error("Enter a user ID.");
        }

        result = await auditLogService.getByUser(userId.trim());
      } else if (filter === "ENTITY") {
        if (!entityName.trim() || !entityId.trim()) {
          throw new Error("Enter an entity name and entity ID.");
        }

        result = await auditLogService.getEntityHistory(
          entityName.trim(),
          entityId.trim()
        );
      } else if (filter === "PATIENT") {
        if (!patientId.trim()) {
          throw new Error("Enter a patient ID.");
        }

        result = await auditLogService.getPatientAccessHistory(
          patientId.trim()
        );
      } else {
        result = await auditLogService.getAll();
      }

      setLogs(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        userId: form.userId.trim() ? Number(form.userId) : null,
        action: form.action.trim(),
        entityName: form.entityName.trim(),
        entityId: form.entityId.trim()
          ? Number(form.entityId)
          : null,
        oldValue: form.oldValue.trim() || null,
        newValue: form.newValue.trim() || null,
        ipAddress: form.ipAddress.trim() || null,
      };

      await auditLogService.create(payload);

      setForm(initialForm);
      setSuccess("Audit log created successfully.");
      await loadAllLogs();
      setFilter("ALL");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return logs.filter((log) =>
      [
        log.id,
        log.userId,
        log.action,
        log.entityName,
        log.entityId,
        log.ipAddress,
        log.oldValue,
        log.newValue,
        log.createdAt,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [logs, search]);

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div>
          <h1>Audit Logs</h1>
          <p>
            Review recorded user activity and changes to hospital records.
          </p>
        </div>

        <button
          type="button"
          className="audit-refresh-button"
          onClick={loadAllLogs}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="audit-alert audit-alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="audit-alert audit-alert-success">
          {success}
        </div>
      )}

      <div className="audit-summary">
        <div className="audit-summary-icon">
          <ShieldCheck size={26} />
        </div>
        <div>
          <span>Logs currently loaded</span>
          <strong>{logs.length}</strong>
        </div>
        <div className="audit-summary-icon">
          <Activity size={26} />
        </div>
        <div>
          <span>Matching search results</span>
          <strong>{filteredLogs.length}</strong>
        </div>
      </div>

      <section className="audit-panel">
        <div className="audit-panel-heading">
          <div>
            <h2>Find Audit History</h2>
            <p>Select a history type to query the backend.</p>
          </div>
          <ClipboardList size={23} />
        </div>

        <div className="audit-filter-tabs">
          {[
            ["ALL", "All Logs"],
            ["USER", "By User"],
            ["ENTITY", "By Entity"],
            ["PATIENT", "Patient Access"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={
                filter === value
                  ? "audit-filter-tab active"
                  : "audit-filter-tab"
              }
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {filter === "ALL" ? (
          <button
            type="button"
            className="audit-primary-button"
            onClick={loadAllLogs}
            disabled={loading}
          >
            Load All Logs
          </button>
        ) : (
          <form
            className="audit-query-form"
            onSubmit={loadFilteredLogs}
          >
            {filter === "USER" && (
              <label>
                User ID
                <input
                  type="number"
                  min="1"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                />
              </label>
            )}

            {filter === "ENTITY" && (
              <>
                <label>
                  Entity Name
                  <input
                    value={entityName}
                    onChange={(event) => setEntityName(event.target.value)}
                    placeholder="For example, Patient"
                    required
                  />
                </label>

                <label>
                  Entity ID
                  <input
                    type="number"
                    min="1"
                    value={entityId}
                    onChange={(event) => setEntityId(event.target.value)}
                    required
                  />
                </label>
              </>
            )}

            {filter === "PATIENT" && (
              <label>
                Patient ID
                <input
                  type="number"
                  min="1"
                  value={patientId}
                  onChange={(event) => setPatientId(event.target.value)}
                  required
                />
              </label>
            )}

            <button
              type="submit"
              className="audit-primary-button"
              disabled={loading}
            >
              <Search size={17} />
              {loading ? "Searching..." : "Find History"}
            </button>
          </form>
        )}
      </section>

      <section className="audit-panel">
        <div className="audit-panel-heading">
          <div>
            <h2>Audit Log Records</h2>
            <p>Search the records currently loaded.</p>
          </div>
        </div>

        <div className="audit-search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search action, entity, user ID, IP address..."
          />
        </div>

        {loading ? (
          <div className="audit-empty">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="audit-empty">No audit logs found.</div>
        ) : (
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>IP Address</th>
                  <th>Created At</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id ?? "—"}</td>
                    <td>{log.userId ?? "—"}</td>
                    <td>
                      <span className="audit-action">
                        {log.action || "—"}
                      </span>
                    </td>
                    <td>{log.entityName || "—"}</td>
                    <td>{log.entityId ?? "—"}</td>
                    <td>{log.ipAddress || "—"}</td>
                    <td>{formatDate(log.createdAt)}</td>
                    <td className="audit-value-cell">
                      {log.oldValue || "—"}
                    </td>
                    <td className="audit-value-cell">
                      {log.newValue || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="audit-panel">
        <div className="audit-panel-heading">
          <div>
            <h2>Create Audit Log</h2>
            <p>
              Use this form only when manually recording an event is
              appropriate for your application.
            </p>
          </div>
        </div>

        <form className="audit-create-form" onSubmit={handleCreate}>
          <label>
            User ID <span>(optional)</span>
            <input
              type="number"
              min="1"
              name="userId"
              value={form.userId}
              onChange={handleFormChange}
            />
          </label>

          <label>
            Action
            <input
              name="action"
              value={form.action}
              onChange={handleFormChange}
              placeholder="For example, VIEW or UPDATE"
              required
            />
          </label>

          <label>
            Entity Name
            <input
              name="entityName"
              value={form.entityName}
              onChange={handleFormChange}
              placeholder="For example, Patient"
              required
            />
          </label>

          <label>
            Entity ID <span>(optional)</span>
            <input
              type="number"
              min="1"
              name="entityId"
              value={form.entityId}
              onChange={handleFormChange}
            />
          </label>

          <label>
            IP Address <span>(optional)</span>
            <input
              name="ipAddress"
              value={form.ipAddress}
              onChange={handleFormChange}
              placeholder="If known"
            />
          </label>

          <label>
            Old Value <span>(optional)</span>
            <textarea
              name="oldValue"
              value={form.oldValue}
              onChange={handleFormChange}
              rows={3}
            />
          </label>

          <label>
            New Value <span>(optional)</span>
            <textarea
              name="newValue"
              value={form.newValue}
              onChange={handleFormChange}
              rows={3}
            />
          </label>

          <button
            type="submit"
            className="audit-primary-button"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Create Audit Log"}
          </button>
        </form>
      </section>
    </div>
  );
}
