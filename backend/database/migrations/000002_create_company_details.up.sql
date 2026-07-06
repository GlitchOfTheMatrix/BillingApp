CREATE TABLE company_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_name TEXT NOT NULL,

    gst_number TEXT,
    pan_number TEXT,
    msme_number TEXT,

    address TEXT NOT NULL,

    phone TEXT,
    email TEXT,
    website TEXT,

    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    branch TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);