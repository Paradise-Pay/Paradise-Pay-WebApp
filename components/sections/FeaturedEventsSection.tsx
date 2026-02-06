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
  IconButton,
} from "@chakra-ui/react";
import { MapPin, Calendar, Ticket, Heart } from "lucide-react";
import { getFeaturedEvents, getUserFavorites, addEventToFavorites, removeEventFromFavorites } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [eventsRes, favoritesRes] = await Promise.all([
          getFeaturedEvents(),
          user ? getUserFavorites() : Promise.resolve([]) 
        ]);

        if (!mounted) return;

        let rawEvents: BackendEvent[] = [];
        const res = eventsRes as any;
        if (Array.isArray(res)) rawEvents = res;
        else if (res.success && Array.isArray(res.data)) rawEvents = res.data;

        const mappedEvents: FrontendEvent[] = rawEvents.map((e) => ({
          id: e.event_id,
          title: e.title,
          coverImage: e.event_image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800",
          location: `${e.venue_name || 'Unknown Venue'}, ${e.city || ''}`,
          startDate: e.event_date,
          availableTickets: (e.max_attendees || 0) - (e.current_attendees || 0),
        }));

        setEvents(mappedEvents);
        
        // Handle favorites array safely
        if (Array.isArray(favoritesRes)) {
             const favs = favoritesRes.map((f: any) => f.event_id || f.id);
             setFavorites(favs);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        if (mounted) setError("Failed to load events");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const isFav = favorites.includes(eventId);
    setFavorites(prev => isFav ? prev.filter(id => id !== eventId) : [...prev, eventId]);

    try {
      if (isFav) await removeEventFromFavorites(eventId);
      else await addEventToFavorites(eventId);
    } catch (error) {
      setFavorites(prev => isFav ? [...prev, eventId] : prev.filter(id => id !== eventId));
    }
  };

  return (
    <Box bg="#2196F3" py={16} px={4}>
      <Container maxW="7xl">
        <VStack gap={16} align="start">
          <Heading as="h2" color="white" fontWeight={700} fontSize="36px" textAlign="left" w="full" lineHeight="1.1">
            Featured Events
          </Heading>
          
          {loading ? (
            <Text color="white">Loading events...</Text>
          ) : error ? (
            <Text color="red.300">{error}</Text>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
              {events.length === 0 ? (
                <Text color="white">No featured events found.</Text>
              ) : (
                events.map((event) => {
                  const isFavorite = favorites.includes(event.id);
                  return (
                    <GridItem key={event.id}>
                      <Box
                        bg="#222222"
                        borderRadius="16px"
                        cursor={"pointer"}
                        overflow="hidden"
                        shadow="md"
                        h="360px"
                        position="relative"
                        w="full"
                        transition="transform 0.2s"
                        _hover={{ transform: "translateY(-5px)" }}
                        onClick={() => router.push(`/events/${event.id}`)}
                      >
                        <Box h="50%" bgImage={`url('${event.coverImage}')`} bgSize="cover" backgroundPosition="center" position="relative">
                          <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.1)" />
                        </Box>

                        <Box bg="#222222" p="20px">
                          <VStack align="start" gap="12px" h="full">
                            <Box w="full">
                              <Heading size="md" color="white" fontWeight={700} fontSize="18px" mb="8px" textAlign="left">
                                {event.title}
                              </Heading>
                              <VStack align="start" gap="6px" w="full">
                                <HStack gap="8px" align="center"><MapPin size={14} color="#CCCCCC" /><Text color="#CCCCCC" fontSize="14px">{event.location}</Text></HStack>
                                <HStack gap="8px" align="center"><Calendar size={14} color="#CCCCCC" /><Text color="#CCCCCC" fontSize="14px">{new Date(event.startDate).toLocaleDateString()}</Text></HStack>
                                <HStack gap="8px" align="center"><Ticket size={14} color="#CCCCCC" /><Text color="#CCCCCC" fontSize="14px">{event.availableTickets} Tickets Available</Text></HStack>
                              </VStack>
                            </Box>
                          </VStack>
                        </Box>

                        <IconButton
                          aria-label="Add to favorites"
                          position="absolute"
                          bottom="20px"
                          right="20px"
                          variant="ghost"
                          borderRadius="full"
                          _hover={{ bg: "whiteAlpha.200", transform: "scale(1.1)" }}
                          onClick={(e) => toggleFavorite(e, event.id)}
                          zIndex={2}
                        >
                          <Heart size={20} fill={isFavorite ? "red" : "none"} color={isFavorite ? "red" : "white"} />
                        </IconButton>
                      </Box>
                    </GridItem>
                  );
                })
              )}
            </Grid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}