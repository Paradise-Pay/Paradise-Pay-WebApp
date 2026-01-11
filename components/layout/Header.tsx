"use client";

/**
 * Header component with responsive navigation
 * Features:
 * - Desktop: Shows navigation links horizontally
 * - Mobile: Shows hamburger menu with dropdown
 * - Theme toggle functionality
 * - Search functionality
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  HStack,
  Image,
  IconButton,
  VStack
} from "@chakra-ui/react";
import { Search, Menu, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get authenticated user from context
  const { user } = useAuth();
  
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

  const links = [
    { name: "Discover Events", path: "/discover" },
    { name: "Bundles", path: "/bundles" },
    { name: "Pricing", path: "/pricing" }
  ];
  
  const logoPath = "/logos/Paradise Pay_Logo.png";

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add theme switching logic here
  };

  return (
    <Box
      bg="white"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
      py={2}
      px={{ base: 4, md: 6 }}
    >
      <Container maxW="7xl">
        <Flex
          h={{ base: "16", md: "20" }}
          align="center"
          justify="space-between"
          w="full"
        >
          {/* Logo */}
          <Flex align="center" flexShrink={0}>
            <Box
              as="button"
              cursor={"pointer"}
              onClick={() => router.push("/")}
              _hover={{ opacity: 0.8 }}
            >
              <Image
                src={logoPath}
                alt="Paradise Pay"
                height={{ base: "36px", md: "44px" }}
                width={{ base: "120px", md: "154px" }}
                objectFit="contain"
              />
            </Box>
          </Flex>

          {/* Desktop Navigation Links */}
          {isMounted && !isMobile && (
            <HStack gap={8} flex="1" justify="center">
              {links.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Text
                    key={link.path}
                    color={isActive ? "#278BF7" : "#1A1A1A"}
                    fontWeight={isActive ? 600 : 500}
                    fontSize="17px"
                    cursor="pointer"
                    _hover={{ color: "#278BF7" }}
                    onClick={() => {
                      setActiveLink(link.name);
                      router.push(link.path);
                    }}
                  >
                    {link.name}
                  </Text>
                );
              })}
            </HStack>
          )}

          {/* Right side buttons */}
          <HStack gap={{ base: 2, md: 4 }} flexShrink={0}>
            {/* Search Icon - Always visible */}
            <IconButton
              aria-label="Search"
              variant="ghost"
              size={{ base: "md", md: "sm" }}
              color="#1A1A1A"
              _hover={{ bg: "gray.100" }}
              onClick={() => router.push("/discover")}
            >
              <Search size={isMobile ? 22 : 20} />
            </IconButton>

            {/* Desktop buttons - hide on mobile */}
            {isMounted && !isMobile && (
              <>
                {/* Sign up/Login Button */}
                <Link href={user ? "/dashboard" : "/auth/login"}>
                  <Button
                    bg="#FDCB35"
                    color="black"
                    px={6}
                    py={2}
                    borderRadius="24px"
                    fontWeight={600}
                    fontSize="14px"
                    _hover={{ bg: "#E6B834" }}
                    size="sm"
                  >
                    {user ? "Dashboard" : "Sign up/Login"}
                  </Button>
                </Link>

                {/* Theme Switcher */}
                <IconButton
                  aria-label="Toggle theme"
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  color="#1A1A1A"
                  _hover={{ bg: "gray.100" }}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </IconButton>
              </>
            )}

            {/* Mobile Menu Button - only show on mobile */}
            {isMounted && isMobile && (
              <IconButton
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                variant="ghost"
                size="md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                color="#1A1A1A"
                _hover={{ bg: "gray.100" }}
                borderRadius="md"
              >
                <Menu size={24} />
              </IconButton>
            )}
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Menu Dropdown */}
      {isMounted && isMobile && isMobileMenuOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          shadow="lg"
          zIndex={1000}
          p={6}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <VStack gap={2} align="stretch">
            {links.map((link) => (
              <Text
                key={link.name}
                color={activeLink === link.name ? "#278BF7" : "#1A1A1A"}
                fontWeight={activeLink === link.name ? 600 : 500}
                fontSize="18px"
                cursor="pointer"
                py={3}
                px={4}
                borderRadius="md"
                _hover={{ bg: "gray.50" }}
                onClick={() => {
                  setActiveLink(link.name);
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  router.push(link.path);
                }}
              >
                {link.name}
              </Text>
            ))}

            {/* Mobile Action Buttons */}
            <Box pt={4} borderTop="1px solid" borderColor="gray.200">
              <VStack gap={3} align="stretch">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    bg="#FDCB35"
                    color="white"
                    w="full"
                    py={3}
                    borderRadius="md"
                    fontWeight={600}
                    fontSize="16px"
                    _hover={{ bg: "#E6B834" }}
                  >
                    Sign up/Login
                  </Button>
                </Link>

                <Flex justify="center">
                  <IconButton
                    aria-label="Toggle theme"
                    variant="ghost"
                    size="md"
                    onClick={toggleTheme}
                    color="#1A1A1A"
                    _hover={{ bg: "gray.100" }}
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </IconButton>
                </Flex>
              </VStack>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
}