import React, { useState, useMemo } from 'react';
import type { Product, Activity } from '../types';
import { ActivityType } from '../types';

interface ProductReportModalProps {
  product: Product;
  onClose: () => void;
}

const ProductReportModal: React.FC<ProductReportModalProps> = ({ product, onClose }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredActivities = useMemo(() => {
    return product.activityLog
      .filter(activity => {
        const activityDate = new Date(activity.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && activityDate < start) return false;
        if (end) {
            // Include the whole day
            end.setHours(23, 59, 59, 999);
            if (activityDate > end) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [product.activityLog, startDate, endDate]);

  const formatActivityDetails = (activity: Activity): string => {
    const { type, details } = activity;
    switch (type) {
      case ActivityType.PRODUCT_CREATED:
        return details.notes || 'Product was added to the inventory.';
      case ActivityType.STOCK_ADDED:
        return `Added ${details.quantity} unit(s) to stock.`;
      case ActivityType.RESERVED:
        return `Reserved ${details.quantity} unit(s) for ${details.customerName} at $${details.unitPrice?.toFixed(2)}/unit.`;
      case ActivityType.RESERVATION_CANCELLED:
        return `Reservation for ${details.quantity} unit(s) by ${details.customerName} was cancelled.`;
      case ActivityType.ORDER_SHIPPED:
        return `Shipped ${details.quantity} unit(s) to ${details.customerName}.`;
      default:
        return 'Unknown activity.';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Activity Report for <span className="text-primary-600 dark:text-primary-400">{product.name}</span>
        </h2>
        
        {/* Filter Section */}
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-md">
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input 
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input 
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>
        </div>

        {/* Activity List */}
        <div className="flex-grow overflow-y-auto pr-2">
            {filteredActivities.length > 0 ? (
                <ul className="space-y-3">
                    {filteredActivities.map(activity => (
                        <li key={activity.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.type}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{formatActivityDetails(activity)}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(activity.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center py-8 text-slate-500 dark:text-slate-400">No activities found for the selected date range.</p>
            )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReportModal;