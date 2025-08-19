import React, { useMemo } from 'react';
import type { Product } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';

interface QuotationGeneratorProps {
  products: Product[];
}

interface CustomerReservation {
  productName: string;
  quantity: number;
  unitPrice: number;
}

const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({ products }) => {
  const customerReservations = useMemo(() => {
    const map = new Map<string, CustomerReservation[]>();

    products.forEach(product => {
      product.reservations.forEach(res => {
        if (!map.has(res.customerName)) {
          map.set(res.customerName, []);
        }
        map.get(res.customerName)!.push({
          productName: product.name,
          quantity: res.quantity,
          unitPrice: res.unitPrice,
        });
      });
    });

    return map;
  }, [products]);

  const generatePdf = (customerName: string, reservations: CustomerReservation[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Quotation', 14, 22);
    doc.setFontSize(12);
    doc.text('Sales Portal Pro', 14, 30);
    
    // Customer Info
    doc.setFontSize(12);
    doc.text(`For: ${customerName}`, 14, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 52);

    // Table
    const tableData = reservations.map(res => {
      const total = res.quantity * res.unitPrice;
      return [
        res.productName,
        res.quantity.toString(),
        `$${res.unitPrice.toFixed(2)}`,
        `$${total.toFixed(2)}`,
      ];
    });

    const grandTotal = reservations.reduce((sum, res) => sum + (res.quantity * res.unitPrice), 0);
    
    autoTable(doc, {
      startY: 60,
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      didDrawPage: (data) => {
        // Footer
        const finalY = (data.cursor?.y ?? 0) + 10;
        doc.setFontSize(14);
        doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 14, finalY);
      },
    });

    doc.save(`Quotation-${customerName.replace(/\s/g, '_')}.pdf`);
  };
  
  if (customerReservations.size === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Customer Quotations</h2>
      <div className="space-y-3">
        {Array.from(customerReservations.entries()).map(([customerName, reservations]) => (
          <div key={customerName} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
            <span className="font-medium text-slate-800 dark:text-slate-200">{customerName}</span>
            <button
              onClick={() => generatePdf(customerName, reservations)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900 transition-colors"
              aria-label={`Generate quotation for ${customerName}`}
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Generate PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotationGenerator;
