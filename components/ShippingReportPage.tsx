import React, { useState, useMemo } from 'react';
import type { Product, ShippedOrder } from '../types';

interface ShippingReportPageProps {
  products: Product[];
}

interface ShippedOrderWithProduct extends ShippedOrder {
  productName: string;
}

const ShippingReportPage: React.FC<ShippingReportPageProps> = ({ products }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const allShippedOrders = useMemo((): ShippedOrderWithProduct[] => {
    const orders: ShippedOrderWithProduct[] = [];
    products.forEach(product => {
      product.shippedOrders.forEach(order => {
        orders.push({ ...order, productName: product.name });
      });
    });
    return orders;
  }, [products]);

  const filteredShippedOrders = useMemo(() => {
    return allShippedOrders
      .filter(order => {
        const shippedDate = new Date(order.shippedDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && shippedDate < start) return false;
        if (end) {
          end.setHours(23, 59, 59, 999);
          if (shippedDate > end) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.shippedDate).getTime() - new Date(a.shippedDate).getTime());
  }, [allShippedOrders, startDate, endDate]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Shipped Orders Report</h2>

        {/* Filter Section */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-md">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-grow">
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input 
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div className="flex-grow">
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input 
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="px-4 py-2 text-sm bg-slate-200 text-slate-700 font-medium rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors w-full sm:w-auto"
                >
                  Clear Filters
                </button>
            </div>
        </div>

        {/* Shipped Orders Table */}
        <div className="overflow-x-auto">
          {filteredShippedOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Shipped Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredShippedOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{order.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{order.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">${order.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">${(order.quantity * order.unitPrice).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(order.shippedDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <p className="text-center py-12 text-slate-500 dark:text-slate-400">No shipped orders found for the selected date range.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingReportPage;