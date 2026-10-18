import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  createDoctor,
  getDoctorById,
  updateDoctor,
} from "../services/doctorService";
import "../styles/Doctors.css";

const initialForm = {
  hospitalId: "",
  departmentId: "",
  fullName: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  address: "",
  specialization: "",
  qualification: "",
  registrationNumber: "",
  experienceYears: "",
  consultationFee: "",
  status: "ACTIVE",
};

export default function DoctorForm() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(doctorId);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function loadDoctor() {
      try {
        setError("");
        const doctor = await getDoctorById(doctorId);

        setForm({
          hospitalId:
            doctor.hospital?.hospitalId ?? doctor.hospitalId ?? "",
          departmentId:
            doctor.department?.departmentId ?? doctor.departmentId ?? "",
          fullName: doctor.fullName ?? "",
          gender: doctor.gender ?? "",
          dateOfBirth: doctor.dateOfBirth
            ? String(doctor.dateOfBirth).slice(0, 10)
            : "",
          phone: doctor.phone ?? "",
          email: doctor.email ?? "",
          address: doctor.address ?? "",
          specialization: doctor.specialization ?? "",
          qualification: doctor.qualification ?? "",
          registrationNumber: doctor.registrationNumber ?? "",
          experienceYears: doctor.experienceYears ?? "",
          consultationFee: doctor.consultationFee ?? "",
          status: doctor.status ?? "ACTIVE",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load doctor details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [doctorId, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.hospitalId || !form.departmentId) {
      setError("Hospital ID and Department ID are required.");
      return;
    }

    const payload = {
      hospitalId: Number(form.hospitalId),
      departmentId: Number(form.departmentId),
      fullName: form.fullName.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth || null,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      specialization: form.specialization.trim(),
      qualification: form.qualification.trim(),
      registrationNumber: form.registrationNumber.trim(),
      experienceYears:
        form.experienceYears === ""
          ? null
          : Number(form.experienceYears),
      consultationFee:
        form.consultationFee === ""
          ? null
          : Number(form.consultationFee),
      status: form.status,
    };

    try {
      setSaving(true);

      if (isEdit) {
        await updateDoctor(doctorId, payload);
        navigate(`/doctors/${doctorId}`);
      } else {
        const created = await createDoctor(payload);

        if (created?.doctorId != null) {
          navigate(`/doctors/${created.doctorId}`);
        } else {
          navigate("/doctors");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save doctor. Check the request fields and backend validation."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="doctors-page doctors-empty">Loading doctor...</div>;
  }

  return (
    <section className="doctors-page">
      <Link
        to={isEdit ? `/doctors/${doctorId}` : "/doctors"}
        className="doctors-back-link"
      >
        <ArrowLeft size={17} />
        Back
      </Link>

      <div className="doctors-heading">
        <div>
          <p className="doctors-eyebrow">DOCTOR MANAGEMENT</p>
          <h1>{isEdit ? "Edit Doctor" : "Register Doctor"}</h1>
          <p className="doctors-subtitle">
            Enter the details required to create or update a doctor.
          </p>
        </div>
      </div>

      {error && <div className="doctors-error">{error}</div>}

      <form className="doctor-form-card" onSubmit={handleSubmit}>
        <h2>Doctor information</h2>

        <div className="doctor-form-grid">
          <label>
            Hospital ID *
            <input
              name="hospitalId"
              type="number"
              min="1"
              value={form.hospitalId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Department ID *
            <input
              name="departmentId"
              type="number"
              min="1"
              value={form.departmentId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Full name *
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Gender *
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <label>
            Date of birth
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Specialization *
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Qualification *
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Registration number *
            <input
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Experience (years)
            <input
              name="experienceYears"
              type="number"
              min="0"
              step="1"
              value={form.experienceYears}
              onChange={handleChange}
            />
          </label>

          <label>
            Consultation fee (₹)
            <input
              name="consultationFee"
              type="number"
              min="0"
              step="0.01"
              value={form.consultationFee}
              onChange={handleChange}
            />
          </label>

          <label>
            Status *
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <label className="doctor-form-full">
            Address
            <textarea
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="doctor-form-actions">
          <Link
            to={isEdit ? `/doctors/${doctorId}` : "/doctors"}
            className="doctors-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="doctors-primary-button"
            disabled={saving}
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Register doctor"}
          </button>
        </div>
      </form>
    </section>
  );
}