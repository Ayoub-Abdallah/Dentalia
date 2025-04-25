import { useEffect } from 'react';
import { useInvoiceStore } from '../store/invoiceStore';

export default function Invoices() {
  const { invoices, isLoading, error, fetchInvoices } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices.map((invoice) => (
          <div key={invoice._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Invoice #{invoice._id}</h2>
            <p className="text-gray-600">Patient: {invoice.patientName}</p>
            <p className="text-gray-600">Status: {invoice.status}</p>
            <p className="text-gray-600">Total: ${invoice.total}</p>
            <p className="text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 