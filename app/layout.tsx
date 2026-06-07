import type {Metadata} from 'next';
import { Suspense } from 'react';
import './globals.css'; // Global styles
import StickyAdBanner from '@/components/StickyAdBanner';

export const metadata: Metadata = {
  title: 'Bizsearch24 | South African Business Listings Directory',
  description: 'Bizsearch24.co.za - Fully optimized directory of verified local South African businesses, trades, dental clinics, and solar installers.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2050/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='%23059669'/%3E%3Csvg x='8' y='8' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E%3C/svg%3E",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900" suppressHydrationWarning>
        <Suspense fallback={null}>
          <StickyAdBanner />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
