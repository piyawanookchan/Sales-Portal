import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface AddProductFormProps {
  onAddProduct: (name: string, stock: number, basePrice: number) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
  const [productName, setProductName] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [basePrice, setBasePrice] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const stockNumber = parseInt(stock, 10);
    const priceNumber = parseFloat(basePrice);
    if (productName.trim() && !isNaN(stockNumber) && stockNumber >= 0 && !isNaN(priceNumber) && priceNumber >= 0) {
      onAddProduct(productName, stockNumber, priceNumber);
      setProductName('');
      setStock('');
      setBasePrice('');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-4">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product name"
          className="flex-grow px-4 py-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500 min-w-[200px]"
          required
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className="px-4 py-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-28"
          required
          min="0"
        />
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          placeholder="Base Price ($)"
          className="px-4 py-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-32"
          required
          min="0"
          step="0.01"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;