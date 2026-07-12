CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    organisation TEXT,

    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,

    gst_number TEXT,

    email TEXT,
    phone TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);