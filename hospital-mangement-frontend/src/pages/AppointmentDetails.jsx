
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import {
    getAppointmentById,
    confirmAppointment,
    cancelAppointment,
} from "../services/appointmentService";
import "../styles/appointments.css";

export default function AppointmentDetails() {
    const { appointmentId } = useParams();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadAppointment = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getAppointmentById(appointmentId);
            setAppointment(result);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load appointment."
            );
        } finally {
            setLoading(false);
        }
    }, [appointmentId]);

    useEffect(() => {
        loadAppointment();
    }, [loadAppointment]);

    async function runAction(action, successMessage) {
        setActionLoading(true);
        setError("");
        setMessage("");

        try {
            await action(appointmentId);
            setMessage(successMessage);
            await loadAppointment();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to update appointment."
            );
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="appointments-page">
                <div className="appointment-empty">
                    Loading appointment...
                </div>
            </section>
        );
    }

    if (error && !appointment) {
        return (
            <section className="appointments-page">
                <Link
                    to="/appointments"
                    className="appointment-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to appointments
                </Link>

                <div className="appointment-alert">
                    <p>{error}</p>
                    <button type="button" onClick={loadAppointment}>
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    if (!appointment) return null;

    const fields = [
        ["Appointment number", appointment.appointmentNumber],
        ["Appointment ID", appointment.appointmentId],
        ["Patient ID", appointment.patientId],
        ["Doctor ID", appointment.doctorId],
        ["Department ID", appointment.departmentId],
        ["Date", appointment.appointmentDate],
        ["Start time", appointment.startTime],
        ["End time", appointment.endTime],
        ["Type", appointment.appointmentType],
        ["Reason", appointment.reason],
        ["Status", appointment.status],
    ];

    const status = String(appointment.status || "").toUpperCase();
    const canConfirm = status === "SCHEDULED";
    const canCancel = !["CANCELLED", "COMPLETED", "NO_SHOW"].includes(status);

    return (
        <section className="appointments-page">
            <Link to="/appointments" className="appointment-back-link">
                <ArrowLeft size={17} />
                Back to appointments
            </Link>

            <div className="appointments-heading">
                <div>
                    <p className="page-eyebrow">APPOINTMENT DETAILS</p>
                    <h1>
                        {appointment.appointmentNumber ||
                            `Appointment #${appointment.id}`}
                    </h1>
                    <p className="page-description">
                        Review the appointment information and status.
                    </p>
                </div>

                <button
                    type="button"
                    className="appointment-secondary-btn"
                    onClick={loadAppointment}
                    disabled={loading || actionLoading}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {message && (
                <div className="appointment-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="appointment-alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="appointment-details-card">
                <div className="appointment-details-header">
                    <div>
                        <h2>Appointment information</h2>
                        <p>
                            Status: {appointment.status || "Not available"}
                        </p>
                    </div>

                    <span className="appointment-status">
                        {appointment.status || "—"}
                    </span>
                </div>

                <div className="appointment-details-grid">
                    {fields.map(([label, value]) => (
                        <div key={label} className="appointment-detail-item">
                            <span>{label}</span>
                            <strong>{value ?? "—"}</strong>
                        </div>
                    ))}
                </div>

                <div className="appointment-form-actions">
                    {canCancel && (
                        <button
                            type="button"
                            className="appointment-cancel-action"
                            disabled={actionLoading}
                            onClick={() => {
                                if (window.confirm("Cancel this appointment?")) {
                                    runAction(
                                        cancelAppointment,
                                        "Appointment cancellation requested."
                                    );
                                }
                            }}
                        >
                            <XCircle size={17} />
                            Cancel appointment
                        </button>
                    )}

                    {canConfirm && (
                        <button
                            type="button"
                            className="appointment-primary-btn"
                            disabled={actionLoading}
                            onClick={() =>
                                runAction(
                                    confirmAppointment,
                                    "Appointment confirmation requested."
                                )
                            }
                        >
                            <CheckCircle size={17} />
                            {actionLoading ? "Updating..." : "Confirm appointment"}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
