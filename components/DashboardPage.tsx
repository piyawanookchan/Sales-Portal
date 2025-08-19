import React, { useState, useCallback } from 'react';
import type { Product, Reservation, Activity, ActivityType, ShippedOrder } from '../types';
import { ActivityType as AT } from '../types';
import Header from './Header';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import EditProductModal from './EditProductModal';
import ConfirmationModal from './ConfirmationModal';
import ProductReportModal from './ProductReportModal';
import ShippingReportPage from './ShippingReportPage';

const initialProducts: Product[] = [
  { 
    id: 1, 
    name: 'Quantum Laptop Pro', 
    stock: 20,
    basePrice: 1499.99,
    reservations: [
      { id: 101, customerName: 'Alice Johnson', quantity: 2, unitPrice: 1450.00 },
      { id: 102, customerName: 'Bob Smith', quantity: 1, unitPrice: 1499.99 },
    ],
    shippedOrders: [],
    activityLog: [
      { id: 1, type: AT.PRODUCT_CREATED, date: new Date('2023-10-01T10:00:00Z').toISOString(), details: { notes: 'Initial stock of 10 units' } },
      { id: 2, type: AT.STOCK_ADDED, date: new Date('2023-10-05T14:20:00Z').toISOString(), details: { quantity: 10 } },
      { id: 3, type: AT.RESERVED, date: new Date('2023-10-06T11:30:00Z').toISOString(), details: { customerName: 'Alice Johnson', quantity: 2, unitPrice: 1450.00 } },
      { id: 4, type: AT.RESERVED, date: new Date('2023-10-07T16:00:00Z').toISOString(), details: { customerName: 'Bob Smith', quantity: 1, unitPrice: 1499.99 } },
    ]
  },
  { id: 2, name: 'Cybernetic Mouse X1', stock: 50, basePrice: 79.99, reservations: [
    { id: 201, customerName: 'Alice Johnson', quantity: 1, unitPrice: 75.00 },
  ], shippedOrders: [], activityLog: []},
  { id: 3, name: 'Hyper-Thread Keyboard', stock: 35, basePrice: 129.50, reservations: [
      { id: 301, customerName: 'Charlie Brown', quantity: 5, unitPrice: 120.00 }
  ], shippedOrders: [], activityLog: []},
  { id: 4, name: '4K Flexi-Monitor', stock: 15, basePrice: 499.00, reservations: [], shippedOrders: [], activityLog: [] },
];

type View = 'inventory' | 'shippingReport';

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productForReport, setProductForReport] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<View>('inventory');

  const handleAddProduct = useCallback((name: string, stock: number, basePrice: number): void => {
    if (name.trim() === '' || stock < 0 || basePrice < 0) return;
    const newActivity: Activity = {
      id: Date.now(),
      type: AT.PRODUCT_CREATED,
      date: new Date().toISOString(),
      details: {
        notes: `Initial stock of ${stock} units.`
      }
    };
    const newProduct: Product = {
      id: Date.now() + 1,
      name: name.trim(),
      stock,
      basePrice,
      reservations: [],
      shippedOrders: [],
      activityLog: [newActivity]
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  }, []);
  
  const handleOpenEditModal = useCallback((product: Product): void => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback((): void => {
    setProductToEdit(null);
    setIsEditModalOpen(false);
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

  const handleReserveProduct = useCallback((productId: number, customerName: string, quantity: number, unitPrice: number): void => {
    const newReservation: Reservation = { id: Date.now(), customerName, quantity, unitPrice };
    const newActivity: Activity = {
      id: Date.now() + 1,
      type: AT.RESERVED,
      date: new Date().toISOString(),
      details: { customerName, quantity, unitPrice }
    };

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const reservedQuantity = p.reservations.reduce((sum, r) => sum + r.quantity, 0);
          const availableStock = p.stock - reservedQuantity;
          if (quantity > 0 && quantity <= availableStock) {
            return { 
              ...p, 
              reservations: [...p.reservations, newReservation],
              activityLog: [...p.activityLog, newActivity] 
            };
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
          const reservationToCancel = p.reservations.find(r => r.id === reservationId);
          if (!reservationToCancel) return p;

          const newActivity: Activity = {
            id: Date.now(),
            type: AT.RESERVATION_CANCELLED,
            date: new Date().toISOString(),
            details: {
              customerName: reservationToCancel.customerName,
              quantity: reservationToCancel.quantity
            }
          };

          return {
            ...p,
            reservations: p.reservations.filter(r => r.id !== reservationId),
            activityLog: [...p.activityLog, newActivity]
          };
        }
        return p;
      })
    );
  }, []);

  const handleAddStock = useCallback((productId: number, quantityToAdd: number): void => {
    if (quantityToAdd <= 0) return;
    const newActivity: Activity = {
      id: Date.now(),
      type: AT.STOCK_ADDED,
      date: new Date().toISOString(),
      details: { quantity: quantityToAdd }
    };
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { 
          ...p, 
          stock: p.stock + quantityToAdd,
          activityLog: [...p.activityLog, newActivity]
        } : p
      )
    );
  }, []);

  const handleShipOrder = useCallback((productId: number, reservationId: number): void => {
    setProducts(prevProducts => 
      prevProducts.map(p => {
        if (p.id !== productId) return p;

        const reservationToShip = p.reservations.find(r => r.id === reservationId);
        if (!reservationToShip) return p;

        const newShippedOrder: ShippedOrder = {
          ...reservationToShip,
          shippedDate: new Date().toISOString(),
        };

        const newActivity: Activity = {
          id: Date.now(),
          type: AT.ORDER_SHIPPED,
          date: new Date().toISOString(),
          details: {
            customerName: reservationToShip.customerName,
            quantity: reservationToShip.quantity,
            unitPrice: reservationToShip.unitPrice,
          }
        };

        return {
          ...p,
          stock: p.stock - reservationToShip.quantity,
          reservations: p.reservations.filter(r => r.id !== reservationId),
          shippedOrders: [...p.shippedOrders, newShippedOrder],
          activityLog: [...p.activityLog, newActivity]
        };
      })
    );
  }, []);

  const handleShowReport = useCallback((product: Product) => {
    setProductForReport(product);
  }, []);

  const handleCloseReport = useCallback(() => {
    setProductForReport(null);
  }, []);


  return (
    <>
      <Header 
        onLogout={onLogout} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'inventory' ? (
          <div className="max-w-4xl mx-auto">
            <AddProductForm onAddProduct={handleAddProduct} />
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Product Inventory</h2>
              <ProductList
                products={products}
                onReserveProduct={handleReserveProduct}
                onDeleteProduct={handleOpenDeleteModal}
                onEditProduct={handleOpenEditModal}
                onCancelReservation={handleCancelReservation}
                onAddStock={handleAddStock}
                onShowReport={handleShowReport}
                onShipOrder={handleShipOrder}
              />
            </div>
          </div>
        ) : (
          <ShippingReportPage products={products} />
        )}
      </main>
      {isEditModalOpen && productToEdit && (
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
      {productForReport && (
        <ProductReportModal 
          product={productForReport}
          onClose={handleCloseReport}
        />
      )}
    </>
  );
};

export default DashboardPage;