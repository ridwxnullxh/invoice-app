import { useState } from "react";
import { useInvoices } from "../context/InvoiceContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import InvoiceFormDrawer from "../components/InvoiceFormDrawer.jsx";

const STATUSES = ["draft", "pending", "paid"];

export default function InvoicesPage({ onViewInvoice }) {
  const { invoices, addInvoice } = useInvoices();
  const [showForm, setShowForm]     = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected]     = useState([]); // [] = all

  const displayed =
    selected.length === 0
      ? invoices
      : invoices.filter((inv) => selected.includes(inv.status));

  const toggleStatus = (s) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleAdd = (data) => {
    addInvoice(data);
    setShowForm(false);
  };

  return (
    <div className="px-6 py-10 md:px-12 md:py-14 max-w-[780px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl md:text-[36px] font-bold tracking-tight dark:text-white leading-tight">
            Invoices
          </h1>
          <p className="text-[#888EB0] text-sm mt-1">
            {displayed.length === 0
              ? "No invoices"
              : <><span className="hidden md:inline">There are </span>{displayed.length}<span className="hidden md:inline"> total</span> invoices</>
            }
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* ── Filter dropdown ── */}
          <div className="relative">
            <button
              id="filter-btn"
              aria-haspopup="true"
              aria-expanded={showFilter}
              aria-controls="filter-menu"
              onClick={() => setShowFilter((v) => !v)}
              className="flex items-center gap-2 font-bold text-sm dark:text-white hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA] transition"
            >
              <span className="hidden md:inline">Filter by status</span>
              <span className="md:hidden">Filter</span>
              <svg
                className={`transition-transform duration-200 ${showFilter ? "rotate-180" : ""}`}
                width="11" height="7" viewBox="0 0 11 7" fill="none"
              >
                <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showFilter && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilter(false)} aria-hidden="true" />
                <div
                  id="filter-menu"
                  role="group"
                  aria-label="Filter by status"
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#252945] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.25)] py-4 px-6 w-48 z-20 space-y-3"
                >
                  {STATUSES.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span
                        role="checkbox"
                        aria-checked={selected.includes(s)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleStatus(s); }}}
                        onClick={() => toggleStatus(s)}
                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition border-2 flex-shrink-0
                          ${selected.includes(s)
                            ? "bg-[#7C5DFA] border-[#7C5DFA]"
                            : "border-[#DFE3FA] dark:border-[#494E6E] group-hover:border-[#7C5DFA]"
                          }`}
                      >
                        {selected.includes(s) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l2.667 2.667L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className="text-sm font-bold capitalize dark:text-white">{s}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── New Invoice button ── */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 md:gap-4 pl-2 pr-4 md:pr-5 py-2 rounded-full bg-[#7C5DFA] hover:bg-[#9277FF] transition font-bold text-sm text-white shadow-lg shadow-purple-500/30"
          >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#7C5DFA] font-bold text-lg leading-none" aria-hidden="true">+</span>
            <span className="hidden md:inline">New Invoice</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>

      {/* ── Invoice List ── */}
      {displayed.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-4" aria-label="Invoice list">
          {displayed.map((invoice) => (
            <li key={invoice.id}>
              <button
                onClick={() => onViewInvoice(invoice)}
                aria-label={`Invoice #${invoice.id}, ${invoice.status}, £${invoice.amount?.toFixed(2)}, due ${invoice.dueDate}`}
                className="w-full text-left bg-white dark:bg-[#1E2139] rounded-lg border border-transparent hover:border-[#7C5DFA] dark:hover:border-[#7C5DFA] transition-all shadow-sm hover:shadow-md p-4 md:p-6 group"
              >
                {/* Mobile */}
                <div className="md:hidden">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-sm dark:text-white">
                      <span className="text-[#888EB0]">#</span>{invoice.id}
                    </span>
                    <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">{invoice.client || invoice.billTo?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2">Due {invoice.dueDate}</p>
                      <p className="font-bold text-base dark:text-white">£ {(invoice.amount ?? 0).toFixed(2)}</p>
                    </div>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid md:grid-cols-[100px_1fr_1fr_120px_120px_12px] items-center gap-4">
                  <p className="font-bold text-sm dark:text-white">
                    <span className="text-[#888EB0]">#</span>{invoice.id}
                  </p>
                  <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Due {invoice.dueDate}</p>
                  <p className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">{invoice.client || invoice.billTo?.name}</p>
                  <p className="font-bold text-base dark:text-white text-right">£ {(invoice.amount ?? 0).toFixed(2)}</p>
                  <div className="flex justify-end">
                    <StatusBadge status={invoice.status} />
                  </div>
                  <svg
                    className="text-[#7C5DFA] group-hover:translate-x-1 transition-transform"
                    width="7" height="10" viewBox="0 0 7 10" fill="none"
                  >
                    <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <InvoiceFormDrawer
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <svg className="mb-10 w-48 h-48" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="121" cy="188" rx="121" ry="12" fill="currentColor" className="text-gray-100 dark:text-[#1E2139]"/>
        <rect x="61" y="20" width="120" height="160" rx="12" fill="currentColor" className="text-[#DFE3FA] dark:text-[#252945]"/>
        <rect x="75" y="48" width="92" height="8" rx="4" fill="currentColor" className="text-[#9277FF] dark:text-[#7C5DFA] opacity-60"/>
        <rect x="75" y="68" width="72" height="6" rx="3" fill="currentColor" className="text-gray-300 dark:text-[#494E6E]"/>
        <rect x="75" y="84" width="60" height="6" rx="3" fill="currentColor" className="text-gray-300 dark:text-[#494E6E]"/>
        <rect x="75" y="108" width="92" height="6" rx="3" fill="currentColor" className="text-gray-300 dark:text-[#494E6E]"/>
        <rect x="75" y="124" width="80" height="6" rx="3" fill="currentColor" className="text-gray-300 dark:text-[#494E6E]"/>
        <circle cx="121" cy="20" r="16" fill="currentColor" className="text-[#7C5DFA]"/>
        <path d="M114 20h14M121 13v14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      <h2 className="text-2xl font-bold dark:text-white mb-3">There is nothing here</h2>
      <p className="text-[#888EB0] max-w-xs text-sm leading-relaxed">
        Create an invoice by clicking the <strong>New</strong> button and get started
      </p>
    </div>
  );
}
