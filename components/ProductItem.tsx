import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ArchiveBoxPlusIcon } from './icons/ArchiveBoxPlusIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { TruckIcon } from './icons/TruckIcon';

interface ProductItemProps {
  product: Product;
  onReserveProduct: (id: number, customerName: string, quantity: number, unitPrice: number) => void;
  onDeleteProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onCancelReservation: (productId: number, reservationId: number) => void;
  onAddStock: (productId: number, quantityToAdd: number) => void;
  onShowReport: (product: Product) => void;
  onShipOrder: (productId: number, reservationId: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onReserveProduct,
  onDeleteProduct,
  onEditProduct,
  onCancelReservation,
  onAddStock,
  onShowReport,
  onShipOrder,
}) => {
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unitPrice, setUnitPrice] = useState<string>(product.basePrice.toString());

  const [isAddingStock, setIsAddingStock] = useState<boolean>(false);
  const [stockToAdd, setStockToAdd] = useState<string>('');

  const { reservedQuantity, availableStock } = useMemo(() => {
    const reserved = product.reservations.reduce((sum, r) => sum + r.quantity, 0);
    return {
      reservedQuantity: reserved,
      availableStock: product.stock - reserved,
    };
  }, [product.stock, product.reservations]);

  const handleReserveClick = (): void => {
    setUnitPrice(product.basePrice.toString());
    setIsReserving(true);
  };
  
  const handleCancelReservationForm = (): void => {
    setIsReserving(false);
    setCustomerName('');
    setQuantity('1');
    setUnitPrice(product.basePrice.toString());
  }

  const handleReserveSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const numQuantity = parseInt(quantity, 10);
    const numPrice = parseFloat(unitPrice);
    if (customerName.trim() && !isNaN(numQuantity) && numQuantity > 0 && numQuantity <= availableStock && !isNaN(numPrice) && numPrice >= 0) {
      onReserveProduct(product.id, customerName.trim(), numQuantity, numPrice);
      handleCancelReservationForm();
    }
  };

  const handleAddStockClick = (): void => {
    setIsAddingStock(true);
  };

  const handleCancelAddStock = (): void => {
    setIsAddingStock(false);
    setStockToAdd('');
  };

  const handleAddStockSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const numStockToAdd = parseInt(stockToAdd, 10);
    if (!isNaN(numStockToAdd) && numStockToAdd > 0) {
      onAddStock(product.id, numStockToAdd);
      handleCancelAddStock();
    }
  };

  const availableStockClass = availableStock > 0
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col gap-4 transition-shadow hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-grow">
          <p className="font-semibold text-lg text-slate-900 dark:text-white">{product.name}</p>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
            <span>Stock: <span className="font-medium text-slate-700 dark:text-slate-300">{product.stock}</span></span>
            <span>Reserved: <span className="font-medium text-slate-700 dark:text-slate-300">{reservedQuantity}</span></span>
            <span>Available: <span className={`font-medium ${availableStockClass}`}>{availableStock}</span></span>
            <span>Base Price: <span className="font-medium text-slate-700 dark:text-slate-300">${product.basePrice.toFixed(2)}</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 self-start">
            <button
              onClick={() => onShowReport(product)}
              className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Product Report"
            >
              <ChartBarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddStockClick}
              className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Add Stock"
            >
              <ArchiveBoxPlusIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEditProduct(product)}
              className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Edit Product"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDeleteProduct(product)}
              className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Delete Product"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      {isAddingStock && (
        <form onSubmit={handleAddStockSubmit} className="flex flex-col sm:flex-row gap-2 p-2 -m-2 bg-slate-50 dark:bg-slate-900/50 rounded-md">
            <input
              type="number"
              value={stockToAdd}
              onChange={(e) => setStockToAdd(e.target.value)}
              placeholder="Quantity to add"
              className="flex-grow px-3 py-2 text-sm border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
              required
              min="1"
            />
            <div className="flex gap-2">
              <button type="submit" className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex-grow sm:flex-grow-0">
                <CheckIcon className="w-5 h-5"/>
              </button>
               <button type="button" onClick={handleCancelAddStock} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md flex-grow sm:flex-grow-0">
                Cancel
              </button>
            </div>
        </form>
      )}

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <h4 className="font-semibold text-md mb-3 text-slate-800 dark:text-slate-200">Reservations</h4>
        
        {!isReserving && availableStock > 0 && (
          <button 
            onClick={handleReserveClick}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900 transition-colors"
          >
            Add Reservation
          </button>
        )}

        {isReserving && (
          <form onSubmit={handleReserveSubmit} className="flex flex-col sm:flex-row flex-wrap gap-2 p-2 -m-2 bg-slate-50 dark:bg-slate-900/50 rounded-md">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="flex-grow px-3 py-2 text-sm border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
              required
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="px-3 py-2 text-sm border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 w-full sm:w-20 focus:ring-primary-500 focus:border-primary-500"
              required
              min="1"
              max={availableStock}
            />
             <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="Unit Price"
              className="px-3 py-2 text-sm border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 w-full sm:w-28 focus:ring-primary-500 focus:border-primary-500"
              required
              min="0"
              step="0.01"
            />
            <div className="flex gap-2 ml-auto">
              <button type="submit" className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex-grow sm:flex-grow-0">
                <CheckIcon className="w-5 h-5"/>
              </button>
               <button type="button" onClick={handleCancelReservationForm} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md flex-grow sm:flex-grow-0">
                Cancel
              </button>
            </div>
          </form>
        )}

        {product.reservations.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {product.reservations.map(res => (
              <li key={res.id} className="flex justify-between items-center p-2 rounded-md bg-slate-50 dark:bg-slate-700/50">
                <div className="text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{res.customerName}</span>
                  <span className="text-slate-500 dark:text-slate-400"> - Qty: {res.quantity} @ ${res.unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => onShipOrder(product.id, res.id)}
                    className="p-1 text-slate-400 hover:text-green-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label={`Ship order for ${res.customerName}`}
                  >
                    <TruckIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onCancelReservation(product.id, res.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label={`Cancel reservation for ${res.customerName}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No active reservations for this product.</p>
        )}
      </div>
    </div>
  );
};

export default ProductItem;