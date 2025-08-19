export interface Reservation {
  id: number;
  customerName: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippedOrder extends Reservation {
  shippedDate: string; // ISO string
}

export enum ActivityType {
  PRODUCT_CREATED = 'Product Created',
  STOCK_ADDED = 'Stock Added',
  RESERVED = 'Product Reserved',
  RESERVATION_CANCELLED = 'Reservation Cancelled',
  ORDER_SHIPPED = 'Order Shipped',
}

export interface Activity {
  id: number;
  type: ActivityType;
  date: string; // ISO string
  details: {
    quantity?: number;
    customerName?: string;
    unitPrice?: number;
    notes?: string;
  };
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  basePrice: number;
  reservations: Reservation[];
  shippedOrders: ShippedOrder[];
  activityLog: Activity[];
}