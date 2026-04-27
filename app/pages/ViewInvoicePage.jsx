import { useState } from "react";
import { useInvoices } from "../context/InvoiceContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import InvoiceFormDrawer from "../components/InvoiceFormDrawer.jsx";
import DeleteModal from "../components/DeleteModal.jsx";

export default function ViewInvoicePage({ invoiceId, onGoBack }) {
  const { invoices, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === invoiceId);

  const [showEditForm, setShowEditForm]       = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!invoice) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-14 max-w-[780px] mx-auto text-center">
        <p className="text-[#888EB0] mb-4">Invoice not found.</p>
        <button
          onClick={onGoBack}
          className="text-[#7C5DFA] hover:text-[#9277FF] font-bold transition"
        >
          ← Back to Invoices
        </button>
      </div>
    );
  }

  const total =
    invoice.items?.reduce((sum, item) => sum + item.qty * item.price, 0) ?? 0;

  const isPaid    = invoice.status === "paid";
  const isDraft   = invoice.status === "draft";
  const isPending = invoice.status === "pending";

  const handleEdit = (data) => {
    updateInvoice(invoice.id, { ...data, status: invoice.status });
    setShowEditForm(false);
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    onGoBack();
  };

  const handleMarkPaid = () => {
    markAsPaid(invoice.id);
  };

  return (
    <div className="px-6 py-10 md:px-12 md:py-14 max-w-[780px] mx-auto pb-36 md:pb-14">

      {/* ── Go back ── */}
      <button
        onClick={onGoBack}
        className="flex items-center gap-3 font-bold text-sm dark:text-white hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA] transition mb-8"
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Go back
      </button>

      {/* ── Status Bar ── */}
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 flex items-center justify-between mb-4 shadow-sm">
        <div className="flex items-center gap-4 md:gap-5">
          <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Desktop action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isPaid && (
            <button
              onClick={() => setShowEditForm(true)}
              className="px-6 py-3 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#EC5757] hover:bg-[#FF9797] transition"
          >
            Delete
          </button>
          {isPending && (
            <button
              onClick={handleMarkPaid}
              className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition"
            >
              Mark as Paid
            </button>
          )}
          {isDraft && (
            <button
              onClick={() => setShowEditForm(true)}
              className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition"
            >
              Edit &amp; Send
            </button>
          )}
        </div>
      </div>

      {/* ── Invoice Detail Card ── */}
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 md:p-10 shadow-sm">

        {/* Top: ID + address */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
          <div>
            <h2 className="text-base font-bold dark:text-white mb-1">
              <span className="text-[#7E88C3]">#</span>{invoice.id}
            </h2>
            <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">
              {invoice.projectDescription}
            </p>
          </div>
          <address className="not-italic text-sm text-[#7E88C3] dark:text-[#DFE3FA] md:text-right leading-6">
            <p>{invoice.billFrom?.street}</p>
            <p>{invoice.billFrom?.city}</p>
            <p>{invoice.billFrom?.postCode}</p>
            <p>{invoice.billFrom?.country}</p>
          </address>
        </div>

        {/* Dates + Bill To + Sent To */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2">Invoice Date</p>
              <p className="font-bold dark:text-white text-sm">{invoice.invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2">Payment Due</p>
              <p className="font-bold dark:text-white text-sm">{invoice.dueDate}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2">Bill To</p>
            <p className="font-bold dark:text-white text-sm mb-2">{invoice.billTo?.name}</p>
            <address className="not-italic text-sm text-[#7E88C3] dark:text-[#DFE3FA] leading-6">
              <p>{invoice.billTo?.street}</p>
              <p>{invoice.billTo?.city}</p>
              <p>{invoice.billTo?.postCode}</p>
              <p>{invoice.billTo?.country}</p>
            </address>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2">Sent To</p>
            <p className="font-bold dark:text-white text-sm break-all">{invoice.billTo?.email || "—"}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 md:p-8">

          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-6">
            <p className="col-span-5 text-xs text-[#7E88C3] dark:text-[#DFE3FA]">Item Name</p>
            <p className="col-span-2 text-xs text-[#7E88C3] dark:text-[#DFE3FA] text-center">QTY.</p>
            <p className="col-span-2 text-xs text-[#7E88C3] dark:text-[#DFE3FA] text-right">Price</p>
            <p className="col-span-3 text-xs text-[#7E88C3] dark:text-[#DFE3FA] text-right">Total</p>
          </div>

          {/* Items */}
          <div className="space-y-5">
            {invoice.items?.map((item, idx) => (
              <div key={idx} className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                {/* Mobile */}
                <div className="md:hidden flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm dark:text-white">{item.name}</p>
                    <p className="text-sm text-[#7E88C3] dark:text-[#888EB0] mt-1">
                      {item.qty} x £ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-sm dark:text-white">
                    £ {(item.qty * item.price).toFixed(2)}
                  </p>
                </div>

                {/* Desktop */}
                <p className="hidden md:block col-span-5 font-bold text-sm dark:text-white">{item.name}</p>
                <p className="hidden md:block col-span-2 text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-center">{item.qty}</p>
                <p className="hidden md:block col-span-2 text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-right">£ {item.price.toFixed(2)}</p>
                <p className="hidden md:block col-span-3 font-bold text-sm dark:text-white text-right">£ {(item.qty * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg px-6 md:px-8 py-6 flex justify-between items-center">
          <p className="text-sm text-white">Amount Due</p>
          <p className="text-2xl md:text-3xl font-bold text-white">£ {total.toFixed(2)}</p>
        </div>
      </div>

      {/* ── Mobile Action Bar (pinned to bottom) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E2139] px-6 py-5 flex items-center justify-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-20">
        {!isPaid && (
          <button
            onClick={() => setShowEditForm(true)}
            className="px-5 py-3 rounded-full text-xs font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-5 py-3 rounded-full text-xs font-bold text-white bg-[#EC5757] hover:bg-[#FF9797] transition"
        >
          Delete
        </button>
        {isPending && (
          <button
            onClick={handleMarkPaid}
            className="px-5 py-3 rounded-full text-xs font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition"
          >
            Mark as Paid
          </button>
        )}
        {isDraft && (
          <button
            onClick={() => setShowEditForm(true)}
            className="px-5 py-3 rounded-full text-xs font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition"
          >
            Edit &amp; Send
          </button>
        )}
        {isPaid && (
          <p className="text-xs text-[#888EB0]">This invoice has been paid and cannot be modified.</p>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* ── Edit Drawer ── */}
      <InvoiceFormDrawer
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEdit}
        invoice={invoice}
      />
    </div>
  );
}
