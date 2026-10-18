
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Package,
  Plus,
  RefreshCw,
} from "lucide-react";

import { getMedicines } from "../services/medicineService";

import {
  createMedicineBatch,
  getBatchesByMedicine,
  getExpiredBatches,
  getLowStockBatches,
  updateBatchStock,
} from "../services/medicineBatchService";

import "../styles/medicineBatches.css";

const initialBatchForm = {
  medicineId: "",
  batchNumber: "",
  manufacturingDate: "",
  expiryDate: "",
  purchasePrice: "",
  sellingPrice: "",
  quantity: "",
};

const initialStockForm = {
  batchId: "",
  quantity: "",
  operation: "ADD",
};

function getMedicineRecordId(medicine) {
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

function getBatchId(batch) {
  const id = batch?.batchId ?? batch?.id;

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

function getMedicineName(batch) {
  return (
    batch?.medicine?.medicineName ||
    batch?.medicineName ||
    `Medicine #${
      batch?.medicine?.medicineId ??
      batch?.medicineId ??
      "-"
    }`
  );
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
}

export default function MedicineBatches() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [batches, setBatches] = useState([]);
  const [view, setView] = useState("medicine");

  const [batchForm, setBatchForm] = useState(initialBatchForm);
  const [stockForm, setStockForm] = useState(initialStockForm);

  const [loadingMedicines, setLoadingMedicines] = useState(true);
  const [loading, setLoading] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);
  const [savingStock, setSavingStock] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load medicine master records.
  const loadMedicines = useCallback(async () => {
    setLoadingMedicines(true);

    try {
      const result = await getMedicines();
      const items = Array.isArray(result) ? result : [];

      setMedicines(items);

      const validMedicines = items.filter(
        (medicine) => getMedicineRecordId(medicine) !== ""
      );

      if (validMedicines.length === 0) {
        setSelectedMedicineId("");
        setBatchForm((current) => ({
          ...current,
          medicineId: "",
        }));

        setError(
          items.length > 0
            ? "Medicines were returned, but no valid medicine ID was found. Check the GET /api/medicines response."
            : "No medicines were returned. Register a medicine first."
        );

        return;
      }

      setSelectedMedicineId((current) => {
        const stillExists = validMedicines.some(
          (medicine) => getMedicineRecordId(medicine) === current
        );

        return stillExists
          ? current
          : getMedicineRecordId(validMedicines[0]);
      });

      setBatchForm((current) => {
        if (current.medicineId) {
          const stillExists = validMedicines.some(
            (medicine) =>
              getMedicineRecordId(medicine) === current.medicineId
          );

          if (stillExists) return current;
        }

        return {
          ...current,
          medicineId: getMedicineRecordId(validMedicines[0]),
        };
      });
    } catch (err) {
      console.error("Failed to load medicines:", err);

      setMedicines([]);
      setSelectedMedicineId("");
      setError(
        getErrorMessage(err, "Unable to load medicines.")
      );
    } finally {
      setLoadingMedicines(false);
    }
  }, []);

  // Load batches according to the currently selected view.
  const loadBatches = useCallback(async () => {
    if (view === "medicine" && !getMedicineRecordId({
      medicineId: selectedMedicineId,
    })) {
      setBatches([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      if (view === "expired") {
        result = await getExpiredBatches();
      } else if (view === "low-stock") {
        result = await getLowStockBatches();
      } else {
        result = await getBatchesByMedicine(selectedMedicineId);
      }

      setBatches(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load medicine batches:", err);

      setBatches([]);
      setError(
        getErrorMessage(err, "Unable to load medicine batches.")
      );
    } finally {
      setLoading(false);
    }
  }, [view, selectedMedicineId]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const handleBatchChange = (event) => {
    const { name, value } = event.target;

    setBatchForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Register a new batch.
  const handleCreateBatch = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const medicineId = getMedicineRecordId({
      medicineId: batchForm.medicineId,
    });

    if (!medicineId) {
      setError("Please select a valid medicine.");
      return;
    }

    if (
      !batchForm.batchNumber.trim() ||
      !batchForm.manufacturingDate ||
      !batchForm.expiryDate ||
      batchForm.purchasePrice === "" ||
      batchForm.sellingPrice === "" ||
      batchForm.quantity === ""
    ) {
      setError("Please complete all required batch fields.");
      return;
    }

    if (batchForm.expiryDate < batchForm.manufacturingDate) {
      setError("Expiry date cannot be before manufacturing date.");
      return;
    }

    const purchasePrice = Number(batchForm.purchasePrice);
    const sellingPrice = Number(batchForm.sellingPrice);
    const quantity = Number(batchForm.quantity);

    if (
      !Number.isFinite(purchasePrice) ||
      !Number.isFinite(sellingPrice) ||
      !Number.isInteger(quantity) ||
      purchasePrice < 0 ||
      sellingPrice < 0 ||
      quantity < 0
    ) {
      setError(
        "Prices must be non-negative numbers and quantity must be a non-negative whole number."
      );
      return;
    }

    const request = {
      medicineId: Number(medicineId),
      batchNumber: batchForm.batchNumber.trim(),
      manufacturingDate: batchForm.manufacturingDate,
      expiryDate: batchForm.expiryDate,
      purchasePrice,
      sellingPrice,
      quantity,
    };

    setSavingBatch(true);

    try {
      await createMedicineBatch(request);

      setMessage("Medicine batch created successfully.");

      setBatchForm({
        ...initialBatchForm,
        medicineId,
      });

      setSelectedMedicineId(medicineId);
      setView("medicine");
    } catch (err) {
      console.error("Failed to create medicine batch:", err);

      setError(
        getErrorMessage(err, "Unable to create the medicine batch.")
      );
    } finally {
      setSavingBatch(false);
    }
  };

  const handleStockChange = (event) => {
    const { name, value } = event.target;

    setStockForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Add or remove stock from a batch.
  const handleStockUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const batchId = getBatchId({
      batchId: stockForm.batchId,
    });

    const quantity = Number(stockForm.quantity);

    if (!batchId || !Number.isInteger(quantity) || quantity <= 0) {
      setError(
        "Select a valid batch and enter a positive whole-number quantity."
      );
      return;
    }

    setSavingStock(true);

    try {
      await updateBatchStock(batchId, {
        quantity,
        operation: stockForm.operation,
      });

      setMessage(
        `Stock ${
          stockForm.operation === "ADD" ? "added" : "removed"
        } successfully.`
      );

      setStockForm(initialStockForm);

      await loadBatches();
    } catch (err) {
      console.error("Failed to update batch stock:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to update stock. Check the quantity and batch status."
        )
      );
    } finally {
      setSavingStock(false);
    }
  };

  const changeView = (nextView) => {
    setError("");
    setMessage("");
    setView(nextView);
  };

  return (
    <div className="medicine-batches-page">
      <div className="medicine-batches-header">
        <div>
          <h1>Medicine Batches &amp; Stock</h1>
          <p>
            Manage batch details, stock quantities, expiry, and
            low-stock records.
          </p>
        </div>

        <Link
          to="/medicines"
          className="medicine-batches-secondary-button"
        >
          <Package size={17} />
          Medicine Master
        </Link>
      </div>

      <div className="medicine-batches-tabs">
        <button
          type="button"
          className={view === "medicine" ? "active" : ""}
          onClick={() => changeView("medicine")}
        >
          Medicine Batches
        </button>

        <button
          type="button"
          className={view === "expired" ? "active" : ""}
          onClick={() => changeView("expired")}
        >
          <AlertTriangle size={16} />
          Expired Batches
        </button>

        <button
          type="button"
          className={view === "low-stock" ? "active" : ""}
          onClick={() => changeView("low-stock")}
        >
          <Package size={16} />
          Low Stock
        </button>
      </div>

      {error && (
        <div className="medicine-batches-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="medicine-batches-message" role="status">
          {message}
        </div>
      )}

      <section className="medicine-batches-card">
        <h2>Find Batches</h2>

        {view === "medicine" ? (
          <div className="medicine-batches-filter">
            <label htmlFor="selectedMedicineId">
              Select Medicine
            </label>

            <select
              id="selectedMedicineId"
              value={selectedMedicineId}
              onChange={(event) =>
                setSelectedMedicineId(event.target.value)
              }
              disabled={loadingMedicines}
            >
              <option value="">Select a medicine</option>

              {medicines.map((medicine, index) => {
                const id = getMedicineRecordId(medicine);

                if (!id) return null;

                return (
                  <option key={id || index} value={id}>
                    {medicine.medicineName || "Unnamed medicine"}
                    {medicine.medicineCode
                      ? ` (${medicine.medicineCode})`
                      : ""}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              className="medicine-batches-secondary-button"
              onClick={loadBatches}
              disabled={loading || !selectedMedicineId}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        ) : (
          <p className="medicine-batches-description">
            {view === "expired"
              ? "Batches returned by the backend's expired-batches endpoint."
              : "Batches returned by the backend's low-stock endpoint."}
          </p>
        )}

        <div className="medicine-batches-table-wrap">
          <table className="medicine-batches-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Medicine</th>
                <th>Batch Number</th>
                <th>Manufactured</th>
                <th>Expires</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Quantity</th>
                {view === "medicine" && <th>Stock Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={view === "medicine" ? 9 : 8}
                    className="medicine-batches-empty"
                  >
                    Loading batches...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td
                    colSpan={view === "medicine" ? 9 : 8}
                    className="medicine-batches-empty"
                  >
                    No batches found.
                  </td>
                </tr>
              ) : (
                batches.map((batch, index) => {
                  const batchId = getBatchId(batch);

                  return (
                    <tr
                      key={
                        batchId ||
                        `${batch.batchNumber || "batch"}-${index}`
                      }
                    >
                      <td>{batchId || "-"}</td>
                      <td>{getMedicineName(batch)}</td>
                      <td>{batch.batchNumber || "-"}</td>
                      <td>{formatDate(batch.manufacturingDate)}</td>
                      <td>{formatDate(batch.expiryDate)}</td>

                      <td>
                        {batch.purchasePrice == null
                          ? "-"
                          : Number(batch.purchasePrice).toFixed(2)}
                      </td>

                      <td>
                        {batch.sellingPrice == null
                          ? "-"
                          : Number(batch.sellingPrice).toFixed(2)}
                      </td>

                      <td>{batch.quantity ?? "-"}</td>

                      {view === "medicine" && (
                        <td>
                          <button
                            type="button"
                            className="medicine-batches-small-button"
                            disabled={!batchId}
                            onClick={() =>
                              setStockForm({
                                batchId,
                                quantity: "",
                                operation: "ADD",
                              })
                            }
                          >
                            Adjust Stock
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="medicine-batches-form-grid">
        <section className="medicine-batches-card">
          <h2>
            <Plus size={19} />
            Register New Batch
          </h2>

          <form
            className="medicine-batches-form"
            onSubmit={handleCreateBatch}
          >
            <label>
              Medicine *
              <select
                name="medicineId"
                value={batchForm.medicineId}
                onChange={handleBatchChange}
                required
                disabled={
                  loadingMedicines ||
                  !medicines.some(
                    (medicine) =>
                      getMedicineRecordId(medicine) !== ""
                  )
                }
              >
                <option value="">Select medicine</option>

                {medicines.map((medicine, index) => {
                  const id = getMedicineRecordId(medicine);

                  if (!id) return null;

                  return (
                    <option key={id || index} value={id}>
                      {medicine.medicineName || "Unnamed medicine"}
                      {medicine.medicineCode
                        ? ` (${medicine.medicineCode})`
                        : ""}
                    </option>
                  );
                })}
              </select>
            </label>

            <label>
              Batch Number *
              <input
                name="batchNumber"
                value={batchForm.batchNumber}
                onChange={handleBatchChange}
                required
              />
            </label>

            <label>
              Manufacturing Date *
              <input
                type="date"
                name="manufacturingDate"
                value={batchForm.manufacturingDate}
                onChange={handleBatchChange}
                required
              />
            </label>

            <label>
              Expiry Date *
              <input
                type="date"
                name="expiryDate"
                value={batchForm.expiryDate}
                onChange={handleBatchChange}
                min={batchForm.manufacturingDate || undefined}
                required
              />
            </label>

            <label>
              Purchase Price *
              <input
                type="number"
                name="purchasePrice"
                min="0"
                step="any"
                value={batchForm.purchasePrice}
                onChange={handleBatchChange}
                required
              />
            </label>

            <label>
              Selling Price *
              <input
                type="number"
                name="sellingPrice"
                min="0"
                step="any"
                value={batchForm.sellingPrice}
                onChange={handleBatchChange}
                required
              />
            </label>

            <label>
              Initial Quantity *
              <input
                type="number"
                name="quantity"
                min="0"
                step="1"
                value={batchForm.quantity}
                onChange={handleBatchChange}
                required
              />
            </label>

            <button
              type="submit"
              className="medicine-batches-primary-button"
              disabled={
                savingBatch ||
                loadingMedicines ||
                !getMedicineRecordId({
                  medicineId: batchForm.medicineId,
                })
              }
            >
              {savingBatch ? "Saving..." : "Create Batch"}
            </button>
          </form>
        </section>

        <section className="medicine-batches-card">
          <h2>
            <RefreshCw size={19} />
            Adjust Batch Stock
          </h2>

          <form
            className="medicine-batches-form"
            onSubmit={handleStockUpdate}
          >
            <label>
              Batch *
              <select
                name="batchId"
                value={stockForm.batchId}
                onChange={handleStockChange}
                required
              >
                <option value="">
                  Select batch from current list
                </option>

                {batches.map((batch, index) => {
                  const id = getBatchId(batch);

                  if (!id) return null;

                  return (
                    <option key={id || index} value={id}>
                      #{id} — {getMedicineName(batch)} —{" "}
                      {batch.batchNumber || "No batch number"}
                    </option>
                  );
                })}
              </select>
            </label>

            <label>
              Operation *
              <select
                name="operation"
                value={stockForm.operation}
                onChange={handleStockChange}
                required
              >
                <option value="ADD">ADD stock</option>
                <option value="REMOVE">REMOVE stock</option>
              </select>
            </label>

            <label>
              Quantity *
              <input
                type="number"
                name="quantity"
                min="1"
                step="1"
                value={stockForm.quantity}
                onChange={handleStockChange}
                required
              />
            </label>

            <p className="medicine-batches-description">
              Select a batch from the current table before adjusting
              stock. The backend validates the requested operation.
            </p>

            <button
              type="submit"
              className="medicine-batches-primary-button"
              disabled={savingStock || !stockForm.batchId}
            >
              {savingStock ? "Updating..." : "Update Stock"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
