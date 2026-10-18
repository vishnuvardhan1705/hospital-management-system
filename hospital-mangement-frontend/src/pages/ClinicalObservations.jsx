
import { useState } from "react";
import { Activity, HeartPulse, Stethoscope } from "lucide-react";

import {
  addSymptoms,
  addVitals,
} from "../services/consultationService";

import "../styles/clinicalObservations.css";

const initialSymptom = {
  consultationId: "",
  symptomName: "",
  duration: "",
  severity: "",
  description: "",
};

const initialVitals = {
  patientId: "",
  visitId: "",
  consultationId: "",
  temperature: "",
  pulse: "",
  systolicBp: "",
  diastolicBp: "",
  oxygenSaturation: "",
  weight: "",
  height: "",
  respiratoryRate: "",
};

function toOptionalNumber(value) {
  return value === "" ? null : Number(value);
}

export default function ClinicalObservations() {
  const [symptom, setSymptom] = useState(initialSymptom);
  const [vitals, setVitals] = useState(initialVitals);

  const [savingSymptoms, setSavingSymptoms] = useState(false);
  const [savingVitals, setSavingVitals] = useState(false);

  const [symptomError, setSymptomError] = useState("");
  const [vitalsError, setVitalsError] = useState("");

  const [symptomMessage, setSymptomMessage] = useState("");
  const [vitalsMessage, setVitalsMessage] = useState("");

  const handleSymptomChange = (event) => {
    const { name, value } = event.target;

    setSymptom((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleVitalsChange = (event) => {
    const { name, value } = event.target;

    setVitals((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveSymptoms = async (event) => {
    event.preventDefault();
    setSavingSymptoms(true);
    setSymptomError("");
    setSymptomMessage("");

    const payload = {
      symptomName: symptom.symptomName.trim(),
      duration: symptom.duration.trim(),
      severity: symptom.severity,
      description: symptom.description.trim(),
    };

    try {
      await addSymptoms(Number(symptom.consultationId), payload);

      setSymptomMessage("Symptoms recorded successfully.");
      setSymptom({
        ...initialSymptom,
        consultationId: symptom.consultationId,
      });
    } catch (err) {
      setSymptomError(
        err.response?.data?.message ??
          "Unable to record symptoms. Check the consultation ID and request fields."
      );
    } finally {
      setSavingSymptoms(false);
    }
  };

  const handleSaveVitals = async (event) => {
    event.preventDefault();
    setSavingVitals(true);
    setVitalsError("");
    setVitalsMessage("");

    const payload = {
      patientId: Number(vitals.patientId),
      visitId: Number(vitals.visitId),
      consultationId: Number(vitals.consultationId),
      temperature: toOptionalNumber(vitals.temperature),
      pulse: toOptionalNumber(vitals.pulse),
      systolicBp: toOptionalNumber(vitals.systolicBp),
      diastolicBp: toOptionalNumber(vitals.diastolicBp),
      oxygenSaturation: toOptionalNumber(vitals.oxygenSaturation),
      weight: toOptionalNumber(vitals.weight),
      height: toOptionalNumber(vitals.height),
      respiratoryRate: toOptionalNumber(vitals.respiratoryRate),
    };

    try {
      await addVitals(Number(vitals.consultationId), payload);

      setVitalsMessage("Vital signs recorded successfully.");
      setVitals({
        ...initialVitals,
        patientId: vitals.patientId,
        visitId: vitals.visitId,
        consultationId: vitals.consultationId,
      });
    } catch (err) {
      setVitalsError(
        err.response?.data?.message ??
          "Unable to record vital signs. Check the IDs and request fields."
      );
    } finally {
      setSavingVitals(false);
    }
  };

  return (
    <div className="clinical-page">
      <div className="clinical-heading">
        <div>
          <h1>Vitals & Symptoms</h1>
          <p>
            Record patient-reported symptoms and clinical measurements
            for an existing consultation.
          </p>
        </div>
      </div>

      <section className="clinical-panel">
        <div className="clinical-section-heading">
          <Stethoscope size={21} />
          <div>
            <h2>Record Symptoms</h2>
            <p>Associate symptoms with an existing consultation.</p>
          </div>
        </div>

        {symptomError && (
          <div className="clinical-alert clinical-error">
            {symptomError}
          </div>
        )}

        {symptomMessage && (
          <div className="clinical-alert clinical-success">
            {symptomMessage}
          </div>
        )}

        <form
          className="clinical-form"
          onSubmit={handleSaveSymptoms}
        >
          <label>
            Consultation ID *
            <input
              type="number"
              name="consultationId"
              min="1"
              value={symptom.consultationId}
              onChange={handleSymptomChange}
              required
            />
          </label>

          <label>
            Symptom Name *
            <input
              name="symptomName"
              value={symptom.symptomName}
              onChange={handleSymptomChange}
              placeholder="For example, headache"
              required
            />
          </label>

          <label>
            Duration
            <input
              name="duration"
              value={symptom.duration}
              onChange={handleSymptomChange}
              placeholder="For example, 2 days"
            />
          </label>

          <label>
            Severity
            <select
              name="severity"
              value={symptom.severity}
              onChange={handleSymptomChange}
              required
            >
              <option value="">Select severity</option>
              <option value="MILD">Mild</option>
              <option value="MODERATE">Moderate</option>
              <option value="SEVERE">Severe</option>
            </select>
          </label>

          <label className="clinical-full-width">
            Description
            <textarea
              name="description"
              value={symptom.description}
              onChange={handleSymptomChange}
              placeholder="Additional details about the symptom"
            />
          </label>

          <div className="clinical-actions">
            <button type="submit" disabled={savingSymptoms}>
              <Activity size={16} />
              {savingSymptoms ? "Saving..." : "Save Symptoms"}
            </button>
          </div>
        </form>
      </section>

      <section className="clinical-panel">
        <div className="clinical-section-heading">
          <HeartPulse size={21} />
          <div>
            <h2>Record Vital Signs</h2>
            <p>
              Enter the measurements recorded by the clinical staff.
            </p>
          </div>
        </div>

        {vitalsError && (
          <div className="clinical-alert clinical-error">
            {vitalsError}
          </div>
        )}

        {vitalsMessage && (
          <div className="clinical-alert clinical-success">
            {vitalsMessage}
          </div>
        )}

        <form className="clinical-form" onSubmit={handleSaveVitals}>
          <label>
            Patient ID *
            <input
              type="number"
              name="patientId"
              min="1"
              value={vitals.patientId}
              onChange={handleVitalsChange}
              required
            />
          </label>

          <label>
            Visit ID *
            <input
              type="number"
              name="visitId"
              min="1"
              value={vitals.visitId}
              onChange={handleVitalsChange}
              required
            />
          </label>

          <label>
            Consultation ID *
            <input
              type="number"
              name="consultationId"
              min="1"
              value={vitals.consultationId}
              onChange={handleVitalsChange}
              required
            />
          </label>

          <label>
            Temperature (°C)
            <input
              type="number"
              name="temperature"
              min="0"
              max="100"
              step="0.1"
              value={vitals.temperature}
              onChange={handleVitalsChange}
              placeholder="e.g. 37.0"
            />
          </label>

          <label>
            Pulse (beats/min)
            <input
              type="number"
              name="pulse"
              min="0"
              step="1"
              value={vitals.pulse}
              onChange={handleVitalsChange}
              placeholder="e.g. 72"
            />
          </label>

          <label>
            Systolic BP (mmHg)
            <input
              type="number"
              name="systolicBp"
              min="0"
              value={vitals.systolicBp}
              onChange={handleVitalsChange}
              placeholder="e.g. 120"
            />
          </label>

          <label>
            Diastolic BP (mmHg)
            <input
              type="number"
              name="diastolicBp"
              min="0"
              value={vitals.diastolicBp}
              onChange={handleVitalsChange}
              placeholder="e.g. 80"
            />
          </label>

          <label>
            Oxygen Saturation (%)
            <input
              type="number"
              name="oxygenSaturation"
              min="0"
              max="100"
              step="0.1"
              value={vitals.oxygenSaturation}
              onChange={handleVitalsChange}
              placeholder="e.g. 98"
            />
          </label>

          <label>
            Weight (kg)
            <input
              type="number"
              name="weight"
              min="0"
              step="0.1"
              value={vitals.weight}
              onChange={handleVitalsChange}
              placeholder="e.g. 68.5"
            />
          </label>

          <label>
            Height (cm)
            <input
              type="number"
              name="height"
              min="0"
              step="0.1"
              value={vitals.height}
              onChange={handleVitalsChange}
              placeholder="e.g. 170"
            />
          </label>

          <label>
            Respiratory Rate (breaths/min)
            <input
              type="number"
              name="respiratoryRate"
              min="0"
              step="1"
              value={vitals.respiratoryRate}
              onChange={handleVitalsChange}
              placeholder="e.g. 16"
            />
          </label>

          <div className="clinical-actions clinical-full-width">
            <button type="submit" disabled={savingVitals}>
              <HeartPulse size={16} />
              {savingVitals ? "Saving..." : "Save Vital Signs"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
