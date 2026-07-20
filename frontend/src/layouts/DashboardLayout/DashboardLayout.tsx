import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar/Navbar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.contentWrapper}>
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
