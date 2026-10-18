import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Pencil,
  Plus,
  Save,
  Stethoscope,
} from "lucide-react";
import {
  createDoctorSchedule,
  getDoctorById,
  getDoctorSchedules,
  updateDoctorSchedule,
} from "../services/doctorService";
import "../styles/doctors.css";

const emptySchedule = {
  dayOfWeek: "MONDAY",
  startTime: "09:00",
  endTime: "17:00",
  breakStart: "",
  breakEnd: "",
  status: "ACTIVE",
};

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function displayTime(value) {
  return value ? String(value).slice(0, 5) : "";
}

function getErrorMessage(err, fallback) {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    fallback
  );
}

export default function DoctorDetails() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const doctorData = await getDoctorById(doctorId);
      setDoctor(doctorData);

      try {
        const scheduleData = await getDoctorSchedules(doctorId);
        setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
      } catch (scheduleError) {
        setSchedules([]);
        setError(
          getErrorMessage(
            scheduleError,
            "Doctor loaded, but schedules could not be loaded."
          )
        );
      }
    } catch (err) {
      setDoctor(null);
      setError(getErrorMessage(err, "Unable to load doctor details."));
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  function handleScheduleChange(event) {
    const { name, value } = event.target;

    setScheduleForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function startEditing(schedule) {
    setEditingScheduleId(schedule.scheduleId);
    setMessage("");
    setError("");

    setScheduleForm({
      dayOfWeek: schedule.dayOfWeek || "MONDAY",
      startTime: displayTime(schedule.startTime) || "09:00",
      endTime: displayTime(schedule.endTime) || "17:00",
      breakStart: displayTime(schedule.breakStart),
      breakEnd: displayTime(schedule.breakEnd),
      status: schedule.status || "ACTIVE",
    });
  }

  function resetScheduleForm() {
    setEditingScheduleId(null);
    setScheduleForm({ ...emptySchedule });
  }

  async function handleScheduleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (scheduleForm.endTime <= scheduleForm.startTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (
      Boolean(scheduleForm.breakStart) !==
      Boolean(scheduleForm.breakEnd)
    ) {
      setError("Enter both break start and break end, or leave both empty.");
      return;
    }

    if (
      scheduleForm.breakStart &&
      (scheduleForm.breakStart < scheduleForm.startTime ||
        scheduleForm.breakEnd > scheduleForm.endTime ||
        scheduleForm.breakEnd <= scheduleForm.breakStart)
    ) {
      setError("Break times must be within the working hours.");
      return;
    }

    const payload = {
      dayOfWeek: scheduleForm.dayOfWeek,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      breakStart: scheduleForm.breakStart || null,
      breakEnd: scheduleForm.breakEnd || null,
      status: scheduleForm.status,
    };

    const wasEditing = Boolean(editingScheduleId);

    try {
      setSaving(true);

      if (wasEditing) {
        await updateDoctorSchedule(editingScheduleId, payload);
      } else {
        await createDoctorSchedule(doctorId, payload);
      }

      resetScheduleForm();
      setMessage(
        wasEditing
          ? "Schedule updated successfully."
          : "Schedule created successfully."
      );

      await loadDetails();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save schedule."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="doctors-page doctors-empty">
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <section className="doctors-page">
        <div className="doctors-error">{error || "Doctor not found."}</div>
        <Link to="/doctors" className="doctors-back-link">
          <ArrowLeft size={17} />
          Back to doctors
        </Link>
      </section>
    );
  }

  const departmentName =
    doctor.department?.departmentName ??
    doctor.department?.name ??
    "—";

  const hospitalId =
    doctor.hospital?.hospitalId ?? "—";

  return (
    <section className="doctors-page">
      <Link to="/doctors" className="doctors-back-link">
        <ArrowLeft size={17} />
        Back to doctors
      </Link>

      {error && <div className="doctors-error">{error}</div>}
      {message && <div className="doctors-success">{message}</div>}

      <div className="doctor-profile-header">
        <div className="doctor-profile-avatar">
          <Stethoscope size={30} />
        </div>

        <div className="doctor-profile-heading">
          <p className="doctors-eyebrow">DOCTOR PROFILE</p>
          <h1>{doctor.fullName || "Doctor"}</h1>
          <p>{doctor.specialization || "—"}</p>
          <span className="doctor-profile-id">
            Doctor ID: {doctor.id}
          </span>
        </div>

        <Link
          to={`/doctors/${doctor.id}/edit`}
          className="doctors-primary-button"
        >
          <Pencil size={16} />
          Edit profile
        </Link>
      </div>

      <div className="doctor-info-grid">
        <Info label="Qualification" value={doctor.qualification} />
        <Info label="Department" value={departmentName} />
        <Info label="Registration number" value={doctor.registrationNumber} />
        <Info label="Experience" value={
          doctor.experienceYears != null
            ? `${doctor.experienceYears} years`
            : "—"
        } />
        <Info label="Phone" value={doctor.phone} />
        <Info label="Email" value={doctor.email} />
        <Info label="Date of birth" value={doctor.dateOfBirth} />
        <Info label="Gender" value={doctor.gender} />
        <Info label="Consultation fee" value={
          doctor.consultationFee != null
            ? `₹${doctor.consultationFee}`
            : "—"
        } />
        <Info label="Status" value={doctor.status} />
        <Info label="Hospital ID" value={hospitalId} />
        <Info label="Address" value={doctor.address} />
      </div>

      <section className="doctor-schedule-section">
        <div className="doctor-section-heading">
          <div>
            <h2>
              <CalendarDays size={20} />
              Doctor schedules
            </h2>
            <p>View and maintain this doctor's working hours.</p>
          </div>
        </div>

        <form
          className="doctor-schedule-form"
          onSubmit={handleScheduleSubmit}
        >
          <h3>
            {editingScheduleId ? "Edit schedule" : "Add working schedule"}
          </h3>

          <div className="doctor-form-grid">
            <label>
              Day of week *
              <select
                name="dayOfWeek"
                value={scheduleForm.dayOfWeek}
                onChange={handleScheduleChange}
                required
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Start time *
              <input
                name="startTime"
                type="time"
                value={scheduleForm.startTime}
                onChange={handleScheduleChange}
                required
              />
            </label>

            <label>
              End time *
              <input
                name="endTime"
                type="time"
                value={scheduleForm.endTime}
                onChange={handleScheduleChange}
                required
              />
            </label>

            <label>
              Break start
              <input
                name="breakStart"
                type="time"
                value={scheduleForm.breakStart}
                onChange={handleScheduleChange}
              />
            </label>

            <label>
              Break end
              <input
                name="breakEnd"
                type="time"
                value={scheduleForm.breakEnd}
                onChange={handleScheduleChange}
              />
            </label>

            <label>
              Status *
              <select
                name="status"
                value={scheduleForm.status}
                onChange={handleScheduleChange}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>
          </div>

          <div className="doctor-form-actions">
            {editingScheduleId && (
              <button
                type="button"
                className="doctors-secondary-button"
                onClick={resetScheduleForm}
              >
                Cancel edit
              </button>
            )}

            <button
              type="submit"
              className="doctors-primary-button"
              disabled={saving}
            >
              {editingScheduleId ? <Save size={16} /> : <Plus size={16} />}
              {saving
                ? "Saving..."
                : editingScheduleId
                  ? "Update schedule"
                  : "Add schedule"}
            </button>
          </div>
        </form>

        <div className="doctor-schedule-list">
          {schedules.length === 0 ? (
            <div className="doctors-empty">
              No schedules found for this doctor.
            </div>
          ) : (
            schedules.map((schedule) => (
              <article
                className="doctor-schedule-card"
                key={schedule.id}
              >
                <div className="doctor-schedule-icon">
                  <Clock3 size={21} />
                </div>

                <div className="doctor-schedule-info">
                  <strong>{schedule.dayOfWeek || "—"}</strong>
                  <span>
                    {displayTime(schedule.startTime) || "—"} –{" "}
                    {displayTime(schedule.endTime) || "—"}
                  </span>
                  <small>
                    Break: {displayTime(schedule.breakStart) || "—"} –{" "}
                    {displayTime(schedule.breakEnd) || "—"}
                  </small>
                </div>

                <span
                  className={`doctor-status ${
                    String(schedule.status || "").toUpperCase() === "ACTIVE"
                      ? "is-active"
                      : "is-other"
                  }`}
                >
                  {schedule.status || "—"}
                </span>

                <button
                  type="button"
                  className="doctors-secondary-button"
                  onClick={() => startEditing(schedule)}
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="doctor-info-item">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}