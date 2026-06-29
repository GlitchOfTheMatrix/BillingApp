import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'quotation', label: 'Quotation' },
    { id: 'proforma', label: 'Proforma' },
    { id: 'invoice', label: 'Invoice' }
  ];

  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>BillingApp</h2>
        <ul className="nav-list">
          {tabs.map(tab => (
            <li 
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
