CREATE TABLE document_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

    serial_no INTEGER NOT NULL,

    software_name TEXT NOT NULL,

    description TEXT,

    hsn_code TEXT,

    license_type TEXT,

    subscription_duration TEXT,

    quantity INTEGER NOT NULL,

    unit TEXT,

    rate NUMERIC(12,2) NOT NULL,

    discount NUMERIC(12,2) NOT NULL DEFAULT 0,

    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,

    total NUMERIC(12,2) NOT NULL,

    extra JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_items_document_id
ON document_items(document_id);