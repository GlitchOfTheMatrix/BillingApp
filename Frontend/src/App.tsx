import { useState, useEffect } from "react";
import Preview from "./Components/Preview/QuotationPreview";
import Editor from "./Components/Editor/Editor";
import Layout from "./Components/Layout/Layout";
import DashboardView from "./Components/Views/DashboardView";
import QuotationView from "./Components/Views/QuotationView";
import ProformaView from "./Components/Views/ProformaView";
import InvoiceView from "./Components/Views/InvoiceView";
import ProformaPreview from "./Components/Preview/ProformaPreview";
import InvoicePreview from "./Components/Preview/InvoicePreview";
import type { QuotationItem, QuotationDocument } from "./types";

const defaultItems: QuotationItem[] = [
  {
    id: 1,
    sNo: "1",
    description:
      "MAXQDA Analytic Pro Academia\n- FIVE SINGLE USER(S)\n- THREE Year(s) Subscription\nHSN Code : 997331",
    qty: "1\n(one)",
    rate: "3,11,000.00",
    per: "--",
    total: "3,11,000.00",
  },
  {
    id: 2,
    sNo: "2",
    description:
      "AI Assist Premium Academia\n- ONE Year Subscription\nTranscription (feature activation)+\n-60 free transcription minutes\nHSN Code : 997331",
    qty: "1\n(one)",
    rate: "59,000.00",
    per: "--",
    total: "59,000.00",
  },
  {
    id: 3,
    sNo: "3",
    description:
      "MAXQDA TeamCloud Academia\n- ONE CLOUD SPACE ONE Year Subscription\n- 25GB Cloud Storage\n- 1 team lead and up to 4 team members per license\nHSN Code : 997331",
    qty: "1\n(one)",
    rate: "24,800.00",
    per: "--",
    total: "24,800.00",
  },
];

const mockInitialQuotations: QuotationDocument[] = [
  {
    id: "QT-26-001",
    date: "2026-06-15",
    clientName: "Acme Corp",
    amount: "₹ 3,94,800.00",
    items: defaultItems,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quotationWorkflow, setQuotationWorkflow] = useState<
    "none" | "editor" | "preview" | "proforma-preview" | "invoice-preview"
  >("none");
  const [quotations, setQuotations] = useState<QuotationDocument[]>(() => {
    const saved = localStorage.getItem("billingAppQuotations");
    return saved ? JSON.parse(saved) : mockInitialQuotations;
  });
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("billingAppQuotations", JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const id = params.get("id");
    if (view) {
      if (id) setActiveDocumentId(id);
      setQuotationWorkflow(view as any);
    }
  }, []);

  const activeDocument = quotations.find((q) => q.id === activeDocumentId);
  const editorItems = activeDocument ? activeDocument.items : defaultItems;

  const handleSaveItems = (items: QuotationItem[]) => {
    if (activeDocumentId) {
      setQuotations(
        quotations.map((q) =>
          q.id === activeDocumentId ? { ...q, items } : q,
        ),
      );
    } else {
      const newId = `QT-26-${String(quotations.length + 1).padStart(3, "0")}`;
      const newDoc: QuotationDocument = {
        id: newId,
        date: new Date().toISOString().split("T")[0],
        clientName: "New Client",
        amount: "₹ 0.00",
        items,
      };
      setQuotations([...quotations, newDoc]);
      setActiveDocumentId(newId);
    }
  };

  const handleDeleteQuotation = (id: string) => {
    setQuotations(quotations.filter((q) => q.id !== id));
    if (activeDocumentId === id) setActiveDocumentId(null);
  };

  if (quotationWorkflow === "preview") {
    return (
      <Preview
        items={editorItems}
        onBack={() => window.close()}
      />
    );
  }

  if (quotationWorkflow === "proforma-preview") {
    return (
      <ProformaPreview
        items={editorItems}
        onBack={() => window.close()}
      />
    );
  }

  if (quotationWorkflow === "invoice-preview") {
    return (
      <InvoicePreview
        items={editorItems}
        onBack={() => window.close()}
      />
    );
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab !== "quotation" && tab !== "proforma" && tab !== "invoice") {
          setQuotationWorkflow("none");
        } else if (tab === "proforma" || tab === "invoice") {
          setQuotationWorkflow("none");
        }
      }}
    >
      {activeTab === "dashboard" && <DashboardView />}

      {activeTab === "quotation" && quotationWorkflow === "none" && (
        <QuotationView
          quotations={quotations}
          onGenerateNew={() => {
            setActiveDocumentId(null);
            setQuotationWorkflow("editor");
          }}
          onEdit={(id) => {
            setActiveDocumentId(id);
            setQuotationWorkflow("editor");
          }}
          onDelete={handleDeleteQuotation}
        />
      )}

      {activeTab === "quotation" && quotationWorkflow === "editor" && (
        <div>
          <button
            onClick={() => setQuotationWorkflow("none")}
            style={{
              marginBottom: "20px",
              background: "#ccc",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Back to Quotations
          </button>
          <Editor
            items={editorItems}
            setItems={handleSaveItems}
            onGenerate={() => {
              let id = activeDocumentId;
              if (!id) {
                id = `QT-26-${String(quotations.length + 1).padStart(3, "0")}`;
                const newDoc: QuotationDocument = {
                  id,
                  date: new Date().toISOString().split("T")[0],
                  clientName: "New Client",
                  amount: "₹ 0.00",
                  items: editorItems,
                };
                const newQuotations = [...quotations, newDoc];
                setQuotations(newQuotations);
                localStorage.setItem(
                  "billingAppQuotations",
                  JSON.stringify(newQuotations),
                );
              } else {
                localStorage.setItem(
                  "billingAppQuotations",
                  JSON.stringify(quotations),
                );
              }
              window.open(`?view=preview&id=${id}`, "_blank");
            }}
          />
        </div>
      )}

      {activeTab === "proforma" && (
        <ProformaView
          quotations={quotations}
          onGenerateProforma={(id) => {
            window.open(`?view=proforma-preview&id=${id}`, "_blank");
          }}
        />
      )}

      {activeTab === "invoice" && (
        <InvoiceView
          quotations={quotations}
          onGenerateInvoice={(id) => {
            window.open(`?view=invoice-preview&id=${id}`, "_blank");
          }}
        />
      )}
    </Layout>
  );
}
