
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  RefreshCw,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import emergencyService from "../services/emergencyService";
import "../styles/emergencyManagement.css";

const emptyVisit = {
  patientId: "",
  arrivalMode: "WALK_IN",
  chiefComplaint: "",
  priority: "MEDIUM",
  assignedDoctor: "",
  status: "WAITING",
};

const emptyTriage = {
  emergencyVisitId: "",
  patientId: "",
  priority: "MEDIUM",
  symptoms: "",
  vitals: "",
  triageNotes: "",
  assessedBy: "",
};

const emptyAdmission = {
  doctorId: "",
  departmentId: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  admissionReason: "",
  diagnosis: "",
  wardId: "",
  roomId: "",
  bedId: "",
  expectedDischargeDate: "",
  status: "PENDING",
};

const asArray = (value) =>
  Array.isArray(value) ? value : [];

const getPatientName = (patient) => {
  if (!patient) return "Unknown patient";

  const name = [patient.firstName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  return name || `Patient #${patient.id ?? "?"}`;
};

const getDoctorName = (doctor) => {
  if (!doctor) return "Unknown doctor";

  const name = [doctor.firstName, doctor.lastName]
    .filter(Boolean)
    .join(" ");

  return name || doctor.name || `Doctor #${doctor.id ?? "?"}`;
};

const getPatientId = (visit) => visit.patient?.id;

export default function EmergencyManagement() {
  const [activeTab, setActiveTab] = useState("visits");
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [triageRecords, setTriageRecords] = useState([]);

  const [visitForm, setVisitForm] = useState(emptyVisit);
  const [triageForm, setTriageForm] = useState(emptyTriage);
  const [admissionForm, setAdmissionForm] =
    useState(emptyAdmission);

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [historyPatientId, setHistoryPatientId] = useState("");
  const [historyRecords, setHistoryRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [visitData, patientData, doctorData] =
        await Promise.all([
          emergencyService.getAllVisits(),
          emergencyService.getPatients(),
          emergencyService.getDoctors(),
        ]);

      setVisits(asArray(visitData));
      setPatients(asArray(patientData));
      setDoctors(asArray(doctorData));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load emergency management data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetFeedback = () => {
    setError("");
    setMessage("");
  };

  const handleCreateVisit = async (event) => {
    event.preventDefault();
    resetFeedback();
    setSaving(true);

    try {
      const payload = {
        ...visitForm,
        patientId: Number(visitForm.patientId),
        assignedDoctor: visitForm.assignedDoctor
          ? Number(visitForm.assignedDoctor)
          : null,
      };

      await emergencyService.createVisit(payload);
      setVisitForm(emptyVisit);
      setMessage("Emergency visit registered successfully.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to register the emergency visit."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAssignDoctor = async (visit) => {
    resetFeedback();

    const doctorId = window.prompt(
      "Enter the doctor ID to assign:"
    );

    if (!doctorId) return;

    if (!doctors.some((doctor) => String(doctor.id) === doctorId)) {
      setError("Enter a doctor ID from the available doctors list.");
      return;
    }

    try {
      await emergencyService.assignDoctor(
        visit.emergencyVisitId,
        Number(doctorId)
      );

      setMessage("Doctor assigned successfully.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to assign doctor."
      );
    }
  };

  const handleVisitAction = async (visit, action) => {
    resetFeedback();

    const actions = {
      treatment: () =>
        emergencyService.startTreatment(visit.emergencyVisitId),
      discharge: () =>
        emergencyService.dischargePatient(visit.emergencyVisitId),
    };

    try {
      await actions[action]();

      setMessage(
        action === "treatment"
          ? "Emergency visit marked as under treatment."
          : "Emergency patient discharged."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the emergency visit."
      );
    }
  };

  const openTriage = (visit) => {
    setSelectedVisit(visit);
    setTriageForm({
      ...emptyTriage,
      emergencyVisitId: String(visit.emergencyVisitId),
      patientId: String(getPatientId(visit) ?? ""),
      priority: visit.priority || "MEDIUM",
    });
    setActiveTab("triage");
    resetFeedback();
  };

  const handleCreateTriage = async (event) => {
    event.preventDefault();
    resetFeedback();
    setSaving(true);

    try {
      const payload = {
        ...triageForm,
        emergencyVisitId: Number(triageForm.emergencyVisitId),
        patientId: Number(triageForm.patientId),
      };

      await emergencyService.createTriageRecord(payload);

      setMessage("Triage record saved successfully.");
      setTriageForm(emptyTriage);
      setSelectedVisit(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the triage record."
      );
    } finally {
      setSaving(false);
    }
  };

  const loadTriageForVisit = async (visitId) => {
    resetFeedback();

    try {
      const records =
        await emergencyService.getTriageByVisit(visitId);

      setTriageRecords(asArray(records));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load triage records."
      );
    }
  };

  const loadPatientTriageHistory = async (event) => {
    event.preventDefault();
    resetFeedback();

    if (!historyPatientId) {
      setError("Enter a patient ID.");
      return;
    }

    try {
      const records =
        await emergencyService.getPatientTriageHistory(
          Number(historyPatientId)
        );

      setHistoryRecords(asArray(records));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load patient triage history."
      );
    }
  };

  const startAdmission = (visit) => {
    setSelectedVisit(visit);
    setAdmissionForm({
      ...emptyAdmission,
      admissionReason: visit.chiefComplaint || "",
    });
    setActiveTab("admit");
    resetFeedback();
  };

  const handleAdmission = async (event) => {
    event.preventDefault();
    resetFeedback();

    if (!selectedVisit) {
      setError("Select an emergency visit first.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...admissionForm,
        doctorId: admissionForm.doctorId
          ? Number(admissionForm.doctorId)
          : null,
        departmentId: admissionForm.departmentId
          ? Number(admissionForm.departmentId)
          : null,
        wardId: admissionForm.wardId
          ? Number(admissionForm.wardId)
          : null,
        roomId: admissionForm.roomId
          ? Number(admissionForm.roomId)
          : null,
        bedId: admissionForm.bedId
          ? Number(admissionForm.bedId)
          : null,
        expectedDischargeDate:
          admissionForm.expectedDischargeDate || null,
        actualDischargeDate: null,
      };

      await emergencyService.admitPatient(
        selectedVisit.emergencyVisitId,
        payload
      );

      setMessage("Emergency patient admitted successfully.");
      setSelectedVisit(null);
      setAdmissionForm(emptyAdmission);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to admit the emergency patient."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="emergency-page">
      <div className="emergency-header">
        <div>
          <h1>Emergency Management</h1>
          <p>
            Manage emergency visits, triage assessments and
            emergency admissions.
          </p>
        </div>

        <button
          type="button"
          className="emergency-secondary-btn"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="emergency-stats">
        <div className="emergency-stat-card">
          <span>Total visits</span>
          <strong>{visits.length}</strong>
        </div>
        <div className="emergency-stat-card">
          <span>Waiting</span>
          <strong>
            {visits.filter((v) => v.status === "WAITING").length}
          </strong>
        </div>
        <div className="emergency-stat-card">
          <span>Under treatment</span>
          <strong>
            {
              visits.filter((v) => v.status === "UNDER_TREATMENT")
                .length
            }
          </strong>
        </div>
        <div className="emergency-stat-card">
          <span>Patients discharged</span>
          <strong>
            {visits.filter((v) => v.status === "DISCHARGED").length}
          </strong>
        </div>
      </div>

      {error && <div className="emergency-alert error">{error}</div>}
      {message && (
        <div className="emergency-alert success">{message}</div>
      )}

      <div className="emergency-tabs">
        <button
          className={activeTab === "visits" ? "active" : ""}
          onClick={() => setActiveTab("visits")}
          type="button"
        >
          <AlertCircle size={17} /> Emergency Visits
        </button>
        <button
          className={activeTab === "triage" ? "active" : ""}
          onClick={() => setActiveTab("triage")}
          type="button"
        >
          <ClipboardList size={17} /> Triage Records
        </button>
        <button
          className={activeTab === "admit" ? "active" : ""}
          onClick={() => setActiveTab("admit")}
          type="button"
        >
          <UserPlus size={17} /> Admit Patient
        </button>
      </div>

      {activeTab === "visits" && (
        <>
          <section className="emergency-panel">
            <h2>Register Emergency Visit</h2>

            <form
              className="emergency-form"
              onSubmit={handleCreateVisit}
            >
              <label>
                Patient
                <select
                  required
                  value={visitForm.patientId}
                  onChange={(e) =>
                    setVisitForm({
                      ...visitForm,
                      patientId: e.target.value,
                    })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.id} - {getPatientName(patient)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Arrival mode
                <select
                  value={visitForm.arrivalMode}
                  onChange={(e) =>
                    setVisitForm({
                      ...visitForm,
                      arrivalMode: e.target.value,
                    })
                  }
                >
                  <option value="WALK_IN">Walk-in</option>
                  <option value="AMBULANCE">Ambulance</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label>
                Priority
                <select
                  value={visitForm.priority}
                  onChange={(e) =>
                    setVisitForm({
                      ...visitForm,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </label>

              <label>
                Initial status
                <select
                  value={visitForm.status}
                  onChange={(e) =>
                    setVisitForm({
                      ...visitForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="WAITING">Waiting</option>
                  <option value="REGISTERED">Registered</option>
                </select>
              </label>

              <label>
                Assign doctor (optional)
                <select
                  value={visitForm.assignedDoctor}
                  onChange={(e) =>
                    setVisitForm({
                      ...visitForm,
                      assignedDoctor: e.target.value,
                    })
                  }
                >
                  <option value="">Not assigned</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.id} - {getDoctorName(doctor)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="full-width">
                Chief complaint
                <textarea
                  required
                  rows="3"
                  value={visitForm.chiefComplaint}
                  onChange={(e) =>
                    setVisitForm({
                      ...visitForm,
                      chiefComplaint: e.target.value,
                    })
                  }
                  placeholder="Describe the patient's main complaint"
                />
              </label>

              <button
                className="emergency-primary-btn"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Register Emergency Visit"}
              </button>
            </form>
          </section>

          <section className="emergency-panel">
            <h2>Emergency Visit List</h2>

            {loading ? (
              <p>Loading emergency visits...</p>
            ) : visits.length === 0 ? (
              <p className="emergency-empty">
                No emergency visits found.
              </p>
            ) : (
              <div className="emergency-table-wrapper">
                <table className="emergency-table">
                  <thead>
                    <tr>
                      <th>Visit ID</th>
                      <th>Patient</th>
                      <th>Arrival</th>
                      <th>Complaint</th>
                      <th>Priority</th>
                      <th>Doctor ID</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit) => (
                      <tr key={visit.emergencyVisitId}>
                        <td>{visit.emergencyVisitId}</td>
                        <td>{getPatientName(visit.patient)}</td>
                        <td>
                          {visit.arrivalTime
                            ? new Date(
                                visit.arrivalTime
                              ).toLocaleString()
                            : "-"}
                        </td>
                        <td>{visit.chiefComplaint || "-"}</td>
                        <td>
                          <span
                            className={`emergency-priority ${(visit.priority || "unknown").toLowerCase()}`}
                          >
                            {visit.priority || "-"}
                          </span>
                        </td>
                        <td>{visit.assignedDoctor || "Unassigned"}</td>
                        <td>
                          <span className="emergency-status">
                            {visit.status || "-"}
                          </span>
                        </td>
                        <td>
                          <div className="emergency-actions">
                            <button
                              type="button"
                              onClick={() => handleAssignDoctor(visit)}
                            >
                              Assign doctor
                            </button>
                            <button
                              type="button"
                              onClick={() => openTriage(visit)}
                            >
                              Add triage
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                loadTriageForVisit(
                                  visit.emergencyVisitId
                                )
                              }
                            >
                              View triage
                            </button>
                            <button
                              type="button"
                              onClick={() => startAdmission(visit)}
                            >
                              Admit
                            </button>
                            {visit.status !== "UNDER_TREATMENT" &&
                              visit.status !== "DISCHARGED" &&
                              visit.status !== "ADMITTED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleVisitAction(
                                      visit,
                                      "treatment"
                                    )
                                  }
                                >
                                  Start treatment
                                </button>
                              )}
                            {visit.status !== "DISCHARGED" &&
                              visit.status !== "ADMITTED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleVisitAction(
                                      visit,
                                      "discharge"
                                    )
                                  }
                                >
                                  Discharge
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

          {triageRecords.length > 0 && (
            <section className="emergency-panel">
              <h2>Triage Records</h2>
              <div className="emergency-table-wrapper">
                <table className="emergency-table">
                  <thead>
                    <tr>
                      <th>Triage ID</th>
                      <th>Visit ID</th>
                      <th>Patient</th>
                      <th>Priority</th>
                      <th>Symptoms</th>
                      <th>Vitals</th>
                      <th>Assessed by</th>
                      <th>Assessed at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {triageRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>
                          {record.emergencyVisit?.emergencyVisitId}
                        </td>
                        <td>{getPatientName(record.patient)}</td>
                        <td>{record.priority || "-"}</td>
                        <td>{record.symptoms || "-"}</td>
                        <td>{record.vitals || "-"}</td>
                        <td>{record.assessedBy || "-"}</td>
                        <td>
                          {record.assessedAt
                            ? new Date(
                                record.assessedAt
                              ).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}

      {activeTab === "triage" && (
        <>
          <section className="emergency-panel">
            <h2>
              <Stethoscope size={20} /> Record Triage Assessment
            </h2>

            <form
              className="emergency-form"
              onSubmit={handleCreateTriage}
            >
              <label>
                Emergency visit
                <select
                  required
                  value={triageForm.emergencyVisitId}
                  onChange={(e) => {
                    const visit = visits.find(
                      (v) =>
                        String(v.emergencyVisitId) === e.target.value
                    );

                    setSelectedVisit(visit || null);
                    setTriageForm({
                      ...triageForm,
                      emergencyVisitId: e.target.value,
                      patientId: String(
                        getPatientId(visit || {}) ?? ""
                      ),
                    });
                  }}
                >
                  <option value="">Select emergency visit</option>
                  {visits.map((visit) => (
                    <option
                      key={visit.emergencyVisitId}
                      value={visit.emergencyVisitId}
                    >
                      Visit #{visit.emergencyVisitId} —{" "}
                      {getPatientName(visit.patient)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Patient
                <select
                  required
                  value={triageForm.patientId}
                  onChange={(e) =>
                    setTriageForm({
                      ...triageForm,
                      patientId: e.target.value,
                    })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.id} - {getPatientName(patient)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select
                  value={triageForm.priority}
                  onChange={(e) =>
                    setTriageForm({
                      ...triageForm,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </label>

              <label>
                Assessed by
                <input
                  required
                  value={triageForm.assessedBy}
                  onChange={(e) =>
                    setTriageForm({
                      ...triageForm,
                      assessedBy: e.target.value,
                    })
                  }
                  placeholder="Nurse or clinician name"
                />
              </label>

              <label>
                Symptoms
                <textarea
                  required
                  rows="3"
                  value={triageForm.symptoms}
                  onChange={(e) =>
                    setTriageForm({
                      ...triageForm,
                      symptoms: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Vitals
                <textarea
                  rows="3"
                  value={triageForm.vitals}
                  onChange={(e) =>
                    setTriageForm({
                      ...triageForm,
                      vitals: e.target.value,
                    })
                  }
                  placeholder="For example, BP, pulse, temperature"
                />
              </label>

              <label className="full-width">
                Triage notes
                <textarea
                  rows="3"
                  value={triageForm.triageNotes}
                  onChange={(e) =>
                    setTriageForm({
                      ...triageForm,
                      triageNotes: e.target.value,
                    })
                  }
                />
              </label>

              <button
                type="submit"
                className="emergency-primary-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Triage Record"}
              </button>
            </form>
          </section>

          <section className="emergency-panel">
            <h2>Patient Triage History</h2>

            <form
              className="emergency-inline-form"
              onSubmit={loadPatientTriageHistory}
            >
              <label>
                Patient ID
                <input
                  required
                  type="number"
                  min="1"
                  value={historyPatientId}
                  onChange={(e) =>
                    setHistoryPatientId(e.target.value)
                  }
                  placeholder="Enter patient ID"
                />
              </label>
              <button
                type="submit"
                className="emergency-primary-btn"
              >
                Load History
              </button>
            </form>

            {historyRecords.length > 0 && (
              <div className="emergency-table-wrapper">
                <table className="emergency-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Visit ID</th>
                      <th>Priority</th>
                      <th>Symptoms</th>
                      <th>Vitals</th>
                      <th>Notes</th>
                      <th>Assessed by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>
                          {record.emergencyVisit?.emergencyVisitId}
                        </td>
                        <td>{record.priority}</td>
                        <td>{record.symptoms}</td>
                        <td>{record.vitals || "-"}</td>
                        <td>{record.triageNotes || "-"}</td>
                        <td>{record.assessedBy || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {historyRecords.length === 0 && (
              <p className="emergency-empty">
                Search for a patient to view their triage history.
              </p>
            )}
          </section>
        </>
      )}

      {activeTab === "admit" && (
        <section className="emergency-panel">
          <h2>Admit Emergency Patient</h2>

          <p className="emergency-help">
            Select an emergency visit, then provide the inpatient
            admission details. The backend obtains the patient ID
            from the selected emergency visit.
          </p>

          <form
            className="emergency-form"
            onSubmit={handleAdmission}
          >
            <label className="full-width">
              Emergency visit
              <select
                required
                value={selectedVisit?.emergencyVisitId || ""}
                onChange={(e) => {
                  const visit = visits.find(
                    (v) =>
                      String(v.emergencyVisitId) === e.target.value
                  );

                  setSelectedVisit(visit || null);
                  setAdmissionForm({
                    ...admissionForm,
                    admissionReason: visit?.chiefComplaint || "",
                  });
                }}
              >
                <option value="">Select emergency visit</option>
                {visits
                  .filter(
                    (visit) =>
                      visit.status !== "ADMITTED" &&
                      visit.status !== "DISCHARGED"
                  )
                  .map((visit) => (
                    <option
                      key={visit.emergencyVisitId}
                      value={visit.emergencyVisitId}
                    >
                      Visit #{visit.emergencyVisitId} —{" "}
                      {getPatientName(visit.patient)} (
                      {visit.status || "No status"})
                    </option>
                  ))}
              </select>
            </label>

            {selectedVisit && (
              <div className="emergency-selected-patient full-width">
                <strong>Patient:</strong>{" "}
                {getPatientName(selectedVisit.patient)}
                {" · "}
                <strong>Visit:</strong>{" "}
                {selectedVisit.emergencyVisitId}
              </div>
            )}

            <label>
              Doctor ID
              <select
                value={admissionForm.doctorId}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    doctorId: e.target.value,
                  })
                }
              >
                <option value="">Select doctor (optional)</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.id} - {getDoctorName(doctor)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Department ID
              <input
                type="number"
                min="1"
                value={admissionForm.departmentId}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    departmentId: e.target.value,
                  })
                }
                placeholder="Department ID"
              />
            </label>

            <label>
              Admission date
              <input
                required
                type="date"
                value={admissionForm.admissionDate}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    admissionDate: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Expected discharge date
              <input
                type="date"
                value={admissionForm.expectedDischargeDate}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    expectedDischargeDate: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Ward ID
              <input
                type="number"
                min="1"
                value={admissionForm.wardId}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    wardId: e.target.value,
                  })
                }
                placeholder="Ward ID"
              />
            </label>

            <label>
              Room ID
              <input
                type="number"
                min="1"
                value={admissionForm.roomId}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    roomId: e.target.value,
                  })
                }
                placeholder="Room ID"
              />
            </label>

            <label>
              Bed ID
              <input
                type="number"
                min="1"
                value={admissionForm.bedId}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    bedId: e.target.value,
                  })
                }
                placeholder="Bed ID"
              />
            </label>

            <label>
              Admission status
              <select
                value={admissionForm.status}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    status: e.target.value,
                  })
                }
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
              </select>
            </label>

            <label className="full-width">
              Admission reason
              <textarea
                required
                rows="2"
                value={admissionForm.admissionReason}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    admissionReason: e.target.value,
                  })
                }
              />
            </label>

            <label className="full-width">
              Diagnosis
              <textarea
                rows="2"
                value={admissionForm.diagnosis}
                onChange={(e) =>
                  setAdmissionForm({
                    ...admissionForm,
                    diagnosis: e.target.value,
                  })
                }
              />
            </label>

            <button
              type="submit"
              className="emergency-primary-btn"
              disabled={saving || !selectedVisit}
            >
              {saving ? "Admitting..." : "Admit Patient"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
