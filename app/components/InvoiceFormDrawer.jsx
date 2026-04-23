import { forwardRef, useEffect, useRef, useState } from "react";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";

// ── Validation helpers ─────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data) {
  const errors = {};

  // Bill From
  if (!data.billFrom.street.trim())
    errors["billFrom.street"] = "Can't be empty";
  if (!data.billFrom.city.trim()) errors["billFrom.city"] = "Can't be empty";
  if (!data.billFrom.postCode.trim())
    errors["billFrom.postCode"] = "Can't be empty";
  if (!data.billFrom.country.trim())
    errors["billFrom.country"] = "Can't be empty";

  // Bill To
  if (!data.billTo.name.trim()) errors["billTo.name"] = "Can't be empty";
  if (!data.billTo.email.trim()) errors["billTo.email"] = "Can't be empty";
  else if (!EMAIL_RE.test(data.billTo.email))
    errors["billTo.email"] = "Must be a valid email";
  if (!data.billTo.street.trim()) errors["billTo.street"] = "Can't be empty";
  if (!data.billTo.city.trim()) errors["billTo.city"] = "Can't be empty";
  if (!data.billTo.postCode.trim())
    errors["billTo.postCode"] = "Can't be empty";
  if (!data.billTo.country.trim()) errors["billTo.country"] = "Can't be empty";

  // Invoice meta
  if (!data.invoiceDate) errors["invoiceDate"] = "Can't be empty";
  if (!data.paymentTerms) errors["paymentTerms"] = "Required";
  if (!data.projectDescription.trim())
    errors["projectDescription"] = "Can't be empty";

  // Items
  if (!data.items.length) {
    errors["items"] = "An item must be added";
  } else {
    data.items.forEach((item, idx) => {
      if (!item.name.trim()) errors[`item.${idx}.name`] = "Can't be empty";
      if (item.qty < 1) errors[`item.${idx}.qty`] = "Min 1";
      if (item.price < 0) errors[`item.${idx}.price`] = "Min 0";
    });
  }

  return errors;
}

// ── Field components ────────────────────────────────────────────────────────

function Field({ id, label, error, children }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={id}
          className={`text-xs font-medium ${error ? "text-[#EC5757]" : "text-[#7E88C3] dark:text-[#888EB0]"}`}
        >
          {label}
        </label>
        {error && (
          <span
            className="text-xs text-[#EC5757]"
            id={`${id}-error`}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const Input = forwardRef(function Input({ id, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      id={id}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={!!error}
      className={`w-full px-4 py-3 rounded text-sm font-bold dark:text-white bg-white dark:bg-[#1E2139] border transition outline-none
        ${
          error
            ? "border-[#EC5757] focus:border-[#EC5757]"
            : "border-[#DFE3FA] dark:border-[#252945] focus:border-[#7C5DFA] dark:focus:border-[#7C5DFA]"
        }`}
      {...props}
    />
  );
});

// Removed native Select in favor of CustomSelect

// ── Main component ──────//

const EMPTY_FORM = {
  billFrom: { street: "", city: "", postCode: "", country: "" },
  billTo: {
    name: "",
    email: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  invoiceDate: new Date().toISOString().split("T")[0],
  paymentTerms: "Net 30 Days",
  projectDescription: "",
  items: [{ name: "", qty: 1, price: 0 }],
};

export default function InvoiceFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  invoice,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const drawerRef = useRef(null);
  const firstFocusRef = useRef(null);
  const titleId = "invoice-form-title";

  // Reset form
  useEffect(() => {
    if (isOpen) {
      setFormData(invoice ? { ...EMPTY_FORM, ...invoice } : EMPTY_FORM);
      setErrors({});
      setHasSubmitted(false);
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isOpen, invoice]);

  // ESC key + focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        if (!drawerRef.current) return;
        const focusable = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Handlers ────── //

  const set = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setItem = (idx, field, value) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: 1, price: 0 }],
    }));

  const removeItem = (idx) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  // Re-validate on change if user has already tried to submit
  useEffect(() => {
    if (hasSubmitted) setErrors(validateForm(formData));
  }, [formData, hasSubmitted]);

  const handleSaveDraft = () => {
    onSubmit({ ...formData, status: "draft" });
  };

  const handleSaveAndSend = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      drawerRef.current
        ?.querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit({
      ...formData,
      status:
        invoice?.status === "draft" ? "pending" : invoice?.status || "pending",
    });
  };

  if (!isOpen) return null;

  const ef = (key) => errors[key];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 left-0 md:left-[103px] right-0 md:right-auto z-50 flex flex-col bg-white dark:bg-[#141625] md:w-[616px] md:rounded-r-[20px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 md:px-14 pt-10 pb-6 flex-shrink-0">
          <h2 id={titleId} className="text-2xl font-bold dark:text-white">
            {invoice ? (
              <>
                Edit <span className="text-[#888EB0]">#</span>
                {invoice.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h2>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 md:px-14 pb-4">
          <form id="invoice-form" onSubmit={handleSaveAndSend} noValidate>
            {/* ── Bill From ── */}
            <fieldset className="mb-8">
              <legend className="text-xs font-bold text-[#7C5DFA] uppercase tracking-widest mb-4">
                Bill From
              </legend>
              <div className="space-y-4">
                <Field
                  id="from-street"
                  label="Street Address"
                  error={ef("billFrom.street")}
                >
                  <Input
                    id="from-street"
                    ref={firstFocusRef}
                    value={formData.billFrom.street}
                    onChange={(e) => set("billFrom.street", e.target.value)}
                    error={ef("billFrom.street")}
                  />
                </Field>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field
                    id="from-city"
                    label="City"
                    error={ef("billFrom.city")}
                  >
                    <Input
                      id="from-city"
                      value={formData.billFrom.city}
                      onChange={(e) => set("billFrom.city", e.target.value)}
                      error={ef("billFrom.city")}
                    />
                  </Field>
                  <Field
                    id="from-post"
                    label="Post Code"
                    error={ef("billFrom.postCode")}
                  >
                    <Input
                      id="from-post"
                      value={formData.billFrom.postCode}
                      onChange={(e) => set("billFrom.postCode", e.target.value)}
                      error={ef("billFrom.postCode")}
                    />
                  </Field>
                  <div className="col-span-2 md:col-span-1">
                    <Field
                      id="from-country"
                      label="Country"
                      error={ef("billFrom.country")}
                    >
                      <Input
                        id="from-country"
                        value={formData.billFrom.country}
                        onChange={(e) =>
                          set("billFrom.country", e.target.value)
                        }
                        error={ef("billFrom.country")}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* ── Bill To ── */}
            <fieldset className="mb-8">
              <legend className="text-xs font-bold text-[#7C5DFA] uppercase tracking-widest mb-4">
                Bill To
              </legend>
              <div className="space-y-4">
                <Field
                  id="to-name"
                  label="Client's Name"
                  error={ef("billTo.name")}
                >
                  <Input
                    id="to-name"
                    value={formData.billTo.name}
                    onChange={(e) => set("billTo.name", e.target.value)}
                    error={ef("billTo.name")}
                  />
                </Field>
                <Field
                  id="to-email"
                  label="Client's Email"
                  error={ef("billTo.email")}
                >
                  <Input
                    id="to-email"
                    type="email"
                    placeholder="e.g. email@example.com"
                    value={formData.billTo.email}
                    onChange={(e) => set("billTo.email", e.target.value)}
                    error={ef("billTo.email")}
                  />
                </Field>
                <Field
                  id="to-street"
                  label="Street Address"
                  error={ef("billTo.street")}
                >
                  <Input
                    id="to-street"
                    value={formData.billTo.street}
                    onChange={(e) => set("billTo.street", e.target.value)}
                    error={ef("billTo.street")}
                  />
                </Field>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field id="to-city" label="City" error={ef("billTo.city")}>
                    <Input
                      id="to-city"
                      value={formData.billTo.city}
                      onChange={(e) => set("billTo.city", e.target.value)}
                      error={ef("billTo.city")}
                    />
                  </Field>
                  <Field
                    id="to-post"
                    label="Post Code"
                    error={ef("billTo.postCode")}
                  >
                    <Input
                      id="to-post"
                      value={formData.billTo.postCode}
                      onChange={(e) => set("billTo.postCode", e.target.value)}
                      error={ef("billTo.postCode")}
                    />
                  </Field>
                  <div className="col-span-2 md:col-span-1">
                    <Field
                      id="to-country"
                      label="Country"
                      error={ef("billTo.country")}
                    >
                      <Input
                        id="to-country"
                        value={formData.billTo.country}
                        onChange={(e) => set("billTo.country", e.target.value)}
                        error={ef("billTo.country")}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* ── Invoice Meta ── */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  id="invoice-date"
                  label="Invoice Date"
                  error={ef("invoiceDate")}
                >
                  <CustomDatePicker
                    id="invoice-date"
                    value={formData.invoiceDate}
                    onChange={(value) => set("invoiceDate", value)}
                    error={ef("invoiceDate")}
                  />
                </Field>
                <Field
                  id="payment-terms"
                  label="Payment Terms"
                  error={ef("paymentTerms")}
                >
                  <CustomSelect
                    id="payment-terms"
                    value={formData.paymentTerms}
                    onChange={(value) => set("paymentTerms", value)}
                    options={[
                      { value: "Net 1 Day", label: "Net 1 Day" },
                      { value: "Net 7 Days", label: "Net 7 Days" },
                      { value: "Net 14 Days", label: "Net 14 Days" },
                      { value: "Net 30 Days", label: "Net 30 Days" }
                    ]}
                    error={ef("paymentTerms")}
                  />
                </Field>
              </div>
              <Field
                id="project-desc"
                label="Project Description"
                error={ef("projectDescription")}
              >
                <Input
                  id="project-desc"
                  placeholder="e.g. Graphic Design Service"
                  value={formData.projectDescription}
                  onChange={(e) => set("projectDescription", e.target.value)}
                  error={ef("projectDescription")}
                />
              </Field>
            </div>

            {/* ── Item List ── */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#777F98] dark:text-[#777F98] mb-4">
                Item List
              </h3>

              {ef("items") && (
                <p role="alert" className="text-xs text-[#EC5757] mb-3">
                  {ef("items")}
                </p>
              )}

              <div className="space-y-4">
                {formData.items.map((item, idx) => (
                  <div key={idx}>
                    {/* Mobile: stacked layout */}
                    <div className="md:hidden space-y-3">
                      <Field
                        id={`item-${idx}-name`}
                        label="Item Name"
                        error={ef(`item.${idx}.name`)}
                      >
                        <Input
                          id={`item-${idx}-name`}
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => setItem(idx, "name", e.target.value)}
                          error={ef(`item.${idx}.name`)}
                        />
                      </Field>
                      <div className="grid grid-cols-3 gap-3 items-end">
                        <Field
                          id={`item-${idx}-qty`}
                          label="Qty."
                          error={ef(`item.${idx}.qty`)}
                        >
                          <Input
                            id={`item-${idx}-qty`}
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              setItem(idx, "qty", parseInt(e.target.value) || 1)
                            }
                            error={ef(`item.${idx}.qty`)}
                          />
                        </Field>
                        <Field
                          id={`item-${idx}-price`}
                          label="Price"
                          error={ef(`item.${idx}.price`)}
                        >
                          <Input
                            id={`item-${idx}-price`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              setItem(
                                idx,
                                "price",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            error={ef(`item.${idx}.price`)}
                          />
                        </Field>
                        <div>
                          <p className="text-xs text-[#7E88C3] dark:text-[#888EB0] mb-2">
                            Total
                          </p>
                          <p className="py-3 font-bold text-[#888EB0] text-sm">
                            {(item.qty * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          aria-label={`Remove item ${item.name || idx + 1}`}
                          className="text-[#888EB0] hover:text-[#EC5757] transition p-1"
                        >
                          <svg
                            width="13"
                            height="16"
                            viewBox="0 0 13 16"
                            fill="currentColor"
                          >
                            <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694c-.982 0-1.777-.796-1.777-1.778V3.556h10.666zM8.473 0l.888.889H13v1.778H0V.889h3.64L4.528 0h3.945z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Desktop: row layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        {idx === 0 && (
                          <p className="text-xs text-[#7E88C3] dark:text-[#888EB0] mb-2">
                            Item Name
                          </p>
                        )}
                        <Input
                          id={`item-${idx}-name-d`}
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => setItem(idx, "name", e.target.value)}
                          error={ef(`item.${idx}.name`)}
                        />
                      </div>
                      <div className="col-span-2">
                        {idx === 0 && (
                          <p className="text-xs text-[#7E88C3] dark:text-[#888EB0] mb-2">
                            Qty.
                          </p>
                        )}
                        <Input
                          id={`item-${idx}-qty-d`}
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            setItem(idx, "qty", parseInt(e.target.value) || 1)
                          }
                          error={ef(`item.${idx}.qty`)}
                        />
                      </div>
                      <div className="col-span-3">
                        {idx === 0 && (
                          <p className="text-xs text-[#7E88C3] dark:text-[#888EB0] mb-2">
                            Price
                          </p>
                        )}
                        <Input
                          id={`item-${idx}-price-d`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            setItem(
                              idx,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          error={ef(`item.${idx}.price`)}
                        />
                      </div>
                      <div className="col-span-1">
                        {idx === 0 && (
                          <p className="text-xs text-[#7E88C3] dark:text-[#888EB0] mb-2">
                            Total
                          </p>
                        )}
                        <p className="py-3 font-bold text-[#888EB0] text-sm text-right">
                          {(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          aria-label={`Remove item ${item.name || idx + 1}`}
                          className="text-[#888EB0] hover:text-[#EC5757] transition pb-3"
                        >
                          <svg
                            width="13"
                            height="16"
                            viewBox="0 0 13 16"
                            fill="currentColor"
                          >
                            <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694c-.982 0-1.777-.796-1.777-1.778V3.556h10.666zM8.473 0l.888.889H13v1.778H0V.889h3.64L4.528 0h3.945z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="mt-4 w-full py-3 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition"
              >
                + Add New Item
              </button>
            </div>

            {/* Summary error list */}
            {hasSubmitted && Object.keys(errors).length > 0 && (
              <p role="alert" className="text-xs text-[#EC5757] mb-4">
                - All fields must be added
              </p>
            )}
          </form>
        </div>

        {/* ── Footer Buttons ── */}
        <div className="flex-shrink-0 px-6 md:px-14 py-5 bg-white dark:bg-[#141625] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
          {invoice ? (
            /* Edit mode */
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="invoice-form"
                className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition"
              >
                Save Changes
              </button>
            </div>
          ) : (
            /* New invoice mode */
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition"
              >
                Discard
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-5 py-3 rounded-full text-sm font-bold text-[#888EB0] dark:text-[#DFE3FA] bg-[#373B53] dark:bg-[#373B53] hover:bg-[#0C0E16] transition"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  form="invoice-form"
                  className="px-5 py-3 rounded-full text-sm font-bold text-white bg-[#7C5DFA] hover:bg-[#9277FF] transition"
                >
                  Save &amp; Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
