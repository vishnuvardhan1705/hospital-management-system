
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { createAppointment } from "../services/appointmentService";
import "../styles/appointments.css";

const initialForm = {
    patientId: "",
    doctorId: "",
    departmentId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    appointmentType: "OPD",
    reason: "",
};

function getErrorMessage(error) {
    const data = error.response?.data;

    if (data?.message) return data.message;

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).join(", ");
    }

    return error.message || "Unable to book appointment.";
}

export default function AppointmentForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (form.endTime <= form.startTime) {
            setError("End time must be later than start time.");
            return;
        }

        const payload = {
            patientId: Number(form.patientId),
            doctorId: Number(form.doctorId),
            departmentId: Number(form.departmentId),
            appointmentDate: form.appointmentDate,
            startTime: form.startTime,
            endTime: form.endTime,
            appointmentType: form.appointmentType,
            reason: form.reason.trim(),
        };

        setLoading(true);

        try {
            const result = await createAppointment(payload);

            // Open the new appointment when the API returns its ID.
            if (result?.appointmentId) {
                navigate(`/appointments/${result.appointmentId}`, {
                    replace: true,
                    state: {
                        message: "Appointment booked successfully.",
                    },
                });
            } else {
                navigate("/appointments", { replace: true });
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="appointments-page">
            <Link to="/appointments" className="appointment-back-link">
                <ArrowLeft size={17} />
                Back to appointments
            </Link>

            <div className="appointments-heading">
                <div>
                    <p className="page-eyebrow">APPOINTMENT MANAGEMENT</p>
                    <h1>Book appointment</h1>
                    <p className="page-description">
                        Enter the patient, doctor, department, and appointment
                        time.
                    </p>
                </div>
            </div>

            <form
                className="appointment-form-card"
                onSubmit={handleSubmit}
            >
                <div className="appointment-form-section">
                    <h2>People and department</h2>
                    <p>Use IDs from your existing records.</p>
                </div>

                {error && (
                    <div className="appointment-alert">
                        <p>{error}</p>
                    </div>
                )}

                <div className="appointment-form-grid">
                    <div className="appointment-field">
                        <label htmlFor="patientId">Patient ID *</label>
                        <input
                            id="patientId"
                            name="patientId"
                            type="number"
                            min="1"
                            value={form.patientId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label htmlFor="departmentId">Department ID *</label>
                        <input
                            id="departmentId"
                            name="departmentId"
                            type="number"
                            min="1"
                            value={form.departmentId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label htmlFor="doctorId">Doctor ID *</label>
                        <input
                            id="doctorId"
                            name="doctorId"
                            type="number"
                            min="1"
                            value={form.doctorId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="appointment-form-section">
                    <h2>Date and time</h2>
                    <p>Select the appointment date and time range.</p>
                </div>

                <div className="appointment-form-grid">
                    <div className="appointment-field">
                        <label htmlFor="appointmentDate">
                            Appointment date *
                        </label>
                        <input
                            id="appointmentDate"
                            name="appointmentDate"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={form.appointmentDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label htmlFor="startTime">Start time *</label>
                        <input
                            id="startTime"
                            name="startTime"
                            type="time"
                            value={form.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label htmlFor="endTime">End time *</label>
                        <input
                            id="endTime"
                            name="endTime"
                            type="time"
                            min={form.startTime || undefined}
                            value={form.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label htmlFor="appointmentType">
                            Appointment type *
                        </label>
                        <select
                            id="appointmentType"
                            name="appointmentType"
                            value={form.appointmentType}
                            onChange={handleChange}
                            required
                        >
                            <option value="OPD">OPD</option>
                            <option value="FOLLOW_UP">Follow-up</option>
                            <option value="EMERGENCY">Emergency</option>
                        </select>
                    </div>

                    <div className="appointment-field appointment-field-wide">
                        <label htmlFor="reason">Reason for appointment *</label>
                        <textarea
                            id="reason"
                            name="reason"
                            rows="4"
                            maxLength="1000"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Describe the reason for the appointment"
                            required
                        />
                    </div>
                </div>

                <div className="appointment-form-actions">
                    <Link
                        to="/appointments"
                        className="appointment-cancel-btn"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="appointment-primary-btn"
                        disabled={loading}
                    >
                        <CalendarPlus size={18} />
                        {loading ? "Booking..." : "Book appointment"}
                    </button>
                </div>
            </form>
        </section>
    );
}
