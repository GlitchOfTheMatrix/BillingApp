import { Route, Routes } from "react-router-dom";

import { ROUTES } from "./routes";
import ProtectedRoute from "../../components/guards/ProtectedRoute";
import PublicRoute from "../../components/guards/PublicRoute";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import CompanyPage from "../../pages/company/CompanyPage";
import ClientsPage from "../../pages/clients/ClientsPage";
import DocumentsPage from "../../pages/documents/DocumentsPage";
import CreateDocumentPage from "../../pages/documents/CreateDocumentPage";
import EditDocumentPage from "../../pages/documents/EditDocumentPage";
import ViewDocumentPage from "../../pages/documents/ViewDocumentPage";
import PaymentsPage from "../../pages/payments/PaymentsPage";
import NotFoundPage from "../../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

          <Route path={ROUTES.COMPANY} element={<CompanyPage />} />

          <Route path={ROUTES.CLIENTS} element={<ClientsPage />} />

          <Route path={ROUTES.DOCUMENTS} element={<DocumentsPage />} />

          <Route
            path={ROUTES.CREATE_DOCUMENT}
            element={<CreateDocumentPage />}
          />

          <Route path={ROUTES.EDIT_DOCUMENT} element={<EditDocumentPage />} />

          <Route
            path={ROUTES.VIEW_DOCUMENT}
            element={<ViewDocumentPage />}
          />

          <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
