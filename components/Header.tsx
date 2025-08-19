import React, { useState, useEffect, useRef } from 'react';
import { LogoutIcon } from './icons/LogoutIcon';
import { BellIcon } from './icons/BellIcon';
import type { Product } from '../types';

type View = 'inventory' | 'shippingReport';

interface HeaderProps {
  onLogout: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
  lowStockProducts: Product[];
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentView, onViewChange, lowStockProducts }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const getButtonClass = (view: View) => {
    const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
    if (view === currentView) {
      return `${baseClass} bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300`;
    }
    return `${baseClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700`;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsRef]);
  
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Sales Portal Pro
            </h1>
            <nav className="flex items-center gap-2">
              <button onClick={() => onViewChange('inventory')} className={getButtonClass('inventory')}>
                Inventory
              </button>
              <button onClick={() => onViewChange('shippingReport')} className={getButtonClass('shippingReport')}>
                Shipping Report
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="relative p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="w-6 h-6" />
                {lowStockProducts.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-sm">Low Stock Alerts ({lowStockProducts.length})</h3>
                  </div>
                  {lowStockProducts.length > 0 ? (
                    <ul className="max-h-80 overflow-y-auto">
                      {lowStockProducts.map(p => {
                          const reserved = p.reservations.reduce((sum, r) => sum + r.quantity, 0);
                          const available = p.stock - reserved;
                          return (
                            <li key={p.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                              <p className="font-medium text-slate-800 dark:text-slate-200">{p.name}</p>
                              <p className="text-yellow-600 dark:text-yellow-400">Only {available} left in stock.</p>
                            </li>
                          );
                      })}
                    </ul>
                  ) : (
                    <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No low stock alerts.</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;