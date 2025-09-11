import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Oreliya — Fine Jewellery',
  description: 'Oreliya storefront',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <div className='min-h-screen flex flex-col bg-[#1E240A]'>
          <Header />
          <main className='flex-1 py-8'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
