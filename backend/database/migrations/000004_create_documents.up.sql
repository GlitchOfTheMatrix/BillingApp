CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_type TEXT NOT NULL CHECK (
        document_type IN ('quotation','proforma','tax_invoice')
    ),

    document_number TEXT NOT NULL UNIQUE,

    document_date DATE NOT NULL,

    client_id UUID NOT NULL REFERENCES clients(id),

    source_document_id UUID REFERENCES documents(id),

    order_number TEXT,
    order_date DATE,

    status TEXT NOT NULL CHECK (
        status IN ('draft','sent','accepted','paid','cancelled')
    ),

    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0,

    cgst NUMERIC(12,2) NOT NULL DEFAULT 0,
    sgst NUMERIC(12,2) NOT NULL DEFAULT 0,
    igst NUMERIC(12,2) NOT NULL DEFAULT 0,

    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,

    amount_in_words TEXT,

    remarks TEXT,

    created_by UUID NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_client_id
ON documents(client_id);

CREATE INDEX idx_documents_created_by
ON documents(created_by);

CREATE INDEX idx_documents_source_document
ON documents(source_document_id);

CREATE INDEX idx_documents_document_type
ON documents(document_type);