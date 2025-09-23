import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/features/ui/components/Header';
import { Footer } from '@/features/ui/components/Footer';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Oreliya — Fine Jewellery',
    template: '%s | Oreliya',
  },
  description:
    'Discover exquisite fine jewellery at Oreliya. Handcrafted pieces for every occasion.',
  keywords: [
    'jewellery',
    'fine jewellery',
    'rings',
    'necklaces',
    'bracelets',
    'earrings',
  ],
  authors: [{ name: 'Oreliya' }],
  creator: 'Oreliya',
  publisher: 'Oreliya',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/assets/logos/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/assets/logos/favicon.svg',
    apple: '/assets/logos/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Oreliya — Fine Jewellery',
    description: 'Discover exquisite fine jewellery at Oreliya.',
    siteName: 'Oreliya',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oreliya — Fine Jewellery',
    description: 'Discover exquisite fine jewellery at Oreliya.',
    creator: '@oreliya',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E240A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} ${playfair.variable}`}>
      <body className='font-sans antialiased'>
        <SessionProvider>
          <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
