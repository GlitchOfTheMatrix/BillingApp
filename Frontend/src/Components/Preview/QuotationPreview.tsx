import { useRef } from 'react';
import './Preview.css';
import type { QuotationItem } from '../../types';

import MillenniumLogo from '../../Pictures/MillenniumSystemsLogo.jpeg';
import AtlasLogo from '../../Pictures/Atlas.jpeg';
import MaxQDALogo from '../../Pictures/MaxQDA.jpeg';
import SmartLogo from '../../Pictures/Smart.jpeg';
import NovaPdfLogo from '../../Pictures/NovaPdf.jpeg';
import QuestionProLogo from '../../Pictures/QuestionPro.jpeg';

const EditableSpan = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span 
    contentEditable 
    suppressContentEditableWarning 
    className={`editable-highlight ${className}`}
  >
    {children}
  </span>
);

interface PreviewProps {
  items: QuotationItem[];
  onBack?: () => void;
}

export default function Preview({ items = [], onBack }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = () => {
    window.print();
  };

  return (
    <div className="preview-container">
      <div className="action-bar">
        {onBack && <button onClick={onBack} style={{marginRight: '10px', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer'}}>Back to Editor</button>}
        <button className="generate-btn" onClick={handleGeneratePdf}>Generate PDF</button>
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
            <p><strong>Goods & Services Tax Number : 07AALSLS9222B1Z5</strong></p>
            <p>Udyam Registration [MSME] : UDYAM-DL-05-00023223</p>
            <p>+91 11 42334449 | post@milsys.co.in | ww.milsys.co.in</p>
          </div>
        </div>

        {/* Title */}
        <div className="title-section">
          <h2>QUOTATION</h2>
          <div><EditableSpan>MS/26-27/GST-0XXXXX</EditableSpan></div>
          <div><EditableSpan>1XXXXXXth June 2026</EditableSpan></div>
        </div>

        {/* To / Order Info */}
        <div className="info-row">
          <div className="to-section">
            <p>To,</p>
            <div><EditableSpan>Amrita dkdkjjdjkd Vidyapedkjjdhdmham,</EditableSpan></div>
            <div><EditableSpan>Amritadmnmndmnpuri, Clnmdnmmnappana</EditableSpan></div>
            <div>P.O.. Kerala,dmmdmmd India – 690 525</div>
            <div><EditableSpan>GST Number : 3SHTdjdmnmdmndmnEK61ZS</EditableSpan></div>
          </div>
          <table className="order-details-table">
            <tbody>
              <tr>
                <td>Your Order No.</td>
                <td><EditableSpan>PXXXXXXXXXXXXXX. X x. x</EditableSpan></td>
              </tr>
              <tr>
                <td>Dated</td>
                <td><EditableSpan>XX/XX/2026</EditableSpan></td>
              </tr>
              <tr>
                <td>Email</td>
                <td><EditableSpan>iXXXXXXXXXse@ams.arita.edu</EditableSpan></td>
              </tr>
              <tr>
                <td>Other Details</td>
                <td><EditableSpan>XXXX. prism project NAME 2026</EditableSpan></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Table */}
        <table className="main-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Software Licensing Services</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Per</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="text-center">
                  <EditableSpan>{item.sNo}</EditableSpan>
                </td>
                <td>
                  {item.description.split('\n').map((line, idx) => {
                    const isBold = idx === 0 || line.includes('HSN Code');
                    return (
                      <div key={idx}>
                        {isBold ? <strong><EditableSpan>{line}</EditableSpan></strong> : <EditableSpan>{line}</EditableSpan>}
                      </div>
                    );
                  })}
                </td>
                <td className="text-center">
                  {item.qty.split('\n').map((line, idx) => (
                    <div key={idx}><EditableSpan>{line}</EditableSpan></div>
                  ))}
                </td>
                <td className="text-right"><EditableSpan>{item.rate}</EditableSpan></td>
                <td className="text-center"><EditableSpan>{item.per}</EditableSpan></td>
                <td className="text-right"><EditableSpan>{item.total}</EditableSpan></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="terms-col">
            <p><strong>Commercial Terms & Conditions:</strong></p>
            <p><EditableSpan>- Quotation Validity: 30 days</EditableSpan></p>
            <p><EditableSpan>- Payment Terms: 100% advance against with Purchase Order.</EditableSpan></p>
            <p><EditableSpan>- Delivery: Electronic Software Delivery (ESD) via email within FIVE business days of receipt of payment.</EditableSpan></p>
            <p><EditableSpan>- Taxes: GST @ 18% or as applicable at the time of Invoicing.</EditableSpan></p>
            <p><EditableSpan>- Support: Includes OEM portal-based support.</EditableSpan></p>
            <p><EditableSpan>- Installation: Onsite/offline installation & support is not included.</EditableSpan></p>
            <p><EditableSpan>- Subject to DELHI JURISDICTION</EditableSpan></p>

            <div style={{ marginTop: '30px' }}>
              <p><EditableSpan>Enclosures:</EditableSpan></p>
              <p><EditableSpan>PAN | GST | MSME | Dealership Letter</EditableSpan></p>
            </div>
          </div>
          <div className="totals-col">
            <table className="totals-table">
              <tbody>
                <tr>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Sub Total</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>3,94,800.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>Shipping | Installation</td>
                  <td style={{ textAlign: 'right' }}><EditableSpan>( - ) 5XXXXXXX00.00</EditableSpan></td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>IGST @18%</td>
                  <td style={{ textAlign: 'right' }}>7XXXXXXXX74.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>CGST @ 9%</td>
                  <td style={{ textAlign: 'right' }}>XXXXX.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right' }}>SGST @ 9%</td>
                  <td style={{ textAlign: 'right' }}>XXXXXX0.00</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>4,XXXXXXX374.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="amount-words-container">
          <div style={{ marginBottom: '4px' }}>Amount in words</div>
          <div>Eight fivXXXXXXXXXXXXXXXXX eighty six only</div>
        </div>

        {/* Signature */}
        <div className="signature-container">
          <div>For <strong>MILLENNIUM SYSTEMS</strong></div>
          <div>Authorized Signatory</div>
        </div>

        {/* Footer Logos */}
        <div className="logos-footer">
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
