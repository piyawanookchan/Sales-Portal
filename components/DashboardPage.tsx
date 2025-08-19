import React, { useState, useCallback } from 'react';
import type { Product, Reservation } from '../types';
import Header from './Header';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import EditProductModal from './EditProductModal';
import ConfirmationModal from './ConfirmationModal';

const initialProducts: Product[] = [
  { 
    id: 1, 
    name: 'Quantum Laptop Pro', 
    stock: 20,
    reservations: [
      { id: 101, customerName: 'Alice Johnson', quantity: 2 },
      { id: 102, customerName: 'Bob Smith', quantity: 1 },
    ]
  },
  { id: 2, name: 'Cybernetic Mouse X1', stock: 50, reservations: [] },
  { id: 3, name: 'Hyper-Thread Keyboard', stock: 35, reservations: [
      { id: 301, customerName: 'Charlie Brown', quantity: 5 }
  ]},
  { id: 4, name: '4K Flexi-Monitor', stock: 15, reservations: [] },
];

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleAddProduct = useCallback((name: string, stock: number): void => {
    if (name.trim() === '' || stock < 0) return;
    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      stock,
      reservations: [],
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  }, []);
  
  const handleOpenEditModal = useCallback((product: Product): void => {
    setProductToEdit(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback((): void => {
    setProductToEdit(null);
    setIsModalOpen(false);
  }, []);
  
  const handleUpdateProduct = useCallback((id: number, newName: string): void => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === id ? { ...p, name: newName } : p))
    );
    handleCloseEditModal();
  }, [handleCloseEditModal]);

  const handleOpenDeleteModal = useCallback((product: Product): void => {
    setProductToDelete(product);
  }, []);

  const handleCloseDeleteModal = useCallback((): void => {
    setProductToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback((): void => {
    if (!productToDelete) return;
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
    handleCloseDeleteModal();
  }, [productToDelete, handleCloseDeleteModal]);

  const handleReserveProduct = useCallback((productId: number, customerName: string, quantity: number): void => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const reservedQuantity = p.reservations.reduce((sum, r) => sum + r.quantity, 0);
          const availableStock = p.stock - reservedQuantity;
          if (quantity > 0 && quantity <= availableStock) {
            const newReservation: Reservation = {
              id: Date.now(),
              customerName,
              quantity,
            };
            return { ...p, reservations: [...p.reservations, newReservation] };
          }
        }
        return p;
      })
    );
  }, []);
  
  const handleCancelReservation = useCallback((productId: number, reservationId: number): void => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            reservations: p.reservations.filter(r => r.id !== reservationId)
          };
        }
        return p;
      })
    );
  }, []);

  const handleAddStock = useCallback((productId: number, quantityToAdd: number): void => {
    if (quantityToAdd <= 0) return;
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock + quantityToAdd } : p
      )
    );
  }, []);


  return (
    <>
      <Header onLogout={onLogout} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AddProductForm onAddProduct={handleAddProduct} />
          <ProductList
            products={products}
            onReserveProduct={handleReserveProduct}
            onDeleteProduct={handleOpenDeleteModal}
            onEditProduct={handleOpenEditModal}
            onCancelReservation={handleCancelReservation}
            onAddStock={handleAddStock}
          />
        </div>
      </main>
      {isModalOpen && productToEdit && (
        <EditProductModal
          product={productToEdit}
          onClose={handleCloseEditModal}
          onSave={handleUpdateProduct}
        />
      )}
      {productToDelete && (
        <ConfirmationModal
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          confirmButtonText="Delete"
        />
      )}
    </>
  );
};

export default DashboardPage;