
import { useState } from "react";
import * as lab from "../services/laboratoryService";
import "../styles/laboratoryManagement.css";

const emptyTest = {
  testCode: "",
  testName: "",
  category: "",
  description: "",
  price: "",
  normalRange: "",
  status: "",
};

const emptyOrder = {
  patientId: "",
  consultationId: "",
  doctorId: "",
  priority: "",
  status: "ORDERED",
  testIds: "",
};

const emptySample = {
  patientId: "",
  labOrderId: "",
  sampleType: "",
  barcode: "",
  collectedBy: "",
  status: "",
};

const emptyResult = {
  orderItemId: "",
  testId: "",
  resultValue: "",
  unit: "",
  referenceRange: "",
  abnormalFlag: "",
  remarks: "",
  enteredBy: "",
};

const emptyReport = {
  labOrderId: "",
  patientId: "",
  verifiedBy: "",
};

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="lab-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="lab-field">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
      />
    </label>
  );
}

function Output({ data }) {
  if (data === null || data === undefined) return null;

  return (
    <div className="lab-output">
      <h3>Backend Response</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function LaboratoryManagement() {
  const [tab, setTab] = useState("tests");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const [testForm, setTestForm] = useState(emptyTest);
  const [testId, setTestId] = useState("");
  const [testSearch, setTestSearch] = useState("");

  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [orderId, setOrderId] = useState("");
  const [orderLookupType, setOrderLookupType] = useState("id");
  const [orderLookupId, setOrderLookupId] = useState("");
  const [addTestId, setAddTestId] = useState("");

  const [sampleForm, setSampleForm] = useState(emptySample);
  const [sampleId, setSampleId] = useState("");
  const [sampleLookupType, setSampleLookupType] = useState("order");
  const [sampleLookupId, setSampleLookupId] = useState("");
  const [sampleStatus, setSampleStatus] = useState("");

  const [resultForm, setResultForm] = useState(emptyResult);
  const [resultId, setResultId] = useState("");
  const [resultLookupItemId, setResultLookupItemId] = useState("");
  const [verifiedBy, setVerifiedBy] = useState("");

  const [reportForm, setReportForm] = useState(emptyReport);
  const [reportLookupType, setReportLookupType] = useState("order");
  const [reportLookupId, setReportLookupId] = useState("");

  const setField = (setter, key, value) =>
    setter((previous) => ({ ...previous, [key]: value }));

  const run = async (action, successMessage = "Operation completed.") => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await action();
      setOutput(data ?? { success: true });
      setMessage(successMessage);
    } catch (err) {
      setOutput(null);
      setError(
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "The operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const numberOrUndefined = (value) =>
    value.trim() === "" ? undefined : Number(value);

  const submitTest = (event) => {
    event.preventDefault();

    const payload = {
      ...testForm,
      price: Number(testForm.price),
    };

    run(
      () => testId
        ? lab.updateLabTest(Number(testId), payload)
        : lab.createLabTest(payload),
      testId ? "Laboratory test updated." : "Laboratory test created."
    );
  };

  const submitOrder = (event) => {
    event.preventDefault();

    const payload = {
      patientId: Number(orderForm.patientId),
      consultationId: Number(orderForm.consultationId),
      doctorId: Number(orderForm.doctorId),
      priority: orderForm.priority,
      status: orderForm.status,
      testIds: orderForm.testIds
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number),
    };

    run(() => lab.createLabOrder(payload), "Laboratory order created.");
  };

  const submitSample = (event) => {
    event.preventDefault();

    run(
      () => lab.registerLabSample({
        patientId: Number(sampleForm.patientId),
        labOrderId: Number(sampleForm.labOrderId),
        sampleType: sampleForm.sampleType,
        barcode: sampleForm.barcode,
        collectedBy: sampleForm.collectedBy,
        status: sampleForm.status,
      }),
      "Laboratory sample registered."
    );
  };

  const submitResult = (event) => {
    event.preventDefault();

    run(
      () => lab.createLabResult({
        orderItemId: Number(resultForm.orderItemId),
        testId: Number(resultForm.testId),
        resultValue: resultForm.resultValue,
        unit: resultForm.unit,
        referenceRange: resultForm.referenceRange,
        abnormalFlag: resultForm.abnormalFlag,
        remarks: resultForm.remarks,
        enteredBy: resultForm.enteredBy,
      }),
      "Laboratory result recorded."
    );
  };

  const submitReport = (event) => {
    event.preventDefault();

    run(
      () => lab.generateLabReport({
        labOrderId: Number(reportForm.labOrderId),
        patientId: Number(reportForm.patientId),
        verifiedBy: reportForm.verifiedBy,
      }),
      "Laboratory report generated."
    );
  };

  const loadTest = () => run(
    () => lab.getLabTest(Number(testId)),
    "Laboratory test loaded."
  );

  const searchTests = () => run(
    () => testSearch.trim()
      ? lab.searchLabTests(testSearch.trim())
      : lab.getLabTests(),
    "Laboratory tests loaded."
  );

  const lookupOrder = () => {
    const id = Number(orderLookupId);

    if (orderLookupType === "patient") {
      return run(() => lab.getLabOrdersByPatient(id));
    }

    if (orderLookupType === "consultation") {
      return run(() => lab.getLabOrdersByConsultation(id));
    }

    return run(() => lab.getLabOrder(id));
  };

  const lookupSample = () => {
    const id = Number(sampleLookupId);

    if (sampleLookupType === "patient") {
      return run(() => lab.getLabSamplesByPatient(id));
    }

    return run(() => lab.getLabSamplesByOrder(id));
  };

  const lookupReport = () => {
    const id = Number(reportLookupId);

    if (reportLookupType === "patient") {
      return run(() => lab.getLabReportsByPatient(id));
    }

    return run(() => lab.getLabReportsByOrder(id));
  };

  const tabs = [
    ["tests", "Laboratory Tests"],
    ["orders", "Lab Orders"],
    ["samples", "Sample Collection"],
    ["results", "Lab Results"],
    ["reports", "Lab Reports"],
  ];

  return (
    <div className="lab-page">
      <header className="lab-header">
        <div>
          <h1>Laboratory Management</h1>
          <p>Manage laboratory tests, orders, samples, results and reports.</p>
        </div>
      </header>

      {error && <div className="lab-alert lab-error">{error}</div>}
      {message && <div className="lab-alert lab-success">{message}</div>}

      <nav className="lab-tabs">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={tab === value ? "active" : ""}
            onClick={() => {
              setTab(value);
              setError("");
              setMessage("");
              setOutput(null);
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "tests" && (
        <section className="lab-card">
          <h2>Laboratory Test Master</h2>
          <p>Create a test or enter an existing test ID to update it.</p>

          <form className="lab-form" onSubmit={submitTest}>
            <Field label="Test Code" value={testForm.testCode}
              onChange={(v) => setField(setTestForm, "testCode", v)} required />
            <Field label="Test Name" value={testForm.testName}
              onChange={(v) => setField(setTestForm, "testName", v)} required />
            <Field label="Category" value={testForm.category}
              onChange={(v) => setField(setTestForm, "category", v)} required />
            <Field label="Price" type="number" value={testForm.price}
              onChange={(v) => setField(setTestForm, "price", v)} required />
            <Field label="Normal Range" value={testForm.normalRange}
              onChange={(v) => setField(setTestForm, "normalRange", v)} />
            <Field label="Status" value={testForm.status}
              onChange={(v) => setField(setTestForm, "status", v)} required />
            <TextAreaField label="Description" value={testForm.description}
              onChange={(v) => setField(setTestForm, "description", v)} />

            <Field label="Test ID (fill to update)" value={testId}
              onChange={setTestId} type="number" />

            <div className="lab-actions">
              <button type="submit" disabled={loading}>
                {testId ? "Update Test" : "Create Test"}
              </button>
              <button type="button" className="secondary" disabled={loading}
                onClick={loadTest}>Load by ID</button>
              <button type="button" className="secondary" disabled={loading}
                onClick={searchTests}>List / Search Tests</button>
            </div>
          </form>

          <div className="lab-inline-search">
            <Field label="Search by Test Name" value={testSearch}
              onChange={setTestSearch} />
          </div>
        </section>
      )}

      {tab === "orders" && (
        <>
          <section className="lab-card">
            <h2>Create Laboratory Order</h2>
            <p>Enter the existing patient, consultation and doctor IDs.</p>

            <form className="lab-form" onSubmit={submitOrder}>
              <Field label="Patient ID" type="number" value={orderForm.patientId}
                onChange={(v) => setField(setOrderForm, "patientId", v)} required />
              <Field label="Consultation ID" type="number" value={orderForm.consultationId}
                onChange={(v) => setField(setOrderForm, "consultationId", v)} required />
              <Field label="Doctor ID" type="number" value={orderForm.doctorId}
                onChange={(v) => setField(setOrderForm, "doctorId", v)} required />
              <Field label="Priority" value={orderForm.priority}
                onChange={(v) => setField(setOrderForm, "priority", v)} required />
              <Field label="Status" value={orderForm.status}
                onChange={(v) => setField(setOrderForm, "status", v)} required />
              <Field label="Test IDs (comma-separated)" value={orderForm.testIds}
                onChange={(v) => setField(setOrderForm, "testIds", v)} />
              <button type="submit" disabled={loading}>Create Order</button>
            </form>
          </section>

          <section className="lab-card">
            <h2>Find or Update Order</h2>
            <div className="lab-form">
              <label className="lab-field">
                <span>Find orders by</span>
                <select value={orderLookupType}
                  onChange={(e) => setOrderLookupType(e.target.value)}>
                  <option value="id">Order ID</option>
                  <option value="patient">Patient ID</option>
                  <option value="consultation">Consultation ID</option>
                </select>
              </label>
              <Field label="ID" value={orderLookupId}
                onChange={setOrderLookupId} type="number" required />
              <button type="button" disabled={loading} onClick={lookupOrder}>
                Find Order(s)
              </button>
            </div>

            <div className="lab-form lab-top-gap">
              <Field label="Order ID to update or add a test" value={orderId}
                onChange={setOrderId} type="number" />
              <Field label="New status (for update)" value={orderForm.status}
                onChange={(v) => setField(setOrderForm, "status", v)} />
              <Field label="Priority (for update)" value={orderForm.priority}
                onChange={(v) => setField(setOrderForm, "priority", v)} />
              <Field label="Test ID to add" value={addTestId}
                onChange={setAddTestId} type="number" />

              <div className="lab-actions">
                <button type="button" disabled={loading} onClick={() =>
                  run(() => lab.updateLabOrder(Number(orderId), {
                    priority: orderForm.priority,
                    status: orderForm.status,
                  }), "Order updated.")}>
                  Update Order
                </button>
                <button type="button" className="secondary" disabled={loading}
                  onClick={() => run(
                    () => lab.addTestToLabOrder(Number(orderId), Number(addTestId)),
                    "Test added to order."
                  )}>
                  Add Test to Order
                </button>
                <button type="button" className="secondary" disabled={loading}
                  onClick={() => run(
                    () => lab.getLabOrderTests(Number(orderId)),
                    "Order tests loaded."
                  )}>
                  View Order Tests
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "samples" && (
        <>
          <section className="lab-card">
            <h2>Register Sample</h2>
            <form className="lab-form" onSubmit={submitSample}>
              <Field label="Patient ID" type="number" value={sampleForm.patientId}
                onChange={(v) => setField(setSampleForm, "patientId", v)} required />
              <Field label="Lab Order ID" type="number" value={sampleForm.labOrderId}
                onChange={(v) => setField(setSampleForm, "labOrderId", v)} required />
              <Field label="Sample Type" value={sampleForm.sampleType}
                onChange={(v) => setField(setSampleForm, "sampleType", v)} required />
              <Field label="Barcode" value={sampleForm.barcode}
                onChange={(v) => setField(setSampleForm, "barcode", v)} required />
              <Field label="Collected By" value={sampleForm.collectedBy}
                onChange={(v) => setField(setSampleForm, "collectedBy", v)} required />
              <Field label="Status" value={sampleForm.status}
                onChange={(v) => setField(setSampleForm, "status", v)} required />
              <button type="submit" disabled={loading}>Register Sample</button>
            </form>
          </section>

          <section className="lab-card">
            <h2>Find or Update Sample</h2>
            <div className="lab-form">
              <Field label="Sample ID" type="number" value={sampleId}
                onChange={setSampleId} />
              <button type="button" disabled={loading} onClick={() =>
                run(() => lab.getLabSample(Number(sampleId)))}>Find Sample</button>

              <label className="lab-field">
                <span>Search samples by</span>
                <select value={sampleLookupType}
                  onChange={(e) => setSampleLookupType(e.target.value)}>
                  <option value="order">Lab Order ID</option>
                  <option value="patient">Patient ID</option>
                </select>
              </label>
              <Field label="Patient / Order ID" type="number" value={sampleLookupId}
                onChange={setSampleLookupId} />
              <button type="button" disabled={loading} onClick={lookupSample}>
                Search Samples
              </button>
              <Field label="New sample status" value={sampleStatus}
                onChange={setSampleStatus} />
              <button type="button" disabled={loading} onClick={() =>
                run(() => lab.updateLabSampleStatus(
                  Number(sampleId), sampleStatus
                ), "Sample status updated.")}>
                Update Status
              </button>
            </div>
          </section>
        </>
      )}

      {tab === "results" && (
        <>
          <section className="lab-card">
            <h2>Record Laboratory Result</h2>
            <form className="lab-form" onSubmit={submitResult}>
              <Field label="Order Item ID" type="number" value={resultForm.orderItemId}
                onChange={(v) => setField(setResultForm, "orderItemId", v)} required />
              <Field label="Test ID" type="number" value={resultForm.testId}
                onChange={(v) => setField(setResultForm, "testId", v)} required />
              <Field label="Result Value" value={resultForm.resultValue}
                onChange={(v) => setField(setResultForm, "resultValue", v)} required />
              <Field label="Unit" value={resultForm.unit}
                onChange={(v) => setField(setResultForm, "unit", v)} />
              <Field label="Reference Range" value={resultForm.referenceRange}
                onChange={(v) => setField(setResultForm, "referenceRange", v)} />
              <Field label="Abnormal Flag" value={resultForm.abnormalFlag}
                onChange={(v) => setField(setResultForm, "abnormalFlag", v)} />
              <Field label="Entered By" value={resultForm.enteredBy}
                onChange={(v) => setField(setResultForm, "enteredBy", v)} required />
              <TextAreaField label="Remarks" value={resultForm.remarks}
                onChange={(v) => setField(setResultForm, "remarks", v)} />
              <button type="submit" disabled={loading}>Save Result</button>
            </form>
          </section>

          <section className="lab-card">
            <h2>Find or Verify Result</h2>
            <div className="lab-form">
              <Field label="Result ID" type="number" value={resultId}
                onChange={setResultId} />
              <button type="button" disabled={loading} onClick={() =>
                run(() => lab.getLabResult(Number(resultId)))}>Find Result</button>
              <Field label="Order Item ID" type="number" value={resultLookupItemId}
                onChange={setResultLookupItemId} />
              <button type="button" disabled={loading} onClick={() =>
                run(() => lab.getLabResultsByOrderItem(Number(resultLookupItemId)))}>
                Results by Order Item
              </button>
              <Field label="Verified By" value={verifiedBy}
                onChange={setVerifiedBy} required />
              <button type="button" disabled={loading} onClick={() =>
                run(() => lab.verifyLabResult(Number(resultId), verifiedBy),
                  "Result verification requested.")}>
                Verify Result
              </button>
            </div>
          </section>
        </>
      )}

      {tab === "reports" && (
        <>
          <section className="lab-card">
            <h2>Generate Laboratory Report</h2>
            <form className="lab-form" onSubmit={submitReport}>
              <Field label="Lab Order ID" type="number" value={reportForm.labOrderId}
                onChange={(v) => setField(setReportForm, "labOrderId", v)} required />
              <Field label="Patient ID" type="number" value={reportForm.patientId}
                onChange={(v) => setField(setReportForm, "patientId", v)} required />
              <Field label="Verified By" value={reportForm.verifiedBy}
                onChange={(v) => setField(setReportForm, "verifiedBy", v)} required />
              <button type="submit" disabled={loading}>Generate Report</button>
            </form>
          </section>

          <section className="lab-card">
            <h2>Find Laboratory Reports</h2>
            <div className="lab-form">
              <label className="lab-field">
                <span>Find reports by</span>
                <select value={reportLookupType}
                  onChange={(e) => setReportLookupType(e.target.value)}>
                  <option value="order">Lab Order ID</option>
                  <option value="patient">Patient ID</option>
                </select>
              </label>
              <Field label="Patient / Order ID" type="number"
                value={reportLookupId} onChange={setReportLookupId} />
              <button type="button" disabled={loading} onClick={lookupReport}>
                Search Reports
              </button>
              <Field label="Report ID" type="number" value={testId}
                onChange={setTestId} />
              <button type="button" className="secondary" disabled={loading}
                onClick={() => run(() => lab.getLabReport(Number(testId)))}>
                Find Report by ID
              </button>
            </div>
          </section>
        </>
      )}

      {loading && <p className="lab-loading">Processing request...</p>}
      <Output data={output} />
    </div>
  );
}
