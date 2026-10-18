
import { useEffect, useState } from "react";
import api from "../services/api";
import { getBatchesByMedicine } from "../services/medicineBatchService";
import {
  dispenseMedicine,
  getTransactionsByMedicine,
  getTransactionsByBatch,
} from "../services/pharmacyService";
import "../styles/pharmacyDispensing.css";

const unwrap = (response) =>
  response.data?.data ?? response.data;

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getMedicineId = (item) =>
  item?.medicine?.medicineId ?? item?.medicineId;

const getMedicineName = (item) =>
  item?.medicine?.medicineName ??
  item?.medicineName ??
  "Medicine";

const getPrescriptionItemId = (item) =>
  item?.prescriptionItemId ?? item?.prescriptionMedicineId;

const getBatchMedicineId = (batch) =>
  batch?.medicine?.medicineId ?? batch?.medicineId;

export default function PharmacyDispensing() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);

  const [prescriptionId, setPrescriptionId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dispensedBy, setDispensedBy] = useState("");

  const [historyType, setHistoryType] = useState("medicine");
  const [historyId, setHistoryId] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedItem = items.find(
    (item) => String(getPrescriptionItemId(item)) === String(selectedItemId)
  );

  const selectedMedicineId = selectedItem
    ? getMedicineId(selectedItem)
    : "";

  const selectedBatch = batches.find(
    (batch) => String(batch.batchId) === String(selectedBatchId)
  );

  // Load active prescriptions when the page opens.
  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const response = await api.get("/api/prescriptions/active");
        setPrescriptions(getArray(unwrap(response)));
      } catch (err) {
        setError(
          err.response?.data?.message ??
          "Unable to load active prescriptions."
        );
      }
    };

    loadPrescriptions();
  }, []);

  // Load medicine items for the selected prescription.
  useEffect(() => {
    if (!prescriptionId) {
      setItems([]);
      setSelectedItemId("");
      setBatches([]);
      setSelectedBatchId("");
      return;
    }

    const loadItems = async () => {
      setError("");
      setItems([]);
      setSelectedItemId("");
      setBatches([]);
      setSelectedBatchId("");

      try {
        const response = await api.get(
          `/api/prescriptions/${prescriptionId}/medicines`
        );

        setItems(getArray(unwrap(response)));
      } catch (err) {
        setError(
          err.response?.data?.message ??
          "Unable to load prescription medicines."
        );
      }
    };

    loadItems();
  }, [prescriptionId]);

  // Load available batches for the selected medicine.
  useEffect(() => {
    if (!selectedMedicineId) {
      setBatches([]);
      setSelectedBatchId("");
      return;
    }

    const loadBatches = async () => {
      setError("");
      setBatches([]);
      setSelectedBatchId("");

      try {
        const response = await getBatchesByMedicine(selectedMedicineId);
        setBatches(getArray(response));
      } catch (err) {
        setError(
          err.response?.data?.message ??
          "Unable to load batches for this medicine."
        );
      }
    };

    loadBatches();
  }, [selectedMedicineId]);

  const handleDispense = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedItemId || !selectedBatchId) {
      setError("Select a prescription item and a medicine batch.");
      return;
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setError("Enter a whole-number quantity greater than zero.");
      return;
    }

    if (!dispensedBy.trim()) {
      setError("Enter the dispenser's identifier.");
      return;
    }

    if (
      selectedItem &&
      getMedicineId(selectedItem) &&
      selectedBatch &&
      getBatchMedicineId(selectedBatch) &&
      String(getMedicineId(selectedItem)) !==
        String(getBatchMedicineId(selectedBatch))
    ) {
      setError("The selected batch does not belong to this medicine.");
      return;
    }

    setLoading(true);

    try {
      await dispenseMedicine({
        prescriptionItemId: Number(selectedItemId),
        batchId: Number(selectedBatchId),
        quantity: Number(quantity),
        dispensedBy: dispensedBy.trim(),
      });

      setMessage("Medicine dispensed successfully.");
      setQuantity("");
      setSelectedBatchId("");

      // Refresh the batch list so the displayed stock is up to date.
      if (selectedMedicineId) {
        const refreshed = await getBatchesByMedicine(selectedMedicineId);
        setBatches(getArray(refreshed));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ??
        err.message ??
        "Unable to dispense medicine."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySearch = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setTransactions([]);

    if (!historyId.trim()) {
      setError(
        `Enter a ${historyType === "medicine" ? "medicine" : "batch"} ID.`
      );
      return;
    }

    setHistoryLoading(true);

    try {
      const result =
        historyType === "medicine"
          ? await getTransactionsByMedicine(historyId.trim())
          : await getTransactionsByBatch(historyId.trim());

      setTransactions(getArray(result));
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Unable to load transaction history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="pharmacy-page">
      <div className="pharmacy-heading">
        <div>
          <h1>Pharmacy Dispensing</h1>
          <p>Dispense prescribed medicines and review stock transactions.</p>
        </div>
      </div>

      {error && <div className="pharmacy-alert error">{error}</div>}
      {message && <div className="pharmacy-alert success">{message}</div>}

      <section className="pharmacy-card">
        <h2>Dispense Medicine</h2>

        <form onSubmit={handleDispense} className="pharmacy-form">
          <div className="pharmacy-field">
            <label htmlFor="prescriptionId">Active Prescription</label>
            <select
              id="prescriptionId"
              value={prescriptionId}
              onChange={(event) => setPrescriptionId(event.target.value)}
              required
            >
              <option value="">Select prescription</option>
              {prescriptions.map((prescription) => (
                <option
                  key={prescription.prescriptionId}
                  value={prescription.prescriptionId}
                >
                  Prescription #{prescription.prescriptionId}
                  {prescription.patient?.patientName
                    ? ` — ${prescription.patient.patientName}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="pharmacy-field">
            <label htmlFor="prescriptionItem">Prescribed Medicine</label>
            <select
              id="prescriptionItem"
              value={selectedItemId}
              onChange={(event) => {
                setSelectedItemId(event.target.value);
                setSelectedBatchId("");
              }}
              disabled={!prescriptionId || items.length === 0}
              required
            >
              <option value="">Select medicine</option>
              {items.map((item, index) => {
                const itemId = getPrescriptionItemId(item);

                return (
                  <option
                    key={itemId ?? index}
                    value={itemId ?? ""}
                    disabled={!itemId || !getMedicineId(item)}
                  >
                    {getMedicineName(item)}
                    {item.dosage ? ` — ${item.dosage}` : ""}
                  </option>
                );
              })}
            </select>
            {prescriptionId && items.length === 0 && (
              <small>No medicine items were returned for this prescription.</small>
            )}
          </div>

          <div className="pharmacy-field">
            <label htmlFor="batchId">Medicine Batch</label>
            <select
              id="batchId"
              value={selectedBatchId}
              onChange={(event) => setSelectedBatchId(event.target.value)}
              disabled={!selectedMedicineId || batches.length === 0}
              required
            >
              <option value="">Select batch</option>
              {batches.map((batch) => (
                <option
                  key={batch.batchId}
                  value={batch.batchId}
                  disabled={Number(batch.quantity) <= 0}
                >
                  {batch.batchNumber} — Stock: {batch.quantity}
                  {batch.expiryDate ? ` — Expires: ${batch.expiryDate}` : ""}
                </option>
              ))}
            </select>
            {selectedMedicineId && batches.length === 0 && (
              <small>No batches were returned for this medicine.</small>
            )}
          </div>

          <div className="pharmacy-field">
            <label htmlFor="quantity">Quantity to Dispense</label>
            <input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>

          <div className="pharmacy-field">
            <label htmlFor="dispensedBy">Dispensed By</label>
            <input
              id="dispensedBy"
              type="text"
              value={dispensedBy}
              onChange={(event) => setDispensedBy(event.target.value)}
              placeholder="Enter staff/user identifier"
              required
            />
          </div>

          {selectedBatch && (
            <div className="pharmacy-stock-info">
              Selected batch stock: <strong>{selectedBatch.quantity}</strong>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Dispensing..." : "Dispense Medicine"}
          </button>
        </form>
      </section>

      <section className="pharmacy-card">
        <h2>Pharmacy Transaction History</h2>

        <form onSubmit={handleHistorySearch} className="pharmacy-history-form">
          <div className="pharmacy-field">
            <label htmlFor="historyType">Search Transactions By</label>
            <select
              id="historyType"
              value={historyType}
              onChange={(event) => {
                setHistoryType(event.target.value);
                setHistoryId("");
                setTransactions([]);
              }}
            >
              <option value="medicine">Medicine ID</option>
              <option value="batch">Batch ID</option>
            </select>
          </div>

          <div className="pharmacy-field">
            <label htmlFor="historyId">
              {historyType === "medicine" ? "Medicine ID" : "Batch ID"}
            </label>
            <input
              id="historyId"
              type="number"
              min="1"
              value={historyId}
              onChange={(event) => setHistoryId(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={historyLoading}>
            {historyLoading ? "Searching..." : "Search History"}
          </button>
        </form>

        <div className="pharmacy-table-wrapper">
          <table className="pharmacy-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Medicine</th>
                <th>Batch</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Performed By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.transactionId ?? index}
                >
                  <td>{transaction.transactionId ?? "—"}</td>
                  <td>{transaction.transactionType ?? "—"}</td>
                  <td>
                    {transaction.medicine?.medicineName ??
                      transaction.medicine?.medicineId ??
                      "—"}
                  </td>
                  <td>
                    {transaction.batch?.batchNumber ??
                      transaction.batch?.batchId ??
                      "—"}
                  </td>
                  <td>{transaction.quantity ?? "—"}</td>
                  <td>{transaction.transactionDate ?? "—"}</td>
                  <td>{transaction.performedBy ?? "—"}</td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="pharmacy-empty">
                    No transactions to display. Search by medicine or batch ID.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
