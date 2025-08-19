import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface AddProductFormProps {
  onAddProduct: (name: string, stock: number) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
  const [productName, setProductName] = useState<string>('');
  const [stock, setStock] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const stockNumber = parseInt(stock, 10);
    if (productName.trim() && !isNaN(stockNumber) && stockNumber >= 0) {
      onAddProduct(productName, stockNumber);
      setProductName('');
      setStock('');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name..."
          className="flex-grow px-4 py-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500"
          required
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock quantity"
          className="px-4 py-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-32"
          required
          min="0"
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
