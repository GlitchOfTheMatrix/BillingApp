export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
  },

  COMPANY: {
    GET: "/company-details",
    CREATE: "/company-details",
    UPDATE: "/company-details/:id",
    DELETE: "/company-details/:id",
  },

  CLIENTS: {
    LIST: "/clients",
    GET: "/clients/:id",
    CREATE: "/clients",
    UPDATE: "/clients/:id",
    DELETE: "/clients/:id",
  },

  DOCUMENTS: {
    LIST: "/documents",
    GET: "/documents/:id",
    CREATE: "/documents",
    UPDATE: "/documents/:id",
    DELETE: "/documents/:id",
    DUPLICATE: "/documents/:id/duplicate",
    PDF: "/documents/:id/pdf",
  },

  PAYMENTS: {
    LIST: "/payments",
    GET: "/payments/:id",
    CREATE: "/payments",
    UPDATE: "/payments/:id",
    DELETE: "/payments/:id",
  },
};
