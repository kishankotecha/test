const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'data');
fs.mkdirSync(dir, { recursive: true });

const settings = {
  name: 'Qissa Khawani',
  tagline:
    "We're an authentic north Indian eatery only trying to compete with your grandma at what we do.",
  phone: '+91 96867 54003',
  whatsappNumber: '919686754003',
  email: 'hello@qissakhawani.com',
  address: 'Indiranagar, Bengaluru',
  city: 'Bengaluru',
  openingTime: '12:00 PM',
  closingTime: '11:00 PM',
  instagram: 'https://instagram.com/qissakhawani',
};

const orders = [
  {
    id: 'QK-DEMO-1001',
    customerName: 'Ananya R.',
    phone: '9876543210',
    address: '12th Main, Indiranagar',
    orderMode: 'Delivery',
    items: [
      {
        menuItemId: 'lucknowi-dum-murgh',
        name: 'Lucknowi Dum Murgh Biryani',
        variantId: '3pcs',
        variantLabel: '3 Pcs',
        unitPrice: 380,
        quantity: 1,
      },
      {
        menuItemId: 'mango-lassi',
        name: 'Mango Lassi',
        variantId: 'glass',
        variantLabel: '1 Glass',
        unitPrice: 130,
        quantity: 2,
      },
    ],
    totalPrice: 640,
    totalItems: 3,
    note: 'Less spice please',
    createdAt: '2026-09-09T05:45:00.000Z',
    status: 'pending',
    source: 'website',
  },
  {
    id: 'QK-DEMO-1002',
    customerName: 'Rohan M.',
    phone: '9123456780',
    orderMode: 'Pickup',
    items: [
      {
        menuItemId: 'mutton-galouti',
        name: 'Mutton Galouti Kebab',
        variantId: '8pcs',
        variantLabel: '8 Pcs',
        unitPrice: 550,
        quantity: 1,
      },
      {
        menuItemId: 'ulte-tawa-paratha',
        name: 'Ulte Tawa Paratha',
        variantId: '1pc',
        variantLabel: '1 Pc',
        unitPrice: 40,
        quantity: 4,
      },
    ],
    totalPrice: 710,
    totalItems: 5,
    createdAt: '2026-09-09T04:20:00.000Z',
    status: 'preparing',
    source: 'website',
  },
  {
    id: 'QK-DEMO-1003',
    customerName: 'Priya S.',
    phone: '9988776655',
    address: '100 Ft Road, near metro',
    orderMode: 'Delivery',
    items: [
      {
        menuItemId: 'lucknowi-dum-gosht',
        name: 'Lucknowi Dum Gosht Biryani',
        variantId: '2pcs',
        variantLabel: '2 Pcs',
        unitPrice: 275,
        quantity: 2,
      },
      {
        menuItemId: 'shahi-tukda',
        name: 'Shahi Tukda',
        variantId: 'plate',
        variantLabel: '1 Plate',
        unitPrice: 175,
        quantity: 1,
      },
    ],
    totalPrice: 725,
    totalItems: 3,
    note: 'Call on arrival',
    createdAt: '2026-09-08T19:15:00.000Z',
    status: 'delivered',
    source: 'website',
  },
  {
    id: 'QK-DEMO-1004',
    customerName: 'Dev Shah',
    phone: '9001122334',
    orderMode: 'Pickup',
    items: [
      {
        menuItemId: 'bhuna-gosht-korma',
        name: 'Bhuna Gosht Korma',
        variantId: 'half',
        variantLabel: 'Half (3 Pcs)',
        unitPrice: 450,
        quantity: 1,
      },
      {
        menuItemId: 'dei-ka-paratha',
        name: 'Dei Ka Paratha',
        variantId: '2pcs',
        variantLabel: '2 Pcs',
        unitPrice: 130,
        quantity: 1,
      },
    ],
    totalPrice: 580,
    totalItems: 2,
    createdAt: '2026-09-08T13:50:00.000Z',
    status: 'confirmed',
    source: 'whatsapp',
  },
  {
    id: 'QK-DEMO-1005',
    customerName: 'Sana Iqbal',
    phone: '9812345678',
    address: 'HAL 2nd Stage',
    orderMode: 'Delivery',
    items: [
      {
        menuItemId: 'kalkatiya-dum-gosht',
        name: 'Kalkatiya Dum Gosht Biryani',
        variantId: '3pcs',
        variantLabel: '3 Pcs (1 egg, 1 potato)',
        unitPrice: 615,
        quantity: 1,
      },
      {
        menuItemId: 'kesari-lassi',
        name: 'Kesari Lassi',
        variantId: 'glass',
        variantLabel: '1 Glass',
        unitPrice: 150,
        quantity: 2,
      },
    ],
    totalPrice: 915,
    totalItems: 3,
    createdAt: '2026-09-07T20:05:00.000Z',
    status: 'ready',
    source: 'website',
  },
];

const testimonials = [
  {
    id: 't1',
    customerName: 'Ananya R.',
    message:
      'The Galouti literally melts. Ordered on WhatsApp before — this site made it so much easier.',
    rating: 5,
    approved: true,
    createdAt: '2026-09-07T10:20:00.000Z',
  },
  {
    id: 't2',
    customerName: 'Rohan M.',
    message:
      'Dum Gosht Biryani tastes like home. Confirmations are clear and the kitchen is on time.',
    rating: 5,
    approved: true,
    createdAt: '2026-09-06T18:05:00.000Z',
  },
  {
    id: 't3',
    customerName: 'Priya S.',
    message:
      'Finally an ordering flow that doesn’t need 10 Instagram DMs. Shahi Tukda is unreal.',
    rating: 5,
    approved: true,
    createdAt: '2026-09-05T14:40:00.000Z',
  },
  {
    id: 't4',
    customerName: 'Karthik V.',
    message:
      'Ordered Bhuna Murgh + Ulte Tawa Paratha for office. Packaging was solid, taste was fire.',
    rating: 5,
    approved: false,
    createdAt: '2026-09-09T05:10:00.000Z',
  },
  {
    id: 't5',
    customerName: 'Meera D.',
    message: 'Kesari Lassi is dangerous. Please never change the recipe.',
    rating: 4,
    approved: false,
    createdAt: '2026-09-08T20:30:00.000Z',
  },
];

fs.writeFileSync(path.join(dir, 'settings.json'), JSON.stringify(settings, null, 2));
fs.writeFileSync(path.join(dir, 'orders.json'), JSON.stringify(orders, null, 2));
fs.writeFileSync(path.join(dir, 'testimonials.json'), JSON.stringify(testimonials, null, 2));
console.log('Demo data written:', { orders: orders.length, testimonials: testimonials.length });
