import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, RefreshCw, Search, Stethoscope } from "lucide-react";
import { getDoctors } from "../services/doctorService";
import "../styles/Doctors.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load doctors. Check the backend and API response."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter((doctor) =>
      [
        doctor.fullName,
        doctor.specialization,
        doctor.qualification,
        doctor.registrationNumber,
        doctor.phone,
        doctor.email,
      ]
        .filter((value) => value != null)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [doctors, search]);

  return (
    <section className="doctors-page">
      <div className="doctors-heading">
        <div>
          <p className="doctors-eyebrow">HOSPITAL MANAGEMENT</p>
          <h1>Doctors</h1>
          <p className="doctors-subtitle">
            View and manage registered doctors.
          </p>
        </div>

        <Link to="/doctors/new" className="doctors-primary-button">
          <Plus size={18} />
          Register Doctor
        </Link>
      </div>

      <div className="doctors-summary">
        <div className="doctors-summary-icon">
          <Stethoscope size={23} />
        </div>
        <div>
          <span>Total doctors</span>
          <strong>{loading ? "—" : doctors.length}</strong>
        </div>
      </div>

      <div className="doctors-toolbar">
        <div className="doctors-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search name, specialization, phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="doctors-secondary-button"
          onClick={loadDoctors}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="doctors-error">{error}</div>}

      <div className="doctors-table-card">
        <div className="doctors-table-title">
          <h2>Doctor directory</h2>
          <p>{filteredDoctors.length} matching doctor(s)</p>
        </div>

        {loading ? (
          <div className="doctors-empty">Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="doctors-empty">
            {doctors.length === 0
              ? "No doctors found."
              : "No doctors match your search."}
          </div>
        ) : (
          <div className="doctors-table-scroll">
            <table className="doctors-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Qualification</th>
                  <th>Phone</th>
                  <th>Consultation Fee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <div className="doctor-name-cell">
                        <span className="doctor-avatar">
                          {(doctor.fullName || "D")
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div>
                          <strong>{doctor.fullName || "—"}</strong>
                          <small>ID: {doctor.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>{doctor.specialization || "—"}</td>
                    <td>{doctor.qualification || "—"}</td>
                    <td>{doctor.phone || "—"}</td>
                    <td>
                      {doctor.consultationFee != null
                        ? `₹${doctor.consultationFee}`
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`doctor-status ${
                          String(doctor.status || "").toUpperCase() ===
                          "ACTIVE"
                            ? "is-active"
                            : "is-other"
                        }`}
                      >
                        {doctor.status || "—"}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/doctors/${doctor.id}`}
                        className="doctor-view-link"
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
        )}
      </div>
    </section>
  );
}