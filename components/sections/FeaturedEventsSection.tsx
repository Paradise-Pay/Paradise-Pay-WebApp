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
} from "@chakra-ui/react";
import { MapPin, Calendar, Ticket } from "lucide-react";
import { getFeaturedEvents } from "@/lib/api";

// Define the shape of the data COMING from the backend
interface BackendEvent {
  event_id: string;
  title: string;
  event_image_url?: string;
  venue_name: string;
  city: string;
  event_date: string;
  max_attendees: number;
  current_attendees: number;
}

// Define the shape of the data used by THIS component
interface FrontendEvent {
  id: string;
  title: string;
  coverImage: string;
  location: string;
  startDate: string;
  availableTickets: number;
}

export default function FeaturedEventsSection() {
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getFeaturedEvents()
      .then((res: any) => { // Using 'any' to bypass the type mismatch temporarily
        if (!mounted) return;

        // 1. Handle Response Format (Array vs Object)
        let rawEvents: BackendEvent[] = [];
        
        if (Array.isArray(res)) {
          // If backend sends raw array [{}, {}]
          rawEvents = res;
        } else if (res.success && Array.isArray(res.data)) {
          // If backend sends wrapper { success: true, data: [] }
          rawEvents = res.data;
        } else {
          throw new Error("Invalid data format received");
        }

        // 2. Map Backend Names (snake_case) to Frontend Names (camelCase)
        const mappedEvents: FrontendEvent[] = rawEvents.map((e) => ({
          id: e.event_id,
          title: e.title,
          // Use a fallback image if URL is missing
          coverImage: e.event_image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800",
          location: `${e.venue_name || 'Unknown Venue'}, ${e.city || ''}`,
          startDate: e.event_date,
          availableTickets: (e.max_attendees || 0) - (e.current_attendees || 0),
        }));

        setEvents(mappedEvents);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (mounted) setError("Failed to load events");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box bg="#2196F3" py={16} px={4}> {/* Adjusted px for mobile responsiveness */}
      <Container maxW="7xl">
        <VStack gap={16} align="start">
          <Heading
            as="h2"
            color="white"
            fontWeight={700}
            fontSize="36px"
            textAlign="left"
            w="full"
            lineHeight="1.1"
          >
            Featured Events
          </Heading>
          
          {loading ? (
            <Text color="white">Loading events...</Text>
          ) : error ? (
            <Text color="red.300">{error}</Text>
          ) : (
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
              gap={8} 
              w="full"
            >
              {events.length === 0 ? (
                <Text color="white">No featured events found.</Text>
              ) : (
                events.map((event) => (
                  <GridItem key={event.id}>
                    <Box
                      bg="#222222"
                      borderRadius="16px"
                      overflow="hidden"
                      shadow="md"
                      h="360px"
                      position="relative"
                      w="full"
                      transition="transform 0.2s"
                      _hover={{ transform: "translateY(-5px)" }}
                    >
                      {/* Main Image Area */}
                      <Box 
                        h="50%" 
                        bgImage={`url('${event.coverImage}')`} 
                        bgSize="cover" 
                        backgroundPosition="center" 
                        position="relative"
                      >
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.1)" />
                      </Box>

                      {/* Content Area */}
                      <Box bg="#222222" p="20px">
                        <VStack align="start" gap="12px" h="full">
                          <Box w="full">
                            <Heading
                              size="md"
                              color="white"
                              fontWeight={700}
                              fontSize="18px"
                              mb="8px"
                              textAlign="left"
                            >
                              {event.title}
                            </Heading>

                            <VStack align="start" gap="6px" w="full">
                              <HStack gap="8px" align="center">
                                <MapPin size={14} color="#CCCCCC" />
                                <Text color="#CCCCCC" fontSize="14px" >
                                  {event.location}
                                </Text>
                              </HStack>

                              <HStack gap="8px" align="center">
                                <Calendar size={14} color="#CCCCCC" />
                                <Text color="#CCCCCC" fontSize="14px">
                                  {new Date(event.startDate).toLocaleDateString()}
                                </Text>
                              </HStack>

                              <HStack gap="8px" align="center">
                                <Ticket size={14} color="#CCCCCC" />
                                <Text color="#CCCCCC" fontSize="14px">
                                  {event.availableTickets} Tickets Available
                                </Text>
                              </HStack>
                            </VStack>
                          </Box>
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