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
  Skeleton,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { searchEvents } from "@/lib/api";
import { useRouter } from "next/navigation";

// --- Types ---
interface BackendEvent {
  event_id: string;
  title: string;
  event_image_url?: string;
  event_banner_url?: string;
  venue_name: string;
  city: string;
  event_date: string;
  category_name?: string; // Added category_name from your JSON response
  tags?: string[];        // Added tags from your JSON response
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

const FILTER_TABS = [
  "Concerts",
  "Music",
  "Sports",
  "Festivals",
  "Conferences",
  "Arts",
];

// --- Skeleton Component ---
const EventCardSkeleton = () => (
  <Box bg="#222222" borderRadius="16px" overflow="hidden" shadow="xl" h="480px">
    <Skeleton height="60%" />
    <Box p={6} h="40%" bg="#222222">
      <VStack align="start" gap={4} h="full" justify="space-between">
        <Box w="full">
          <Skeleton height="24px" width="80%" mb={2} />
          <Skeleton height="16px" width="40%" mb={1} />
          <Skeleton height="16px" width="60%" />
        </Box>
        <Skeleton height="44px" width="100%" borderRadius="full" />
      </VStack>
    </Box>
  </Box>
);

export default function DiscoverSection() {
  const [allEvents, setAllEvents] = useState<FrontendEvent[]>([]); 
  const [filteredEvents, setFilteredEvents] = useState<FrontendEvent[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const router = useRouter();

  const fetchEvents = async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch broadly from API
      const res: any = await searchEvents({
        search_query: query || ""
      });

      let rawEvents: BackendEvent[] = [];
      if (res.events && Array.isArray(res.events)) {
        rawEvents = res.events;
      } else if (Array.isArray(res)) {
        rawEvents = res;
      } else if (res.success && Array.isArray(res.data)) {
        rawEvents = res.data;
      }

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
      // Apply initial filtering immediately after fetch
      filterLocalEvents(mappedEvents, query || "", activeTab);
      
    } catch (err: any) {
      console.error("Discover fetch error:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Client-side filtering logic
  const filterLocalEvents = (events: FrontendEvent[], searchQuery: string, tab: string | null) => {
    let results = events;

    // 1. Filter by Text Search (Title or Location)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(e => 
        e.title.toLowerCase().includes(lowerQuery) || 
        e.location.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Filter by Tab (Category/Tags)
    if (tab) {
      const lowerTab = tab.toLowerCase();
      results = results.filter(e => {
        const catMatch = e.category?.toLowerCase().includes(lowerTab);
        const tagMatch = e.tags?.some(t => t.toLowerCase().includes(lowerTab));
        // Also check title as fallback for "Concerts" vs "Music" overlap
        const titleMatch = e.title.toLowerCase().includes(lowerTab);
        
        return catMatch || tagMatch || titleMatch;
      });
    }

    setFilteredEvents(results);
  };

  // Initial Fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Re-run local filter when Search or Tab changes
  useEffect(() => {
    filterLocalEvents(allEvents, search, activeTab);
  }, [search, activeTab, allEvents]);

  const handleSearch = () => {
    // If you want to force a server re-fetch on enter:
    // fetchEvents(search); 
    // But since we have the data, local filtering is faster:
    filterLocalEvents(allEvents, search, null); 
    setActiveTab(null);
  };

  const handleTabClick = (tab: string) => {
    const newTab = activeTab === tab ? null : tab;
    setActiveTab(newTab);
    setSearch(""); // Optional: clear search text when clicking a tab
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
              color="black"
              borderRadius="12px"
              onClick={handleSearch}
              _hover={{ bg: "#E6B834" }}
              h="44px"
              loading={loading && !allEvents.length}
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

          {/* Event Cards Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={8}
            w="full"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <GridItem key={i}>
                  <EventCardSkeleton />
                </GridItem>
              ))
            ) : error ? (
              <GridItem colSpan={4}>
                <Text color="red.300" textAlign="center" fontSize="lg">{error}</Text>
              </GridItem>
            ) : filteredEvents.length === 0 ? (
              <GridItem colSpan={4}>
                <Text color="gray.400" textAlign="center" fontSize="lg">
                  No events found matching your search.
                </Text>
              </GridItem>
            ) : (
              filteredEvents.map((event) => (
                <GridItem key={event.id}>
                  <Box
                    bg="#222222"
                    cursor={"pointer"}
                    borderRadius="16px"
                    overflow="hidden"
                    shadow="xl"
                    h="480px"
                    position="relative"
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-8px)", shadow: "2xl" }}
                    onClick={() => router.push(`/events/${event.id}`)}
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
                            lineClamp={2}
                          >
                            {event.title}
                          </Heading>
                          <Text color="#9CA3AF" fontSize="14px">
                            {new Date(event.startDate).toLocaleDateString()}
                            {event.timezone ? ` • ${event.timezone}` : ""}
                          </Text>
                          <Text color="#9CA3AF" fontSize="14px" lineClamp={1}>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/events/${event.id}`);
                          }}
                        >
                          View Event
                        </Button>
                      </VStack>
                    </Box>
                  </Box>
                </GridItem>
              ))
            )}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}