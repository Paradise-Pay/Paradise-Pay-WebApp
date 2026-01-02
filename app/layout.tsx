
import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';
import { Provider } from "@/components/ui/provider";
import HeaderWrapper from './HeaderWrapper';
import FooterWrapper from './FooterWrapper';

// Load Google Fonts Inter with all necessary weights
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <Provider>
            <CssBaseline enableColorScheme={true} />
            <div className="min-h-screen flex flex-col">
              <HeaderWrapper />
              <main className="flex-grow">{children}</main>
              <FooterWrapper />
            </div>
            <ToastContainer
              position="bottom-right"
              pauseOnFocusLoss
              draggable
              pauseOnHover
              closeOnClick
              theme="colored"
              autoClose={5000}
            />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}