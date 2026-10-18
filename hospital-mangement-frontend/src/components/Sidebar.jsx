
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Pill,
  Stethoscope,
  Users,
  X,
  HeartPulse,
  Layers,
  FlaskConical,
  ScanLine,
  BedDouble,
  Siren,
  Scissors,
  Receipt,
  ShieldCheck,
  Clipboard,
  Bell,
  LogOut,
} from "lucide-react";

const ADMIN = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];
const FRONT_DESK = ["RECEPTIONIST"];
const CLINICAL = ["DOCTOR", "NURSE"];
const PHARMACY = ["PHARMACIST"];
const LAB = ["LAB_TECHNICIAN", "LAB_STAFF"];
const RADIOLOGY = ["RADIOLOGIST", "RADIOLOGY_TECHNICIAN"];

const navigationItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  {
    label: "Patients",
    path: "/patients",
    icon: Users,
    roles: [...ADMIN, ...FRONT_DESK, ...CLINICAL],
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    roles: [...ADMIN, ...FRONT_DESK, ...CLINICAL],
  },
  {
    label: "Doctors",
    path: "/doctors",
    icon: Stethoscope,
    roles: [...ADMIN, ...FRONT_DESK, ...CLINICAL],
  },
  {
    label: "Patient Visits",
    path: "/visits",
    icon: ClipboardList,
    roles: [...ADMIN, ...FRONT_DESK, ...CLINICAL],
  },
  {
    label: "Queue Management",
    path: "/queue",
    icon: Activity,
    roles: [...ADMIN, ...FRONT_DESK, ...CLINICAL],
  },
  {
    label: "Pharmacy",
    path: "/pharmacy",
    icon: Pill,
    roles: [...ADMIN, ...PHARMACY],
  },
  {
    label: "Consultation",
    path: "/consultations",
    icon: Stethoscope,
    roles: [...ADMIN, "DOCTOR"],
  },
  {
    label: "Vitals & Symptoms",
    path: "/clinical-observations",
    icon: HeartPulse,
    roles: [...ADMIN, ...CLINICAL],
  },
  {
    label: "Prescriptions",
    path: "/prescriptions/new",
    icon: Pill,
    roles: [...ADMIN, "DOCTOR", "PHARMACIST"],
  },
  {
    label: "Medicines",
    path: "/medicines",
    icon: Pill,
    roles: [...ADMIN, ...PHARMACY],
  },
  {
    label: "Medicine Batches & Stock",
    path: "/medicine-batches",
    icon: Layers,
    roles: [...ADMIN, ...PHARMACY],
  },
  {
    label: "Pharmacy Dispensing",
    path: "/pharmacy-dispensing",
    icon: Pill,
    roles: [...ADMIN, ...PHARMACY],
  },
  {
    label: "Laboratory",
    path: "/laboratory",
    icon: FlaskConical,
    roles: [...ADMIN, ...LAB, "DOCTOR"],
  },
  {
    label: "Radiology Management",
    path: "/radiology",
    icon: ScanLine,
    roles: [...ADMIN, ...RADIOLOGY, "DOCTOR"],
  },
  {
    label: "Inpatient Management",
    path: "/inpatient",
    icon: BedDouble,
    roles: [...ADMIN, ...CLINICAL],
  },
  {
    label: "Nursing Management",
    path: "/nursing",
    icon: HeartPulse,
    roles: [...ADMIN, "NURSE"],
  },
  {
    label: "Emergency Management",
    path: "/emergency",
    icon: Siren,
    roles: [...ADMIN, ...CLINICAL],
  },
  {
    label: "Surgery Management",
    path: "/surgery",
    icon: Scissors,
    roles: [...ADMIN, "DOCTOR"],
  },
  {
    label: "Billing Management",
    path: "/billing",
    icon: Receipt,
    roles: [...ADMIN, ...FRONT_DESK],
  },
  {
    label: "Insurance Management",
    path: "/insurance",
    icon: ShieldCheck,
    roles: [...ADMIN, ...FRONT_DESK],
  },
  {
    label: "Discharge Management",
    path: "/discharge",
    icon: Clipboard,
    roles: [...ADMIN, ...CLINICAL],
  },
  {
    label: "Follow-up Management",
    path: "/follow-ups",
    icon: CalendarDays,
    roles: [...ADMIN, ...FRONT_DESK, ...CLINICAL],
  },
  {
    label: "Notification Management",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Reports Management",
    path: "/reports",
    icon: ClipboardList,
    roles: ADMIN,
  },
  {
    label: "Audit Logs",
    path: "/audit-logs",
    icon: ShieldCheck,
    roles: ADMIN,
  },
  {
    label: "User Management",
    path: "/users",
    icon: Users,
    roles: ADMIN,
  },
];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getRoles(user) {
  const rawRoles = user?.roles ?? user?.authorities ?? [];

  const roles = Array.isArray(rawRoles)
    ? rawRoles
    : typeof rawRoles === "string"
      ? [rawRoles]
      : [];

  return roles
    .map((role) =>
      typeof role === "string"
        ? role
        : role?.roleName ?? role?.name ?? role?.authority ?? ""
    )
    .map((role) => String(role).replace(/^ROLE_/, "").toUpperCase())
    .filter(Boolean);
}

function getName(user) {
  return (
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.username ||
    "Hospital User"
  );
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const user = getUser();
  const roles = getRoles(user);
  const userName = getName(user);

  const isAdmin = roles.some((role) => ADMIN.includes(role));

  const visibleItems = navigationItems.filter((item) => {
    if (!item.roles) return true;
    if (isAdmin) return true;

    return item.roles.some((role) => roles.includes(role));
  });

  const userRole = roles.length
    ? roles.map((role) => role.replaceAll("_", " ")).join(", ")
    : "Staff";

  const handleLogout = () => {
    // Remove only authentication-related values; preserve unrelated app settings.
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // If your app stores a separate refresh token, remove it here too.
    sessionStorage.clear();

    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${open ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Activity size={22} />
          </div>

          <div className="sidebar-brand-copy">
            <span className="sidebar-brand-name">CarePoint</span>
            <span className="sidebar-brand-subtitle">
              Hospital Management
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {visibleItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
              onClick={onClose}
            >
              <Icon size={21} strokeWidth={1.9} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user-avatar">
            {String(userName).trim().charAt(0).toUpperCase() || "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={19} />
          </button>
        </div>
      </aside>
    </>
  );
}
