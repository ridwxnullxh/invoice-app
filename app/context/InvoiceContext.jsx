import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "invoice-app-data";

const SEED_INVOICES = [
  {
    id: "RT3080",
    status: "paid",
    dueDate: "19 Aug 2021",
    client: "Jensen Huang",
    amount: 1800.9,
    invoiceDate: "2021-08-05",
    paymentTerms: "Net 30 Days",
    projectDescription: "Re-branding",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "Jensen Huang", email: "jensen@nvidia.com", street: "106 Kendell Street", city: "Sharrington", postCode: "NR24 5WQ", country: "United Kingdom" },
    items: [{ name: "Brand Guidelines", qty: 1, price: 1800.9 }],
  },
  {
    id: "XM9141",
    status: "pending",
    dueDate: "20 Sep 2021",
    client: "Alex Grim",
    amount: 556,
    invoiceDate: "2021-08-21",
    paymentTerms: "Net 30 Days",
    projectDescription: "Graphic Design",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "Alex Grim", email: "alexgrim@mail.com", street: "84 Church Way", city: "Bradford", postCode: "BD1 9PB", country: "United Kingdom" },
    items: [
      { name: "Banner Design", qty: 1, price: 156 },
      { name: "Email Design", qty: 2, price: 200 },
    ],
  },
  {
    id: "RG0314",
    status: "paid",
    dueDate: "01 Oct 2021",
    client: "John Morrison",
    amount: 14002.33,
    invoiceDate: "2021-09-01",
    paymentTerms: "Net 30 Days",
    projectDescription: "Website Redesign",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "John Morrison", email: "jm@myco.com", street: "79 Dover Road", city: "Westhall", postCode: "IP19 3PF", country: "United Kingdom" },
    items: [{ name: "Website Redesign", qty: 1, price: 14002.33 }],
  },
  {
    id: "RT2080",
    status: "pending",
    dueDate: "12 Oct 2021",
    client: "Alysa Werner",
    amount: 102.04,
    invoiceDate: "2021-09-12",
    paymentTerms: "Net 30 Days",
    projectDescription: "Logo Redesign",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "Alysa Werner", email: "alysa@email.co.uk", street: "63 Warwick Road", city: "Carlisle", postCode: "CA20 2TG", country: "United Kingdom" },
    items: [{ name: "Logo Redesign", qty: 1, price: 102.04 }],
  },
  {
    id: "AA1449",
    status: "pending",
    dueDate: "14 Oct 2021",
    client: "Mellisa Clarke",
    amount: 4032.33,
    invoiceDate: "2021-09-14",
    paymentTerms: "Net 30 Days",
    projectDescription: "Premium Package",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "Mellisa Clarke", email: "mellisa@clarkebrands.com", street: "46 Abbey Row", city: "Cambridge", postCode: "CB5 6EG", country: "United Kingdom" },
    items: [
      { name: "New Logo", qty: 1, price: 1532.33 },
      { name: "Brand Guidelines", qty: 1, price: 2500 },
    ],
  },
  {
    id: "TY9141",
    status: "pending",
    dueDate: "31 Oct 2021",
    client: "Thomas Wayne",
    amount: 6155.91,
    invoiceDate: "2021-10-01",
    paymentTerms: "Net 30 Days",
    projectDescription: "Landing Page Design",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "Thomas Wayne", email: "thomas@dc.com", street: "3 Gotham Avenue", city: "Gotham", postCode: "GOT 1AM", country: "United States" },
    items: [{ name: "Landing Page Design", qty: 1, price: 6155.91 }],
  },
  {
    id: "FV2353",
    status: "draft",
    dueDate: "12 Nov 2021",
    client: "Anita Wainwright",
    amount: 3102.04,
    invoiceDate: "2021-10-13",
    paymentTerms: "Net 30 Days",
    projectDescription: "Logo & Brand Assets",
    billFrom: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    billTo: { name: "Anita Wainwright", email: "", street: "", city: "", postCode: "", country: "" },
    items: [{ name: "Logo Design", qty: 1, price: 3102.04 }],
  },
];

function loadFromStorage() {
  // SSR-safe: localStorage only available in browser
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(invoices) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {}
}

function generateId() {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const r = (n) => Math.floor(Math.random() * n);
  return L[r(26)] + L[r(26)] + r(10) + r(10) + r(10) + r(10);
}

function formatDueDate(dateObj) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

function calculateDueDate(invoiceDate, paymentTerms) {
  if (!invoiceDate || !paymentTerms) return "";
  const days = parseInt(paymentTerms.replace(/[^0-9]/g, "")) || 0;
  const date = new Date(invoiceDate);
  if (isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return formatDueDate(date);
}

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(SEED_INVOICES);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) setInvoices(stored);
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever invoices change (after hydration)
  useEffect(() => {
    if (hydrated) saveToStorage(invoices);
  }, [invoices, hydrated]);

  const addInvoice = useCallback((data) => {
    const invoice = {
      ...data,
      id: generateId(),
      dueDate: calculateDueDate(data.invoiceDate, data.paymentTerms),
      client: data.billTo?.name || "",
      amount: data.items.reduce((s, i) => s + i.qty * i.price, 0),
    };
    setInvoices((prev) => [invoice, ...prev]);
    return invoice;
  }, []);

  const updateInvoice = useCallback((id, data) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...data,
              dueDate: calculateDueDate(data.invoiceDate || inv.invoiceDate, data.paymentTerms || inv.paymentTerms),
              client: data.billTo?.name || inv.client,
              amount: data.items.reduce((s, i) => s + i.qty * i.price, 0),
            }
          : inv
      )
    );
  }, []);

  const deleteInvoice = useCallback((id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  const markAsPaid = useCallback((id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );
  }, []);

  return (
    <InvoiceContext.Provider
      value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}
