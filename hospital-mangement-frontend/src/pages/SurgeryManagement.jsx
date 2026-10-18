
import { useEffect, useState } from "react";
import {
  CalendarClock,
  ClipboardList,
  RefreshCw,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import surgeryService from "../services/surgeryService";
import "../styles/surgeryManagement.css";

const emptyRequest = {
  patientId: "",
  admissionId: "",
  doctorId: "",
  surgeryTypeId: "",
  reason: "",
  priority: "MEDIUM",
};

const emptySchedule = {
  surgeonId: "",
  otId: "",
  scheduledStart: "",
  scheduledEnd: "",
  anesthesiaType: "",
};

const emptyType = {
  surgeryName: "",
  surgeryCode: "",
  description: "",
  standardCharge: "",
  estimatedDuration: "",
  status: "ACTIVE",
};

const emptyTheatre = {
  otName: "",
  location: "",
  capacity: "",
  status: "ACTIVE",
};

const asArray = (data) => Array.isArray(data) ? data : [];

const patientName = (patient) =>
  patient
    ? [patient.firstName, patient.lastName].filter(Boolean).join(" ") ||
      `Patient #${patient.id ?? "?"}`
    : "Unknown patient";

const doctorName = (doctor) =>
  doctor
    ? [doctor.firstName, doctor.lastName].filter(Boolean).join(" ") ||
      doctor.name ||
      `Doctor #${doctor.id ?? "?"}`
    : "Unknown doctor";

const typeId = (type) => type.surgeryTypeId ?? type.id;

export default function SurgeryManagement() {
  const [activeTab, setActiveTab] = useState("requests");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [surgeryTypes, setSurgeryTypes] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  const [requestForm, setRequestForm] = useState(emptyRequest);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [typeForm, setTypeForm] = useState(emptyType);
  const [theatreForm, setTheatreForm] = useState(emptyTheatre);

  const [requestIdInput, setRequestIdInput] = useState("");
  const [currentRequest, setCurrentRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("SCHEDULED");
  const [patientFilter, setPatientFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  const loadSupportingData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        patientData,
        doctorData,
        admissionData,
        typeData,
        theatreData,
      ] = await Promise.all([
        surgeryService.getPatients(),
        surgeryService.getDoctors(),
        surgeryService.getAdmissions(),
        surgeryService.getSurgeryTypes(),
        surgeryService.getOperationTheatres(),
      ]);

      setPatients(asArray(patientData));
      setDoctors(asArray(doctorData));
      setAdmissions(asArray(admissionData));
      setSurgeryTypes(asArray(typeData));
      setTheatres(asArray(theatreData));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load surgery reference data. Check the backend and API access."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSurgeries = async (status = statusFilter) => {
    setLoading(true);
    setError("");

    try {
      const data = patientFilter
        ? await surgeryService.getSurgeriesByPatient(Number(patientFilter))
        : await surgeryService.getSurgeriesByStatus(status);

      const rows = asArray(data);
      setSurgeries(
        patientFilter
          ? rows.filter((item) => !status || item.status === status)
          : rows
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to load surgeries with status ${status}.`
      );
      setSurgeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupportingData();
    loadSurgeries("SCHEDULED");
    // Initial data load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateRequest = async (event) => {
    event.preventDefault();
    clearFeedback();
    setSaving(true);

    try {
      const payload = {
        patientId: Number(requestForm.patientId),
        doctorId: Number(requestForm.doctorId),
        surgeryTypeId: Number(requestForm.surgeryTypeId),
        admissionId: requestForm.admissionId
          ? Number(requestForm.admissionId)
          : null,
        reason: requestForm.reason,
        priority: requestForm.priority,
      };

      const created = await surgeryService.createSurgeryRequest(payload);

      setCurrentRequest(created);
      setRequestIdInput(String(created.id ?? ""));
      setRequestForm(emptyRequest);
      setMessage(
        `Surgery request created. Request ID: ${created.id ?? "check the response"}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the surgery request."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLoadRequest = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!requestIdInput) {
      setError("Enter a surgery request ID.");
      return;
    }

    try {
      const data = await surgeryService.getSurgeryRequest(
        Number(requestIdInput)
      );
      setCurrentRequest(data);
      setMessage(`Loaded surgery request #${data.id}.`);
    } catch (err) {
      setCurrentRequest(null);
      setError(
        err.response?.data?.message ||
          "Unable to load that surgery request."
      );
    }
  };

  const handleApproveRequest = async () => {
    if (!currentRequest?.id) {
      setError("Load or create a surgery request first.");
      return;
    }

    clearFeedback();
    setSaving(true);

    try {
      const data = await surgeryService.approveSurgeryRequest(
        currentRequest.id
      );
      setCurrentRequest(data);
      setMessage("Surgery request approved.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to approve the surgery request."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleSurgery = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!currentRequest?.id) {
      setError("Load or create a surgery request first.");
      return;
    }

    if (
      !scheduleForm.scheduledStart ||
      !scheduleForm.scheduledEnd ||
      scheduleForm.scheduledEnd <= scheduleForm.scheduledStart
    ) {
      setError("Scheduled end must be later than scheduled start.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        surgeonId: Number(scheduleForm.surgeonId),
        otId: Number(scheduleForm.otId),
        scheduledStart: scheduleForm.scheduledStart,
        scheduledEnd: scheduleForm.scheduledEnd,
        anesthesiaType: scheduleForm.anesthesiaType,
      };

      const created = await surgeryService.scheduleSurgery(
        currentRequest.id,
        payload
      );

      setCurrentRequest({
        ...currentRequest,
        status: "SCHEDULED",
      });
      setScheduleForm(emptySchedule);
      setMessage(`Surgery scheduled successfully. Surgery ID: ${created.id}`);
      setActiveTab("surgeries");
      setStatusFilter("SCHEDULED");
      setPatientFilter("");
      await loadSurgeries("SCHEDULED");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to schedule the surgery. Ensure the request is approved first."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSurgeryAction = async (surgery, action) => {
    clearFeedback();

    try {
      if (action === "start") {
        await surgeryService.startSurgery(surgery.id);
        setMessage(`Surgery #${surgery.id} started.`);
      } else if (action === "complete") {
        const outcome = window.prompt(
          "Enter the surgery outcome:"
        );
        if (outcome === null || !outcome.trim()) return;

        await surgeryService.completeSurgery(surgery.id, {
          outcome: outcome.trim(),
        });
        setMessage(`Surgery #${surgery.id} completed.`);
      } else if (action === "cancel") {
        const confirmed = window.confirm(
          `Cancel surgery #${surgery.id}?`
        );
        if (!confirmed) return;

        await surgeryService.cancelSurgery(surgery.id);
        setMessage(`Surgery #${surgery.id} cancelled.`);
      }

      await loadSurgeries(statusFilter);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${action} this surgery.`
      );
    }
  };

  const handleCreateType = async (event) => {
    event.preventDefault();
    clearFeedback();
    setSaving(true);

    try {
      await surgeryService.createSurgeryType({
        ...typeForm,
        standardCharge: typeForm.standardCharge
          ? Number(typeForm.standardCharge)
          : null,
        estimatedDuration: typeForm.estimatedDuration
          ? Number(typeForm.estimatedDuration)
          : null,
      });

      setTypeForm(emptyType);
      await loadSupportingData();
      setMessage("Surgery type created.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the surgery type."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTheatre = async (event) => {
    event.preventDefault();
    clearFeedback();
    setSaving(true);

    try {
      await surgeryService.createOperationTheatre({
        ...theatreForm,
        capacity: theatreForm.capacity
          ? Number(theatreForm.capacity)
          : null,
      });

      setTheatreForm(emptyTheatre);
      await loadSupportingData();
      setMessage("Operation theatre created.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the operation theatre."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="surgery-page">
      <header className="surgery-header">
        <div>
          <h1>Surgery Management</h1>
          <p>
            Manage surgery requests, operating theatres, schedules and outcomes.
          </p>
        </div>

        <button
          type="button"
          className="surgery-secondary-btn"
          onClick={async () => {
            await loadSupportingData();
            await loadSurgeries(statusFilter);
          }}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      <div className="surgery-stats">
        <div className="surgery-stat">
          <span>Surgery types</span>
          <strong>{surgeryTypes.length}</strong>
        </div>
        <div className="surgery-stat">
          <span>Operation theatres</span>
          <strong>{theatres.length}</strong>
        </div>
        <div className="surgery-stat">
          <span>Patients available</span>
          <strong>{patients.length}</strong>
        </div>
        <div className="surgery-stat">
          <span>Doctors available</span>
          <strong>{doctors.length}</strong>
        </div>
      </div>

      {error && <div className="surgery-alert error">{error}</div>}
      {message && <div className="surgery-alert success">{message}</div>}

      <nav className="surgery-tabs">
        <button
          type="button"
          className={activeTab === "requests" ? "active" : ""}
          onClick={() => setActiveTab("requests")}
        >
          <ClipboardList size={17} /> Requests
        </button>
        <button
          type="button"
          className={activeTab === "surgeries" ? "active" : ""}
          onClick={() => setActiveTab("surgeries")}
        >
          <Scissors size={17} /> Surgeries
        </button>
        <button
          type="button"
          className={activeTab === "resources" ? "active" : ""}
          onClick={() => setActiveTab("resources")}
        >
          <ShieldCheck size={17} /> Surgery Types & Theatres
        </button>
      </nav>

      {activeTab === "requests" && (
        <>
          <section className="surgery-panel">
            <h2>Create Surgery Request</h2>

            <form className="surgery-form" onSubmit={handleCreateRequest}>
              <label>
                Patient
                <select
                  required
                  value={requestForm.patientId}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      patientId: e.target.value,
                    })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.id} — {patientName(patient)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Requesting doctor
                <select
                  required
                  value={requestForm.doctorId}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      doctorId: e.target.value,
                    })
                  }
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.id} — {doctorName(doctor)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Surgery type
                <select
                  required
                  value={requestForm.surgeryTypeId}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      surgeryTypeId: e.target.value,
                    })
                  }
                >
                  <option value="">Select surgery type</option>
                  {surgeryTypes.map((type) => (
                    <option key={typeId(type)} value={typeId(type)}>
                      {type.surgeryName} ({type.surgeryCode})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Admission (optional)
                <select
                  value={requestForm.admissionId}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      admissionId: e.target.value,
                    })
                  }
                >
                  <option value="">No admission linked</option>
                  {admissions.map((admission) => (
                    <option key={admission.id} value={admission.id}>
                      Admission #{admission.id} —{" "}
                      {admission.admissionNumber || admission.status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select
                  value={requestForm.priority}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </label>

              <label className="full-width">
                Reason for surgery
                <textarea
                  required
                  rows="3"
                  value={requestForm.reason}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Describe the reason for requesting surgery"
                />
              </label>

              <button
                className="surgery-primary-btn"
                type="submit"
                disabled={saving || loading}
              >
                {saving ? "Saving..." : "Create Request"}
              </button>
            </form>
          </section>

          <section className="surgery-panel">
            <h2>Load or Approve a Request</h2>
            <p className="surgery-help">
              Enter the ID of a surgery request, or use the ID returned
              after creating a request above.
            </p>

            <form className="surgery-inline-form" onSubmit={handleLoadRequest}>
              <label>
                Surgery request ID
                <input
                  required
                  type="number"
                  min="1"
                  value={requestIdInput}
                  onChange={(e) => setRequestIdInput(e.target.value)}
                  placeholder="Enter request ID"
                />
              </label>
              <button type="submit" className="surgery-secondary-btn">
                Load Request
              </button>
            </form>

            {currentRequest && (
              <div className="surgery-request-summary">
                <div>
                  <span>Request ID</span>
                  <strong>{currentRequest.id}</strong>
                </div>
                <div>
                  <span>Patient</span>
                  <strong>{patientName(currentRequest.patient)}</strong>
                </div>
                <div>
                  <span>Surgery type</span>
                  <strong>
                    {currentRequest.surgeryType?.surgeryName || "-"}
                  </strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{currentRequest.status || "-"}</strong>
                </div>

                {currentRequest.status === "REQUESTED" && (
                  <button
                    type="button"
                    className="surgery-primary-btn"
                    onClick={handleApproveRequest}
                    disabled={saving}
                  >
                    Approve Request
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="surgery-panel">
            <h2>
              <CalendarClock size={20} /> Schedule Approved Surgery
            </h2>
            <p className="surgery-help">
              Load an approved request above before scheduling. The backend
              requires the request status to be APPROVED.
            </p>

            <form className="surgery-form" onSubmit={handleScheduleSurgery}>
              <label>
                Surgeon
                <select
                  required
                  value={scheduleForm.surgeonId}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      surgeonId: e.target.value,
                    })
                  }
                >
                  <option value="">Select surgeon</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.id} — {doctorName(doctor)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Operation theatre
                <select
                  required
                  value={scheduleForm.otId}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      otId: e.target.value,
                    })
                  }
                >
                  <option value="">Select theatre</option>
                  {theatres.map((theatre) => (
                    <option key={theatre.id} value={theatre.id}>
                      {theatre.otName} — {theatre.location}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Scheduled start
                <input
                  required
                  type="datetime-local"
                  value={scheduleForm.scheduledStart}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      scheduledStart: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Scheduled end
                <input
                  required
                  type="datetime-local"
                  min={scheduleForm.scheduledStart || undefined}
                  value={scheduleForm.scheduledEnd}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      scheduledEnd: e.target.value,
                    })
                  }
                />
              </label>

              <label className="full-width">
                Anesthesia type
                <input
                  required
                  value={scheduleForm.anesthesiaType}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      anesthesiaType: e.target.value,
                    })
                  }
                  placeholder="Enter anesthesia type"
                />
              </label>

              <button
                type="submit"
                className="surgery-primary-btn"
                disabled={
                  saving ||
                  !currentRequest ||
                  currentRequest.status !== "APPROVED"
                }
              >
                {saving ? "Scheduling..." : "Schedule Surgery"}
              </button>
            </form>
          </section>
        </>
      )}

      {activeTab === "surgeries" && (
        <section className="surgery-panel">
          <h2>Scheduled and Completed Surgeries</h2>

          <form
            className="surgery-filter-form"
            onSubmit={(e) => {
              e.preventDefault();
              loadSurgeries(statusFilter);
            }}
          >
            <label>
              Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>

            <label>
              Patient (optional)
              <select
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
              >
                <option value="">All patients for selected status</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.id} — {patientName(patient)}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="surgery-primary-btn">
              Search
            </button>
          </form>

          {loading ? (
            <p>Loading surgeries...</p>
          ) : surgeries.length === 0 ? (
            <p className="surgery-empty">No surgeries found for this filter.</p>
          ) : (
            <div className="surgery-table-wrap">
              <table className="surgery-table">
                <thead>
                  <tr>
                    <th>Surgery ID</th>
                    <th>Patient</th>
                    <th>Surgery type</th>
                    <th>Surgeon</th>
                    <th>Theatre</th>
                    <th>Scheduled start</th>
                    <th>Scheduled end</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {surgeries.map((surgery) => (
                    <tr key={surgery.id}>
                      <td>{surgery.id}</td>
                      <td>{patientName(surgery.patient)}</td>
                      <td>
                        {surgery.surgeryRequest?.surgeryType?.surgeryName || "-"}
                      </td>
                      <td>{doctorName(surgery.surgeon)}</td>
                      <td>{surgery.operationTheatre?.otName || "-"}</td>
                      <td>
                        {surgery.scheduledStart
                          ? new Date(surgery.scheduledStart).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        {surgery.scheduledEnd
                          ? new Date(surgery.scheduledEnd).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <span className="surgery-status">
                          {surgery.status}
                        </span>
                      </td>
                      <td>
                        <div className="surgery-actions">
                          {surgery.status === "SCHEDULED" && (
                            <button
                              type="button"
                              onClick={() => handleSurgeryAction(surgery, "start")}
                            >
                              Start
                            </button>
                          )}
                          {surgery.status === "IN_PROGRESS" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSurgeryAction(surgery, "complete")
                              }
                            >
                              Complete
                            </button>
                          )}
                          {["SCHEDULED"].includes(surgery.status) && (
                            <button
                              type="button"
                              onClick={() => handleSurgeryAction(surgery, "cancel")}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === "resources" && (
        <div className="surgery-resource-grid">
          <section className="surgery-panel">
            <h2>Create Surgery Type</h2>

            <form className="surgery-form single-column" onSubmit={handleCreateType}>
              <label>
                Surgery name
                <input
                  required
                  value={typeForm.surgeryName}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, surgeryName: e.target.value })
                  }
                />
              </label>
              <label>
                Surgery code
                <input
                  required
                  value={typeForm.surgeryCode}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, surgeryCode: e.target.value })
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  rows="2"
                  value={typeForm.description}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, description: e.target.value })
                  }
                />
              </label>
              <label>
                Standard charge
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={typeForm.standardCharge}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, standardCharge: e.target.value })
                  }
                />
              </label>
              <label>
                Estimated duration (minutes)
                <input
                  type="number"
                  min="1"
                  value={typeForm.estimatedDuration}
                  onChange={(e) =>
                    setTypeForm({
                      ...typeForm,
                      estimatedDuration: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={typeForm.status}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
              <button
                className="surgery-primary-btn"
                type="submit"
                disabled={saving}
              >
                Create Surgery Type
              </button>
            </form>

            <h3>Existing Surgery Types</h3>
            <div className="surgery-simple-list">
              {surgeryTypes.map((type) => (
                <div key={typeId(type)}>
                  <strong>{type.surgeryName}</strong>
                  <span>{type.surgeryCode} · {type.status}</span>
                  <span>
                    {type.standardCharge ?? "No charge"} ·{" "}
                    {type.estimatedDuration ?? "?"} min
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="surgery-panel">
            <h2>Create Operation Theatre</h2>

            <form className="surgery-form single-column" onSubmit={handleCreateTheatre}>
              <label>
                Theatre name
                <input
                  required
                  value={theatreForm.otName}
                  onChange={(e) =>
                    setTheatreForm({ ...theatreForm, otName: e.target.value })
                  }
                />
              </label>
              <label>
                Location
                <input
                  required
                  value={theatreForm.location}
                  onChange={(e) =>
                    setTheatreForm({ ...theatreForm, location: e.target.value })
                  }
                />
              </label>
              <label>
                Capacity
                <input
                  type="number"
                  min="1"
                  value={theatreForm.capacity}
                  onChange={(e) =>
                    setTheatreForm({ ...theatreForm, capacity: e.target.value })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={theatreForm.status}
                  onChange={(e) =>
                    setTheatreForm({ ...theatreForm, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
              <button
                className="surgery-primary-btn"
                type="submit"
                disabled={saving}
              >
                Create Theatre
              </button>
            </form>

            <h3>Existing Operation Theatres</h3>
            <div className="surgery-simple-list">
              {theatres.map((theatre) => (
                <div key={theatre.id}>
                  <strong>{theatre.otName}</strong>
                  <span>{theatre.location}</span>
                  <span>
                    Capacity: {theatre.capacity ?? "-"} · {theatre.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
