"use client";

/**
 * Header component with responsive navigation
 * - Desktop: Shows navigation links horizontally
 * - Mobile: Shows hamburger menu with dropdown
 * - Hydration-safe: Uses client-side detection to prevent SSR mismatches
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  Image,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { ColorModeButton } from "@/components/ui/color-mode";
export default function Header() {
  const [activeLink, setActiveLink] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle hydration and responsive behavior
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const links = ["Home", "Discover Events", "Bundles", "Pricing", "Contact"];
  const logoPath = "/logos/Paradise Pay_Logo.png";

  return (
    <Box bg="white" shadow="sm" position="sticky" top={0} zIndex={1000} py={2} px={38}>
      <Container maxW="7xl">
        <Flex h="20" align="center" justify="space-between">
          <Flex align="center">
            <Image
              src={logoPath}
              alt="Paradise Pay"
              height="44px"
              width="154px"
              objectFit="contain"
            />
          </Flex>

          {isMounted && !isMobile && (
            <HStack gap={8}>
              {links.map((link) => (
                <Text
                  key={link}
                  color={activeLink === link ? "#278BF7" : "#1A1A1A"}
                  fontWeight={activeLink === link ? 600 : 500}
                  fontSize="17px"
                  cursor="pointer"
                  _hover={{ color: "#278BF7" }}
                  onClick={() => setActiveLink(link)}
                >
                  {link}
                </Text>
              ))}
            </HStack>
          )}

          <HStack gap={4}>
            <Search size={28} color="#1A1A1A" style={{ cursor: "pointer" }} />
            
            <Link href="/auth/login" passHref>
              <Button
                bg="#FDCB35"
                color="white"
                px={8}
                py={6}
                borderRadius="24px"
                fontWeight={600}
                fontSize="16px"
                _hover={{ bg: "#E6B834" }}
              >
                Sign up/Login
              </Button>
            </Link>

            <ColorModeButton />

            {isMounted && isMobile && (
              <IconButton
                aria-label="Open menu"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </IconButton>
            )}
          </HStack>
        </Flex>
      </Container>

      {isMounted && isMobile && isMobileMenuOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          shadow="lg"
          zIndex={1000}
          p={4}
        >
          <VStack gap={4} align="stretch">
            {links.map((link) => (
              <Text
                key={link}
                color={activeLink === link ? "#278BF7" : "#1A1A1A"}
                fontWeight={activeLink === link ? 600 : 500}
                fontSize="18px"
                cursor="pointer"
                py={2}
                onClick={() => {
                  setActiveLink(link);
                  setIsMobileMenuOpen(false);
                }}
              >
                {link}
              </Text>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
}