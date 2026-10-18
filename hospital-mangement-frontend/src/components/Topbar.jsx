
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Search } from "lucide-react";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getRoles(user) {
  const rawRoles = user?.roles ?? user?.authorities ??
    (user?.role ? [user.role] : []);

  const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

  return roles
    .map((role) =>
      typeof role === "string"
        ? role
        : role?.roleName ?? role?.name ?? role?.authority ?? ""
    )
    .map((role) => String(role).replace(/^ROLE_/, "").toUpperCase())
    .filter(Boolean);
}

function getDisplayName(user) {
  return (
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.username ||
    "User"
  );
}

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const user = getUser();
  const userName = getDisplayName(user);
  const roles = getRoles(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button menu-toggle"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="topbar-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search patients, doctors..."
          aria-label="Search"
        />
        <span className="search-shortcut">Search</span>
      </div>

      <div className="topbar-actions">
        <Link
          to="/notifications"
          className="icon-button notification-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
        </Link>

        <div className="topbar-user">
          <div className="user-avatar">
            {String(userName).trim().charAt(0).toUpperCase() || "U"}
          </div>

          <div className="topbar-user-text">
            <strong>{userName}</strong>
            <span>
              {roles.length
                ? roles.map((role) => role.replaceAll("_", " ")).join(", ")
                : "Hospital staff"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="icon-button topbar-logout"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
