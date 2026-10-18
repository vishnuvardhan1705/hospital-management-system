import { useCallback,useEffect,useMemo,useState } from "react";
import {Link} from "react-router-dom";
import { Search, UserPlus, RefreshCw, Eye } from "lucide-react";
import { getPatients } from "../services/patientService";
import "../styles/patients.css";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to load patients."
    );
}

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPatients = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getPatients();
            setPatients(result);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
        console.log("Patients data:", patients);
    }, []);

    useEffect(() => {
        loadPatients();
    }, [loadPatients]);

    const filteredPatients = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return patients;

        return patients.filter((patient) => {
            const fullName = [
                patient.firstName,
                patient.lastName,
            ].filter(Boolean).join(" ");

            return [
                fullName,
                patient.patientNumber,
                patient.mobileNumber,
                patient.email,
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            
            );
            console.log("Patients data:", patients);
        });
    }, [patients, search]);
    return (
        <section className="patients-page">
            <div className="patients-heading">
                <div>
                    <p className="page-eyebrow">PATIENT MANAGEMENT</p>
                    <h1>Patients</h1>
                    <p className="page-description">
                        Register patients and manage their profiles.
                    </p>
                </div>

                <Link to="/patients/new" className="patient-primary-btn">
                    <UserPlus size={18} />
                    <span>Register patient</span>
                </Link>
            </div>

            <div className="patients-summary">
                <div className="patient-summary-icon">
                    <UserPlus size={22} />
                </div>
                <div>
                    <p>Total loaded patients</p>
                    <h2>{patients.length}</h2>
                </div>
            </div>

            <div className="patients-table-card">
                <div className="patients-toolbar">
                    <div>
                        <h2>Patient directory</h2>
                        <p>Search your loaded patient records.</p>
                    </div>

                    <button
                        type="button"
                        className="patient-refresh-btn"
                        onClick={loadPatients}
                        disabled={loading}
                        aria-label="Refresh patients"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                <label className="patient-search">
                    <Search size={18} />
                    <input
                        type="search"
                        placeholder="Search name, patient number, mobile..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>

                {error && (
                    <div className="patient-alert patient-alert-error">
                        <p>{error}</p>
                        <button type="button" onClick={loadPatients}>
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="patient-state">
                        Loading patients...
                    </div>
                ) : !error && filteredPatients.length === 0 ? (
                    <div className="patient-state">
                        <Search size={28} />
                        <h3>No patients found</h3>
                        <p>
                            {search
                                ? "Try another search term."
                                : "Register a patient to get started."}
                        </p>
                    </div>
                ) : !error ? (
                    <div className="patients-table-wrapper">
                        <table className="patients-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Patient number</th>
                                    <th>Mobile</th>
                                    <th>Gender</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={
                                            patient.id ??
                                            patient.patientNumber
                                        }
                                    >
                                        <td>
                                            <div className="patient-name-cell">
                                                <div className="patient-avatar">
                                                    {patient.firstName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "P"}
                                                </div>
                                                <div>
                                                    <strong>
                                                        {[
                                                            patient.firstName,
                                                            patient.lastName,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" ") ||
                                                            "Unnamed patient"}
                                                    </strong>
                                                    <span>
                                                        {patient.email || "No email"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {patient.patientNumber || "—"}
                                        </td>
                                        <td>
                                            {patient.mobileNumber || "—"}
                                        </td>
                                        <td>{patient.gender || "—"}</td>
                                        <td>
                                            <span className="patient-status">
                                                {patient.status || "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                className="patient-view-link"
                                                to={`/patients/${patient.id}`}
                                                aria-label={`View ${patient.firstName || "patient"}`}
                                            >
                                                <Eye size={16} />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
