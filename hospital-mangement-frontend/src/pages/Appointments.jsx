
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, CalendarPlus, RefreshCw, Eye } from "lucide-react";
import { getPatientAppointments } from "../services/appointmentService"
import "../styles/appointments.css";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to load appointments."
    );
}

export default function Appointments() {
    const navigate = useNavigate();

    const [patientId, setPatientId] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    async function loadAppointments(event) {
        event?.preventDefault();

        if (!patientId.trim()) {
            setError("Enter a patient ID.");
            return;
        }

        setLoading(true);
        setError("");
        setSearched(false);

        try {
            const result = await getPatientAppointments(
                patientId.trim()
            );

            setAppointments(result);
            setSearched(true);
        } catch (err) {
            setAppointments([]);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    const filteredAppointments = appointments.filter((appointment) => {
        const term = search.trim().toLowerCase();

        if (!term) return true;

        return [
            appointment.appointmentNumber,
            appointment.appointmentId,
            appointment.appointmentType,
            appointment.status,
            appointment.reason,
        ].some((value) =>
            String(value ?? "").toLowerCase().includes(term)
        );
    });

    return (
        <section className="appointments-page">
            <div className="appointments-heading">
                <div>
                    <p className="page-eyebrow">APPOINTMENT MANAGEMENT</p>
                    <h1>Appointments</h1>
                    <p className="page-description">
                        Find appointments for a registered patient.
                    </p>
                </div>

                <Link
                    to="/appointments/new"
                    className="appointment-primary-btn"
                >
                    <CalendarPlus size={18} />
                    Book appointment
                </Link>
            </div>

            <div className="appointment-search-card">
                <h2>Find patient appointments</h2>
                <p>
                    Enter the patient's ID to retrieve their appointment
                    records.
                </p>

                <form
                    className="appointment-lookup-form"
                    onSubmit={loadAppointments}
                >
                    <label htmlFor="patientId">Patient ID</label>

                    <div className="appointment-lookup-row">
                        <input
                            id="patientId"
                            type="number"
                            min="1"
                            value={patientId}
                            onChange={(event) =>
                                setPatientId(event.target.value)
                            }
                            placeholder="Enter patient ID"
                            required
                        />

                        <button
                            type="submit"
                            className="appointment-primary-btn"
                            disabled={loading}
                        >
                            <Search size={17} />
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="appointment-alert">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={loadAppointments}
                    >
                        Try again
                    </button>
                </div>
            )}

            {searched && !error && (
                <div className="appointment-results-card">
                    <div className="appointment-results-heading">
                        <div>
                            <h2>Appointment records</h2>
                            <p>
                                Patient ID: {patientId} ·{" "}
                                {appointments.length} record(s)
                            </p>
                        </div>

                        <button
                            type="button"
                            className="appointment-secondary-btn"
                            onClick={loadAppointments}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    <label className="appointment-search">
                        <Search size={17} />
                        <input
                            type="search"
                            placeholder="Search appointment number, type, status..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </label>

                    {filteredAppointments.length === 0 ? (
                        <div className="appointment-empty">
                            <CalendarPlus size={28} />
                            <h3>No appointments found</h3>
                            <p>
                                {search
                                    ? "Try a different search term."
                                    : "This patient has no appointments to display."}
                            </p>
                        </div>
                    ) : (
                        <div className="appointment-table-wrapper">
                            <table className="appointment-table">
                                <thead>
                                    <tr>
                                        <th>Appointment</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredAppointments.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>
                                                    {item.appointmentNumber ||
                                                        `#${item.id}`}
                                                </strong>
                                                <span className="appointment-subtext">
                                                    {item.reason || "No reason provided"}
                                                </span>
                                            </td>
                                            <td>{item.appointmentDate || "—"}</td>
                                            <td>
                                                {item.startTime || "—"}
                                                {item.endTime
                                                    ? ` – ${item.endTime}`
                                                    : ""}
                                            </td>
                                            <td>
                                                {item.appointmentType || "—"}
                                            </td>
                                            <td>
                                                <span className="appointment-status">
                                                    {item.status || "—"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="appointment-view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/appointments/${item.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
