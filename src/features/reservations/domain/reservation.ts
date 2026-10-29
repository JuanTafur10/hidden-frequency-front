export interface ReservationInput {
  productId?: number;
  requestedItem: string;
  notes?: string;
}

export interface ReservationUpdateInput {
  requestedItem?: string;
  notes?: string | null;
}

export interface Reservation {
  id: string;
  userId: string;
  productId: number | null;
  requestedItem: string;
  status: string;
  notes: string | null;
  createdAt: string;
  product: { id: number; title: string; category: string; price: number; imageUrl: string } | null;
  user?: { id: string; name: string; email: string };
}
