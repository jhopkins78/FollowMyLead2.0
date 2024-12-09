import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={inter.className}>
          <Component {...pageProps} />
          <Toaster position="top-right" />
        </body>
      </html>
    </AuthProvider>
  );
}
