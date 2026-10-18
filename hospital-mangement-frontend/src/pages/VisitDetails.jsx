
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getVisitById } from "../services/visitService";
import "../styles/visits.css";

export default function VisitDetails() {
  const { visitId } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadVisit = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getVisitById(visitId);
        if (active) setVisit(result);
      } catch (err) {
        if (active) {
          const body = err.response?.data;
          setError(
            (typeof body === "string" ? body : body?.message) ||
              "Unable to load visit details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadVisit();

    return () => {
      active = false;
    };
  }, [visitId]);

  if (loading) {
    return <div className="visits-page">Loading visit details...</div>;
  }

  if (error || !visit) {
    return (
      <div className="visits-page">
        <div className="visit-alert visit-alert-error">
          {error || "Visit not found."}
        </div>
        <Link to="/visits">Back to Visits</Link>
      </div>
    );
  }

  const patient = visit.patient ?? {};
  const doctor = visit.doctor ?? {};
  const department = visit.department ?? {};
  const appointment = visit.appointment ?? {};

  const patientName =
    [patient.firstName, patient.lastName].filter(Boolean).join(" ") ||
    patient.fullName ||
    "—";

  const fields = [
    ["Visit ID", visit.id],
    ["Visit Type", visit.visitType],
    ["Visit Date", visit.visitDate],
    ["Visit Status", visit.status],
    ["Patient ID", patient.id],
    ["Patient Number", patient.patientNumber],
    ["Patient Name", patientName],
    ["Patient Phone", patient.mobileNumber],
    ["Doctor ID", doctor.id],
    ["Doctor Name", doctor.name],
    ["Doctor Specialization", doctor.specialization],
    ["Department ID", department.id],
    ["Department", department.departmentName],
    ["Appointment ID", appointment.id],
    ["Appointment Number", appointment.appointmentNumber],
    ["Appointment Date", appointment.appointmentDate],
    ["Appointment Status", appointment.status],
    ["Start Time", appointment.startTime],
    ["End Time", appointment.endTime],
    ["Reason", appointment.reason],
  ];

  return (
    <div className="visits-page">
      <div className="visits-heading">
        <div>
          <h1>Visit Details</h1>
          <p>Details for visit #{visit.id}</p>
        </div>

        <Link className="visit-back-link" to="/visits">
          Back to Visits
        </Link>
      </div>

      <section className="visit-panel">
        <div className="visit-details-grid">
          {fields.map(([label, value]) => (
            <div className="visit-detail-item" key={label}>
              <span>{label}</span>
              <strong>
                {value == null || value === "" ? "—" : String(value)}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
