
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BedDouble,
  CalendarDays,
  ClipboardList,
  DollarSign,
  FlaskConical,
  Pill,
  RefreshCw,
  Users,
} from "lucide-react";

import reportService from "../services/reportService";
import "../styles/reportManagement.css";

const reportOptions = [
  {
    id: "patients",
    label: "Patients",
    icon: Users,
    load: reportService.getPatients,
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: CalendarDays,
    load: reportService.getAppointments,
  },
  {
    id: "financial",
    label: "Financial",
    icon: DollarSign,
    load: reportService.getFinancial,
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    icon: Pill,
    load: reportService.getPharmacy,
  },
  {
    id: "laboratory",
    label: "Laboratory",
    icon: FlaskConical,
    load: reportService.getLaboratory,
  },
  {
    id: "admissions",
    label: "Admissions",
    icon: BedDouble,
    load: reportService.getAdmissions,
  },
];

const reportFields = {
  patients: [
    { key: "totalPatients", label: "Total Patients" },
    { key: "totalVisits", label: "Total Patient Visits" },
  ],

  appointments: [
    { key: "totalAppointments", label: "Total Appointments" },
    { key: "todaysAppointments", label: "Today's Appointments" },
    { key: "completedAppointments", label: "Completed" },
    { key: "cancelledAppointments", label: "Cancelled" },
    { key: "noShowAppointments", label: "No-Show Appointments" },
  ],

  financial: [
    { key: "totalBills", label: "Total Bills" },
    {
      key: "outstandingAmount",
      label: "Outstanding Amount",
      format: "currency",
    },
    {
      key: "dailyRevenue",
      label: "Today's Revenue",
      format: "currency",
    },
    {
      key: "monthlyRevenue",
      label: "This Month's Revenue",
      format: "currency",
    },
    { key: "totalRefundRecords", label: "Refund Records" },
    { key: "totalInsuranceClaims", label: "Insurance Claims" },
  ],

  pharmacy: [
    { key: "totalMedicines", label: "Total Medicines" },
    {
      key: "currentStockQuantity",
      label: "Current Stock Quantity",
    },
    { key: "expiredBatches", label: "Expired Batches" },
    {
      key: "lowStockMedicineCount",
      label: "Low-Stock Medicines",
    },
    {
      key: "totalPharmacyTransactions",
      label: "Pharmacy Transactions",
    },
  ],

  laboratory: [
    { key: "totalLabOrders", label: "Total Lab Orders" },
    { key: "pendingLabOrders", label: "Pending Lab Orders" },
    { key: "completedLabOrders", label: "Completed Lab Orders" },
    { key: "totalLabReports", label: "Total Lab Reports" },
    { key: "completedReports", label: "Completed Reports" },
  ],

  admissions: [
    { key: "totalAdmissions", label: "Total Admissions" },
    { key: "currentPatients", label: "Currently Admitted" },
    { key: "dischargedPatients", label: "Discharged Patients" },
    { key: "totalBeds", label: "Total Beds" },
    { key: "availableBeds", label: "Available Beds" },
    { key: "occupiedBeds", label: "Occupied Beds" },
  ],
};

function formatValue(value, format) {
  if (value === null || value === undefined) return "—";

  if (format === "currency") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value));
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN").format(value);
  }

  return String(value);
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Unable to load this report."
  );
}

export default function ReportsManagement() {
  const [activeReport, setActiveReport] = useState("patients");
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled(
      reportOptions.map(async (option) => ({
        id: option.id,
        report: await option.load(),
      }))
    );

    const nextReports = {};
    const failedReports = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        nextReports[result.value.id] = result.value.report;
      } else {
        failedReports.push(reportOptions[index].label);
      }
    });

    setReports((previous) => ({
      ...previous,
      ...nextReports,
    }));

    if (failedReports.length > 0) {
      setError(
        `Could not load: ${failedReports.join(", ")}. Try refreshing.`
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const selectedOption = reportOptions.find(
    (option) => option.id === activeReport
  );

  const currentReport = reports[activeReport];
  const data = currentReport?.data ?? {};
  const fields = reportFields[activeReport] ?? [];

  const availableFields = fields.filter(
    (field) => Object.hasOwn(data, field.key)
  );

  const extraEntries = Object.entries(data).filter(
    ([key, value]) =>
      !fields.some((field) => field.key === key) &&
      value !== null &&
      typeof value !== "object"
  );

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports Management</h1>
          <p>
            Review hospital statistics across patients, appointments,
            finances, pharmacy, laboratory, and admissions.
          </p>
        </div>

        <button
          type="button"
          className="reports-refresh-button"
          onClick={loadReports}
          disabled={loading}
        >
          <RefreshCw size={17} />
          {loading ? "Refreshing..." : "Refresh Reports"}
        </button>
      </div>

      {error && (
        <div className="reports-error" role="alert">
          {error}
        </div>
      )}

      <div className="reports-overview">
        <div className="reports-overview-icon">
          <Activity size={25} />
        </div>
        <div>
          <h2>Hospital Overview</h2>
          <p>
            Select a report category to view the available statistics.
          </p>
        </div>
      </div>

      <div className="reports-tabs">
        {reportOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              className={
                activeReport === option.id
                  ? "reports-tab active"
                  : "reports-tab"
              }
              onClick={() => setActiveReport(option.id)}
            >
              <Icon size={18} />
              {option.label}
            </button>
          );
        })}
      </div>

      <section className="reports-panel">
        <div className="reports-panel-heading">
          <div>
            <h2>{currentReport?.reportName || selectedOption?.label + " Report"}</h2>
            <p>
              {availableFields.length} statistics available in this report
            </p>
          </div>
          <ClipboardList size={24} />
        </div>

        {loading && !currentReport ? (
          <div className="reports-empty">Loading report data...</div>
        ) : !currentReport ? (
          <div className="reports-empty">
            No report data is available. Check the backend and try again.
          </div>
        ) : availableFields.length === 0 && extraEntries.length === 0 ? (
          <div className="reports-empty">
            This report has no statistics to display.
          </div>
        ) : (
          <>
            <div className="reports-stat-grid">
              {availableFields.map((field) => (
                <div className="reports-stat-card" key={field.key}>
                  <span>{field.label}</span>
                  <strong>
                    {formatValue(data[field.key], field.format)}
                  </strong>
                </div>
              ))}

              {extraEntries.map(([key, value]) => (
                <div className="reports-stat-card" key={key}>
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  <strong>{formatValue(value)}</strong>
                </div>
              ))}
            </div>

            {activeReport === "appointments" &&
              data.appointmentsByDoctor &&
              Object.keys(data.appointmentsByDoctor).length > 0 && (
                <div className="reports-detail-section">
                  <h3>Appointments by Doctor ID</h3>
                  <div className="reports-doctor-list">
                    {Object.entries(data.appointmentsByDoctor).map(
                      ([doctorId, count]) => (
                        <div
                          className="reports-doctor-row"
                          key={doctorId}
                        >
                          <span>Doctor #{doctorId}</span>
                          <strong>{formatValue(count)}</strong>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {activeReport === "admissions" &&
              Number(data.totalBeds) > 0 && (
                <div className="reports-detail-section">
                  <h3>Bed Occupancy</h3>
                  <div
                    className="reports-progress-track"
                    role="img"
                    aria-label={`${data.occupiedBeds ?? 0} of ${data.totalBeds} beds occupied`}
                  >
                    <div
                      className="reports-progress-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            (Number(data.occupiedBeds ?? 0) /
                              Number(data.totalBeds)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                  <p>
                    {formatValue(data.occupiedBeds ?? 0)} occupied out of{" "}
                    {formatValue(data.totalBeds)} beds
                    {" · "}
                    {(
                      (Number(data.occupiedBeds ?? 0) /
                        Number(data.totalBeds)) *
                      100
                    ).toFixed(1)}
                    % occupancy
                  </p>
                </div>
              )}
          </>
        )}
      </section>
    </div>
  );
}
