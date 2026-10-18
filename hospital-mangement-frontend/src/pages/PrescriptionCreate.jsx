
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createPrescription } from "../services/prescriptionService";
import "../styles/prescriptions.css";

export default function PrescriptionCreate() {
  const navigate = useNavigate();

  const [consultationId, setConsultationId] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const consultationNumber = Number(consultationId);
    const patientNumber = Number(formData.patientId);
    const doctorNumber = Number(formData.doctorId);

    if (
      !Number.isInteger(consultationNumber) ||
      consultationNumber <= 0 ||
      !Number.isInteger(patientNumber) ||
      patientNumber <= 0 ||
      !Number.isInteger(doctorNumber) ||
      doctorNumber <= 0
    ) {
      setError("Enter valid positive IDs for all three fields.");
      return;
    }

    setLoading(true);

    try {
      const result = await createPrescription(
        consultationNumber,
        {
          patientId: patientNumber,
          doctorId: doctorNumber,
          instructions: formData.instructions.trim(),
        }
      );

      const prescriptionId =
        result?.prescriptionId ?? result?.id;

      if (prescriptionId) {
        navigate(`/prescriptions/${prescriptionId}`);
      } else {
        setError(
          "The request succeeded, but the response did not include a prescription ID. Check the backend response."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create the prescription. Verify the IDs and backend response."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prescription-page">
      <button
        type="button"
        className="prescription-secondary-button"
        onClick={() => navigate("/prescriptions")}
      >
        <ArrowLeft size={17} />
        Back to Prescriptions
      </button>

      <div className="prescription-heading">
        <h1>Create Prescription</h1>
        <p>Enter the consultation and prescription details.</p>
      </div>

      {error && (
        <div className="prescription-alert prescription-alert-error">
          {error}
        </div>
      )}

      <form className="prescription-card" onSubmit={handleSubmit}>
        <div className="prescription-form-grid">
          <div className="prescription-field">
            <label htmlFor="consultationId">Consultation ID *</label>
            <input
              id="consultationId"
              type="number"
              min="1"
              required
              value={consultationId}
              onChange={(event) =>
                setConsultationId(event.target.value)
              }
            />
            <small>
              This ID is sent in the URL, not in the request body.
            </small>
          </div>

          <div className="prescription-field">
            <label htmlFor="patientId">Patient ID *</label>
            <input
              id="patientId"
              name="patientId"
              type="number"
              min="1"
              required
              value={formData.patientId}
              onChange={handleChange}
            />
          </div>

          <div className="prescription-field">
            <label htmlFor="doctorId">Doctor ID *</label>
            <input
              id="doctorId"
              name="doctorId"
              type="number"
              min="1"
              required
              value={formData.doctorId}
              onChange={handleChange}
            />
          </div>

          <div className="prescription-field prescription-field-full">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="4"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="General instructions for the prescription"
            />
          </div>
        </div>

        <div className="prescription-actions">
          <button
            type="button"
            className="prescription-secondary-button"
            onClick={() => navigate("/prescriptions")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="prescription-primary-button"
            disabled={loading}
          >
            <Save size={17} />
            {loading ? "Creating..." : "Create Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
}
