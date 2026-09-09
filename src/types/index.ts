export type OrderMode = 'Pickup' | 'Delivery';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface PriceVariant {
  id: string;
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  image: string;
  tag?: string;
  available: boolean;
  variants: PriceVariant[];
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountPercent?: number;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  orderId?: string;
}

export interface OrderLine {
  menuItemId: string;
  name: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  orderMode: OrderMode;
  items: OrderLine[];
  totalPrice: number;
  totalItems: number;
  note?: string;
  createdAt: string;
  status: OrderStatus;
  source: 'website' | 'whatsapp';
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  openingTime: string;
  closingTime: string;
  instagram: string;
}
