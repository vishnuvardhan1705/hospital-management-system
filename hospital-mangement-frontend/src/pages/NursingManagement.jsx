
import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  FileText,
  History,
  Pill,
  RefreshCw,
} from "lucide-react";
import nursing from "../services/nursingService";
import "../styles/nursingManagement.css";

const emptyAssignment = {
  nurseId: "",
  patientId: "",
  admissionId: "",
  status: "ACTIVE",
};

const emptyNote = {
  patientId: "",
  admissionId: "",
  nurseId: "",
  observation: "",
  actionTaken: "",
};

const emptyMedication = {
  patientId: "",
  admissionId: "",
  prescriptionItemId: "",
  medicineId: "",
  administeredBy: "",
  dosage: "",
  status: "GIVEN",
  remarks: "",
};

// Normalize plain arrays and common nested API response envelopes.
const asList = (value, depth = 0) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 4) return [];

  if (Array.isArray(value.content)) return value.content;
  if (Array.isArray(value.items)) return value.items;

  if (value.data !== undefined) return asList(value.data, depth + 1);
  if (value.result !== undefined) return asList(value.result, depth + 1);

  return [];
};

const getError = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Something went wrong.";

const personName = (person) => {
  if (!person) return "—";

  const name = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(" ");

  return name || person.name || `ID ${person.id ?? "?"}`;
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}) {
  return (
    <label className="nursing-field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        min={min}
      />
    </label>
  );
}

function TextAreaField({ label, name, value, onChange, required = false }) {
  return (
    <label className="nursing-field nursing-field-wide">
      <span>{label}</span>
      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={3}
        required={required}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <label className="nursing-field">
      <span>{label}</span>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DataTable({ columns, rows, emptyText = "No records to display." }) {
  return (
    <div className="nursing-table-wrap">
      <table className="nursing-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="nursing-empty" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((column) => (
                  <td key={column.label}>
                    {column.render
                      ? column.render(row)
                      : row[column.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function NursingManagement() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const [assignmentForm, setAssignmentForm] = useState(emptyAssignment);
  const [noteForm, setNoteForm] = useState(emptyNote);
  const [medicationForm, setMedicationForm] = useState(emptyMedication);

  const [assignmentNurseId, setAssignmentNurseId] = useState("");
  const [assignments, setAssignments] = useState([]);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [historyPatientId, setHistoryPatientId] = useState("");
  const [nursingNotes, setNursingNotes] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);

  const loadReferenceData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [patientData, admissionData, medicineData] =
        await Promise.all([
          nursing.getPatients(),
          nursing.getActiveAdmissions(),
          nursing.getMedicines(),
        ]);

      setPatients(asList(patientData));
      setAdmissions(asList(admissionData));
      setMedicines(asList(medicineData));
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  const perform = async (action, successMessage, afterSuccess) => {
    setError("");
    setMessage("");

    try {
      await action();
      setMessage(successMessage);

      if (afterSuccess) afterSuccess();

      await loadReferenceData();
    } catch (err) {
      setError(getError(err));
    }
  };

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;
    setter((previous) => ({ ...previous, [name]: value }));
  };

  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: `${personName(patient)} (ID ${patient.id})`,
  }));

  const admissionOptions = asList(admissions)
    .filter((admission) => admission && typeof admission === "object")
    .map((admission) => {
      const id = admission.id ?? admission.admissionId ?? admission.admission_id;
      if (id === null || id === undefined || id === "") return null;

      return {
        value: String(id),
        label: `${admission.admissionNumber || `Admission ${id}`} — ${personName(admission.patient ?? admission.patientDetails)}`,
      };
    })
    .filter((option) => option !== null);

  const medicineOptions = medicines.map((medicine) => ({
    value: medicine.id,
    label: `${medicine.medicineName || medicine.genericName || "Medicine"} (ID ${medicine.id})`,
  }));

  const tabs = [
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "notes", label: "Nursing Notes", icon: FileText },
    { id: "medications", label: "Medication Administration", icon: Pill },
    { id: "history", label: "Patient History", icon: History },
  ];

  const submitAssignment = (event) => {
    event.preventDefault();

    const data = {
      nurseId: Number(assignmentForm.nurseId),
      patientId: Number(assignmentForm.patientId),
      admissionId: Number(assignmentForm.admissionId),
      status: assignmentForm.status,
    };

    perform(
      () => nursing.assignPatient(data),
      "Patient assigned to nurse.",
      () => setAssignmentForm(emptyAssignment)
    );
  };

  const searchAssignments = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await nursing.getAssignedPatients(
        Number(assignmentNurseId)
      );
      setAssignments(asList(data));
    } catch (err) {
      setError(getError(err));
      setAssignments([]);
    }
  };

  const submitNote = (event) => {
    event.preventDefault();

    const data = {
      patientId: Number(noteForm.patientId),
      admissionId: Number(noteForm.admissionId),
      nurseId: Number(noteForm.nurseId),
      observation: noteForm.observation,
      actionTaken: noteForm.actionTaken,
    };

    perform(
      () =>
        editingNoteId
          ? nursing.updateNursingNote(editingNoteId, data)
          : nursing.addNursingNote(data),
      editingNoteId ? "Nursing note updated." : "Nursing note saved.",
      () => {
        setNoteForm(emptyNote);
        setEditingNoteId(null);
      }
    );
  };

  const submitMedication = (event) => {
    event.preventDefault();

    const data = {
      patientId: Number(medicationForm.patientId),
      admissionId: Number(medicationForm.admissionId),
      prescriptionItemId: medicationForm.prescriptionItemId
        ? Number(medicationForm.prescriptionItemId)
        : null,
      medicineId: medicationForm.medicineId
        ? Number(medicationForm.medicineId)
        : null,
      administeredBy: Number(medicationForm.administeredBy),
      dosage: medicationForm.dosage,
      status: medicationForm.status,
      remarks: medicationForm.remarks,
    };

    perform(
      () => nursing.administerMedication(data),
      "Medication administration recorded.",
      () => setMedicationForm(emptyMedication)
    );
  };

  const searchPatientHistory = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const [notes, medications] = await Promise.all([
        nursing.getPatientNursingNotes(Number(historyPatientId)),
        nursing.getPatientMedicationHistory(Number(historyPatientId)),
      ]);

      setNursingNotes(asList(notes));
      setMedicationHistory(asList(medications));
    } catch (err) {
      setError(getError(err));
      setNursingNotes([]);
      setMedicationHistory([]);
    }
  };

  const renderAssignments = () => (
    <>
      <section className="nursing-card">
        <h2>Assign Patient to Nurse</h2>
        <p className="nursing-help">
          Nurse ID refers to the user ID of the nurse. Use the patient and
          admission associated with the inpatient stay.
        </p>

        <form className="nursing-form" onSubmit={submitAssignment}>
          <Field
            label="Nurse ID"
            name="nurseId"
            type="number"
            min="1"
            value={assignmentForm.nurseId}
            onChange={updateForm(setAssignmentForm)}
            required
          />
          <SelectField
            label="Patient"
            name="patientId"
            value={assignmentForm.patientId}
            onChange={updateForm(setAssignmentForm)}
            options={patientOptions}
            required
          />
          <SelectField
            label="Admission"
            name="admissionId"
            value={assignmentForm.admissionId}
            onChange={updateForm(setAssignmentForm)}
            options={admissionOptions}
            required
          />
          <SelectField
            label="Assignment Status"
            name="status"
            value={assignmentForm.status}
            onChange={updateForm(setAssignmentForm)}
            options={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "INACTIVE", label: "INACTIVE" },
            ]}
            required
          />
          <button className="nursing-button" type="submit">
            Assign Patient
          </button>
        </form>
      </section>

      <section className="nursing-card">
        <h2>Assignments by Nurse</h2>
        <form className="nursing-search" onSubmit={searchAssignments}>
          <Field
            label="Nurse ID"
            name="assignmentNurseId"
            type="number"
            min="1"
            value={assignmentNurseId}
            onChange={(event) => setAssignmentNurseId(event.target.value)}
            required
          />
          <button className="nursing-button" type="submit">
            Find Assignments
          </button>
        </form>

        <DataTable
          columns={[
            { label: "Assignment ID", key: "id" },
            { label: "Nurse ID", key: "nurseId" },
            {
              label: "Patient",
              render: (row) => personName(row.patient),
            },
            {
              label: "Admission",
              render: (row) =>
                row.admission?.admissionNumber ??
                row.admission?.id ??
                "—",
            },
            { label: "Assigned Date", key: "assignedDate" },
            { label: "Status", key: "status" },
          ]}
          rows={assignments}
        />
      </section>
    </>
  );

  const renderNotes = () => (
    <section className="nursing-card">
      <h2>{editingNoteId ? "Update Nursing Note" : "Add Nursing Note"}</h2>
      <p className="nursing-help">
        Record patient observations and the action taken. Notes are saved
        against a patient and admission.
      </p>

      <form className="nursing-form" onSubmit={submitNote}>
        <SelectField
          label="Patient"
          name="patientId"
          value={noteForm.patientId}
          onChange={updateForm(setNoteForm)}
          options={patientOptions}
          required
        />
        <SelectField
          label="Admission"
          name="admissionId"
          value={noteForm.admissionId}
          onChange={updateForm(setNoteForm)}
          options={admissionOptions}
          required
        />
        <Field
          label="Nurse ID"
          name="nurseId"
          type="number"
          min="1"
          value={noteForm.nurseId}
          onChange={updateForm(setNoteForm)}
          required
        />
        <TextAreaField
          label="Observation"
          name="observation"
          value={noteForm.observation}
          onChange={updateForm(setNoteForm)}
          required
        />
        <TextAreaField
          label="Action Taken"
          name="actionTaken"
          value={noteForm.actionTaken}
          onChange={updateForm(setNoteForm)}
          required
        />

        <div className="nursing-form-actions">
          <button className="nursing-button" type="submit">
            {editingNoteId ? "Update Note" : "Save Note"}
          </button>

          {editingNoteId && (
            <button
              className="nursing-button nursing-button-light"
              type="button"
              onClick={() => {
                setNoteForm(emptyNote);
                setEditingNoteId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="nursing-inline-search">
        <h3>Find Notes for a Patient</h3>
        <form className="nursing-search" onSubmit={searchPatientHistory}>
          <Field
            label="Patient ID"
            name="historyPatientId"
            type="number"
            min="1"
            value={historyPatientId}
            onChange={(event) => setHistoryPatientId(event.target.value)}
            required
          />
          <button className="nursing-button" type="submit">
            Load Patient History
          </button>
        </form>
      </div>

      <DataTable
        columns={[
          { label: "Note ID", key: "id" },
          { label: "Nurse ID", key: "nurseId" },
          { label: "Observation", key: "observation" },
          { label: "Action Taken", key: "actionTaken" },
          { label: "Created At", key: "createdAt" },
          {
            label: "Action",
            render: (row) => (
              <button
                className="nursing-button nursing-button-small"
                onClick={() => {
                  setEditingNoteId(row.id);
                  setNoteForm({
                    patientId: String(row.patient?.id ?? ""),
                    admissionId: String(row.admission?.id ?? ""),
                    nurseId: String(row.nurseId ?? ""),
                    observation: row.observation ?? "",
                    actionTaken: row.actionTaken ?? "",
                  });
                  setActiveTab("notes");
                }}
              >
                Edit
              </button>
            ),
          },
        ]}
        rows={nursingNotes}
        emptyText="Search a patient to view notes here."
      />
    </section>
  );

  const renderMedications = () => (
    <section className="nursing-card">
      <h2>Record Medication Administration</h2>
      <p className="nursing-help">
        This records administration in the nursing module. It does not dispense
        stock or replace the pharmacy dispensing workflow.
      </p>

      <form className="nursing-form" onSubmit={submitMedication}>
        <SelectField
          label="Patient"
          name="patientId"
          value={medicationForm.patientId}
          onChange={updateForm(setMedicationForm)}
          options={patientOptions}
          required
        />
        <SelectField
          label="Admission"
          name="admissionId"
          value={medicationForm.admissionId}
          onChange={updateForm(setMedicationForm)}
          options={admissionOptions}
          required
        />
        <SelectField
          label="Medicine"
          name="medicineId"
          value={medicationForm.medicineId}
          onChange={updateForm(setMedicationForm)}
          options={medicineOptions}
        />
        <Field
          label="Prescription Item ID (optional)"
          name="prescriptionItemId"
          type="number"
          min="1"
          value={medicationForm.prescriptionItemId}
          onChange={updateForm(setMedicationForm)}
        />
        <Field
          label="Dosage"
          name="dosage"
          value={medicationForm.dosage}
          onChange={updateForm(setMedicationForm)}
          required
        />
        <Field
          label="Administered By (User ID)"
          name="administeredBy"
          type="number"
          min="1"
          value={medicationForm.administeredBy}
          onChange={updateForm(setMedicationForm)}
          required
        />
        <SelectField
          label="Status"
          name="status"
          value={medicationForm.status}
          onChange={updateForm(setMedicationForm)}
          options={[
            { value: "GIVEN", label: "GIVEN" },
            { value: "NOT_GIVEN", label: "NOT_GIVEN" },
            { value: "DELAYED", label: "DELAYED" },
          ]}
          required
        />
        <TextAreaField
          label="Remarks"
          name="remarks"
          value={medicationForm.remarks}
          onChange={updateForm(setMedicationForm)}
        />
        <button className="nursing-button" type="submit">
          Save Administration
        </button>
      </form>
    </section>
  );

  const renderHistory = () => (
    <>
      <section className="nursing-card">
        <h2>Patient Nursing and Medication History</h2>
        <form className="nursing-search" onSubmit={searchPatientHistory}>
          <Field
            label="Patient ID"
            name="historyPatientId"
            type="number"
            min="1"
            value={historyPatientId}
            onChange={(event) => setHistoryPatientId(event.target.value)}
            required
          />
          <button className="nursing-button" type="submit">
            Search History
          </button>
        </form>
      </section>

      <section className="nursing-card">
        <h2>Nursing Notes</h2>
        <DataTable
          columns={[
            { label: "Note ID", key: "id" },
            { label: "Nurse ID", key: "nurseId" },
            {
              label: "Admission",
              render: (row) =>
                row.admission?.admissionNumber ??
                row.admission?.id ??
                "—",
            },
            { label: "Observation", key: "observation" },
            { label: "Action Taken", key: "actionTaken" },
            { label: "Created At", key: "createdAt" },
          ]}
          rows={nursingNotes}
        />
      </section>

      <section className="nursing-card">
        <h2>Medication Administration History</h2>
        <DataTable
          columns={[
            { label: "Record ID", key: "id" },
            {
              label: "Admission",
              render: (row) =>
                row.admission?.admissionNumber ??
                row.admission?.id ??
                "—",
            },
            { label: "Medicine ID", key: "medicineId" },
            { label: "Prescription Item ID", key: "prescriptionItemId" },
            { label: "Dosage", key: "dosage" },
            { label: "Administered By", key: "administeredBy" },
            { label: "Administered At", key: "administeredAt" },
            { label: "Status", key: "status" },
            { label: "Remarks", key: "remarks" },
          ]}
          rows={medicationHistory}
        />
      </section>
    </>
  );

  return (
    <main className="nursing-page">
      <header className="nursing-header">
        <div>
          <p className="nursing-eyebrow">INPATIENT CARE</p>
          <h1>Nursing Management</h1>
          <p>Manage patient assignments, observations, and medication records.</p>
        </div>

        <button
          className="nursing-button nursing-button-light"
          type="button"
          onClick={loadReferenceData}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </header>

      {error && <div className="nursing-alert nursing-alert-error">{error}</div>}
      {message && (
        <div className="nursing-alert nursing-alert-success">{message}</div>
      )}

      <nav className="nursing-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`nursing-tab ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "assignments" && renderAssignments()}
      {activeTab === "notes" && renderNotes()}
      {activeTab === "medications" && renderMedications()}
      {activeTab === "history" && renderHistory()}
    </main>
  );
}
