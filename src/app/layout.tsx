import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qissa Khawani — Stories Served Hot',
  description:
    'Browse the Qissa Khawani menu and place a direct demo order for North Indian favourites in Indiranagar.',
  keywords: ['biryani', 'kebabs', 'north indian', 'indiranagar', 'bengaluru', 'restaurant'],
  authors: [{ name: 'Qissa Khawani' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://qissakhawani.com',
    title: 'Qissa Khawani — Stories Served Hot',
    description:
      'Browse dum biryani, kebabs and late-night comfort from Qissa Khawani in Indiranagar.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qissa Khawani — Stories Served Hot',
    description: 'Browse dum biryani, kebabs and late-night comfort from Qissa Khawani in Indiranagar.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
