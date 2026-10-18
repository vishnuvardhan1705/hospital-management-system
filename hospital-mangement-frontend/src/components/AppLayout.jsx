
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-panel">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          Hospital Management System
          <span>Healthcare operations workspace</span>
        </footer>
      </div>
    </div>
  );
}
