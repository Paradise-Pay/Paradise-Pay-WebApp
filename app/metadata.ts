import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paradise Pay",
  description: "Ticketing Platform Powered By Paradise Pay",
  icons: {
    icon: '/favicon.svg',
  },
};

// This is a workaround to make TypeScript happy with the RootLayout props
export interface RootLayoutProps {
  children: React.ReactNode;
}
