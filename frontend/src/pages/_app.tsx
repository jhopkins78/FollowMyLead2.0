import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </main>
    </AuthProvider>
  );
}
