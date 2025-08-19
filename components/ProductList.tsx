import React from 'react';
import type { Product } from '../types';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: Product[];
  onReserveProduct: (id: number, customerName: string, quantity: number) => void;
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: Product) => void;
  onCancelReservation: (productId: number, reservationId: number) => void;
  onAddStock: (productId: number, quantityToAdd: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onReserveProduct,
  onDeleteProduct,
  onEditProduct,
  onCancelReservation,
  onAddStock,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium">No Products Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Try adding a new product to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onReserveProduct={onReserveProduct}
          onDeleteProduct={onDeleteProduct}
          onEditProduct={onEditProduct}
          onCancelReservation={onCancelReservation}
          onAddStock={onAddStock}
        />
      ))}
    </div>
  );
};

export default ProductList;