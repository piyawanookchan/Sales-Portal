export interface Reservation {
  id: number;
  customerName: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  reservations: Reservation[];
}
