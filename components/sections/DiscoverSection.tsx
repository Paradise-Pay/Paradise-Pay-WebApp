"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
//import { toast } from "react-toastify";
import { searchEvents } from "@/lib/api";

// 1. Define the shape of data coming FROM the backend
interface BackendEvent {
  event_id: string;
  title: string;
  event_image_url?: string;
  venue_name: string;
  city: string;
  event_date: string;
  // Add other backend fields if needed
}

// 2. Define the shape of data used by THIS component
interface FrontendEvent {
  id: string;
  title: string;
  coverImage: string;
  startDate: string;
  location: string;
  timezone?: string;
}

const FILTER_TABS = [
  "Concerts",
  "Music",
  "Sports",
  "Festivals",
  "Conferences",
  "Arts",
];

export default function DiscoverSection() {
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const fetchEvents = async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);

    try {
      // API call
      const res: any = await searchEvents(params);

      // Handle response format (Array vs Object wrapper)
      let rawEvents: BackendEvent[] = [];
      if (res.events && Array.isArray(res.events)) {
        rawEvents = res.events; // The repo usually returns { events: [], total: ... }
      } else if (Array.isArray(res)) {
        rawEvents = res;
      } else if (res.success && Array.isArray(res.data)) {
        rawEvents = res.data;
      } else {
        // Fallback for empty or malformed responses
        rawEvents = [];
      }

      // Map Backend -> Frontend
      const mappedEvents: FrontendEvent[] = rawEvents.map((e) => ({
        id: e.event_id,
        title: e.title,
        coverImage:
          e.event_image_url ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800",
        startDate: e.event_date,
        location: `${e.venue_name || "TBA"}, ${e.city || ""}`,
        timezone: "GMT", // Hardcoded or derived if your backend adds it later
      }));

      setEvents(mappedEvents);
    } catch (err: any) {
      console.error("Discover fetch error:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = () => {
    // Map 'query' to 'search_query' which the backend likely expects
    fetchEvents({
      search_query: search,
      // If you had category IDs, you'd pass category_id here.
      // For now, we search everything.
    });
  };

  const handleTabClick = (tab: string) => {
    const newTab = activeTab === tab ? null : tab;
    setActiveTab(newTab);

    // Since we don't have exact Category IDs on the frontend yet,
    // we send the tab name as a search query to find related events.
    fetchEvents({
      search_query: newTab || search || undefined,
    });
  };

  return (
    <Box
      minH="100vh"
      bgImage="url('/assets/images/index-image.jpg')"
      bgSize="cover"
      backgroundPosition="center"
      position="relative"
      display="flex"
      alignItems="center"
      py={24}
    >
      {/* Dark Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="black"
        opacity={0.85}
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack gap={16}>
          <Heading
            as="h2"
            color="white"
            fontWeight={700}
            textAlign="center"
            w="full"
            fontSize={{ base: "3xl", md: "5xl" }}
          >
            Discover What's Next.
          </Heading>

          {/* Search Bar */}
          <Box w="full" maxW="5xl" position="relative">
            <Input
              bg="white"
              placeholder="Search for events, artists, venues..."
              borderRadius="16px"
              fontSize="18px"
              h="60px"
              pl={12}
              border="none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              _focus={{ boxShadow: "0 0 0 3px rgba(253, 203, 53, 0.5)" }}
              color="black"
            />
            <Box
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
            >
              <Search size={24} color="#9CA3AF" />
            </Box>
            <Button
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              bg="#FDCB35"
              borderRadius="12px"
              onClick={handleSearch}
              _hover={{ bg: "#E6B834" }}
              h="44px"
            >
              Search
            </Button>
          </Box>

          {/* Filter Buttons */}
          <HStack gap={4} wrap="wrap" justify="center">
            {FILTER_TABS.map((tab) => (
              <Button
                key={tab}
                bg={activeTab === tab ? "white" : "transparent"}
                color={activeTab === tab ? "#1A1A1A" : "white"}
                border="2px solid white"
                borderRadius="full"
                px={8}
                py={2}
                fontSize="16px"
                fontWeight={500}
                _hover={{ bg: "white", color: "#1A1A1A" }}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </Button>
            ))}
          </HStack>

          {/* Event Cards */}
          {loading ? (
            <Text color="white" fontSize="lg">
              Loading events...
            </Text>
          ) : error ? (
            <Text color="red.300">{error}</Text>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={8}
              w="full"
            >
              {events.length === 0 ? (
                <GridItem colSpan={4}>
                  <Text color="gray.400" textAlign="center" fontSize="lg">
                    No events found matching your search.
                  </Text>
                </GridItem>
              ) : (
                events.map((event) => (
                  <GridItem key={event.id}>
                    <Box
                      bg="#222222"
                      borderRadius="16px"
                      overflow="hidden"
                      shadow="xl"
                      h="480px"
                      position="relative"
                      transition="all 0.3s"
                      _hover={{ transform: "translateY(-8px)", shadow: "2xl" }}
                    >
                      <Box
                        h="60%"
                        bgImage={`url('${event.coverImage}')`}
                        bgSize="cover"
                        backgroundPosition="center"
                      />
                      <Box h="40%" bg="#222222" p={6}>
                        <VStack
                          align="start"
                          gap={4}
                          h="full"
                          justify="space-between"
                        >
                          <Box w="full">
                            <Heading
                              size="md"
                              color="white"
                              mb={2}
                              fontWeight={600}
                            >
                              {event.title}
                            </Heading>
                            <Text color="#9CA3AF" fontSize="14px">
                              {new Date(event.startDate).toLocaleDateString()}
                              {event.timezone ? ` • ${event.timezone}` : ""}
                            </Text>
                            <Text color="#9CA3AF" fontSize="14px">
                              {event.location}
                            </Text>
                          </Box>
                          <Button
                            w="full"
                            bg="#FDCB35"
                            color="#1A1A1A"
                            borderRadius="full"
                            fontWeight={600}
                            fontSize="16px"
                            py={3}
                            _hover={{ bg: "#E6B834" }}
                          >
                            Add To Cart
                          </Button>
                        </VStack>
                      </Box>
                    </Box>
                  </GridItem>
                ))
              )}
            </Grid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
