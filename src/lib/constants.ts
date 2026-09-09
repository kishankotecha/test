/**
 * Restaurant Configuration
 */
export const RESTAURANT = {
  name: 'Qissa Khawani',
  tagline: 'Stories Served Hot',
  phone: process.env.NEXT_PUBLIC_RESTAURANT_PHONE || '+91-XXXXXXXXXX',
  email: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || 'info@qissakhawani.com',
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || '12, 100 Ft Road, Indiranagar, Bengaluru',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  openingTime: '12:00 PM',
  closingTime: '11:00 PM',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX',
};

/**
 * Menu Categories
 */
export const MENU_CATEGORIES = [
  'All',
  'Biryani',
  'Kebabs',
  'Mains',
  'Breads',
  'Desserts',
] as const;

/**
 * Order Modes
 */
export const ORDER_MODES = {
  PICKUP: 'Pickup',
  DELIVERY: 'Delivery',
} as const;

/**
 * Order Status
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
} as const;

/**
 * UI Constants
 */
export const UI = {
  animationDuration: 300,
  debounceDelay: 500,
  throttleDelay: 1000,
};

/**
 * Validation Rules
 */
export const VALIDATION = {
  MIN_PHONE_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 200,
  MAX_NOTE_LENGTH: 500,
};

/**
 * Image Sizes
 */
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 300, height: 300 },
  SMALL: { width: 400, height: 300 },
  MEDIUM: { width: 600, height: 450 },
  LARGE: { width: 1024, height: 768 },
  HERO: { width: 1920, height: 1280 },
};

/**
 * Social Media Links (add your profiles)
 */
export const SOCIAL_MEDIA = {
  instagram: 'https://instagram.com/qissakhawani',
  facebook: 'https://facebook.com/qissakhawani',
  twitter: 'https://twitter.com/qissakhawani',
  whatsapp: `https://wa.me/${RESTAURANT.whatsappNumber}`,
};

/**
 * Payment Methods (for future implementation)
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet',
};

/**
 * Delivery Charges
 */
export const DELIVERY_CHARGES = {
  FREE_ABOVE: 500, // Free delivery above ₹500
  CHARGE: 50, // Delivery charge if below
};

/**
 * Discount Codes (for future implementation)
 */
export const DISCOUNT_CODES = {
  WELCOME10: { code: 'WELCOME10', discount: 10, description: 'Welcome discount' },
  FIRST20: { code: 'FIRST20', discount: 20, description: 'First order discount' },
};

/**
 * Rating Configuration
 */
export const RATING = {
  DISPLAY_RATING: 4.9,
  TOTAL_RATINGS: 2300,
};

/**
 * SEO
 */
export const SEO = {
  siteName: 'Qissa Khawani',
  siteDescription:
    'Authentic North Indian & Hyderabadi Biryani, Kebabs and slow-cooked curries in Indiranagar, Bengaluru',
  keywords: [
    'biryani',
    'kebabs',
    'north indian',
    'hyderabadi',
    'indiranagar',
    'bengaluru',
    'restaurant',
    'food delivery',
  ],
};
