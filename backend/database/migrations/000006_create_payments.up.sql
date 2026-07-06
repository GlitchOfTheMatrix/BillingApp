CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    invoice_id UUID NOT NULL REFERENCES documents(id),

    payment_date DATE NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    mode TEXT NOT NULL,

    utr_number TEXT,

    bank_name TEXT,

    status TEXT NOT NULL,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice_id
ON payments(invoice_id);