import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col bg-[#1E240A]'>
      <Header />
      <main className='flex-1 py-8'>{children}</main>
      <Footer />
    </div>
  );
}
