
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createMedicine,
  getMedicineById,
  updateMedicine,
} from "../services/medicineService";
import "../styles/medicines.css";

const initialForm = {
  medicineCode: "",
  medicineName: "",
  genericName: "",
  manufacturer: "",
  medicineType: "",
  unit: "",
  taxPercentage: "",
  sellingPrice: "",
  reorderLevel: "",
  status: "ACTIVE",
};

export default function MedicineForm() {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(medicineId);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadMedicine = async () => {
      try {
        const medicine = await getMedicineById(medicineId);

        setForm({
          medicineCode: medicine.medicineCode ?? "",
          medicineName: medicine.medicineName ?? "",
          genericName: medicine.genericName ?? "",
          manufacturer: medicine.manufacturer ?? "",
          medicineType: medicine.medicineType ?? "",
          unit: medicine.unit ?? "",
          taxPercentage: medicine.taxPercentage ?? "",
          sellingPrice: medicine.sellingPrice ?? "",
          reorderLevel: medicine.reorderLevel ?? "",
          status: medicine.status ?? "ACTIVE",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load this medicine."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMedicine();
  }, [isEdit, medicineId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.medicineCode.trim() || !form.medicineName.trim()) {
      setError("Medicine code and medicine name are required.");
      return;
    }

    const request = {
      medicineCode: form.medicineCode.trim(),
      medicineName: form.medicineName.trim(),
      genericName: form.genericName.trim(),
      manufacturer: form.manufacturer.trim(),
      medicineType: form.medicineType.trim(),
      unit: form.unit.trim(),
      taxPercentage: Number(form.taxPercentage),
      sellingPrice: Number(form.sellingPrice),
      reorderLevel: Number(form.reorderLevel),
      status: form.status,
    };

    if (
      !Number.isFinite(request.taxPercentage) ||
      !Number.isFinite(request.sellingPrice) ||
      !Number.isFinite(request.reorderLevel) ||
      request.taxPercentage < 0 ||
      request.sellingPrice < 0 ||
      request.reorderLevel < 0
    ) {
      setError(
        "Tax percentage, selling price, and reorder level must be valid non-negative numbers."
      );
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        await updateMedicine(medicineId, request);
      } else {
        await createMedicine(request);
      }

      navigate("/medicines");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the medicine. Check the entered values."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="medicine-form-page">Loading medicine...</div>;
  }

  return (
    <div className="medicine-form-page">
      <div className="medicines-header">
        <div>
          <h1>{isEdit ? "Edit Medicine" : "Add Medicine"}</h1>
          <p>
            {isEdit
              ? "Update the existing medicine record."
              : "Register a medicine in the medicine master."}
          </p>
        </div>

        <Link to="/medicines" className="medicine-secondary-button">
          Back to Medicines
        </Link>
      </div>

      {error && <div className="medicine-error">{error}</div>}

      <form className="medicine-form" onSubmit={handleSubmit}>
        <div className="medicine-form-grid">
          <label>
            Medicine Code *
            <input
              name="medicineCode"
              value={form.medicineCode}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Medicine Name *
            <input
              name="medicineName"
              value={form.medicineName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Generic Name
            <input
              name="genericName"
              value={form.genericName}
              onChange={handleChange}
            />
          </label>

          <label>
            Manufacturer
            <input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
            />
          </label>

          <label>
            Medicine Type
            <input
              name="medicineType"
              value={form.medicineType}
              onChange={handleChange}
              placeholder="e.g. TABLET, SYRUP"
            />
          </label>

          <label>
            Unit
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="e.g. tablet, bottle"
            />
          </label>

          <label>
            Tax Percentage
            <input
              type="number"
              name="taxPercentage"
              min="0"
              step="any"
              value={form.taxPercentage}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Selling Price
            <input
              type="number"
              name="sellingPrice"
              min="0"
              step="any"
              value={form.sellingPrice}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Reorder Level
            <input
              type="number"
              name="reorderLevel"
              min="0"
              step="1"
              value={form.reorderLevel}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>

        <div className="medicine-form-actions">
          <button
            type="submit"
            className="medicine-primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Medicine"
                : "Create Medicine"}
          </button>

          <Link to="/medicines" className="medicine-secondary-button">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
