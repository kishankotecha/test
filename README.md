# Qissa Khawani - Restaurant Ordering System

A modern, full-featured restaurant ordering website built with **Next.js 14**, **React 18**, **Tailwind CSS**, and **TypeScript**. Perfect for North Indian restaurants with a demo ordering system.

## 🎨 Features

✨ **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Beautiful gradient designs and skewed elements
- Elegant typography with custom fonts

🛒 **Ordering System**
- Interactive menu with category filtering
- Add/remove items to cart
- Real-time price calculation
- Pickup or delivery options
- Customer details form
- Order confirmation flow
- WhatsApp integration ready

📱 **Mobile Optimized**
- Touch-friendly interface
- Mobile-first design approach
- Sticky cart button for quick access
- Responsive navigation

⚡ **Performance**
- Image optimization with Next.js Image component
- Lazy loading for menu items
- Optimized CSS with Tailwind
- Fast page load times

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher
- **npm** or **yarn** or **pnpm**

## 🚀 Getting Started

### 1. Clone or Download the Project

```bash
cd qissa-khawani
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### 4. Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
qissa-khawani/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout
│       ├── page.tsx            # Main page component
│       └── globals.css         # Global styles
├── public/                     # Static assets (add images here)
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🎯 Customization Guide

### 1. Update Restaurant Details

Edit `src/app/page.tsx` and update these sections:

```typescript
// Line ~200: Restaurant location
<p className="inline-flex items-center gap-2 font-bold text-cream">
  <MapPin className="size-4 text-accent-hot" /> 12, 100 Ft Road, Indiranagar
</p>

// Line ~210: Operating hours
<p className="inline-flex items-center gap-2">
  <Clock3 className="size-4 text-saffron" /> Open daily · 12pm–11pm
</p>
```

### 2. Add Your Own Images

Replace image URLs in the `menuItems` array with your own:

```typescript
const menuItems: MenuItem[] = [
  {
    id: 'chicken-biryani',
    name: 'Chicken Dum Biryani',
    // ... other properties
    image: 'YOUR_IMAGE_URL_HERE', // Replace with your image URL
  },
  // ... more items
];
```

**Recommended image sources:**
- Host images on services like Cloudinary, AWS S3, or Vercel Blob
- Use high-quality food photography (1024x768 minimum)
- Ensure images load quickly for better UX

### 3. Customize Colors

Edit `tailwind.config.ts` to change the brand colors:

```typescript
colors: {
  brand: '#1a1a1a',        // Dark background
  'brand-2': '#2d2d2d',
  cream: '#f5f1e8',        // Light text/background
  'accent-hot': '#ff6b35', // Hot orange accent
  saffron: '#ffd700',      // Golden yellow
  background: '#faf8f3',
}
```

### 4. Update Menu Items

Edit the `menuItems` array in `src/app/page.tsx`:

```typescript
const menuItems: MenuItem[] = [
  {
    id: 'unique-id',
    name: 'Dish Name',
    category: 'Biryani', // or 'Kebabs', 'Mains', 'Breads', 'Desserts'
    description: 'Brief description of the dish',
    price: 350,
    image: 'https://example.com/image.jpg',
    tag?: 'Optional tag', // e.g., 'House favourite', 'From the tandoor'
  },
  // ... more items
];
```

### 5. Add New Categories

1. Update the `Category` type:
```typescript
type Category = 'Biryani' | 'Kebabs' | 'Mains' | 'Breads' | 'Desserts' | 'NewCategory';
```

2. Add to categories array:
```typescript
const categories: Array<'All' | Category> = [
  'All',
  'Biryani',
  'Kebabs',
  'Mains',
  'Breads',
  'Desserts',
  'NewCategory', // Add here
];
```

3. Create menu items with the new category

### 6. Customize Fonts

The project uses Google Fonts. To change fonts, edit `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'YourFont', serif;
  --font-body: 'YourOtherFont', sans-serif;
}
```

## 🔗 WhatsApp Integration

To enable WhatsApp order handling:

1. Create a function to generate WhatsApp message link:

```typescript
const generateWhatsAppMessage = (
  customerName: string,
  phone: string,
  cartItems: CartItem[],
  totalPrice: number
) => {
  const itemsList = cartItems.map(item => `${item.name} x${item.quantity}`).join('%0A');
  const message = `Order from Qissa Khawani%0ACustomer: ${customerName}%0APhone: ${phone}%0A%0AItems:%0A${itemsList}%0A%0ATotal: ₹${totalPrice}`;
  return `https://wa.me/919XXXXXXXXX?text=${message}`;
};
```

2. Add WhatsApp number to environment variables:

Create `.env.local`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=919XXXXXXXXX
```

3. Update WhatsApp button to use the generated link

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect Next.js and configure it
5. Click Deploy

### Deploy on Other Platforms

**Netlify:**
- Build command: `npm run build`
- Publish directory: `.next`

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 SEO & Meta Tags

Update metadata in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Qissa Khawani — Stories Served Hot',
  description: 'Your restaurant description here',
  keywords: ['biryani', 'kebabs', 'indian', 'restaurant'],
  // ... other meta tags
};
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🎨 Tailwind CSS Customization

The project uses Tailwind CSS v3. Key utility classes used:

- `bg-brand` - Primary brand color
- `text-cream` - Primary text color
- `text-accent-hot` - Accent color for highlights
- `animate-rise-in` - Rise animation
- `animate-float-in` - Float animation
- `animate-stamp-in` - Stamp animation

## 📦 Dependencies

- **next**: React framework
- **react**: UI library
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

### Images Not Loading
- Check image URLs are correct and accessible
- Verify image dimensions (recommend 1024x768 minimum)
- Check browser console for CORS errors
- Add domain to `next.config.js` if using remote images

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips & Best Practices

1. **Performance**: Optimize images before uploading
2. **Mobile**: Test on real devices, not just browser dev tools
3. **Accessibility**: Use semantic HTML and ARIA labels
4. **SEO**: Keep meta descriptions under 160 characters
5. **Updates**: Regularly update dependencies: `npm update`

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Next.js documentation: [nextjs.org](https://nextjs.org)
3. Check Tailwind CSS docs: [tailwindcss.com](https://tailwindcss.com)

## 🚀 Next Steps

1. Add real restaurant images
2. Set up WhatsApp integration with backend
3. Add payment gateway integration
4. Implement order tracking
5. Set up email notifications
6. Add customer reviews system
7. Implement promotional banners

---

**Made with ❤️ for restaurants**
