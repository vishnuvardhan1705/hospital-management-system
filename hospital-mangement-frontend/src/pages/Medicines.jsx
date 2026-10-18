
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, RefreshCw, Pencil, Package } from "lucide-react";
import {
  getMedicines,
  searchMedicines,
} from "../services/medicineService";
import "../styles/medicines.css";

function getMedicineId(medicine) {
  const id =
    medicine?.medicineId ??
    medicine?.id ??
    medicine?.medicine_id;

  if (
    id === undefined ||
    id === null ||
    String(id).trim() === "" ||
    String(id) === "undefined" ||
    String(id) === "null"
  ) {
    return "";
  }

  return String(id);
}

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMedicines = useCallback(async (searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      const result = searchTerm.trim()
        ? await searchMedicines(searchTerm.trim())
        : await getMedicines();

      const items = Array.isArray(result) ? result : [];

      setMedicines(items);

      if (items.length > 0 && !items.some(getMedicineId)) {
        setError(
          "Medicines were returned, but their IDs are missing. Check the medicine API response."
        );
      }
    } catch (err) {
      console.error("Failed to load medicines:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load medicines. Please check the backend."
      );

      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadMedicines(search);
  };

  const handleReset = () => {
    setSearch("");
    loadMedicines();
  };

  return (
    <div className="medicines-page">
      <div className="medicines-header">
        <div>
          <h1>Medicine Management</h1>
          <p>Manage the hospital's medicine master records.</p>
        </div>

        <Link
          to="/medicines/new"
          className="medicine-primary-button"
        >
          <Plus size={18} />
          Add Medicine
        </Link>
      </div>

      <div className="medicine-summary">
        <div className="medicine-summary-icon">
          <Package size={24} />
        </div>

        <div>
          <span>Total medicines loaded</span>
          <strong>{medicines.length}</strong>
        </div>
      </div>

      <form className="medicine-search" onSubmit={handleSearch}>
        <div className="medicine-search-input">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by medicine name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button type="submit" className="medicine-primary-button">
          Search
        </button>

        <button
          type="button"
          className="medicine-secondary-button"
          onClick={handleReset}
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </form>

      {error && (
        <div className="medicine-error" role="alert">
          {error}
        </div>
      )}

      <div className="medicine-table-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicine Code</th>
              <th>Medicine Name</th>
              <th>Generic Name</th>
              <th>Manufacturer</th>
              <th>Type</th>
              <th>Unit</th>
              <th>Selling Price</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="medicine-empty">
                  Loading medicines...
                </td>
              </tr>
            ) : medicines.length === 0 ? (
              <tr>
                <td colSpan={11} className="medicine-empty">
                  No medicines found.
                </td>
              </tr>
            ) : (
              medicines.map((medicine, index) => {
                const medicineId = getMedicineId(medicine);

                // Use the database ID whenever possible.
                // The fallback avoids missing-key warnings if an ID is absent.
                const rowKey =
                  medicineId ||
                  medicine.medicineCode ||
                  `${medicine.medicineName || "medicine"}-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>{medicineId || "-"}</td>
                    <td>{medicine.medicineCode || "-"}</td>

                    <td className="medicine-name-cell">
                      {medicine.medicineName || "-"}
                    </td>

                    <td>{medicine.genericName || "-"}</td>
                    <td>{medicine.manufacturer || "-"}</td>
                    <td>{medicine.medicineType || "-"}</td>
                    <td>{medicine.unit || "-"}</td>

                    <td>
                      {medicine.sellingPrice != null
                        ? Number(medicine.sellingPrice).toFixed(2)
                        : "-"}
                    </td>

                    <td>{medicine.reorderLevel ?? "-"}</td>

                    <td>
                      <span className="medicine-status">
                        {medicine.status || "-"}
                      </span>
                    </td>

                    <td>
                      {medicineId ? (
                        <Link
                          to={`/medicines/${medicineId}/edit`}
                          className="medicine-edit-button"
                          title="Edit medicine"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
