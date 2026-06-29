import { useRef } from "react";
import "./Preview.css"; // Reuse Preview.css styles
import type { QuotationItem } from "../../types";

import MillenniumLogo from "../../Pictures/MillenniumSystemsLogo.jpeg";
import AtlasLogo from "../../Pictures/Atlas.jpeg";
import MaxQDALogo from "../../Pictures/MaxQDA.jpeg";
import SmartLogo from "../../Pictures/Smart.jpeg";
import NovaPdfLogo from "../../Pictures/NovaPdf.jpeg";
import QuestionProLogo from "../../Pictures/QuestionPro.jpeg";

const EditableSpan = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    contentEditable
    suppressContentEditableWarning
    className={`editable-highlight ${className}`}
  >
    {children}
  </span>
);

interface ProformaPreviewProps {
  items: QuotationItem[];
  onBack?: () => void;
}

export default function ProformaPreview({
  items = [],
  onBack,
}: ProformaPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = () => {
    window.print();
  };

  return (
    <div className="preview-container">
      <div className="action-bar">
        {onBack && (
          <button
            onClick={onBack}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Proforma Tab
          </button>
        )}
        <button className="generate-btn" onClick={handleGeneratePdf}>
          Generate PDF
        </button>
      </div>

      <div ref={previewRef}>
        {/* Header */}
        <div className="header-row">
          <div className="logo-left">
            <img src={MillenniumLogo} alt="Millennium Systems" />
          </div>
          <div className="header-right">
            <h1>MILLENNIUM SYSTEMS</h1>
            <p>2nd Floor, Elegance Tower, Jasola District Center,</p>
            <p>Old Mathura Road, New Delhi - 110025.</p>
            <p>
              <strong>Goods & Services Tax Number : 07AALSLS9222B1Z5</strong>
            </p>
            <p>Udyam Registration [MSME] : UDYAM-DL-05-00023223</p>
            <p>+91 11 42334449 | post@milsys.co.in | ww.milsys.co.in</p>
          </div>
        </div>

        {/* Title */}
        <div className="title-section">
          <h2>PROFORMA INVOICE</h2>
          <div>
            <EditableSpan>PI-2026-27/MS-001</EditableSpan>
          </div>
          <div>
            <EditableSpan>XXth June 2026</EditableSpan>
          </div>
        </div>

        {/* To / Order Info */}
        <div className="info-row">
          <div className="to-section">
            <p>To,</p>
            <div>
              <EditableSpan>Amrita XXXXXXXXXVi dXXXXpeexXXX tham,</EditableSpan>
            </div>
            <div>
              <EditableSpan>AmriXDXXXXtapuri, ClappaDDDDD na P.O.</EditableSpan>
            </div>
            <div>
              <EditableSpan>P.O.. Kerala, India – 6CXXXXX5</EditableSpan>
            </div>
            <div>
              <EditableSpan>GST Number : 32AXXXXXXXXXXXX3EK61ZS</EditableSpan>
            </div>
          </div>
          <table className="order-details-table">
            <tbody>
              <tr>
                <td>Your Order No.</td>
                <td>
                  <EditableSpan>PXXXXXXXXXXXXXX. X x. x</EditableSpan>
                </td>
              </tr>
              <tr>
                <td>Dated</td>
                <td>
                  <EditableSpan>XX/XX/2026</EditableSpan>
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  <EditableSpan>iXXXXXXXXXse@ams.arita.edu</EditableSpan>
                </td>
              </tr>
              <tr>
                <td>Other Details</td>
                <td>
                  <EditableSpan>XXXX. prism project NAME 2026</EditableSpan>
                </td>
              </tr>
              <tr>
                <td>Other Details</td>
                <td>
                  <EditableSpan>XXXX. prism project NAME 2026</EditableSpan>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Table */}
        <table className="main-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Description of Product / Services</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Per</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td style={{ textAlign: "center" }}>
                <strong>
                  <EditableSpan>TEXT TEXT</EditableSpan>
                </strong>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="text-center">
                  <EditableSpan>{item.sNo}</EditableSpan>
                </td>
                <td>
                  {item.description.split("\n").map((line, idx) => {
                    const isBold = idx === 0 || line.includes("HSN Code");
                    return (
                      <div key={idx}>
                        {isBold ? (
                          <strong>
                            <EditableSpan>{line}</EditableSpan>
                          </strong>
                        ) : (
                          <EditableSpan>{line}</EditableSpan>
                        )}
                      </div>
                    );
                  })}
                </td>
                <td className="text-center">
                  {item.qty.split("\n").map((line, idx) => (
                    <div key={idx}>
                      <EditableSpan>{line}</EditableSpan>
                    </div>
                  ))}
                </td>
                <td className="text-right">
                  <EditableSpan>{item.rate}</EditableSpan>
                </td>
                <td className="text-center">
                  <EditableSpan>{item.per}</EditableSpan>
                </td>
                <td className="text-right">
                  <EditableSpan>{item.total}</EditableSpan>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="terms-col">
            <p>
              <strong>Commercial Terms & Conditions</strong>
            </p>
            <p>
              <EditableSpan>
                - Payment due date XXXXth Feb 2026 – 5100%
              </EditableSpan>
            </p>
            <p>
              <EditableSpan>
                - Delivery: Electronic Software Delivery (ESD) via email within
                FIVE business days of receipt of payment.
              </EditableSpan>
            </p>
            <p>
              <EditableSpan>
                - Support: Includes OEM portal-based support.
              </EditableSpan>
            </p>
            <p>
              <EditableSpan>
                - Installation: Onsite/offline installation & support is not
                included.
              </EditableSpan>
            </p>
            <p>
              <EditableSpan>
                - Overdue accounts subject to interest @ 2% per month.
              </EditableSpan>
            </p>
            <p>
              <EditableSpan>- Subject to DELHI JURISDICTION</EditableSpan>
            </p>

            <div style={{ marginTop: "15px" }}>
              <div>
                <EditableSpan>Bank Details for NEFT/RTGS :</EditableSpan>
              </div>
              <div>
                <EditableSpan>ACCOUNT NAME: MILLENNIUM SYSTEMS</EditableSpan>
              </div>
              <div>
                <EditableSpan>ACCOUNT NUMBER: 9110618000</EditableSpan>
              </div>
              <div>
                <EditableSpan>IFSC: UTIB00533</EditableSpan>
              </div>
              <div>
                <EditableSpan>BANK NAME: Axis Bank Limited</EditableSpan>
              </div>
              <div>
                <EditableSpan>BRANCH: Delhi, New Delhi</EditableSpan>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <p>
                <EditableSpan>Enclosures:</EditableSpan>
              </p>
              <p>
                <EditableSpan>
                  Copy of Cancelled Cheque | PAN | GST | MSME
                </EditableSpan>
              </p>
            </div>
          </div>
          <div className="totals-col">
            <table className="totals-table">
              <tbody>
                <tr>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    Sub Total
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    3,94,800.00
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <EditableSpan>Shipping | Installation</EditableSpan>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <EditableSpan>( - ) 5,500.00</EditableSpan>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>IGST @18%</td>
                  <td style={{ textAlign: "right" }}>70,074.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>CGST @ 9%</td>
                  <td style={{ textAlign: "right" }}>0.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>SGST @ 9%</td>
                  <td style={{ textAlign: "right" }}>0.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    Grand Total
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    4,59,374.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="amount-words-container">
          <div style={{ marginBottom: "4px" }}>Amount in words</div>
          <div>Eight five thousand seven hundred eighty six only</div>
        </div>

        {/* Signature */}
        <div className="signature-container">
          <div>
            For <strong>MILLENNIUM SYSTEMS</strong>
          </div>
          <div>Authorized Signatory</div>
        </div>

        {/* Footer Logos */}
        <div
          style={{ textAlign: "center", fontWeight: "bold", marginTop: "15px" }}
        >
          Thank you for your business!
        </div>
        <div className="logos-footer" style={{ marginTop: "10px" }}>
          <img src={AtlasLogo} alt="Atlas.ti" />
          <img src={MaxQDALogo} alt="MAXQDA" />
          <img src={SmartLogo} alt="Smart" />
          <img src={NovaPdfLogo} alt="novaPDF" />
          <img src={QuestionProLogo} alt="QuestionPro" />
        </div>
      </div>
    </div>
  );
}
