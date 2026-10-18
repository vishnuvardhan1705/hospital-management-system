
import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle,
  ClipboardList,
  FilePlus2,
  Pill,
  RefreshCw,
  Search,
  Send,
  UserRound,
  AlertCircle,
} from "lucide-react";

import dischargeService from "../services/dischargeService";
import "../styles/dischargeManagement.css";

const entityId = (item) => item?.id ?? item?.patientId ?? "";

const patientName = (patient) =>
  `${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim() ||
  patient?.name ||
  `Patient #${entityId(patient)}`;

const doctorName = (doctor) =>
  `${doctor?.firstName ?? ""} ${doctor?.lastName ?? ""}`.trim() ||
  doctor?.name ||
  `Doctor #${entityId(doctor)}`;

const errorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "The request failed. Please try again.";

const formatDate = (value) => {
  if (!value) return "—";
  return String(value).replace("T", " ").slice(0, 16);
};

const initialDischarge = {
  admissionId: "",
  patientId: "",
  doctorId: "",
  dischargeType: "NORMAL",
  finalDiagnosis: "",
  treatmentSummary: "",
  conditionAtDischarge: "STABLE",
  instructions: "",
};

const initialMedication = {
  medicineId: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

export default function DischargeManagement() {
  const [activeTab, setActiveTab] = useState("records");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [form, setForm] = useState(initialDischarge);
  const [medicationForm, setMedicationForm] = useState(initialMedication);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [discharges, setDischarges] = useState([]);
  const [selectedDischargeId, setSelectedDischargeId] = useState("");
  const [selectedDischarge, setSelectedDischarge] = useState(null);
  const [medications, setMedications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearNotices = () => {
    setMessage("");
    setError("");
  };

  const loadResources = async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      dischargeService.getPatients(),
      dischargeService.getDoctors(),
      dischargeService.getMedicines(),
      dischargeService.getActiveAdmissions(),
    ]);

    const [patientResult, doctorResult, medicineResult, admissionResult] =
      results;

    if (patientResult.status === "fulfilled") {
      setPatients(
        Array.isArray(patientResult.value) ? patientResult.value : []
      );
    }

    if (doctorResult.status === "fulfilled") {
      setDoctors(
        Array.isArray(doctorResult.value) ? doctorResult.value : []
      );
    }

    if (medicineResult.status === "fulfilled") {
      setMedicines(
        Array.isArray(medicineResult.value) ? medicineResult.value : []
      );
    }

    if (admissionResult.status === "fulfilled") {
      setAdmissions(
        Array.isArray(admissionResult.value) ? admissionResult.value : []
      );
    }

    const failed = results.find((result) => result.status === "rejected");
    if (failed) {
      setError(
        `Some dropdown data could not be loaded: ${errorMessage(failed.reason)}`
      );
    }

    setLoading(false);
  };

  const loadPatientDischarges = async (patientId) => {
    if (!patientId) {
      setDischarges([]);
      setSelectedDischarge(null);
      setSelectedDischargeId("");
      setMedications([]);
      return;
    }

    setLoading(true);
    clearNotices();

    try {
      const result =
        await dischargeService.getPatientDischarges(patientId);
      const list = Array.isArray(result) ? result : [];

      setDischarges(list);

      if (selectedDischargeId) {
        const updated = list.find(
          (item) => String(entityId(item)) === String(selectedDischargeId)
        );

        if (updated) {
          setSelectedDischarge(updated);
        }
      }
    } catch (err) {
      setError(errorMessage(err));
      setDischarges([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDischargeDetails = async (dischargeId) => {
    if (!dischargeId) return;

    setLoading(true);
    clearNotices();

    try {
      const [dischargeResult, medicationResult] = await Promise.all([
        dischargeService.getDischarge(dischargeId),
        dischargeService.getDischargeMedications(dischargeId),
      ]);

      setSelectedDischarge(dischargeResult);
      setSelectedDischargeId(String(entityId(dischargeResult)));
      setMedications(
        Array.isArray(medicationResult) ? medicationResult : []
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    loadPatientDischarges(selectedPatientId);
  }, [selectedPatientId]);

  const handleAdmissionChange = (admissionId) => {
    const admission = admissions.find(
      (item) => String(entityId(item)) === String(admissionId)
    );

    setForm((previous) => ({
      ...previous,
      admissionId,
      patientId: admission?.patient
        ? String(entityId(admission.patient))
        : previous.patientId,
      doctorId: admission?.doctor
        ? String(entityId(admission.doctor))
        : previous.doctorId,
    }));
  };

  const handleCreateDischarge = async (event) => {
    event.preventDefault();
    clearNotices();
    setSaving(true);

    try {
      const payload = {
        admissionId: Number(form.admissionId),
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        dischargeType: form.dischargeType,
        finalDiagnosis: form.finalDiagnosis.trim(),
        treatmentSummary: form.treatmentSummary.trim(),
        conditionAtDischarge: form.conditionAtDischarge,
        instructions: form.instructions.trim(),
      };

      const result = await dischargeService.createDischarge(payload);
      const newId = entityId(result);

      setMessage(
        `Discharge record created successfully. Status: ${
          result?.status || "PENDING"
        }.`
      );

      setForm(initialDischarge);
      setSelectedPatientId(String(payload.patientId));

      if (newId) {
        setSelectedDischargeId(String(newId));
        await loadDischargeDetails(newId);
      }

      await loadPatientDischarges(payload.patientId);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAddMedication = async (event) => {
    event.preventDefault();
    clearNotices();

    if (!selectedDischargeId) {
      setError("Select a discharge record before adding medicines.");
      return;
    }

    setSaving(true);

    try {
      await dischargeService.addMedication(selectedDischargeId, {
        medicineId: Number(medicationForm.medicineId),
        dosage: medicationForm.dosage.trim(),
        frequency: medicationForm.frequency.trim(),
        duration: medicationForm.duration.trim(),
        instructions: medicationForm.instructions.trim(),
      });

      setMessage("Discharge medication added successfully.");
      setMedicationForm(initialMedication);
      await loadDischargeDetails(selectedDischargeId);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteDischarge = async () => {
    if (!selectedDischargeId || !selectedDischarge) return;

    if (selectedDischarge.status !== "PENDING") {
      setError("Only a PENDING discharge can be completed.");
      return;
    }

    const confirmed = window.confirm(
      "Complete this discharge? The patient discharge status will be updated."
    );

    if (!confirmed) return;

    clearNotices();
    setSaving(true);

    try {
      await dischargeService.completeDischarge(selectedDischargeId);
      setMessage("Discharge completed successfully.");
      await loadDischargeDetails(selectedDischargeId);

      if (selectedPatientId) {
        await loadPatientDischarges(selectedPatientId);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const getPatientLabel = (id) => {
    const patient = patients.find(
      (item) => String(entityId(item)) === String(id)
    );
    return patient ? patientName(patient) : `Patient #${id ?? "—"}`;
  };

  const getDoctorLabel = (id) => {
    const doctor = doctors.find(
      (item) => String(entityId(item)) === String(id)
    );
    return doctor ? doctorName(doctor) : `Doctor #${id ?? "—"}`;
  };

  return (
    <div className="discharge-page">
      <div className="discharge-header">
        <div>
          <h1>Discharge Management</h1>
          <p>Create discharge records, prescribe take-home medicines, and
            complete patient discharges.</p>
        </div>

        <button
          type="button"
          className="discharge-secondary-button"
          onClick={() => {
            clearNotices();
            loadResources();
            if (selectedPatientId) {
              loadPatientDischarges(selectedPatientId);
            }
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="discharge-alert discharge-alert-success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="discharge-alert discharge-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="discharge-summary-grid">
        <div className="discharge-summary-card">
          <span><UserRound size={21} /></span>
          <div>
            <p>Patients Loaded</p>
            <h3>{patients.length}</h3>
          </div>
        </div>

        <div className="discharge-summary-card">
          <span><Activity size={21} /></span>
          <div>
            <p>Active Admissions</p>
            <h3>{admissions.length}</h3>
          </div>
        </div>

        <div className="discharge-summary-card">
          <span><ClipboardList size={21} /></span>
          <div>
            <p>Patient Discharge Records</p>
            <h3>{discharges.length}</h3>
          </div>
        </div>
      </div>

      <div className="discharge-tabs">
        <button
          type="button"
          className={activeTab === "records" ? "active" : ""}
          onClick={() => {
            setActiveTab("records");
            clearNotices();
          }}
        >
          <ClipboardList size={17} />
          Discharge Records
        </button>

        <button
          type="button"
          className={activeTab === "medications" ? "active" : ""}
          onClick={() => {
            setActiveTab("medications");
            clearNotices();
          }}
        >
          <Pill size={17} />
          Discharge Medicines
        </button>
      </div>

      {activeTab === "records" && (
        <div className="discharge-layout">
          <section className="discharge-panel">
            <div className="discharge-panel-heading">
              <h2>Create Discharge Record</h2>
              <p>Choose an active admission and complete the discharge summary.</p>
            </div>

            <form onSubmit={handleCreateDischarge}>
              <label>
                Active Admission
                <select
                  required
                  value={form.admissionId}
                  onChange={(event) => handleAdmissionChange(event.target.value)}
                >
                  <option value="">Select admission</option>
                  {admissions.map((admission) => (
                    <option key={entityId(admission)} value={entityId(admission)}>
                      Admission #{entityId(admission)} —{" "}
                      {admission.patient
                        ? patientName(admission.patient)
                        : `Patient #${admission.patient?.id ?? "—"}`}
                    </option>
                  ))}
                </select>
                <small>
                  Only admissions returned by the backend's active-admissions
                  endpoint are shown.
                </small>
              </label>

              <div className="discharge-form-row">
                <label>
                  Patient ID
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.patientId}
                    onChange={(event) =>
                      setForm({ ...form, patientId: event.target.value })
                    }
                  />
                </label>

                <label>
                  Doctor ID
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.doctorId}
                    onChange={(event) =>
                      setForm({ ...form, doctorId: event.target.value })
                    }
                  />
                </label>
              </div>

              <label>
                Discharge Type
                <select
                  required
                  value={form.dischargeType}
                  onChange={(event) =>
                    setForm({ ...form, dischargeType: event.target.value })
                  }
                >
                  <option value="NORMAL">Normal</option>
                  <option value="REFERRED">Referred</option>
                  <option value="LAMA">Left Against Medical Advice (LAMA)</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </label>

              <label>
                Final Diagnosis
                <textarea
                  required
                  rows={2}
                  value={form.finalDiagnosis}
                  onChange={(event) =>
                    setForm({ ...form, finalDiagnosis: event.target.value })
                  }
                  placeholder="Enter final diagnosis"
                />
              </label>

              <label>
                Treatment Summary
                <textarea
                  required
                  rows={3}
                  value={form.treatmentSummary}
                  onChange={(event) =>
                    setForm({ ...form, treatmentSummary: event.target.value })
                  }
                  placeholder="Summarize treatment received"
                />
              </label>

              <label>
                Condition at Discharge
                <select
                  required
                  value={form.conditionAtDischarge}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      conditionAtDischarge: event.target.value,
                    })
                  }
                >
                  <option value="STABLE">Stable</option>
                  <option value="IMPROVED">Improved</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label>
                Discharge Instructions
                <textarea
                  rows={3}
                  value={form.instructions}
                  onChange={(event) =>
                    setForm({ ...form, instructions: event.target.value })
                  }
                  placeholder="Follow-up advice and home-care instructions"
                />
              </label>

              <button
                type="submit"
                className="discharge-primary-button"
                disabled={saving || loading}
              >
                <FilePlus2 size={17} />
                {saving ? "Creating..." : "Create Discharge"}
              </button>
            </form>
          </section>

          <section className="discharge-panel">
            <div className="discharge-panel-heading">
              <h2>Patient Discharge History</h2>
              <p>Search by patient, then select a record to view its details.</p>
            </div>

            <form
              className="discharge-search-row"
              onSubmit={(event) => {
                event.preventDefault();
                loadPatientDischarges(selectedPatientId);
              }}
            >
              <select
                value={selectedPatientId}
                onChange={(event) => setSelectedPatientId(event.target.value)}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={entityId(patient)} value={entityId(patient)}>
                    {patientName(patient)} (ID: {entityId(patient)})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="discharge-secondary-button"
                disabled={!selectedPatientId || loading}
              >
                <Search size={16} />
                Search
              </button>
            </form>

            {loading ? (
              <p className="discharge-empty">Loading discharge records...</p>
            ) : discharges.length === 0 ? (
              <p className="discharge-empty">
                No discharge records to display for the selected patient.
              </p>
            ) : (
              <div className="discharge-table-wrap">
                <table className="discharge-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Admission</th>
                      <th>Doctor</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discharges.map((item) => (
                      <tr key={entityId(item)}>
                        <td>{entityId(item)}</td>
                        <td>{entityId(item.admission)}</td>
                        <td>{item.doctor ? doctorName(item.doctor) : "—"}</td>
                        <td>{item.dischargeType || "—"}</td>
                        <td>
                          <span
                            className={`discharge-status status-${String(
                              item.status || "unknown"
                            ).toLowerCase()}`}
                          >
                            {item.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="discharge-view-button"
                            onClick={() => loadDischargeDetails(entityId(item))}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedDischarge && (
              <div className="discharge-detail-card">
                <div className="discharge-detail-header">
                  <div>
                    <span>Discharge Record</span>
                    <h3>#{entityId(selectedDischarge)}</h3>
                  </div>
                  <span
                    className={`discharge-status status-${String(
                      selectedDischarge.status || "unknown"
                    ).toLowerCase()}`}
                  >
                    {selectedDischarge.status || "UNKNOWN"}
                  </span>
                </div>

                <div className="discharge-detail-grid">
                  <div>
                    <span>Patient</span>
                    <strong>
                      {selectedDischarge.patient
                        ? patientName(selectedDischarge.patient)
                        : getPatientLabel(selectedDischarge.patient?.id)}
                    </strong>
                  </div>
                  <div>
                    <span>Doctor</span>
                    <strong>
                      {selectedDischarge.doctor
                        ? doctorName(selectedDischarge.doctor)
                        : getDoctorLabel(selectedDischarge.doctor?.id)}
                    </strong>
                  </div>
                  <div>
                    <span>Admission ID</span>
                    <strong>{entityId(selectedDischarge.admission) || "—"}</strong>
                  </div>
                  <div>
                    <span>Discharge Date</span>
                    <strong>{formatDate(selectedDischarge.dischargeDate)}</strong>
                  </div>
                </div>

                <p><strong>Final Diagnosis:</strong> {selectedDischarge.finalDiagnosis || "—"}</p>
                <p><strong>Treatment Summary:</strong> {selectedDischarge.treatmentSummary || "—"}</p>
                <p><strong>Condition:</strong> {selectedDischarge.conditionAtDischarge || "—"}</p>
                <p><strong>Instructions:</strong> {selectedDischarge.instructions || "—"}</p>

                {selectedDischarge.status === "PENDING" && (
                  <button
                    type="button"
                    className="discharge-primary-button"
                    onClick={handleCompleteDischarge}
                    disabled={saving}
                  >
                    <CheckCircle size={17} />
                    {saving ? "Completing..." : "Complete Discharge"}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "medications" && (
        <div className="discharge-layout">
          <section className="discharge-panel">
            <div className="discharge-panel-heading">
              <h2>Add Discharge Medication</h2>
              <p>Add the medicine plan before completing a pending discharge.</p>
            </div>

            <label>
              Patient
              <select
                value={selectedPatientId}
                onChange={(event) => setSelectedPatientId(event.target.value)}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={entityId(patient)} value={entityId(patient)}>
                    {patientName(patient)} (ID: {entityId(patient)})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Discharge Record
              <select
                value={selectedDischargeId}
                onChange={(event) => {
                  const id = event.target.value;
                  if (id) loadDischargeDetails(id);
                }}
              >
                <option value="">Select discharge record</option>
                {discharges.map((item) => (
                  <option key={entityId(item)} value={entityId(item)}>
                    Discharge #{entityId(item)} — {item.status}
                  </option>
                ))}
              </select>
            </label>

            {selectedDischarge && selectedDischarge.status !== "PENDING" && (
              <div className="discharge-alert discharge-alert-error">
                Medicines can only be added while the discharge is PENDING.
              </div>
            )}

            <form onSubmit={handleAddMedication}>
              <label>
                Medicine
                <select
                  required
                  value={medicationForm.medicineId}
                  onChange={(event) =>
                    setMedicationForm({
                      ...medicationForm,
                      medicineId: event.target.value,
                    })
                  }
                >
                  <option value="">Select medicine</option>
                  {medicines.map((medicine) => (
                    <option key={entityId(medicine)} value={entityId(medicine)}>
                      {medicine.medicineName || medicine.name || `Medicine #${entityId(medicine)}`}
                      {" "} (ID: {entityId(medicine)})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Dosage
                <input
                  required
                  value={medicationForm.dosage}
                  onChange={(event) =>
                    setMedicationForm({
                      ...medicationForm,
                      dosage: event.target.value,
                    })
                  }
                  placeholder="e.g. 1 tablet"
                />
              </label>

              <label>
                Frequency
                <input
                  required
                  value={medicationForm.frequency}
                  onChange={(event) =>
                    setMedicationForm({
                      ...medicationForm,
                      frequency: event.target.value,
                    })
                  }
                  placeholder="e.g. Twice daily"
                />
              </label>

              <label>
                Duration
                <input
                  required
                  value={medicationForm.duration}
                  onChange={(event) =>
                    setMedicationForm({
                      ...medicationForm,
                      duration: event.target.value,
                    })
                  }
                  placeholder="e.g. 5 days"
                />
              </label>

              <label>
                Instructions
                <textarea
                  rows={2}
                  value={medicationForm.instructions}
                  onChange={(event) =>
                    setMedicationForm({
                      ...medicationForm,
                      instructions: event.target.value,
                    })
                  }
                  placeholder="e.g. Take after food"
                />
              </label>

              <button
                type="submit"
                className="discharge-primary-button"
                disabled={
                  saving ||
                  !selectedDischargeId ||
                  selectedDischarge?.status !== "PENDING"
                }
              >
                <Pill size={17} />
                {saving ? "Adding..." : "Add Medication"}
              </button>
            </form>
          </section>

          <section className="discharge-panel">
            <div className="discharge-panel-heading">
              <h2>Medicine Plan</h2>
              <p>
                {selectedDischargeId
                  ? `Medicines for discharge #${selectedDischargeId}`
                  : "Select a discharge record to see its medicines."}
              </p>
            </div>

            {medications.length === 0 ? (
              <p className="discharge-empty">
                No medicines have been added to this discharge record yet.
              </p>
            ) : (
              <div className="discharge-table-wrap">
                <table className="discharge-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((item) => (
                      <tr key={entityId(item)}>
                        <td>
                          {item.medicine?.medicineName ||
                            item.medicine?.name ||
                            `Medicine #${entityId(item.medicine)}`}
                        </td>
                        <td>{item.dosage || "—"}</td>
                        <td>{item.frequency || "—"}</td>
                        <td>{item.duration || "—"}</td>
                        <td>{item.instructions || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="discharge-note">
              Adding medicines is permitted only while the discharge status is
              PENDING. Complete the discharge from the Discharge Records tab.
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
