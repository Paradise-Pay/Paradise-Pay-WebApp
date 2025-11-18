"use client";

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';
import { Provider } from "@/components/ui/provider";
import Header from "@/components/layouts/header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans`}>
        <AuthProvider>
          <Provider>
            <CssBaseline enableColorScheme={true} />
            <Header />
            <main>
              {children}
            </main>
            <Footer />
            <ToastContainer 
              position="bottom-right"
              pauseOnFocusLoss
              draggable
              pauseOnHover
              closeOnClick
              theme="colored"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              rtl={false}
            />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
