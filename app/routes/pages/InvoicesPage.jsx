// pages/InvoicesPage.jsx
import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import InvoiceFormDrawer from '../components/InvoiceFormDrawer';

const SAMPLE_INVOICES = [
  { id: 'RT3080', clientName: 'Jensen Huang', dueDate: '19 Aug 2021', amount: '1,800.90', status: 'paid' },
  { id: 'XM9141', clientName: 'Alex Grim', dueDate: '20 Sep 2021', amount: '556.00', status: 'pending' },
  { id: 'RG0314', clientName: 'John Morrison', dueDate: '01 Oct 2021', amount: '14,002.33', status: 'paid' },
  { id: 'RT2080', clientName: 'Alysa Werner', dueDate: '12 Oct 2021', amount: '102.04', status: 'pending' },
  { id: 'AA1449', clientName: 'Mellisa Clarke', dueDate: '14 Oct 2021', amount: '4,032.33', status: 'pending' },
  { id: 'TY9141', clientName: 'Thomas Wayne', dueDate: '31 Oct 2021', amount: '6,155.91', status: 'pending' },
  { id: 'FV2353', clientName: 'Anita Wainwright', dueDate: '12 Nov 2021', amount: '3,102.04', status: 'draft' },
];

// Empty state illustration (SVG inline)
const EmptyIllustration = () => (
  <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="121" cy="185" rx="95" ry="15" fill="#DFE3FA" fillOpacity="0.4"/>
    {/* envelope body */}
    <rect x="56" y="80" width="130" height="95" rx="10" fill="#DFE3FA"/>
    <path d="M56 90L121 135L186 90" stroke="#9277FF" strokeWidth="3" strokeLinecap="round"/>
    {/* paper plane */}
    <path d="M175 130L200 115L180 155L175 130Z" fill="#9277FF" fillOpacity="0.5"/>
    <path d="M175 130L200 115" stroke="#9277FF" strokeWidth="2"/>
    {/* envelope flap */}
    <path d="M56 80L121 122L186 80H56Z" fill="#C8CEED"/>
    {/* floating envelopes */}
    <rect x="30" y="55" width="40" height="30" rx="4" fill="#DFE3FA" fillOpacity="0.8" transform="rotate(-15 30 55)"/>
    <path d="M30 62L50 72L70 62" stroke="#9277FF" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-15 30 55)" style={{transformOrigin: '50px 62px'}}/>
    <rect x="175" y="42" width="36" height="26" rx="4" fill="#DFE3FA" fillOpacity="0.8" transform="rotate(12 175 42)"/>
    <path d="M175 48L193 57L211 48" stroke="#9277FF" strokeWidth="1.5" strokeLinecap="round" transform="rotate(12 175 42)" style={{transformOrigin: '193px 48px'}}/>
    {/* person outline */}
    <circle cx="121" cy="50" r="18" fill="#9277FF" fillOpacity="0.15" stroke="#9277FF" strokeWidth="2"/>
    <path d="M113 50C113 46 117 42 121 42C125 42 129 46 129 50" stroke="#9277FF" strokeWidth="2" strokeLinecap="round"/>
    <rect x="117" y="50" width="8" height="10" rx="2" fill="#9277FF" fillOpacity="0.4"/>
    {/* megaphone */}
    <path d="M128 45L145 38V62L128 55V45Z" fill="#9277FF"/>
    <rect x="124" y="47" width="6" height="8" rx="1" fill="#9277FF" fillOpacity="0.6"/>
    <path d="M145 45C148 45 151 47 151 50C151 53 148 55 145 55" stroke="#9277FF" strokeWidth="2" strokeLinecap="round"/>
    <path d="M145 41C150 41 155 45 155 50C155 55 150 59 145 59" stroke="#9277FF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
  </svg>
);

export default function InvoicesPage({ onViewInvoice }) {
  const [invoices, setInvoices] = useState(SAMPLE_INVOICES);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const toggleFilter = (status) => {
    setActiveFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const filtered = activeFilters.length > 0
    ? invoices.filter((inv) => activeFilters.includes(inv.status))
    : invoices;

  const pendingCount = invoices.filter((i) => i.status === 'pending').length;
  const totalCount = invoices.length;

  const handleNewInvoice = (data) => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInvoices((prev) => [
      ...prev,
      {
        id: newId,
        clientName: data.clientName,
        dueDate: data.invoiceDate,
        amount: data.items.reduce((s, i) => s + parseFloat(i.qty || 0) * parseFloat(i.price || 0), 0).toFixed(2),
        status: data.status,
      },
    ]);
    setShowForm(false);
  };

  return (
    <div className="max-w-[780px] mx-auto px-6 pt-16 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-14">
        <div>
          <h1 className="font-spartan font-bold text-[36px] text-text-dark dark:text-white leading-tight">
            Invoices
          </h1>
          <p className="font-spartan text-[13px] text-text-body mt-1">
            {filtered.length === 0
              ? 'No invoices'
              : activeFilters.length > 0
              ? `There are ${filtered.length} ${activeFilters.join('/')} invoices`
              : `There are ${totalCount} total invoices`}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-3 font-spartan font-bold text-[13px] text-text-dark dark:text-white hover:text-primary transition-colors"
            >
              Filter by status
              <ChevronDown
                size={12}
                className={`text-primary transition-transform ${filterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {filterOpen && (
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-dark-card-2 rounded-xl shadow-dropdown z-20 p-6 space-y-4">
                {['draft', 'pending', 'paid'].map((status) => (
                  <label key={status} className="flex items-center gap-4 cursor-pointer group">
                    <div
                      onClick={() => toggleFilter(status)}
                      className={`w-4 h-4 rounded-sm flex items-center justify-center cursor-pointer transition-colors
                        ${activeFilters.includes(status)
                          ? 'bg-primary'
                          : 'border-2 border-border dark:border-border-dark bg-transparent group-hover:border-primary'
                        }`}
                    >
                      {activeFilters.includes(status) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="font-spartan font-bold text-[13px] text-text-dark dark:text-white capitalize">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* New Invoice button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-4 bg-primary hover:bg-primary-hover text-white font-spartan font-bold text-[13px] pl-2 pr-5 py-2 rounded-full transition-colors"
          >
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Plus size={16} className="text-primary" />
            </span>
            New Invoice
          </button>
        </div>
      </div>

      {/* Invoice list or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 gap-8">
          <EmptyIllustration />
          <div className="text-center">
            <h2 className="font-spartan font-bold text-[24px] text-text-dark dark:text-white mb-4">
              There is nothing here
            </h2>
            <p className="font-spartan text-[13px] text-text-body leading-relaxed max-w-xs mx-auto">
              Create an invoice by clicking the{' '}
              <span className="font-bold text-text-dark dark:text-white">New Invoice</span>{' '}
              button and get started
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onViewInvoice && onViewInvoice(inv)}
              onMouseEnter={() => setHoveredId(inv.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex items-center bg-white dark:bg-dark-card rounded-xl px-8 py-5 cursor-pointer
                border-2 transition-all duration-150 shadow-card dark:shadow-card-dark
                ${hoveredId === inv.id
                  ? 'border-primary'
                  : 'border-transparent'
                }`}
            >
              <span className="font-spartan font-bold text-[13px] text-text-dark dark:text-white w-24">
                <span className="text-text-body">#</span>{inv.id}
              </span>
              <span className="font-spartan text-[13px] text-text-body w-36">
                Due &nbsp;{inv.dueDate}
              </span>
              <span className="font-spartan text-[13px] text-text-body flex-1">
                {inv.clientName}
              </span>
              <span className="font-spartan font-bold text-[16px] text-text-dark dark:text-white w-32 text-right">
                £ {inv.amount}
              </span>
              <div className="ml-8 w-28 flex justify-center">
                <StatusBadge status={inv.status} />
              </div>
              <ChevronRight size={16} className="text-primary ml-4" />
            </div>
          ))}
        </div>
      )}

      {/* Create Invoice Drawer */}
      {showForm && (
        <InvoiceFormDrawer
          mode="create"
          onClose={() => setShowForm(false)}
          onSave={handleNewInvoice}
        />
      )}
    </div>
  );
}
