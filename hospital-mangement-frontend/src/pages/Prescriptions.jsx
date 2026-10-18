
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, RefreshCw, Eye } from "lucide-react";
import {
  getActivePrescriptions,
  getPatientPrescriptions,
} from "../services/prescriptionService";
import "../styles/prescriptions.css";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [mode, setMode] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadActivePrescriptions = async () => {
    setLoading(true);
    setError("");
    setMode("active");

    try {
      const data = await getActivePrescriptions();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load active prescriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  const searchByPatient = async (event) => {
    event.preventDefault();

    if (!patientId || Number(patientId) <= 0) {
      setError("Enter a valid patient ID.");
      return;
    }

    setLoading(true);
    setError("");
    setMode("patient");

    try {
      const data = await getPatientPrescriptions(Number(patientId));
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load prescriptions for this patient."
      );
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivePrescriptions();
  }, []);

  const getId = (prescription) =>
    prescription.prescriptionId ?? prescription.id;

  const getPatientName = (prescription) => {
    const patient = prescription.patient;

    if (!patient) {
      return prescription.patientId ?? "—";
    }

    const name = [
      patient.firstName,
      patient.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return name || patient.patientId || "—";
  };

  const getDoctorName = (prescription) => {
    const doctor = prescription.doctor;

    if (!doctor) {
      return prescription.doctorId ?? "—";
    }

    return (
      doctor.fullName ||
      [doctor.firstName, doctor.lastName]
        .filter(Boolean)
        .join(" ") ||
      doctor.doctorId ||
      "—"
    );
  };

  return (
    <div className="prescription-page">
      <div className="prescription-topbar">
        <div>
          <h1>Prescriptions</h1>
          <p>View active prescriptions or search by patient.</p>
        </div>

        <Link
          to="/prescriptions/new"
          className="prescription-primary-button"
        >
          <Plus size={18} />
          Create Prescription
        </Link>
      </div>

      <div className="prescription-card">
        <form
          className="prescription-search"
          onSubmit={searchByPatient}
        >
          <div className="prescription-field">
            <label htmlFor="searchPatientId">Patient ID</label>
            <input
              id="searchPatientId"
              type="number"
              min="1"
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              placeholder="Enter patient ID"
            />
          </div>

          <button
            type="submit"
            className="prescription-primary-button"
            disabled={loading}
          >
            <Search size={17} />
            Search Patient
          </button>

          <button
            type="button"
            className="prescription-secondary-button"
            onClick={loadActivePrescriptions}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Active Prescriptions
          </button>
        </form>
      </div>

      {error && (
        <div className="prescription-alert prescription-alert-error">
          {error}
        </div>
      )}

      <div className="prescription-card">
        <div className="prescription-list-heading">
          <h2>
            {mode === "active"
              ? "Active Prescriptions"
              : `Prescriptions for Patient ${patientId}`}
          </h2>
          <span>{prescriptions.length} record(s)</span>
        </div>

        {loading ? (
          <p className="prescription-empty">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p className="prescription-empty">
            No prescriptions found.
          </p>
        ) : (
          <div className="prescription-table-wrapper">
            <table className="prescription-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {prescriptions.map((prescription) => {
                  const id = getId(prescription);

                  return (
                    <tr key={id}>
                      <td>{id ?? "—"}</td>
                      <td>{getPatientName(prescription)}</td>
                      <td>{getDoctorName(prescription)}</td>
                      <td>
                        {prescription.prescriptionDate
                          ? String(
                              prescription.prescriptionDate
                            ).slice(0, 10)
                          : "—"}
                      </td>
                      <td>
                        <span className="prescription-status">
                          {prescription.status ?? "—"}
                        </span>
                      </td>
                      <td>
                        {id != null ? (
                          <Link
                            to={`/prescriptions/${id}`}
                            className="prescription-view-link"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
