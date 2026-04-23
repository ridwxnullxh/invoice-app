// pages/ViewInvoicePage.jsx
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import InvoiceFormDrawer from "../components/InvoiceFormDrawer";
import DeleteModal from "../components/DeleteModal";

const SAMPLE_INVOICE = {
  id: "XM9141",
  description: "Graphic Design",
  status: "pending",
  invoiceDate: "21 Aug 2021",
  paymentDue: "20 Sep 2021",
  billFromStreet: "19 Union Terrace",
  billFromCity: "London",
  billFromPostCode: "E1 3EZ",
  billFromCountry: "United Kingdom",
  clientName: "Alex Grim",
  clientEmail: "alexgrim@mail.com",
  billToStreet: "84 Church Way",
  billToCity: "Bradford",
  billToPostCode: "BD1 9PB",
  billToCountry: "United Kingdom",
  items: [
    { name: "Banner Design", qty: 1, price: 156.0, total: 156.0 },
    { name: "Email Design", qty: 2, price: 200.0, total: 400.0 },
  ],
  amountDue: 556.0,
};

export default function ViewInvoicePage({
  invoice = SAMPLE_INVOICE,
  onGoBack,
  onDelete,
  onUpdate,
}) {
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(invoice);

  const handleMarkPaid = () => {
    setCurrentInvoice((prev) => ({ ...prev, status: "paid" }));
    onUpdate && onUpdate({ ...currentInvoice, status: "paid" });
  };

  const handleSaveEdit = (data) => {
    setCurrentInvoice((prev) => ({ ...prev, ...data }));
    onUpdate && onUpdate({ ...currentInvoice, ...data });
    setShowEditDrawer(false);
  };

  const handleDelete = () => {
    onDelete && onDelete(currentInvoice.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-195 mx-auto px-6 pt-14 pb-20 relative">
      {/* Go Back */}
      <button
        onClick={onGoBack}
        className="flex items-center gap-4 mb-10 font-spartan font-bold text-[13px] text-text-dark dark:text-white hover:text-primary transition-colors group"
      >
        <ChevronLeft size={16} className="text-primary" />
        Go back
      </button>

      {/* Status bar */}
      <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-xl px-8 py-5 mb-6 shadow-card dark:shadow-card-dark">
        <div className="flex items-center gap-5">
          <span className="font-spartan text-[13px] text-text-body">
            Status
          </span>
          <StatusBadge status={currentInvoice.status} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditDrawer(true)}
            className="px-6 py-4 rounded-full bg-light-bg dark:bg-dark-card-2 text-text-body dark:text-[#DFE3FA] font-spartan font-bold text-[13px] hover:bg-[#DFE3FA] dark:hover:bg-[#373B53] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-4 rounded-full bg-danger text-white font-spartan font-bold text-[13px] hover:bg-danger-hover transition-colors"
          >
            Delete
          </button>
          {currentInvoice.status !== "paid" && (
            <button
              onClick={handleMarkPaid}
              className="px-6 py-4 rounded-full bg-primary text-white font-spartan font-bold text-[13px] hover:bg-primary-hover transition-colors"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-12 shadow-card dark:shadow-card-dark">
        {/* Invoice ID & address */}
        <div className="flex justify-between mb-10">
          <div>
            <h2 className="font-spartan font-bold text-[16px] text-text-dark dark:text-white mb-2">
              <span className="text-text-body">#</span>
              {currentInvoice.id}
            </h2>
            <p className="font-spartan text-[13px] text-text-body">
              {currentInvoice.description}
            </p>
          </div>
          <div className="text-right font-spartan text-[13px] text-text-body leading-7">
            <p>{currentInvoice.billFromStreet}</p>
            <p>{currentInvoice.billFromCity}</p>
            <p>{currentInvoice.billFromPostCode}</p>
            <p>{currentInvoice.billFromCountry}</p>
          </div>
        </div>

        {/* Dates & Client info */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Dates */}
          <div className="space-y-8">
            <div>
              <p className="font-spartan text-[13px] text-text-body mb-2">
                Invoice Date
              </p>
              <p className="font-spartan font-bold text-[15px] text-text-dark dark:text-white">
                {currentInvoice.invoiceDate}
              </p>
            </div>
            <div>
              <p className="font-spartan text-[13px] text-text-body mb-2">
                Payment Due
              </p>
              <p className="font-spartan font-bold text-[15px] text-text-dark dark:text-white">
                {currentInvoice.paymentDue}
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <p className="font-spartan text-[13px] text-text-body mb-2">
              Bill To
            </p>
            <p className="font-spartan font-bold text-[15px] text-text-dark dark:text-white mb-2">
              {currentInvoice.clientName}
            </p>
            <div className="font-spartan text-[13px] text-text-body leading-7">
              <p>{currentInvoice.billToStreet}</p>
              <p>{currentInvoice.billToCity}</p>
              <p>{currentInvoice.billToPostCode}</p>
              <p>{currentInvoice.billToCountry}</p>
            </div>
          </div>

          {/* Sent To */}
          <div>
            <p className="font-spartan text-[13px] text-text-body mb-2">
              Sent to
            </p>
            <p className="font-spartan font-bold text-[15px] text-text-dark dark:text-white">
              {currentInvoice.clientEmail}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="bg-light-bg dark:bg-dark-card-2 rounded-xl overflow-hidden">
          {/* Table head */}
          <div className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-8 py-5">
            <span className="font-spartan text-[11px] text-text-body">
              Item Name
            </span>
            <span className="font-spartan text-[11px] text-text-body text-center">
              QTY.
            </span>
            <span className="font-spartan text-[11px] text-text-body text-right">
              Price
            </span>
            <span className="font-spartan text-[11px] text-text-body text-right">
              Total
            </span>
          </div>

          {/* Table rows */}
          {currentInvoice.items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-8 py-4"
            >
              <span className="font-spartan font-bold text-[13px] text-text-dark dark:text-white">
                {item.name}
              </span>
              <span className="font-spartan font-bold text-[13px] text-text-body text-center">
                {item.qty}
              </span>
              <span className="font-spartan font-bold text-[13px] text-primary text-right">
                £ {item.price.toFixed(2)}
              </span>
              <span className="font-spartan font-bold text-[13px] text-text-dark dark:text-white text-right">
                £ {item.total.toFixed(2)}
              </span>
            </div>
          ))}

          {/* Amount Due footer */}
          <div className="bg-amount-bg dark:bg-dark-bg rounded-b-xl flex items-center justify-between px-8 py-6 mt-2">
            <span className="font-spartan text-[13px] text-white">
              Amount Due
            </span>
            <span className="font-spartan font-bold text-[28px] text-white">
              £ {currentInvoice.amountDue?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      {showEditDrawer && (
        <InvoiceFormDrawer
          mode="edit"
          invoice={{
            ...currentInvoice,
            invoiceDate: currentInvoice.invoiceDate,
            paymentTerms: currentInvoice.paymentTerms || "Net 30 Days",
          }}
          onClose={() => setShowEditDrawer(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={currentInvoice.id}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
