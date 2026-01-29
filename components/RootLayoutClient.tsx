'use client';

import { Box } from "@chakra-ui/react";
import { usePathname } from 'next/navigation';

const EXCLUDED_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

// Paths that already include their own header/footer or have them globally
const SELF_CONTAINED_PATHS = ['/'];

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldShowLayout = !EXCLUDED_PATHS.some(path => pathname.startsWith(path));
  const isSelfContained = SELF_CONTAINED_PATHS.includes(pathname);

  // Don't add layout for excluded paths or self-contained pages
  if (!shouldShowLayout || isSelfContained) {
    return <>{children}</>;
  }

  // For dashboard and other pages that need header/footer but don't have them
  // Note: Header and Footer are already included globally in app/layout.tsx
  // So we don't need to add them here anymore
  return (
    <Box w="full" bg="white">
      <Box as="main">
        {children}
      </Box>
    </Box>
  );
}
