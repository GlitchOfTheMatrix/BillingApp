import { Outlet } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar/Navbar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.contentWrapper}>
        <Navbar />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
