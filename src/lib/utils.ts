import type { Order, OrderLine, RestaurantSettings } from '@/types';

export function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function buildWhatsAppOrderMessage(
  order: Pick<
    Order,
    'id' | 'customerName' | 'phone' | 'address' | 'orderMode' | 'items' | 'totalPrice' | 'note'
  >
) {
  const lines = [
    `*New order — Qissa Khawani*`,
    `Order ID: ${order.id}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Mode: ${order.orderMode}`,
    order.address ? `Address: ${order.address}` : '',
    '',
    '*Items*',
    ...order.items.map(
      (item: OrderLine) =>
        `• ${item.name} (${item.variantLabel}) x${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`
    ),
    '',
    `*Total: ${formatPrice(order.totalPrice)}*`,
    order.note ? `Note: ${order.note}` : '',
    '',
    'Please confirm total & payment. I’ll share the screenshot once paid.',
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateWhatsAppLink(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getPublicWhatsAppNumber(settings?: RestaurantSettings) {
  return (
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '919686754003'
  );
}
