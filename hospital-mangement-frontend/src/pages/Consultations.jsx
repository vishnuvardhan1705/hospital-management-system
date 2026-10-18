
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Search,
  Stethoscope,
} from "lucide-react";

import {
  createConsultation,
  getPatientConsultations,
} from "../services/consultationService";

import "../styles/consultations.css";

const emptyForm = {
  visitId: "",
  patientId: "",
  doctorId: "",
  chiefComplaint: "",
  clinicalNotes: "",
  examinationNotes: "",
  treatmentPlan: "",
  followUpRequired: false,
  followUpDate: "",
};

const getList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.content)) return result.content;
  if (Array.isArray(result?.items)) return result.items;
  return [];
};

export default function Consultations() {
  const [patientId, setPatientId] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const searchConsultations = async (event) => {
    event?.preventDefault();

    if (!patientId.trim()) {
      setError("Enter a patient ID.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSearched(false);

    try {
      const result = await getPatientConsultations(
        Number(patientId)
      );

      setConsultations(getList(result));
      setSearched(true);
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Unable to load consultation history."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      visitId: Number(form.visitId),
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      chiefComplaint: form.chiefComplaint.trim(),
      clinicalNotes: form.clinicalNotes.trim(),
      examinationNotes: form.examinationNotes.trim(),
      treatmentPlan: form.treatmentPlan.trim(),
      followUpRequired: form.followUpRequired,
      followUpDate: form.followUpRequired
        ? form.followUpDate || null
        : null,
    };

    try {
      const created = await createConsultation(payload);

      setMessage(
        `Consultation created successfully${
          created?.consultationId
            ? ` (ID: ${created.consultationId})`
            : ""
        }.`
      );

      setForm(emptyForm);

      setPatientId(String(payload.patientId));

      try {
        const result = await getPatientConsultations(
          payload.patientId
        );

        setConsultations(getList(result));
        setSearched(true);
      } catch {
      }
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Unable to create the consultation. Check the IDs and required fields."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="consultations-page">
      <div className="consultations-heading">
        <div>
          <h1>Doctor Consultations</h1>
          <p>
            Record clinical findings and review patient consultation
            history.
          </p>
        </div>
      </div>

      {error && (
        <div className="consultation-alert consultation-error">
          {error}
        </div>
      )}

      {message && (
        <div className="consultation-alert consultation-success">
          {message}
        </div>
      )}

      <section className="consultation-panel">
        <div className="consultation-section-heading">
          <Search size={20} />
          <div>
            <h2>Patient Consultation History</h2>
            <p>Search using the patient's existing ID.</p>
          </div>
        </div>

        <form
          className="consultation-search-form"
          onSubmit={searchConsultations}
        >
          <label>
            Patient ID
            <input
              type="number"
              min="1"
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              placeholder="Enter patient ID"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            <Search size={16} />
            {loading ? "Searching..." : "Search History"}
          </button>
        </form>

        {loading ? (
          <p className="consultation-empty">Loading history...</p>
        ) : searched && consultations.length === 0 ? (
          <p className="consultation-empty">
            No consultations found for this patient.
          </p>
        ) : consultations.length > 0 ? (
          <div className="consultation-table-wrapper">
            <table className="consultation-table">
              <thead>
                <tr>
                  <th>Consultation ID</th>
                  <th>Visit ID</th>
                  <th>Chief Complaint</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {consultations.map((item) => (
                  <tr key={item.consultationId}>
                    <td>{item.consultationId}</td>
                    <td>{item.visit?.visitId ?? item.visitId ?? "—"}</td>
                    <td>{item.chiefComplaint ?? "—"}</td>
                    <td>{item.status ?? "—"}</td>
                    <td>
                      <Link
                        to={`/consultations/${item.consultationId}`}
                        className="consultation-link"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="consultation-panel">
        <div className="consultation-section-heading">
          <Stethoscope size={20} />
          <div>
            <h2>Create Consultation</h2>
            <p>
              Enter the visit, patient, and doctor IDs and record
              the consultation.
            </p>
          </div>
        </div>

        <form className="consultation-form" onSubmit={handleCreate}>
          <label>
            Visit ID *
            <input
              type="number"
              name="visitId"
              min="1"
              value={form.visitId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Patient ID *
            <input
              type="number"
              name="patientId"
              min="1"
              value={form.patientId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Doctor ID *
            <input
              type="number"
              name="doctorId"
              min="1"
              value={form.doctorId}
              onChange={handleChange}
              required
            />
          </label>

          <label className="consultation-full-width">
            Chief Complaint *
            <textarea
              name="chiefComplaint"
              value={form.chiefComplaint}
              onChange={handleChange}
              placeholder="Main reason for the patient's visit"
              required
            />
          </label>

          <label className="consultation-full-width">
            Clinical Notes
            <textarea
              name="clinicalNotes"
              value={form.clinicalNotes}
              onChange={handleChange}
              placeholder="Symptoms and clinical observations"
            />
          </label>

          <label className="consultation-full-width">
            Examination Notes
            <textarea
              name="examinationNotes"
              value={form.examinationNotes}
              onChange={handleChange}
              placeholder="Physical examination findings"
            />
          </label>

          <label className="consultation-full-width">
            Treatment Plan
            <textarea
              name="treatmentPlan"
              value={form.treatmentPlan}
              onChange={handleChange}
              placeholder="Recommended treatment or investigations"
            />
          </label>

          <label className="consultation-checkbox">
            <input
              type="checkbox"
              name="followUpRequired"
              checked={form.followUpRequired}
              onChange={handleChange}
            />
            Follow-up required
          </label>

          {form.followUpRequired && (
            <label>
              Follow-up Date
              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <div className="consultation-form-actions">
            <button type="submit" disabled={saving}>
              <ClipboardList size={16} />
              {saving ? "Saving..." : "Save Consultation"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
