export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  COMPANY: "/company",
  CLIENTS: "/clients",
  DOCUMENTS: "/documents",
  CREATE_DOCUMENT: "/documents/new",
  EDIT_DOCUMENT: "/documents/:id/edit",
  PAYMENTS: "/payments",
};

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
  },
  {
    label: "Company",
    path: ROUTES.COMPANY,
  },
  {
    label: "Clients",
    path: ROUTES.CLIENTS,
  },
  {
    label: "Documents",
    path: ROUTES.DOCUMENTS,
  },
  {
    label: "Payments",
    path: ROUTES.PAYMENTS,
  },
];
