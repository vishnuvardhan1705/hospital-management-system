import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import { getPatientById } from "../services/patientService";
import "../styles/patients.css";

export default function PatientDetails() {
    const { patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadPatient() {
            setLoading(true);
            setError("");

            try {
                const result = await getPatientById(patientId);

                if (active) {
                    setPatient(result);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to load patient details."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadPatient();

        return () => {
            active = false;
        };
    }, [patientId]);

    if (loading) {
        return (
            <section className="patients-page">
                <div className="patient-state">Loading patient details...</div>
            </section>
        );
    }

    if (error || !patient) {
        return (
            <section className="patients-page">
                <Link to="/patients" className="patient-back-link">
                    <ArrowLeft size={17} />
                    Back to patients
                </Link>
                <div className="patient-alert patient-alert-error">
                    {error || "Patient not found."}
                </div>
            </section>
        );
    }

    const fields = [
        ["Patient number", patient.patientNumber],
        ["First name", patient.firstName],
        ["Last name", patient.lastName],
        ["Date of birth", patient.dateOfBirth],
        ["Gender", patient.gender],
        ["Blood group", patient.bloodGroup],
        ["Mobile number", patient.mobileNumber],
        ["Email", patient.email],
        ["Address", patient.address],
        ["City", patient.city],
        ["State", patient.state],
        ["Pincode", patient.pincode],
        ["Emergency contact", patient.emergencyContactName],
        ["Emergency contact number", patient.emergencyContactNumber],
        ["Status", patient.status],
    ];

    return (
        <section className="patients-page">
            <Link to="/patients" className="patient-back-link">
                <ArrowLeft size={17} />
                Back to patients
            </Link>

            <div className="patients-heading">
                <div>
                    <p className="page-eyebrow">PATIENT PROFILE</p>
                    <h1>
                        {[patient.firstName, patient.lastName]
                            .filter(Boolean)
                            .join(" ") || "Patient details"}
                    </h1>
                    <p className="page-description">
                        Patient number: {patient.patientNumber || "Not available"}
                    </p>
                </div>
            </div>

            <div className="patient-details-card">
                <div className="patient-profile-header">
                    <div className="patient-profile-avatar">
                        <UserRound size={30} />
                    </div>
                    <div>
                        <h2>
                            {[patient.firstName, patient.lastName]
                                .filter(Boolean)
                                .join(" ")}
                        </h2>
                        <p>{patient.mobileNumber || "No mobile number"}</p>
                    </div>
                    {patient.status && (
                        <span className="patient-status">
                            {patient.status}
                        </span>
                    )}
                </div>

                <div className="patient-details-grid">
                    {fields.map(([label, value]) => (
                        <div className="patient-detail-item" key={label}>
                            <span>{label}</span>
                            <strong>{value || "—"}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}