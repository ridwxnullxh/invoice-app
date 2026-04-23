// components/InvoiceFormDrawer.jsx
import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Trash2 } from 'lucide-react';

const PAYMENT_TERMS = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];

const emptyItem = () => ({ id: Date.now(), name: '', qty: '', price: '' });

const InputField = ({ label, value, onChange, placeholder, error, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className={`font-spartan text-[11px] font-medium ${error ? 'text-danger' : 'text-text-muted dark:text-[#DFE3FA]'} flex justify-between`}>
      <span>{label}</span>
      {error && <span className="text-danger text-[10px]">{error}</span>}
    </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-lg border font-spartan font-bold text-[13px] text-text-dark dark:text-white bg-white dark:bg-dark-card-2 outline-none transition-colors
        ${error
          ? 'border-danger focus:border-danger'
          : 'border-border dark:border-border-dark focus:border-primary dark:focus:border-primary'
        }`}
    />
  </div>
);

const DatePicker = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthName = months[viewDate.getMonth()];
  const year = viewDate.getFullYear();

  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  const formatDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleDay = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(selected.toISOString().split('T')[0]);
    setOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const selectedDay = value ? new Date(value).getDate() : null;
  const isSelectedMonth = value &&
    new Date(value).getMonth() === viewDate.getMonth() &&
    new Date(value).getFullYear() === viewDate.getFullYear();

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="font-spartan text-[11px] font-medium text-text-muted dark:text-[#DFE3FA]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark-card-2 flex items-center justify-between font-spartan font-bold text-[13px] text-text-dark dark:text-white focus:border-primary outline-none"
      >
        <span>{formatDisplay(value) || 'Pick a date'}</span>
        <Calendar size={16} className="text-primary" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-dark-card-2 rounded-xl shadow-dropdown z-30 p-6">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-primary hover:opacity-70">
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M6 1L2 5L6 9" stroke="#7C55FA" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <span className="font-spartan font-bold text-[13px] text-text-dark dark:text-white">
              {monthName} {year}
            </span>
            <button onClick={nextMonth} className="text-primary hover:opacity-70">
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1L5 5L1 9" stroke="#7C55FA" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleDay(day)}
                className={`w-7 h-7 flex items-center justify-center rounded-full font-spartan font-bold text-[11px] transition-colors
                  ${isSelectedMonth && selectedDay === day
                    ? 'bg-primary text-white'
                    : 'text-text-dark dark:text-white hover:text-primary'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentTermsSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2 relative">
      <label className="font-spartan text-[11px] font-medium text-text-muted dark:text-[#DFE3FA]">Payment Terms</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark-card-2 flex items-center justify-between font-spartan font-bold text-[13px] text-text-dark dark:text-white focus:border-primary outline-none"
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`text-primary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-dark-card-2 rounded-xl shadow-dropdown z-30 overflow-hidden">
          {PAYMENT_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => { onChange(term); setOpen(false); }}
              className={`w-full px-4 py-4 text-left font-spartan font-bold text-[13px] border-b border-border dark:border-border-dark last:border-0
                transition-colors hover:text-primary
                ${value === term ? 'text-primary' : 'text-text-dark dark:text-white'}`}
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function InvoiceFormDrawer({ mode = 'create', invoice = null, onClose, onSave }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    billFromStreet: invoice?.billFromStreet || '',
    billFromCity: invoice?.billFromCity || '',
    billFromPostCode: invoice?.billFromPostCode || '',
    billFromCountry: invoice?.billFromCountry || '',
    clientName: invoice?.clientName || '',
    clientEmail: invoice?.clientEmail || '',
    billToStreet: invoice?.billToStreet || '',
    billToCity: invoice?.billToCity || '',
    billToPostCode: invoice?.billToPostCode || '',
    billToCountry: invoice?.billToCountry || '',
    invoiceDate: invoice?.invoiceDate || new Date().toISOString().split('T')[0],
    paymentTerms: invoice?.paymentTerms || 'Net 30 Days',
    projectDescription: invoice?.projectDescription || '',
    items: invoice?.items || [],
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const addItem = () => setForm((p) => ({ ...p, items: [...p.items, emptyItem()] }));

  const removeItem = (id) => setForm((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  const updateItem = (id, field) => (e) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((i) => (i.id === id ? { ...i, [field]: e.target.value } : i)),
    }));

  const calcTotal = (qty, price) => {
    const q = parseFloat(qty) || 0;
    const p = parseFloat(price) || 0;
    return (q * p).toFixed(2);
  };

  const validate = () => {
    const errs = {};
    if (!form.billFromStreet) errs.billFromStreet = "can't be empty";
    if (!form.clientName) errs.clientName = "can't be empty";
    if (!form.clientEmail) errs.clientEmail = "can't be empty";
    if (!form.projectDescription) errs.projectDescription = "can't be empty";
    return errs;
  };

  const handleSend = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setFormError('- All fields must be added');
      if (form.items.length === 0) setFormError('- All fields must be added\n- An item must be added');
      return;
    }
    if (form.items.length === 0) {
      setFormError('- An item must be added');
      return;
    }
    onSave({ ...form, status: 'pending' });
  };

  const handleDraft = () => {
    onSave({ ...form, status: 'draft' });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 left-[103px] h-screen w-[616px] bg-white dark:bg-dark-bg z-50 overflow-y-auto shadow-2xl rounded-r-[20px]">
        <div className="px-14 py-12">
          <h2 className="font-spartan font-bold text-[24px] text-text-dark dark:text-white mb-10">
            {isEdit ? (
              <>Edit <span className="text-text-body">#</span>{invoice?.id}</>
            ) : (
              'New Invoice'
            )}
          </h2>

          {/* Bill From */}
          <section className="mb-8">
            <h3 className="font-spartan font-bold text-[12px] text-primary mb-6">Bill From</h3>
            <div className="space-y-5">
              <InputField
                label="Street Address"
                value={form.billFromStreet}
                onChange={update('billFromStreet')}
                error={errors.billFromStreet}
              />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="City" value={form.billFromCity} onChange={update('billFromCity')} />
                <InputField label="Post Code" value={form.billFromPostCode} onChange={update('billFromPostCode')} />
                <InputField label="Country" value={form.billFromCountry} onChange={update('billFromCountry')} />
              </div>
            </div>
          </section>

          {/* Bill To */}
          <section className="mb-8">
            <h3 className="font-spartan font-bold text-[12px] text-primary mb-6">Bill To</h3>
            <div className="space-y-5">
              <InputField
                label="Client's Name"
                value={form.clientName}
                onChange={update('clientName')}
                error={errors.clientName}
              />
              <InputField
                label="Client's Email"
                value={form.clientEmail}
                onChange={update('clientEmail')}
                placeholder="e.g. email@example.com"
                error={errors.clientEmail}
              />
              <InputField
                label="Street Address"
                value={form.billToStreet}
                onChange={update('billToStreet')}
              />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="City" value={form.billToCity} onChange={update('billToCity')} />
                <InputField label="Post Code" value={form.billToPostCode} onChange={update('billToPostCode')} />
                <InputField label="Country" value={form.billToCountry} onChange={update('billToCountry')} />
              </div>
            </div>
          </section>

          {/* Dates & Terms */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-6 mb-5">
              <DatePicker
                label={isEdit ? 'Invoice Date' : 'Issue Date'}
                value={form.invoiceDate}
                onChange={(val) => setForm((p) => ({ ...p, invoiceDate: val }))}
              />
              <PaymentTermsSelect
                value={form.paymentTerms}
                onChange={(val) => setForm((p) => ({ ...p, paymentTerms: val }))}
              />
            </div>
            <InputField
              label="Project Description"
              value={form.projectDescription}
              onChange={update('projectDescription')}
              placeholder="e.g. Graphic Design Service"
              error={errors.projectDescription}
            />
          </section>

          {/* Item List */}
          <section className="mb-10">
            <h3 className="font-spartan font-bold text-[18px] text-[#777F98] mb-6">Item List</h3>

            {form.items.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-[1fr_60px_100px_80px_24px] gap-4 mb-2">
                  <span className="font-spartan text-[11px] text-text-muted">Item Name</span>
                  <span className="font-spartan text-[11px] text-text-muted">Qty.</span>
                  <span className="font-spartan text-[11px] text-text-muted">Price</span>
                  <span className="font-spartan text-[11px] text-text-muted">Total</span>
                  <span />
                </div>
                <div className="space-y-4">
                  {form.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_60px_100px_80px_24px] gap-4 items-center">
                      <input
                        value={item.name}
                        onChange={updateItem(item.id, 'name')}
                        className="px-3 py-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark-card-2 font-spartan font-bold text-[13px] text-text-dark dark:text-white outline-none focus:border-primary"
                      />
                      <input
                        value={item.qty}
                        onChange={updateItem(item.id, 'qty')}
                        type="number"
                        className="px-2 py-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark-card-2 font-spartan font-bold text-[13px] text-text-dark dark:text-white outline-none focus:border-primary text-center"
                      />
                      <input
                        value={item.price}
                        onChange={updateItem(item.id, 'price')}
                        type="number"
                        className="px-3 py-3 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark-card-2 font-spartan font-bold text-[13px] text-text-dark dark:text-white outline-none focus:border-primary"
                      />
                      <span className="font-spartan font-bold text-[13px] text-text-body">
                        {calcTotal(item.qty, item.price)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-body hover:text-danger transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={addItem}
              className="w-full py-4 rounded-full bg-light-bg dark:bg-dark-card-2 text-text-body dark:text-[#DFE3FA] font-spartan font-bold text-[13px] hover:bg-[#DFE3FA] dark:hover:bg-[#373B53] transition-colors"
            >
              + Add New Item
            </button>
          </section>

          {/* Error messages */}
          {formError && (
            <p className="text-danger font-spartan text-[11px] mb-4 whitespace-pre-line">{formError}</p>
          )}

          {/* Footer actions */}
          <div className={`flex items-center ${isEdit ? 'justify-end' : 'justify-between'} gap-3`}>
            {!isEdit && (
              <button
                onClick={onClose}
                className="px-6 py-4 rounded-full text-text-body dark:text-[#DFE3FA] font-spartan font-bold text-[13px] hover:text-text-dark transition-colors"
              >
                Discard
              </button>
            )}
            <div className="flex gap-3">
              {!isEdit && (
                <button
                  onClick={handleDraft}
                  className="px-6 py-4 rounded-full bg-dark-card dark:bg-[#373B53] text-text-body dark:text-[#DFE3FA] font-spartan font-bold text-[13px] hover:bg-[#373B53] transition-colors"
                >
                  Save as Draft
                </button>
              )}
              {isEdit && (
                <button
                  onClick={onClose}
                  className="px-6 py-4 rounded-full bg-light-bg dark:bg-dark-card-2 text-text-body dark:text-[#DFE3FA] font-spartan font-bold text-[13px] hover:bg-[#DFE3FA] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSend}
                className="px-6 py-4 rounded-full bg-primary text-white font-spartan font-bold text-[13px] hover:bg-primary-hover transition-colors"
              >
                {isEdit ? 'Save Changes' : 'Save & Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
