"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Grid, GridItem, Heading, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { MapPin, Calendar, Ticket, Heart } from "lucide-react";
import { getUserFavorites, addEventToFavorites, removeEventFromFavorites } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Sample Data
const featuredEvents = [
  { id: "1", name: "BROCK'S DOUGLASS B", eventType: "Event Name", date: "17 & 18 AUGUST", venue: "Venue: Accra, Ghana", eventDate: "Date: Dec 25, 2023", tickets: "Tickets: 37 Available", image: "/assets/images/event-1.jpg", soldOut: false, label: "Deluxe" },
  { id: "2", name: "Event Name", eventType: "Event Name", date: "Dec 25, 2023", venue: "Venue: Accra, Ghana", eventDate: "Date: Dec 25, 2023", tickets: "Tickets: 37 Available", image: "/assets/images/event-2.jpg", soldOut: false, label: "Deluxe" },
  { id: "3", name: "Event Name", eventType: "Event Name", date: "Dec 25, 2023", venue: "Venue: Accra, Ghana", eventDate: "Date: Dec 25, 2023", tickets: "Tickets: 37 Available", image: "/assets/images/event-1.jpg", soldOut: false, label: "Deluxe" },
  { id: "4", name: "Event Name", eventType: "Event Name", date: "Dec 25, 2023", venue: "Venue: Accra, Ghana", eventDate: "Date: Dec 25, 2023", tickets: "Tickets: 37 Available", image: "/assets/images/event-2.jpg", soldOut: false, label: "Deluxe" },
];

export default function DisountedTicketsSection() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getUserFavorites().then((res: { data?: any[]; success?: boolean }) => {
        const favoritesArr = Array.isArray(res?.data) ? res.data : [];
        setFavorites(favoritesArr.map((f: any) => f.event_id || f.id));
      }).catch(console.error);
    }
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!user) return router.push('/auth/login');
    const isFav = favorites.includes(eventId);
    setFavorites(prev => isFav ? prev.filter(id => id !== eventId) : [...prev, eventId]);
    try { isFav ? await removeEventFromFavorites(eventId) : await addEventToFavorites(eventId); } catch { setFavorites(prev => isFav ? [...prev, eventId] : prev.filter(id => id !== eventId)); }
  };

  return (
    <Box position="relative" bgImage="url('/assets/images/discounted-tickets-bg.jpg')" bgSize="cover" py={16} px={16}>
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.5} />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack gap={16} align="start">
          <Heading as="h2" color="white" fontWeight={700} fontSize="4xl" textAlign="center" w="full" pl="5%" lineHeight="1.1">Discounted Tickets - Fun on a Budget</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
            {featuredEvents.map((event) => {
              const isFavorite = favorites.includes(event.id);
              return (
                <GridItem key={event.id}>
                  <Box bg="#222222" borderRadius="16px" overflow="hidden" shadow="md" h="360px" position="relative" w="full">
                    <Box h="50%" bgImage={`url('${event.image}')`} bgSize="cover" backgroundPosition="center" position="relative">
                      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.1)" />
                    </Box>
                    <Box bg="#222222" p="20px">
                      <VStack align="start" gap="12px" h="full" justify="space-between">
                        <Box w="full">
                          <Heading size="md" color="white" fontWeight={700} fontSize="18px" mb="8px" textAlign="left">{event.name}</Heading>
                          <VStack align="start" gap="6px" w="full">
                            <HStack gap="8px" align="center"><MapPin size={14} color="#CCCCCC" /><Text color="#CCCCCC" fontSize="14px" fontWeight={400}>{event.venue}</Text></HStack>
                            <HStack gap="8px" align="center"><Calendar size={14} color="#CCCCCC" /><Text color="#CCCCCC" fontSize="14px" fontWeight={400}>{event.eventDate}</Text></HStack>
                            <HStack gap="8px" align="center"><Ticket size={14} color="#CCCCCC" /><Text color="#CCCCCC" fontSize="14px" fontWeight={400}>{event.tickets}</Text></HStack>
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>
                    
                    {/* ✅ FIX: Pass Icon as Child */}
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
            })}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}