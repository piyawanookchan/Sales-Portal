import React from 'react';
import { LogoutIcon } from './icons/LogoutIcon';

type View = 'inventory' | 'shippingReport';

interface HeaderProps {
  onLogout: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentView, onViewChange }) => {
  const getButtonClass = (view: View) => {
    const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
    if (view === currentView) {
      return `${baseClass} bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300`;
    }
    return `${baseClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700`;
  }
  
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
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
    </header>
  );
};

export default Header;