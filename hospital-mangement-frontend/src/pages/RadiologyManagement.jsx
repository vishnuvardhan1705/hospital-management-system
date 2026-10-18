
import { useEffect, useState } from "react";
import * as radiology from "../services/radiologyService";
import "../styles/radiologyManagement.css";

const emptyTest = {
  testCode: "",
  testName: "",
  modality: "",
  description: "",
  price: "",
  status: "ACTIVE",
};

const emptyOrder = {
  patientId: "",
  consultationId: "",
  doctorId: "",
  testId: "",
  priority: "NORMAL",
  status: "ORDERED",
};

const emptyReport = {
  radiologyOrderId: "",
  patientId: "",
  findings: "",
  impression: "",
  reportedBy: "",
};

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getError = (error) =>
  error.response?.data?.message ??
  error.response?.data?.error ??
  error.message ??
  "The operation failed.";

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <label className="radiology-field">
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

function TextAreaField({ label, value, onChange, required = false }) {
  return (
    <label className="radiology-field">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        required={required}
      />
    </label>
  );
}

function ResponseViewer({ data }) {
  if (data === null) return null;

  return (
    <section className="radiology-response">
      <h3>Latest Backend Response</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}

export default function RadiologyManagement() {
  const [tab, setTab] = useState("tests");

  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);

  const [testForm, setTestForm] = useState(emptyTest);
  const [testId, setTestId] = useState("");
  const [testSearch, setTestSearch] = useState("");

  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [orderId, setOrderId] = useState("");
  const [orderLookupType, setOrderLookupType] = useState("patient");
  const [orderLookupId, setOrderLookupId] = useState("");

  const [reportForm, setReportForm] = useState(emptyReport);
  const [reportPatientId, setReportPatientId] = useState("");
  const [reportId, setReportId] = useState("");
  const [verifiedBy, setVerifiedBy] = useState("");

  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (setter, field, value) => {
    setter((previous) => ({ ...previous, [field]: value }));
  };

  const run = async (action, successMessage = "Operation completed.") => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await action();
      setOutput(data ?? { success: true });
      setMessage(successMessage);
      return data;
    } catch (err) {
      setOutput(null);
      setError(getError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadTests = async () => {
    setTestsLoading(true);

    try {
      const data = await radiology.getRadiologyTests();
      setTests(getArray(data));
      setOutput(data);
      setError("");
    } catch (err) {
      setError(getError(err));
    } finally {
      setTestsLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const submitTest = async (event) => {
    event.preventDefault();

    const payload = {
      testCode: testForm.testCode.trim(),
      testName: testForm.testName.trim(),
      modality: testForm.modality.trim(),
      description: testForm.description.trim(),
      price: Number(testForm.price),
      status: testForm.status.trim(),
    };

    const result = await run(
      () => testId.trim()
        ? radiology.updateRadiologyTest(Number(testId), payload)
        : radiology.createRadiologyTest(payload),
      testId.trim() ? "Radiology test updated." : "Radiology test created."
    );

    if (result !== null) {
      await loadTests();
    }
  };

  const searchTests = async (event) => {
    event.preventDefault();

    await run(
      async () => {
        const data = testSearch.trim()
          ? await radiology.searchRadiologyTests(testSearch.trim())
          : await radiology.getRadiologyTests();

        setTests(getArray(data));
        return data;
      },
      "Radiology tests loaded."
    );
  };

  const loadTestById = async () => {
    const data = await run(
      () => radiology.getRadiologyTest(Number(testId)),
      "Radiology test loaded."
    );

    if (!data) return;

    const test = data?.data ?? data;

    setTestForm({
      testCode: test.testCode ?? "",
      testName: test.testName ?? "",
      modality: test.modality ?? "",
      description: test.description ?? "",
      price: test.price ?? "",
      status: test.status ?? "",
    });
  };

  const resetTestForm = () => {
    setTestForm(emptyTest);
    setTestId("");
    setError("");
    setMessage("");
    setOutput(null);
  };

  const submitOrder = (event) => {
    event.preventDefault();

    const payload = {
      patientId: Number(orderForm.patientId),
      consultationId: Number(orderForm.consultationId),
      doctorId: Number(orderForm.doctorId),
      testId: Number(orderForm.testId),
      priority: orderForm.priority,
      status: orderForm.status,
    };

    run(
      () => radiology.createRadiologyOrder(payload),
      "Radiology order created."
    );
  };

  const lookupOrders = () => {
    const id = Number(orderLookupId);

    if (orderLookupType === "id") {
      return run(
        () => radiology.getRadiologyOrder(id),
        "Radiology order loaded."
      );
    }

    if (orderLookupType === "doctor") {
      return run(
        () => radiology.getRadiologyOrdersByDoctor(id),
        "Doctor's radiology orders loaded."
      );
    }

    if (orderLookupType === "consultation") {
      return run(
        () => radiology.getRadiologyOrdersByConsultation(id),
        "Consultation radiology orders loaded."
      );
    }

    return run(
      () => radiology.getRadiologyOrdersByPatient(id),
      "Patient radiology orders loaded."
    );
  };

  const updateOrder = () => {
    const payload = {
      patientId: Number(orderForm.patientId),
      consultationId: Number(orderForm.consultationId),
      doctorId: Number(orderForm.doctorId),
      testId: Number(orderForm.testId),
      priority: orderForm.priority,
      status: orderForm.status,
    };

    return run(
        () =>
        radiology.updateRadiologyOrder(Number(orderId), {
            priority: orderForm.priority,
            status: orderForm.status,
        }),
        "Radiology order updated."
    );
  };

  const scheduleOrder = () =>
    run(
      () => radiology.scheduleRadiologyOrder(Number(orderId)),
      "Radiology scheduling request completed."
    );

  const submitReport = (event) => {
    event.preventDefault();

    const payload = {
      radiologyOrderId: Number(reportForm.radiologyOrderId),
      patientId: Number(reportForm.patientId),
      findings: reportForm.findings.trim(),
      impression: reportForm.impression.trim(),
      reportedBy: reportForm.reportedBy.trim(),
    };

    run(
      () => radiology.createRadiologyReport(payload),
      "Radiology report submitted."
    );
  };

  const searchPatientReports = () =>
    run(
      () => radiology.getRadiologyReportsByPatient(Number(reportPatientId)),
      "Patient radiology reports loaded."
    );

  const verifyReport = () =>
    run(
      () => radiology.verifyRadiologyReport(
        Number(reportId),
        verifiedBy.trim()
      ),
      "Report verification request completed."
    );

  return (
    <main className="radiology-page">
      <header className="radiology-heading">
        <div>
          <h1>Radiology Management</h1>
          <p>
            Manage imaging tests, doctor orders, scheduling, and reports.
          </p>
        </div>
      </header>

      {error && (
        <div className="radiology-alert radiology-error">{error}</div>
      )}

      {message && (
        <div className="radiology-alert radiology-success">{message}</div>
      )}

      <nav className="radiology-tabs">
        {[
          ["tests", "Radiology Tests"],
          ["orders", "Radiology Orders"],
          ["reports", "Radiology Reports"],
        ].map(([value, label]) => (
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
        <>
          <section className="radiology-card">
            <h2>{testId ? "Update Radiology Test" : "Create Radiology Test"}</h2>

            <form className="radiology-form" onSubmit={submitTest}>
              <Field
                label="Test Code"
                value={testForm.testCode}
                onChange={(v) => setField(setTestForm, "testCode", v)}
                required
              />
              <Field
                label="Test Name"
                value={testForm.testName}
                onChange={(v) => setField(setTestForm, "testName", v)}
                required
              />
              <Field
                label="Modality"
                value={testForm.modality}
                onChange={(v) => setField(setTestForm, "modality", v)}
                required
              />
              <Field
                label="Price"
                type="number"
                value={testForm.price}
                onChange={(v) => setField(setTestForm, "price", v)}
                required
              />
              <Field
                label="Status"
                value={testForm.status}
                onChange={(v) => setField(setTestForm, "status", v)}
                required
              />
              <TextAreaField
                label="Description"
                value={testForm.description}
                onChange={(v) => setField(setTestForm, "description", v)}
              />

              <Field
                label="Existing Test ID (for load/update)"
                type="number"
                value={testId}
                onChange={setTestId}
              />

              <div className="radiology-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : testId ? "Update Test" : "Create Test"}
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={loading || !testId.trim()}
                  onClick={loadTestById}
                >
                  Load Test by ID
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={resetTestForm}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </section>

          <section className="radiology-card">
            <h2>Radiology Test Catalogue</h2>

            <form className="radiology-search" onSubmit={searchTests}>
              <Field
                label="Search by Test Name (blank lists all)"
                value={testSearch}
                onChange={setTestSearch}
              />
              <button type="submit" disabled={loading || testsLoading}>
                Search
              </button>
              <button
                type="button"
                className="secondary"
                disabled={testsLoading}
                onClick={loadTests}
              >
                Refresh
              </button>
            </form>

            {testsLoading ? (
              <p className="radiology-empty">Loading tests...</p>
            ) : (
              <div className="radiology-table-wrapper">
                <table className="radiology-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Code</th>
                      <th>Test Name</th>
                      <th>Modality</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((test, index) => (
                      <tr key={test.id ?? index}>
                        <td>{test.id ?? "—"}</td>
                        <td>{test.testCode ?? "—"}</td>
                        <td>{test.testName ?? "—"}</td>
                        <td>{test.modality ?? "—"}</td>
                        <td>{test.price ?? "—"}</td>
                        <td>{test.status ?? "—"}</td>
                        <td>
                          <button
                            type="button"
                            className="table-action"
                            onClick={() => {
                              setTestId(String(test.id ?? ""));
                              setTestForm({
                                testCode: test.testCode ?? "",
                                testName: test.testName ?? "",
                                modality: test.modality ?? "",
                                description: test.description ?? "",
                                price: test.price ?? "",
                                status: test.status ?? "",
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tests.length === 0 && (
                      <tr>
                        <td colSpan="7" className="radiology-empty">
                          No radiology tests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {tab === "orders" && (
        <>
          <section className="radiology-card">
            <h2>Create Radiology Order</h2>
            <p>
              Use IDs of existing patient, consultation, doctor, and radiology test records.
            </p>

            <form className="radiology-form" onSubmit={submitOrder}>
              <Field
                label="Patient ID"
                type="number"
                value={orderForm.patientId}
                onChange={(v) => setField(setOrderForm, "patientId", v)}
                required
              />
              <Field
                label="Consultation ID"
                type="number"
                value={orderForm.consultationId}
                onChange={(v) => setField(setOrderForm, "consultationId", v)}
                required
              />
              <Field
                label="Doctor ID"
                type="number"
                value={orderForm.doctorId}
                onChange={(v) => setField(setOrderForm, "doctorId", v)}
                required
              />

              <label className="radiology-field">
                <span>Radiology Test</span>
                <select
                  value={orderForm.testId}
                  onChange={(event) =>
                    setField(setOrderForm, "testId", event.target.value)
                  }
                  required
                >
                  <option value="">Select test</option>
                  {tests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.testCode} — {test.testName}
                      {test.modality ? ` (${test.modality})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="radiology-field">
                <span>Priority</span>
                <select
                  value={orderForm.priority}
                  onChange={(event) =>
                    setField(setOrderForm, "priority", event.target.value)
                  }
                  required
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="URGENT">URGENT</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                </select>
              </label>

              <Field
                label="Status"
                value={orderForm.status}
                onChange={(v) => setField(setOrderForm, "status", v)}
                required
              />

              <button type="submit" disabled={loading}>
                Create Radiology Order
              </button>
            </form>
          </section>

          <section className="radiology-card">
            <h2>Find Radiology Orders</h2>

            <div className="radiology-form">
              <label className="radiology-field">
                <span>Search Orders By</span>
                <select
                  value={orderLookupType}
                  onChange={(event) => setOrderLookupType(event.target.value)}
                >
                  <option value="patient">Patient ID</option>
                  <option value="doctor">Doctor ID</option>
                  <option value="consultation">Consultation ID</option>
                  <option value="id">Order ID</option>
                </select>
              </label>

              <Field
                label="ID"
                type="number"
                value={orderLookupId}
                onChange={setOrderLookupId}
                required
              />

              <button
                type="button"
                disabled={loading || !orderLookupId.trim()}
                onClick={lookupOrders}
              >
                Find Order(s)
              </button>
            </div>

            <div className="radiology-divider" />

            <h3>Schedule or Update an Existing Order</h3>
            <p>
              Scheduling uses the backend's dedicated PATCH endpoint.
              Updating requires all request fields shown below.
            </p>

            <div className="radiology-form">
              <Field
                label="Order ID"
                type="number"
                value={orderId}
                onChange={setOrderId}
                required
              />
              <Field
                label="Patient ID"
                type="number"
                value={orderForm.patientId}
                onChange={(v) => setField(setOrderForm, "patientId", v)}
              />
              <Field
                label="Consultation ID"
                type="number"
                value={orderForm.consultationId}
                onChange={(v) => setField(setOrderForm, "consultationId", v)}
              />
              <Field
                label="Doctor ID"
                type="number"
                value={orderForm.doctorId}
                onChange={(v) => setField(setOrderForm, "doctorId", v)}
              />
              <label className="radiology-field">
                <span>Test ID</span>
                <select
                  value={orderForm.testId}
                  onChange={(event) =>
                    setField(setOrderForm, "testId", event.target.value)
                  }
                >
                  <option value="">Select test</option>
                  {tests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.id} — {test.testName}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Priority"
                value={orderForm.priority}
                onChange={(v) => setField(setOrderForm, "priority", v)}
              />
              <Field
                label="Status"
                value={orderForm.status}
                onChange={(v) => setField(setOrderForm, "status", v)}
              />

              <div className="radiology-actions">
                <button
                  type="button"
                  disabled={loading || !orderId.trim()}
                  onClick={scheduleOrder}
                >
                  Schedule Order
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={loading || !orderId.trim()}
                  onClick={updateOrder}
                >
                  Update Order
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "reports" && (
        <>
          <section className="radiology-card">
            <h2>Submit Radiology Report</h2>

            <form className="radiology-form" onSubmit={submitReport}>
              <Field
                label="Radiology Order ID"
                type="number"
                value={reportForm.radiologyOrderId}
                onChange={(v) => setField(setReportForm, "radiologyOrderId", v)}
                required
              />
              <Field
                label="Patient ID"
                type="number"
                value={reportForm.patientId}
                onChange={(v) => setField(setReportForm, "patientId", v)}
                required
              />
              <Field
                label="Reported By"
                value={reportForm.reportedBy}
                onChange={(v) => setField(setReportForm, "reportedBy", v)}
                required
              />
              <TextAreaField
                label="Findings"
                value={reportForm.findings}
                onChange={(v) => setField(setReportForm, "findings", v)}
                required
              />
              <TextAreaField
                label="Impression"
                value={reportForm.impression}
                onChange={(v) => setField(setReportForm, "impression", v)}
                required
              />

              <button type="submit" disabled={loading}>
                Submit Report
              </button>
            </form>
          </section>

          <section className="radiology-card">
            <h2>Patient Radiology Report History</h2>

            <div className="radiology-search">
              <Field
                label="Patient ID"
                type="number"
                value={reportPatientId}
                onChange={setReportPatientId}
                required
              />
              <button
                type="button"
                disabled={loading || !reportPatientId.trim()}
                onClick={searchPatientReports}
              >
                Search Reports
              </button>
            </div>
          </section>

          <section className="radiology-card">
            <h2>Verify Radiology Report</h2>

            <div className="radiology-form">
              <Field
                label="Report ID"
                type="number"
                value={reportId}
                onChange={setReportId}
                required
              />
              <Field
                label="Verified By"
                value={verifiedBy}
                onChange={setVerifiedBy}
                required
              />
              <button
                type="button"
                disabled={loading || !reportId.trim() || !verifiedBy.trim()}
                onClick={verifyReport}
              >
                Verify Report
              </button>
            </div>
          </section>
        </>
      )}

      {loading && <p className="radiology-loading">Processing request...</p>}
      <ResponseViewer data={output} />
    </main>
  );
}
