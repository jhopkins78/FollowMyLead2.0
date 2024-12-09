import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
