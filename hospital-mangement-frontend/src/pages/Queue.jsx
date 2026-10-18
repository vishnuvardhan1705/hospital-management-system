
import { useCallback, useEffect, useState } from "react";
import { CheckCircle, PhoneCall, RefreshCw } from "lucide-react";

import {
  callQueuePatient,
  completeQueuePatient,
  getQueues,
  getQueuesByDoctor,
} from "../services/queueService";

import "../styles/queue.css";

const unwrapList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const patientName = (entry) => {
  const patient = entry.patient ?? entry.visit?.patient;

  if (!patient) return "—";

  const name = [patient.firstName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  return name || patient.fullName || `Patient #${patient.patientId ?? ""}`;
};

const doctorName = (entry) =>
  entry.doctor?.fullName ??
  entry.visit?.doctor?.fullName ??
  "—";

export default function Queue() {
  const [queues, setQueues] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadQueues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = doctorId.trim()
        ? await getQueuesByDoctor(Number(doctorId))
        : await getQueues();

      setQueues(unwrapList(data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load the queue. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  const performAction = async (queueId, action, successMessage) => {
    setError("");
    setMessage("");

    try {
      await action(queueId);
      setMessage(successMessage);
      await loadQueues();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "The queue action failed."
      );
    }
  };

  const normalizeStatus = (status) =>
    String(status ?? "").toUpperCase();

  return (
    <div className="queue-page">
      <div className="queue-heading">
        <div>
          <h1>Queue Management</h1>
          <p>Monitor waiting patients and manage their queue status.</p>
        </div>

        <button
          type="button"
          className="queue-refresh-button"
          onClick={loadQueues}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="queue-alert queue-alert-error">{error}</div>}
      {message && (
        <div className="queue-alert queue-alert-success">{message}</div>
      )}

      <section className="queue-panel">
        <form
          className="queue-filter"
          onSubmit={(event) => {
            event.preventDefault();
            loadQueues();
          }}
        >
          <label htmlFor="queue-doctor-id">Filter by Doctor ID</label>
          <input
            id="queue-doctor-id"
            type="number"
            min="1"
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
            placeholder="Leave empty for all doctors"
          />

          <button type="submit" disabled={loading}>
            Apply Filter
          </button>

          <button
            type="button"
            className="queue-clear-button"
            onClick={() => setDoctorId("")}
            disabled={!doctorId}
          >
            Clear
          </button>
        </form>
      </section>

      <section className="queue-panel">
        <div className="queue-panel-heading">
          <h2>Current Queue</h2>
          <span>{queues.length} record(s)</span>
        </div>

        {loading ? (
          <p className="queue-empty">Loading queue...</p>
        ) : queues.length === 0 ? (
          <p className="queue-empty">No queue entries found.</p>
        ) : (
          <div className="queue-table-wrapper">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Queue ID</th>
                  <th>Token</th>
                  <th>Position</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Visit ID</th>
                  <th>Queue Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {queues.map((entry) => {
                  const status = normalizeStatus(entry.status);
                  const canCall = status === "WAITING";
                  const canComplete = status === "CALLED";

                  return (
                    <tr key={entry.queueId}>
                      <td>{entry.queueId}</td>
                      <td>{entry.tokenNumber ?? "—"}</td>
                      <td>{entry.queuePosition ?? "—"}</td>
                      <td>{patientName(entry)}</td>
                      <td>{doctorName(entry)}</td>
                      <td>
                        {entry.visit?.visitId ??
                          entry.visitId ??
                          "—"}
                      </td>
                      <td>
                        {entry.queueDate
                          ? String(entry.queueDate).replace("T", " ")
                          : "—"}
                      </td>
                      <td>
                        <span className={`queue-status queue-status-${status.toLowerCase()}`}>
                          {entry.status ?? "—"}
                        </span>
                      </td>
                      <td>
                        <div className="queue-row-actions">
                          <button
                            type="button"
                            disabled={!canCall}
                            onClick={() =>
                              performAction(
                                entry.queueId,
                                callQueuePatient,
                                `Patient with queue ID ${entry.queueId} called.`
                              )
                            }
                          >
                            <PhoneCall size={14} />
                            Call
                          </button>

                          <button
                            type="button"
                            className="queue-complete-button"
                            disabled={!canComplete}
                            onClick={() =>
                              performAction(
                                entry.queueId,
                                completeQueuePatient,
                                `Queue entry ${entry.queueId} completed.`
                              )
                            }
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
