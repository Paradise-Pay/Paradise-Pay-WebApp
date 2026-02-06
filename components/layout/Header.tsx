"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  HStack,
  Image,
  IconButton,
  VStack,
  Input,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Dialog,
  Portal,
  Separator
} from "@chakra-ui/react";
import { Search, Menu, Sun, Moon, MapPin, Calendar, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { searchEvents } from "@/lib/api";

// --- Types ---
interface BackendEvent {
  event_id: string;
  title: string;
  event_image_url?: string;
  event_banner_url?: string;
  venue_name: string;
  city: string;
  event_date: string;
  category_name?: string;
  tags?: string[];
}

interface FrontendEvent {
  id: string;
  title: string;
  coverImage: string;
  startDate: string;
  location: string;
  timezone?: string;
  category?: string;
  tags?: string[];
}

// --- Search Modal Component (Chakra v3) ---
const SearchModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (details: { open: boolean }) => void }) => {
  const [search, setSearch] = useState("");
  const [allEvents, setAllEvents] = useState<FrontendEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<FrontendEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reset when opening
  useEffect(() => {
    if (open) {
      setSearch("");
      if (allEvents.length === 0) {
        fetchEvents();
      } else {
        setFilteredEvents(allEvents);
      }
    }
  }, [open]);

  // Filter logic
  useEffect(() => {
    if (!search.trim()) {
      setFilteredEvents(allEvents);
      return;
    }
    const lowerQuery = search.toLowerCase();
    const results = allEvents.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) || 
      e.location.toLowerCase().includes(lowerQuery)
    );
    setFilteredEvents(results);
  }, [search, allEvents]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res: any = await searchEvents({ search_query: "" });
      let rawEvents: BackendEvent[] = [];
      
      if (res.events && Array.isArray(res.events)) rawEvents = res.events;
      else if (Array.isArray(res)) rawEvents = res;
      else if (res.success && Array.isArray(res.data)) rawEvents = res.data;

      const mappedEvents: FrontendEvent[] = rawEvents.map((e) => ({
        id: e.event_id,
        title: e.title,
        coverImage: e.event_image_url || e.event_banner_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800",
        startDate: e.event_date,
        location: `${e.venue_name || "TBA"}${e.city ? `, ${e.city}` : ""}`,
        timezone: "GMT",
        category: e.category_name,
        tags: e.tags
      }));

      setAllEvents(mappedEvents);
      setFilteredEvents(mappedEvents);
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (id: string) => {
    onOpenChange({ open: false });
    router.push(`/events/${id}`);
  };

  return (
    <Dialog.Root 
      open={open} 
      onOpenChange={onOpenChange} 
      size="xl" 
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop bg="black/50" backdropFilter="blur(4px)" />
        <Dialog.Positioner>
          <Dialog.Content 
            bg="#1A1A1A" 
            color="white" 
            borderRadius="xl" 
            maxH="85vh" 
            mt={4}
            p={0}
            overflow="hidden"
          >
            <Dialog.Body p={0}>
              <VStack gap={0} align="stretch">
                {/* Sticky Header with Input */}
                <Box p={4} borderBottom="1px solid" borderColor="gray.800" bg="#1A1A1A" position="sticky" top={0} zIndex={5}>
                  <HStack justify="space-between" mb={3}>
                    <Heading size="md" color="white">Search Events</Heading>
                    <Dialog.CloseTrigger asChild>
                      <IconButton size="sm" variant="ghost" color="gray.400" _hover={{ bg: "whiteAlpha.200", color: "white" }}>
                        <X size={20} />
                      </IconButton>
                    </Dialog.CloseTrigger>
                  </HStack>
                  
                  {/* v3 Style Input Group using HStack */}
                  <HStack 
                    bg="#2A2A2A" 
                    borderRadius="md" 
                    px={3} 
                    py={1}
                    border="1px solid" 
                    borderColor="transparent"
                    _focusWithin={{ borderColor: "#FDCB35", boxShadow: "0 0 0 1px #FDCB35" }}
                  >
                    <Search color="#9CA3AF" size={20} />
                    <Input
                      variant="flushed"
                      placeholder="Search events, artists, venues..."
                      border="none"
                      color="white"
                      fontSize="md"
                      _placeholder={{ color: "gray.500" }}
                      _focus={{ boxShadow: "none" }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      h="40px"
                    />
                  </HStack>
                </Box>

                {/* Results Area */}
                <Box p={4} overflowY="auto" minH="300px" maxH="60vh">
                  {loading && allEvents.length === 0 ? (
                    <VStack align="stretch" gap={4}>
                      {[1, 2, 3].map((i) => (
                        <HStack key={i} bg="#2A2A2A" p={3} borderRadius="lg" gap={4}>
                          <Skeleton height="60px" width="60px" borderRadius="md" opacity={0.2} />
                          <VStack align="start" flex={1} gap={2}>
                            <Skeleton height="16px" width="60%" opacity={0.2} />
                            <Skeleton height="12px" width="40%" opacity={0.2} />
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  ) : filteredEvents.length === 0 ? (
                    <Flex direction="column" align="center" justify="center" h="200px" color="gray.500">
                      <Search size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <Text>No events found matching "{search}"</Text>
                    </Flex>
                  ) : (
                    <Grid templateColumns={{ base: "1fr" }} gap={3}>
                      {filteredEvents.map((event) => (
                        <GridItem key={event.id}>
                          <Flex 
                            bg="#2A2A2A" 
                            p={3} 
                            borderRadius="lg" 
                            gap={4}
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ bg: "#333", transform: "translateX(2px)" }}
                            onClick={() => handleEventClick(event.id)}
                          >
                            <Image 
                              src={event.coverImage} 
                              alt={event.title}
                              w="80px" 
                              h="80px" 
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <VStack align="start" justify="center" gap={1} flex={1} overflow="hidden">
                              <Heading size="sm" truncate color="white">
                                {event.title}
                              </Heading>
                              
                              <HStack gap={2} color="#9CA3AF" fontSize="xs">
                                <Calendar size={12} />
                                <Text>{new Date(event.startDate).toLocaleDateString()}</Text>
                              </HStack>
                              
                              <HStack gap={2} color="#9CA3AF" fontSize="xs">
                                <MapPin size={12} />
                                <Text truncate>{event.location}</Text>
                              </HStack>
                            </VStack>
                          </Flex>
                        </GridItem>
                      ))}
                    </Grid>
                  )}
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// --- Main Header ---
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { user } = useAuth();
  
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const links = [
    { name: "Discover Events", path: "/discover" },
    { name: "Bundles", path: "/bundles" },
    { name: "Pricing", path: "/pricing" },
    { name: "Become An Organizer", path: "/auth/organizer-apply" },
  ];
  
  const logoPath = "/logos/Paradise Pay_Logo.png";

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <>
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
              {/* Search Icon - Triggers Modal */}
              <IconButton
                aria-label="Search"
                variant="ghost"
                size={{ base: "md", md: "sm" }}
                color="#1A1A1A"
                _hover={{ bg: "gray.100" }}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={isMobile ? 22 : 20} />
              </IconButton>

              {/* Desktop buttons - hide on mobile */}
              {isMounted && !isMobile && (
                <>
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

              <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                <VStack gap={3} align="stretch">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      bg="#FDCB35"
                      color="black"
                      w="full"
                      py={3}
                      borderRadius="md"
                      fontWeight={600}
                      fontSize="16px"
                      _hover={{ bg: "#E6B834" }}
                    >
                      {user ? "Dashboard" : "Sign up/Login"}
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

      {/* Render the Search Modal */}
      <SearchModal 
        open={isSearchOpen} 
        onOpenChange={(e) => setIsSearchOpen(e.open)} 
      />
    </>
  );
}