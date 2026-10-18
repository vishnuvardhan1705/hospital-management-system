
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Save, Stethoscope } from "lucide-react";

import {
  addDiagnosis,
  getConsultationById,
  updateConsultation,
} from "../services/consultationService";

import "../styles/consultations.css";

const emptyDiagnosis = {
  diagnosisCode: "",
  diagnosisName: "",
  diagnosisType: "PRIMARY",
  description: "",
};

export default function ConsultationDetails() {
  const { consultationId } = useParams();

  const [consultation, setConsultation] = useState(null);
  const [form, setForm] = useState(null);
  const [diagnosis, setDiagnosis] = useState(emptyDiagnosis);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadConsultation = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getConsultationById(consultationId);

      setConsultation(result);
      setForm({
        visitId: result.visit?.visitId ?? result.visitId ?? "",
        patientId: result.patient?.patientId ?? result.patientId ?? "",
        doctorId: result.doctor?.doctorId ?? result.doctorId ?? "",
        chiefComplaint: result.chiefComplaint ?? "",
        clinicalNotes: result.clinicalNotes ?? "",
        examinationNotes: result.examinationNotes ?? "",
        treatmentPlan: result.treatmentPlan ?? "",
        followUpRequired: Boolean(result.followUpRequired),
        followUpDate: result.followUpDate ?? "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Unable to load consultation details."
      );
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    loadConsultation();
  }, [loadConsultation]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
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
      await updateConsultation(consultationId, payload);
      setMessage("Consultation updated successfully.");
      await loadConsultation();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Unable to update the consultation."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDiagnosisChange = (event) => {
    const { name, value } = event.target;

    setDiagnosis((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAddDiagnosis = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await addDiagnosis(consultationId, diagnosis);
      setDiagnosis(emptyDiagnosis);
      setMessage("Diagnosis added successfully.");
      await loadConsultation();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Unable to add the diagnosis."
      );
    }
  };

  if (loading) {
    return (
      <div className="consultations-page">
        Loading consultation details...
      </div>
    );
  }

  if (!consultation || !form) {
    return (
      <div className="consultations-page">
        <div className="consultation-alert consultation-error">
          {error || "Consultation not found."}
        </div>
        <Link to="/consultations">Back to Consultations</Link>
      </div>
    );
  }

  const diagnoses = Array.isArray(consultation.diagnoses)
    ? consultation.diagnoses
    : [];

  return (
    <div className="consultations-page">
      <div className="consultations-heading">
        <div>
          <h1>Consultation Details</h1>
          <p>Consultation ID: {consultation.consultationId}</p>
        </div>

        <Link to="/consultations" className="consultation-link">
          Back to Consultations
        </Link>
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
          <Stethoscope size={20} />
          <div>
            <h2>Clinical Notes</h2>
            <p>Status: {consultation.status ?? "—"}</p>
          </div>
        </div>

        <form className="consultation-form" onSubmit={handleSave}>
          <label>
            Visit ID
            <input value={form.visitId} disabled />
          </label>

          <label>
            Patient ID
            <input value={form.patientId} disabled />
          </label>

          <label>
            Doctor ID
            <input value={form.doctorId} disabled />
          </label>

          <label className="consultation-full-width">
            Chief Complaint *
            <textarea
              name="chiefComplaint"
              value={form.chiefComplaint}
              onChange={handleChange}
              required
            />
          </label>

          <label className="consultation-full-width">
            Clinical Notes
            <textarea
              name="clinicalNotes"
              value={form.clinicalNotes}
              onChange={handleChange}
            />
          </label>

          <label className="consultation-full-width">
            Examination Notes
            <textarea
              name="examinationNotes"
              value={form.examinationNotes}
              onChange={handleChange}
            />
          </label>

          <label className="consultation-full-width">
            Treatment Plan
            <textarea
              name="treatmentPlan"
              value={form.treatmentPlan}
              onChange={handleChange}
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
              <Save size={16} />
              {saving ? "Saving..." : "Update Consultation"}
            </button>
          </div>
        </form>
      </section>

      <section className="consultation-panel">
        <div className="consultation-section-heading">
          <Stethoscope size={20} />
          <div>
            <h2>Diagnoses</h2>
            <p>Clinical diagnoses recorded for this consultation.</p>
          </div>
        </div>

        {diagnoses.length === 0 ? (
          <p className="consultation-empty">
            No diagnoses are included in the consultation response.
            You can add a diagnosis below.
          </p>
        ) : (
          <div className="consultation-table-wrapper">
            <table className="consultation-table">
              <thead>
                <tr>
                  <th>Diagnosis ID</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {diagnoses.map((item) => (
                  <tr key={item.diagnosisId}>
                    <td>{item.diagnosisId}</td>
                    <td>{item.diagnosisCode ?? "—"}</td>
                    <td>{item.diagnosisName ?? "—"}</td>
                    <td>{item.diagnosisType ?? "—"}</td>
                    <td>{item.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form
          className="consultation-form diagnosis-form"
          onSubmit={handleAddDiagnosis}
        >
          <label>
            Diagnosis Code
            <input
              name="diagnosisCode"
              value={diagnosis.diagnosisCode}
              onChange={handleDiagnosisChange}
              placeholder="For example, DX-001"
            />
          </label>

          <label>
            Diagnosis Name *
            <input
              name="diagnosisName"
              value={diagnosis.diagnosisName}
              onChange={handleDiagnosisChange}
              required
            />
          </label>

          <label>
            Diagnosis Type *
            <select
              name="diagnosisType"
              value={diagnosis.diagnosisType}
              onChange={handleDiagnosisChange}
              required
            >
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
            </select>
          </label>

          <label className="consultation-full-width">
            Description
            <textarea
              name="description"
              value={diagnosis.description}
              onChange={handleDiagnosisChange}
            />
          </label>

          <div className="consultation-form-actions">
            <button type="submit">
              Add Diagnosis
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}