
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileText,
  HeartPulse,
  Hospital,
  Pill,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import dashboardService from "../services/dashboardService";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response;

function getRoles(user) {
  const roles = user?.roles ?? user?.authorities ?? [];

  if (!Array.isArray(roles)) return [];

  return roles
    .map((role) => {
      if (typeof role === "string") return role;
      return role?.roleName ?? role?.name ?? role?.authority ?? "";
    })
    .map((role) => role.replace(/^ROLE_/, "").toUpperCase())
    .filter(Boolean);
}

function getDisplayName(user) {
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return fullName || user?.username || "User";
}

// Counts records only when the API returns an array.
// A number or other report structure is not guessed to be a record count.
function getRecordCount(response) {
  const result = unwrap(response);

  if (Array.isArray(result)) return result.length;

  if (Array.isArray(result?.data)) return result.data.length;

  if (Array.isArray(result?.records)) return result.records.length;

  if (Array.isArray(result?.items)) return result.items.length;

  return null;
}

function formatCount(value) {
  return value === null || value === undefined
    ? "—"
    : Number(value).toLocaleString();
}

const actionDefinitions = [
  {
    title: "Register a patient",
    description: "Create a new patient record",
    icon: Users,
    color: "blue",
    path: "/patients",
    roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"],
  },
  {
    title: "Book an appointment",
    description: "Schedule a patient visit",
    icon: CalendarDays,
    color: "purple",
    path: "/appointments",
    roles: [
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "RECEPTIONIST",
      "DOCTOR",
    ],
  },
  {
    title: "View doctor directory",
    description: "Browse doctors and specialties",
    icon: HeartPulse,
    color: "green",
    path: "/doctors",
    roles: [
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "RECEPTIONIST",
      "DOCTOR",
      "NURSE",
    ],
  },
  {
    title: "Manage users",
    description: "Manage staff accounts and roles",
    icon: ShieldCheck,
    color: "blue",
    path: "/users",
    roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
  },
  {
    title: "Laboratory",
    description: "Review laboratory workflows",
    icon: Activity,
    color: "purple",
    path: "/laboratory",
    roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"],
  },
  {
    title: "Pharmacy",
    description: "Manage medicines and stock",
    icon: Pill,
    color: "green",
    path: "/medicine-batches",
    roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"],
  },
  {
    title: "Nursing",
    description: "Open nursing workflows",
    icon: ClipboardList,
    color: "blue",
    path: "/nursing",
    roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"],
  },
  {
    title: "Hospital reports",
    description: "Review hospital report summaries",
    icon: FileText,
    color: "purple",
    path: "/reports",
    roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
  },
];

export default function Dashboard() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [reports, setReports] = useState({
    patients: null,
    appointments: null,
    financial: null,
    admissions: null,
  });

  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [reportError, setReportError] = useState("");

  const roles = useMemo(() => getRoles(user), [user]);
  const isAdmin = roles.some((role) =>
    ["SUPER_ADMIN", "HOSPITAL_ADMIN"].includes(role)
  );

  const loadDashboard = async () => {
    setLoading(true);
    setProfileError("");
    setReportError("");

    const results = await Promise.allSettled([
      dashboardService.getProfile(),
      dashboardService.getPatients(),
      dashboardService.getAppointments(),
      dashboardService.getFinancial(),
      dashboardService.getAdmissions(),
    ]);

    const [profile, patients, appointments, financial, admissions] = results;

    if (profile.status === "fulfilled") {
      const profileData = unwrap(profile.value);
      const updatedUser = profileData?.user ?? profileData;

      if (updatedUser && typeof updatedUser === "object") {
        setUser((previous) => {
          const mergedUser = { ...previous, ...updatedUser };

          localStorage.setItem("user", JSON.stringify(mergedUser));

          return mergedUser;
        });
      }
    } else {
      setProfileError(
        "Could not refresh your profile. Showing saved account information."
      );
    }

    const nextReports = {
      patients: patients.status === "fulfilled" ? patients.value : null,
      appointments:
        appointments.status === "fulfilled" ? appointments.value : null,
      financial: financial.status === "fulfilled" ? financial.value : null,
      admissions:
        admissions.status === "fulfilled" ? admissions.value : null,
    };

    setReports(nextReports);

    if (
      patients.status === "rejected" ||
      appointments.status === "rejected" ||
      financial.status === "rejected" ||
      admissions.status === "rejected"
    ) {
      setReportError(
        "Some report data could not be loaded. Check your permissions and backend responses."
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const quickActions = actionDefinitions.filter((action) =>
    action.roles.some((role) => roles.includes(role))
  );

  const stats = [
    {
      title: "Total patients",
      value: formatCount(getRecordCount(reports.patients)),
      note: reports.patients === null ? "Report unavailable" : "Patient report",
      icon: Users,
      color: "blue",
    },
    {
      title: "Appointments",
      value: formatCount(getRecordCount(reports.appointments)),
      note:
        reports.appointments === null
          ? "Report unavailable"
          : "Appointment report",
      icon: CalendarDays,
      color: "purple",
    },
    {
      title: "Admissions",
      value: formatCount(getRecordCount(reports.admissions)),
      note:
        reports.admissions === null ? "Report unavailable" : "Admission report",
      icon: Hospital,
      color: "orange",
    },
    {
      title: "Financial report",
      value: reports.financial === null ? "—" : "Available",
      note: reports.financial === null
        ? "Report unavailable"
        : "Open reports for details",
      icon: Activity,
      color: "green",
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="page-heading">
        <div>
          <span className="eyebrow">
            {isAdmin ? "ADMINISTRATIVE OVERVIEW" : "MY WORKSPACE"}
          </span>

          <h1>Welcome back, {getDisplayName(user)}</h1>

          <p>
            {roles.length
              ? `Your workspace for ${roles
                  .map((role) => role.replaceAll("_", " "))
                  .join(", ")}.`
              : "Here's your hospital workspace at a glance."}
          </p>
        </div>

        <div className="today-chip">
          <CalendarDays size={16} />
          <span>
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {profileError && (
        <p className="dashboard-message" role="status">{profileError}</p>
      )}

      {reportError && (
        <p className="dashboard-message" role="status">{reportError}</p>
      )}

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>{isAdmin ? "Hospital overview" : "Report overview"}</h2>
            <p>Information from your existing backend report endpoints</p>
          </div>

          <button
            type="button"
            className="dashboard-refresh"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="stats-grid" aria-label="Hospital statistics">
          {stats.map(({ title, value, note, icon: Icon, color }) => (
            <article className="stat-card" key={title}>
              <div className={`stat-icon icon-${color}`}>
                <Icon size={21} />
              </div>
              <p className="stat-title">{title}</p>
              <h2>{loading ? "…" : value}</h2>
              <span className="stat-note">{note}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Quick actions</h2>
            <p>Shortcuts available for your assigned role</p>
          </div>
        </div>

        {quickActions.length ? (
          <div className="quick-actions-grid">
            {quickActions.map(
              ({ title, description, icon: Icon, color, path }) => (
                <Link
                  className="quick-action-card"
                  to={path}
                  key={title}
                >
                  <div className={`quick-action-icon icon-${color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="quick-action-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ArrowRight className="quick-action-arrow" size={19} />
                </Link>
              )
            )}
          </div>
        ) : (
          <p>
            No role-specific shortcuts are configured for this account yet.
            Contact your hospital administrator if this is unexpected.
          </p>
        )}
      </section>

      <section className="welcome-banner">
        <div className="welcome-banner-icon">
          <Stethoscope size={28} />
        </div>
        <div>
          <h2>One connected healthcare workspace</h2>
          <p>
            Use the shortcuts above to open the modules available to your
            account. Access to protected information is still enforced by
            the backend.
          </p>
        </div>
      </section>
    </div>
  );
}
