
import { useEffect, useState } from "react";
import {
  CreditCard,
  FileText,
  Plus,
  RefreshCw,
  Receipt,
  Wallet,
} from "lucide-react";
import billingService from "../services/billingService";
import "../styles/billingManagement.css";

const emptyBill = {
  patientId: "",
  visitId: "",
  admissionId: "",
  billType: "OUTPATIENT",
  discount: "0",
  insuranceAmount: "0",
};

const emptyItem = {
  serviceId: "",
  description: "",
  quantity: "1",
  unitPrice: "",
  discount: "0",
  tax: "0",
};

const emptyPayment = {
  patientId: "",
  amount: "",
  paymentMethod: "CASH",
  transactionReference: "",
};

const emptyRefund = {
  amount: "",
  reason: "",
  approvedBy: "",
};

const asArray = (value) => Array.isArray(value) ? value : [];

const patientName = (patient) => {
  if (!patient) return "Unknown patient";
  return (
    [patient.firstName, patient.lastName].filter(Boolean).join(" ") ||
    `Patient #${patient.id ?? "?"}`
  );
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) =>
  value ? new Date(value).toLocaleString() : "-";

export default function BillingManagement() {
  const [activeTab, setActiveTab] = useState("bills");
  const [patients, setPatients] = useState([]);
  const [patientBills, setPatientBills] = useState([]);
  const [bill, setBill] = useState(null);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);

  const [billForm, setBillForm] = useState(emptyBill);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [refundForm, setRefundForm] = useState(emptyRefund);

  const [billIdInput, setBillIdInput] = useState("");
  const [patientIdInput, setPatientIdInput] = useState("");
  const [refundPaymentId, setRefundPaymentId] = useState("");
  const [refundCreated, setRefundCreated] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  const loadPatients = async () => {
    try {
      const data = await billingService.getPatients();
      setPatients(asArray(data));
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load patients."
      );
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const loadBillDetails = async (id) => {
    const [billData, itemData, paymentData] = await Promise.all([
      billingService.getBill(id),
      billingService.getBillItems(id),
      billingService.getPayments(id),
    ]);

    setBill(billData);
    setItems(asArray(itemData));
    setPayments(asArray(paymentData));
    setBillIdInput(String(billData.id));
    setPatientIdInput(String(billData.patient?.id ?? ""));
    setPaymentForm((previous) => ({
      ...previous,
      patientId: String(billData.patient?.id ?? ""),
    }));
  };

  const refreshBill = async () => {
    if (!bill?.id) return;

    setLoading(true);
    clearFeedback();

    try {
      await loadBillDetails(bill.id);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to refresh bill details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async (event) => {
    event.preventDefault();
    clearFeedback();
    setSaving(true);

    try {
      const payload = {
        patientId: Number(billForm.patientId),
        visitId: billForm.visitId ? Number(billForm.visitId) : null,
        admissionId: billForm.admissionId
          ? Number(billForm.admissionId)
          : null,
        billType: billForm.billType,
        discount: Number(billForm.discount || 0),
        insuranceAmount: Number(billForm.insuranceAmount || 0),
      };

      const created = await billingService.createBill(payload);
      setBillForm(emptyBill);
      await loadBillDetails(created.id);
      setMessage(`Bill ${created.billNumber || `#${created.id}`} created.`);
      setActiveTab("items");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create bill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLoadBill = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!billIdInput || Number(billIdInput) <= 0) {
      setError("Enter a valid bill ID.");
      return;
    }

    setLoading(true);

    try {
      await loadBillDetails(Number(billIdInput));
      setMessage("Bill details loaded.");
    } catch (err) {
      setBill(null);
      setItems([]);
      setPayments([]);
      setError(
        err.response?.data?.message || "Unable to load this bill."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePatientBills = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!patientIdInput || Number(patientIdInput) <= 0) {
      setError("Enter a valid patient ID.");
      return;
    }

    setLoading(true);

    try {
      const data = await billingService.getPatientBills(
        Number(patientIdInput)
      );
      setPatientBills(asArray(data));
      setMessage(`${asArray(data).length} bill(s) found.`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load patient bills."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!bill?.id) {
      setError("Load or create a bill first.");
      return;
    }

    if (bill.status !== "DRAFT") {
      setError("Only draft bills can be modified.");
      return;
    }

    if (
      Number(itemForm.quantity) <= 0 ||
      Number(itemForm.unitPrice) < 0 ||
      Number(itemForm.discount || 0) < 0 ||
      Number(itemForm.tax || 0) < 0
    ) {
      setError("Enter valid quantity, price, discount and tax values.");
      return;
    }

    setSaving(true);

    try {
      await billingService.addBillItem(bill.id, {
        serviceId: itemForm.serviceId
          ? Number(itemForm.serviceId)
          : null,
        description: itemForm.description,
        quantity: Number(itemForm.quantity),
        unitPrice: Number(itemForm.unitPrice),
        discount: Number(itemForm.discount || 0),
        tax: Number(itemForm.tax || 0),
      });

      setItemForm(emptyItem);
      await loadBillDetails(bill.id);
      setMessage("Bill item added and bill totals recalculated.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to add bill item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveItem = async (item) => {
    if (!bill?.id || bill.status !== "DRAFT") {
      setError("Only items on a draft bill can be removed.");
      return;
    }

    if (!window.confirm(`Remove "${item.description}" from this bill?`)) {
      return;
    }

    clearFeedback();

    try {
      await billingService.removeBillItem(bill.id, item.id);
      await loadBillDetails(bill.id);
      setMessage("Bill item removed.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to remove bill item."
      );
    }
  };

  const handleUpdateBill = async (event) => {
    event.preventDefault();

    if (!bill?.id) {
      setError("Load a bill first.");
      return;
    }

    clearFeedback();
    setSaving(true);

    try {
      await billingService.updateBill(bill.id, {
        billType: bill.billType,
        discount: Number(bill.discount || 0),
        insuranceAmount: Number(bill.insuranceAmount || 0),
      });

      await loadBillDetails(bill.id);
      setMessage("Bill updated and totals recalculated.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update bill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBillAction = async (action) => {
    if (!bill?.id) {
      setError("Load a bill first.");
      return;
    }

    clearFeedback();

    const actionLabels = {
      calculate: "recalculate",
      finalize: "finalize",
      cancel: "cancel",
    };

    if (
      action !== "calculate" &&
      !window.confirm(`Are you sure you want to ${actionLabels[action]} this bill?`)
    ) {
      return;
    }

    setSaving(true);

    try {
      if (action === "calculate") {
        await billingService.calculateBill(bill.id);
      } else if (action === "finalize") {
        await billingService.finalizeBill(bill.id);
      } else {
        await billingService.cancelBill(bill.id);
      }

      await loadBillDetails(bill.id);
      setMessage(`Bill ${actionLabels[action]} completed.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${actionLabels[action]} bill.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!bill?.id) {
      setError("Load a bill first.");
      return;
    }

    const amount = Number(paymentForm.amount);
    const outstanding = Number(bill.outstandingAmount || 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Payment amount must be greater than zero.");
      return;
    }

    if (amount > outstanding) {
      setError(`Payment cannot exceed the outstanding balance of ${money(outstanding)}.`);
      return;
    }

    setSaving(true);

    try {
      const created = await billingService.createPayment({
        billId: Number(bill.id),
        patientId: Number(bill.patient?.id),
        amount,
        paymentMethod: paymentForm.paymentMethod,
        transactionReference: paymentForm.transactionReference || null,
      });

      setPaymentForm({
        ...emptyPayment,
        patientId: String(bill.patient?.id ?? ""),
        paymentMethod: paymentForm.paymentMethod,
      });

      await loadBillDetails(bill.id);
      setMessage(`Payment #${created.id} recorded successfully.`);
      setActiveTab("payments");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to record payment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!refundPaymentId || Number(refundPaymentId) <= 0) {
      setError("Enter a valid payment ID.");
      return;
    }

    if (Number(refundForm.amount) <= 0) {
      setError("Refund amount must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const created = await billingService.createRefund(
        Number(refundPaymentId),
        {
          amount: Number(refundForm.amount),
          reason: refundForm.reason,
          approvedBy: refundForm.approvedBy
            ? Number(refundForm.approvedBy)
            : null,
        }
      );

      setRefundCreated(created);
      setRefundForm(emptyRefund);
      setMessage(
        `Refund request #${created.id} submitted with status ${created.status}.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create refund request."
      );
    } finally {
      setSaving(false);
    }
  };

  const paid = Number(bill?.paidAmount || 0);
  const outstanding = Number(bill?.outstandingAmount || 0);
  const total = Number(bill?.totalAmount || 0);

  return (
    <div className="billing-page">
      <header className="billing-header">
        <div>
          <h1>Billing Management</h1>
          <p>Create bills, manage bill items, record payments and request refunds.</p>
        </div>

        <button
          type="button"
          className="billing-secondary-btn"
          onClick={async () => {
            await loadPatients();
            if (bill?.id) await refreshBill();
          }}
          disabled={loading}
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </header>

      {error && <div className="billing-alert error">{error}</div>}
      {message && <div className="billing-alert success">{message}</div>}

      <nav className="billing-tabs">
        <button
          type="button"
          className={activeTab === "bills" ? "active" : ""}
          onClick={() => setActiveTab("bills")}
        >
          <FileText size={17} /> Bills
        </button>
        <button
          type="button"
          className={activeTab === "items" ? "active" : ""}
          onClick={() => setActiveTab("items")}
        >
          <Receipt size={17} /> Bill Items
        </button>
        <button
          type="button"
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          <CreditCard size={17} /> Payments
        </button>
        <button
          type="button"
          className={activeTab === "refunds" ? "active" : ""}
          onClick={() => setActiveTab("refunds")}
        >
          <Wallet size={17} /> Refund Requests
        </button>
      </nav>

      {bill && (
        <section className="billing-summary">
          <div className="billing-summary-heading">
            <div>
              <span>Current bill</span>
              <h2>{bill.billNumber || `Bill #${bill.id}`}</h2>
              <p>{patientName(bill.patient)} · Status: {bill.status}</p>
            </div>
            <button
              type="button"
              className="billing-secondary-btn"
              onClick={refreshBill}
              disabled={loading}
            >
              Refresh bill
            </button>
          </div>

          <div className="billing-amount-grid">
            <div>
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
            <div>
              <span>Paid</span>
              <strong>{money(paid)}</strong>
            </div>
            <div>
              <span>Outstanding</span>
              <strong>{money(outstanding)}</strong>
            </div>
          </div>
        </section>
      )}

      {activeTab === "bills" && (
        <>
          <section className="billing-panel">
            <h2>Create a Bill</h2>
            <form className="billing-form" onSubmit={handleCreateBill}>
              <label>
                Patient
                <select
                  required
                  value={billForm.patientId}
                  onChange={(e) =>
                    setBillForm({ ...billForm, patientId: e.target.value })
                  }
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.id} — {patientName(patient)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Bill type
                <select
                  value={billForm.billType}
                  onChange={(e) =>
                    setBillForm({ ...billForm, billType: e.target.value })
                  }
                >
                  <option value="OUTPATIENT">Outpatient</option>
                  <option value="INPATIENT">Inpatient</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="SURGERY">Surgery</option>
                  <option value="LABORATORY">Laboratory</option>
                  <option value="RADIOLOGY">Radiology</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label>
                Visit ID (optional)
                <input
                  type="number"
                  min="1"
                  value={billForm.visitId}
                  onChange={(e) =>
                    setBillForm({ ...billForm, visitId: e.target.value })
                  }
                />
              </label>

              <label>
                Admission ID (optional)
                <input
                  type="number"
                  min="1"
                  value={billForm.admissionId}
                  onChange={(e) =>
                    setBillForm({ ...billForm, admissionId: e.target.value })
                  }
                />
              </label>

              <label>
                Bill-level discount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={billForm.discount}
                  onChange={(e) =>
                    setBillForm({ ...billForm, discount: e.target.value })
                  }
                />
              </label>

              <label>
                Insurance amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={billForm.insuranceAmount}
                  onChange={(e) =>
                    setBillForm({
                      ...billForm,
                      insuranceAmount: e.target.value,
                    })
                  }
                />
              </label>

              <button className="billing-primary-btn" disabled={saving}>
                {saving ? "Creating..." : "Create Bill"}
              </button>
            </form>
          </section>

          <section className="billing-panel">
            <h2>Load a Bill</h2>
            <form className="billing-inline-form" onSubmit={handleLoadBill}>
              <label>
                Bill ID
                <input
                  type="number"
                  min="1"
                  required
                  value={billIdInput}
                  onChange={(e) => setBillIdInput(e.target.value)}
                  placeholder="Enter bill ID"
                />
              </label>
              <button className="billing-primary-btn" disabled={loading}>
                {loading ? "Loading..." : "Load Bill"}
              </button>
            </form>
          </section>

          <section className="billing-panel">
            <h2>Find Bills by Patient</h2>
            <form className="billing-inline-form" onSubmit={handlePatientBills}>
              <label>
                Patient
                <select
                  required
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.id} — {patientName(patient)}
                    </option>
                  ))}
                </select>
              </label>
              <button className="billing-primary-btn" disabled={loading}>
                Search Bills
              </button>
            </form>

            {patientBills.length > 0 ? (
              <div className="billing-table-wrap">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      <th>Bill number</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Total</th>
                      <th>Outstanding</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientBills.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.billNumber || "-"}</td>
                        <td>{formatDate(row.billDate)}</td>
                        <td>{row.billType || "-"}</td>
                        <td>{money(row.totalAmount)}</td>
                        <td>{money(row.outstandingAmount)}</td>
                        <td><span className="billing-status">{row.status}</span></td>
                        <td>
                          <button
                            type="button"
                            className="billing-small-btn"
                            onClick={async () => {
                              clearFeedback();
                              setLoading(true);
                              try {
                                await loadBillDetails(row.id);
                                setMessage(`Loaded bill #${row.id}.`);
                              } catch (err) {
                                setError(
                                  err.response?.data?.message ||
                                    "Unable to load selected bill."
                                );
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="billing-empty">Search by patient to see their bills.</p>
            )}
          </section>
        </>
      )}

      {activeTab === "items" && (
        <>
          <section className="billing-panel">
            <h2>Add Bill Item</h2>
            <p className="billing-help">
              {bill
                ? `Adding items to ${bill.billNumber || `bill #${bill.id}`}.`
                : "Create or load a bill in the Bills tab first."}
            </p>

            <form className="billing-form" onSubmit={handleAddItem}>
              <label>
                Service ID (optional)
                <input
                  type="number"
                  min="1"
                  value={itemForm.serviceId}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, serviceId: e.target.value })
                  }
                />
              </label>

              <label>
                Description
                <input
                  required
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  placeholder="e.g. Consultation charge"
                />
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  required
                  value={itemForm.quantity}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, quantity: e.target.value })
                  }
                />
              </label>

              <label>
                Unit price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={itemForm.unitPrice}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, unitPrice: e.target.value })
                  }
                />
              </label>

              <label>
                Item discount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.discount}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, discount: e.target.value })
                  }
                />
              </label>

              <label>
                Item tax
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.tax}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, tax: e.target.value })
                  }
                />
              </label>

              <button
                className="billing-primary-btn"
                disabled={saving || !bill || bill.status !== "DRAFT"}
              >
                <Plus size={16} /> Add Item
              </button>
            </form>
          </section>

          <section className="billing-panel">
            <div className="billing-panel-heading">
              <h2>Bill Items</h2>
              <div className="billing-action-row">
                <button
                  type="button"
                  className="billing-secondary-btn"
                  disabled={!bill || saving}
                  onClick={() => handleBillAction("calculate")}
                >
                  Calculate totals
                </button>
                <button
                  type="button"
                  className="billing-primary-btn"
                  disabled={!bill || saving || bill.status !== "DRAFT"}
                  onClick={() => handleBillAction("finalize")}
                >
                  Finalize bill
                </button>
                <button
                  type="button"
                  className="billing-danger-btn"
                  disabled={!bill || saving || bill.status !== "DRAFT"}
                  onClick={() => handleBillAction("cancel")}
                >
                  Cancel bill
                </button>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="billing-table-wrap">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit price</th>
                      <th>Discount</th>
                      <th>Tax</th>
                      <th>Item total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{money(item.unitPrice)}</td>
                        <td>{money(item.discount)}</td>
                        <td>{money(item.tax)}</td>
                        <td>{money(item.totalAmount)}</td>
                        <td>
                          <button
                            type="button"
                            className="billing-danger-small-btn"
                            disabled={!bill || bill.status !== "DRAFT"}
                            onClick={() => handleRemoveItem(item)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="billing-empty">
                {bill ? "No items added to this bill yet." : "Load a bill to see its items."}
              </p>
            )}

            {bill && (
              <form className="billing-update-form" onSubmit={handleUpdateBill}>
                <h3>Update draft bill</h3>
                <label>
                  Bill type
                  <input
                    value={bill.billType || ""}
                    onChange={(e) =>
                      setBill({ ...bill, billType: e.target.value })
                    }
                    disabled={bill.status !== "DRAFT"}
                  />
                </label>
                <label>
                  Bill discount
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bill.discount ?? 0}
                    onChange={(e) =>
                      setBill({ ...bill, discount: e.target.value })
                    }
                    disabled={bill.status !== "DRAFT"}
                  />
                </label>
                <label>
                  Insurance amount
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bill.insuranceAmount ?? 0}
                    onChange={(e) =>
                      setBill({ ...bill, insuranceAmount: e.target.value })
                    }
                    disabled={bill.status !== "DRAFT"}
                  />
                </label>
                <button
                  className="billing-secondary-btn"
                  disabled={saving || bill.status !== "DRAFT"}
                >
                  Save bill changes
                </button>
              </form>
            )}
          </section>
        </>
      )}

      {activeTab === "payments" && (
        <>
          <section className="billing-panel">
            <h2>Record Payment</h2>
            <p className="billing-help">
              Load the bill first. The patient ID is taken from that bill.
            </p>

            <form className="billing-form" onSubmit={handlePayment}>
              <label>
                Payment amount
                <input
                  type="number"
                  min="0.01"
                  max={outstanding || undefined}
                  step="0.01"
                  required
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                />
              </label>

              <label>
                Payment method
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: e.target.value,
                    })
                  }
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank transfer</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label className="billing-full-width">
                Transaction reference (optional)
                <input
                  value={paymentForm.transactionReference}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      transactionReference: e.target.value,
                    })
                  }
                  placeholder="Transaction ID or receipt reference"
                />
              </label>

              <button
                className="billing-primary-btn"
                disabled={
                  saving ||
                  !bill ||
                  outstanding <= 0 ||
                  !["FINALIZED", "PARTIALLY_PAID"].includes(bill.status)
                }
              >
                {saving ? "Recording..." : "Record Payment"}
              </button>
            </form>
          </section>

          <section className="billing-panel">
            <h2>Payment History</h2>
            {payments.length > 0 ? (
              <div className="billing-table-wrap">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Patient</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Transaction reference</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Refund</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.id}</td>
                        <td>{patientName(payment.patient)}</td>
                        <td>{money(payment.amount)}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>{payment.transactionReference || "-"}</td>
                        <td>{formatDate(payment.paymentDate)}</td>
                        <td>{payment.status}</td>
                        <td>
                          <button
                            type="button"
                            className="billing-small-btn"
                            onClick={() => {
                              setRefundPaymentId(String(payment.id));
                              setRefundForm({
                                ...emptyRefund,
                                amount: String(payment.amount ?? ""),
                              });
                              setActiveTab("refunds");
                            }}
                            disabled={payment.status !== "SUCCESS"}
                          >
                            Request refund
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="billing-empty">
                {bill
                  ? "No payments found for this bill."
                  : "Load a bill to see payment history."}
              </p>
            )}
          </section>
        </>
      )}

      {activeTab === "refunds" && (
        <section className="billing-panel">
          <h2>Request a Refund</h2>
          <p className="billing-help">
            A refund request is created with PENDING status. This backend
            does not provide a refund approval or refund-history endpoint.
          </p>

          <form className="billing-form" onSubmit={handleRefund}>
            <label>
              Payment ID
              <input
                type="number"
                min="1"
                required
                value={refundPaymentId}
                onChange={(e) => setRefundPaymentId(e.target.value)}
                placeholder="Payment ID from payment history"
              />
            </label>

            <label>
              Refund amount
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={refundForm.amount}
                onChange={(e) =>
                  setRefundForm({ ...refundForm, amount: e.target.value })
                }
              />
            </label>

            <label className="billing-full-width">
              Reason
              <textarea
                rows="3"
                value={refundForm.reason}
                onChange={(e) =>
                  setRefundForm({ ...refundForm, reason: e.target.value })
                }
                placeholder="Explain why the refund is requested"
              />
            </label>

            <label>
              Approved by user ID (optional)
              <input
                type="number"
                min="1"
                value={refundForm.approvedBy}
                onChange={(e) =>
                  setRefundForm({ ...refundForm, approvedBy: e.target.value })
                }
              />
            </label>

            <button className="billing-primary-btn" disabled={saving}>
              {saving ? "Submitting..." : "Submit Refund Request"}
            </button>
          </form>

          {refundCreated && (
            <div className="billing-refund-result">
              <strong>Refund request created</strong>
              <span>Refund ID: {refundCreated.id}</span>
              <span>Amount: {money(refundCreated.amount)}</span>
              <span>Status: {refundCreated.status}</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
