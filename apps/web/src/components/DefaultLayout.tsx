import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950'>
      <Header />
      <main className='flex-1 py-8'>{children}</main>
      <Footer />
    </div>
  );
}
