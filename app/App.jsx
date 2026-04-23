import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { InvoiceProvider } from "./context/InvoiceContext.jsx";
import Layout from "./components/Layout.jsx";
import InvoicesPage from "./pages/InvoicesPage.jsx";
import ViewInvoicePage from "./pages/ViewInvoicePage.jsx";

export default function App() {
  const [currentPage, setCurrentPage]     = useState("invoices");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoiceId(invoice.id);
    setCurrentPage("view");
  };

  const handleGoBack = () => {
    setCurrentPage("invoices");
    setSelectedInvoiceId(null);
  };

  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Layout>
          {currentPage === "invoices" && (
            <InvoicesPage onViewInvoice={handleViewInvoice} />
          )}
          {currentPage === "view" && (
            <ViewInvoicePage
              invoiceId={selectedInvoiceId}
              onGoBack={handleGoBack}
            />
          )}
        </Layout>
      </InvoiceProvider>
    </ThemeProvider>
  );
}
