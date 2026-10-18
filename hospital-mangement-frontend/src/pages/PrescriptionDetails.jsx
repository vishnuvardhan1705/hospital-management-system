
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

import {
  getPrescription,
  getPrescriptionMedicines,
  addPrescriptionMedicine,
  removePrescriptionMedicine,
  dispensePrescription,
  updatePrescription,
} from "../services/prescriptionService";

import "../styles/prescriptions.css";

const emptyMedicine = {
  medicineId: "",
  dosage: "",
  frequency: "",
  duration: "",
  route: "ORAL",
  quantity: "",
  instructions: "",
};

export default function PrescriptionDetails() {
  const { prescriptionId } = useParams();

  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medicineForm, setMedicineForm] = useState({
    ...emptyMedicine,
  });

  const [editForm, setEditForm] = useState({
    patientId: "",
    doctorId: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [prescriptionData, medicineData] = await Promise.all([
        getPrescription(prescriptionId),
        getPrescriptionMedicines(prescriptionId),
      ]);

      setPrescription(prescriptionData);
      setMedicines(
        Array.isArray(medicineData) ? medicineData : []
      );

      const patientId =
        prescriptionData?.patient?.patientId ??
        prescriptionData?.patientId ??
        "";

      const doctorId =
        prescriptionData?.doctor?.doctorId ??
        prescriptionData?.doctorId ??
        "";

      setEditForm({
        patientId: patientId ? String(patientId) : "",
        doctorId: doctorId ? String(doctorId) : "",
        instructions: prescriptionData?.instructions ?? "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load prescription details."
      );
    } finally {
      setLoading(false);
    }
  }, [prescriptionId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleMedicineChange = (event) => {
    const { name, value } = event.target;

    setMedicineForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddMedicine = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const medicineId = Number(medicineForm.medicineId);
    const quantity = Number(medicineForm.quantity);

    if (
      !Number.isInteger(medicineId) ||
      medicineId <= 0 ||
      !medicineForm.dosage.trim() ||
      !medicineForm.frequency.trim() ||
      !medicineForm.duration.trim() ||
      !medicineForm.route.trim() ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      setError(
        "Enter a valid medicine ID, dosage, frequency, duration, route, and positive whole-number quantity."
      );
      return;
    }

    setSaving(true);

    try {
      await addPrescriptionMedicine(prescriptionId, {
        medicineId,
        dosage: medicineForm.dosage.trim(),
        frequency: medicineForm.frequency.trim(),
        duration: medicineForm.duration.trim(),
        route: medicineForm.route.trim(),
        quantity,
        instructions: medicineForm.instructions.trim(),
      });

      setMedicineForm({ ...emptyMedicine });
      setMessage("Medicine added successfully.");
      await loadDetails();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add medicine."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMedicine = async (itemId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this medicine from the prescription?"
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await removePrescriptionMedicine(itemId);
      setMessage("Medicine removed successfully.");
      await loadDetails();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove medicine."
      );
    }
  };

  const handleDispense = async () => {
    if (
      !window.confirm(
        "Mark this prescription as dispensed?"
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const updated = await dispensePrescription(prescriptionId);

      if (updated && typeof updated === "object") {
        setPrescription(updated);
      }

      setMessage("Dispense request completed.");
      await loadDetails();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark this prescription as dispensed."
      );
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const consultationId =
      prescription?.consultation?.consultationId ??
      prescription?.consultationId;

    if (!consultationId) {
      setError(
        "The consultation ID is missing from the prescription response. The prescription cannot be updated from this page."
      );
      return;
    }

    const patientId = Number(editForm.patientId);
    const doctorId = Number(editForm.doctorId);

    if (
      !Number.isInteger(patientId) ||
      patientId <= 0 ||
      !Number.isInteger(doctorId) ||
      doctorId <= 0
    ) {
      setError("Enter valid patient and doctor IDs.");
      return;
    }

    setSaving(true);

    try {
      await updatePrescription(consultationId, {
        patientId,
        doctorId,
        instructions: editForm.instructions.trim(),
      });

      setMessage("Prescription updated successfully.");
      await loadDetails();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the prescription."
      );
    } finally {
      setSaving(false);
    }
  };

  const getItemId = (item) =>
    item.prescriptionItemId ?? item.id;

  const getMedicineName = (item) =>
    item.medicine?.medicineName ??
    item.medicineName ??
    item.medicine?.name ??
    item.medicineId ??
    "—";

  if (loading) {
    return (
      <div className="prescription-page">
        <p>Loading prescription...</p>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="prescription-page">
        <p className="prescription-alert prescription-alert-error">
          {error || "Prescription not found."}
        </p>

        <Link
          to="/prescriptions"
          className="prescription-secondary-button"
        >
          <ArrowLeft size={17} />
          Back to Prescriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="prescription-page">
      <Link
        to="/prescriptions"
        className="prescription-secondary-button"
      >
        <ArrowLeft size={17} />
        Back to Prescriptions
      </Link>

      <div className="prescription-topbar prescription-details-heading">
        <div>
          <h1>
            Prescription #
            {prescription.prescriptionId ?? prescription.id ?? prescriptionId}
          </h1>
          <p>
            Status:{" "}
            <span className="prescription-status">
              {prescription.status ?? "—"}
            </span>
          </p>
        </div>

        <button
          type="button"
          className="prescription-secondary-button"
          onClick={loadDetails}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="prescription-alert prescription-alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="prescription-alert prescription-alert-success">
          {message}
        </div>
      )}

      <section className="prescription-card">
        <h2>Prescription Information</h2>

        <div className="prescription-info-grid">
          <div>
            <span>Patient ID</span>
            <strong>
              {prescription.patient?.patientId ??
                prescription.patientId ??
                "—"}
            </strong>
          </div>

          <div>
            <span>Doctor ID</span>
            <strong>
              {prescription.doctor?.doctorId ??
                prescription.doctorId ??
                "—"}
            </strong>
          </div>

          <div>
            <span>Consultation ID</span>
            <strong>
              {prescription.consultation?.consultationId ??
                prescription.consultationId ??
                "—"}
            </strong>
          </div>

          <div>
            <span>Prescription Date</span>
            <strong>
              {prescription.prescriptionDate
                ? String(prescription.prescriptionDate).slice(0, 10)
                : "—"}
            </strong>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <h3>Update Prescription Details</h3>

          <div className="prescription-form-grid">
            <div className="prescription-field">
              <label htmlFor="editPatientId">Patient ID *</label>
              <input
                id="editPatientId"
                type="number"
                min="1"
                required
                value={editForm.patientId}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    patientId: event.target.value,
                  }))
                }
              />
            </div>

            <div className="prescription-field">
              <label htmlFor="editDoctorId">Doctor ID *</label>
              <input
                id="editDoctorId"
                type="number"
                min="1"
                required
                value={editForm.doctorId}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    doctorId: event.target.value,
                  }))
                }
              />
            </div>

            <div className="prescription-field prescription-field-full">
              <label htmlFor="editInstructions">Instructions</label>
              <textarea
                id="editInstructions"
                rows="3"
                value={editForm.instructions}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    instructions: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="prescription-actions">
            <button
              type="submit"
              className="prescription-primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Prescription"}
            </button>
          </div>
        </form>
      </section>

      <section className="prescription-card">
        <h2>Prescribed Medicines</h2>

        {medicines.length === 0 ? (
          <p className="prescription-empty">
            No medicines have been added yet.
          </p>
        ) : (
          <div className="prescription-table-wrapper">
            <table className="prescription-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Route</th>
                  <th>Quantity</th>
                  <th>Instructions</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((item) => {
                  const itemId = getItemId(item);

                  return (
                    <tr key={itemId}>
                      <td>{getMedicineName(item)}</td>
                      <td>{item.dosage ?? "—"}</td>
                      <td>{item.frequency ?? "—"}</td>
                      <td>{item.duration ?? "—"}</td>
                      <td>{item.route ?? "—"}</td>
                      <td>{item.quantity ?? "—"}</td>
                      <td>{item.instructions ?? "—"}</td>
                      <td>
                        {itemId != null && (
                          <button
                            type="button"
                            className="prescription-remove-button"
                            onClick={() =>
                              handleRemoveMedicine(itemId)
                            }
                          >
                            <Trash2 size={15} />
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="prescription-card">
        <h2>Add Medicine</h2>
        <p className="prescription-helper">
          Enter a medicine ID that exists in your backend database.
        </p>

        <form onSubmit={handleAddMedicine}>
          <div className="prescription-form-grid">
            <div className="prescription-field">
              <label htmlFor="medicineId">Medicine ID *</label>
              <input
                id="medicineId"
                name="medicineId"
                type="number"
                min="1"
                required
                value={medicineForm.medicineId}
                onChange={handleMedicineChange}
              />
            </div>

            <div className="prescription-field">
              <label htmlFor="dosage">Dosage *</label>
              <input
                id="dosage"
                name="dosage"
                required
                value={medicineForm.dosage}
                onChange={handleMedicineChange}
                placeholder="e.g. 500 mg"
              />
            </div>

            <div className="prescription-field">
              <label htmlFor="frequency">Frequency *</label>
              <input
                id="frequency"
                name="frequency"
                required
                value={medicineForm.frequency}
                onChange={handleMedicineChange}
                placeholder="e.g. TWICE_DAILY"
              />
            </div>

            <div className="prescription-field">
              <label htmlFor="duration">Duration *</label>
              <input
                id="duration"
                name="duration"
                required
                value={medicineForm.duration}
                onChange={handleMedicineChange}
                placeholder="e.g. 5 days"
              />
            </div>

            <div className="prescription-field">
              <label htmlFor="route">Route *</label>
              <input
                id="route"
                name="route"
                required
                value={medicineForm.route}
                onChange={handleMedicineChange}
                placeholder="e.g. ORAL"
              />
            </div>

            <div className="prescription-field">
              <label htmlFor="quantity">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                required
                value={medicineForm.quantity}
                onChange={handleMedicineChange}
              />
            </div>

            <div className="prescription-field prescription-field-full">
              <label htmlFor="medicineInstructions">
                Medicine Instructions
              </label>
              <textarea
                id="medicineInstructions"
                name="instructions"
                rows="2"
                value={medicineForm.instructions}
                onChange={handleMedicineChange}
                placeholder="e.g. After food"
              />
            </div>
          </div>

          <div className="prescription-actions">
            <button
              type="submit"
              className="prescription-primary-button"
              disabled={saving}
            >
              <Plus size={17} />
              {saving ? "Adding..." : "Add Medicine"}
            </button>
          </div>
        </form>
      </section>

      <section className="prescription-card">
        <h2>Dispensing</h2>
        <p className="prescription-helper">
          Use this action when the pharmacy has completed dispensing.
        </p>

        <button
          type="button"
          className="prescription-primary-button"
          onClick={handleDispense}
        >
          <CheckCircle size={17} />
          Mark as Dispensed
        </button>
      </section>
    </div>
  );
}
