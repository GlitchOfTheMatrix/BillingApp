import "./Editor.css";
import type { QuotationItem } from '../../types';

interface EditorProps {
  items: QuotationItem[];
  setItems: (items: QuotationItem[]) => void;
  onGenerate: () => void;
}

export default function Editor({ items, setItems, onGenerate }: EditorProps) {
  const handleChange = (id: number, field: string, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleAdd = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      {
        id: newId,
        sNo: String(newId),
        description: "",
        qty: "1\n(one)",
        rate: "0.00",
        per: "--",
        total: "0.00",
      },
    ]);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="editor-container">
      <h2>Quotation Items Editor</h2>
      <table className="editor-table">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Software Licensing Services</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Per</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  value={item.sNo}
                  onChange={(e) => handleChange(item.id, "sNo", e.target.value)}
                />
              </td>
              <td>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleChange(item.id, "description", e.target.value)
                  }
                  rows={5}
                />
              </td>
              <td>
                <textarea
                  value={item.qty}
                  onChange={(e) => handleChange(item.id, "qty", e.target.value)}
                  rows={2}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.rate}
                  onChange={(e) =>
                    handleChange(item.id, "rate", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.per}
                  onChange={(e) => handleChange(item.id, "per", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.total}
                  onChange={(e) =>
                    handleChange(item.id, "total", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="editor-actions">
        <button className="add-btn" onClick={handleAdd}>
          Add Item
        </button>
        <button className="generate-btn-editor" onClick={onGenerate}>
          Generate Quotation
        </button>
      </div>
    </div>
  );
}
