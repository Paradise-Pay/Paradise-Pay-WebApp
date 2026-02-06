"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Grid, GridItem, Heading, Text, VStack, HStack, Input, Button, IconButton } from "@chakra-ui/react";
import { Search, Heart } from "lucide-react";
import { getUserFavorites, addEventToFavorites, removeEventFromFavorites } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Hardcoded data
const discoverEvents = [
  { id: "1", name: "Summer Music Fest", date: "Oct 20, 2025", time: "6:00 PM", venue: "Accra Stadium", image: "/assets/images/event-1.jpg" },
  { id: "2", name: "Tech Conference", date: "Nov 5, 2025", time: "9:00 AM", venue: "Kempinski Hotel", image: "/assets/images/event-2.jpg" },
  { id: "3", name: "Food & Drink Festival", date: "Dec 12, 2025", time: "12:00 PM", venue: "Osu Oxford Street", image: "/assets/images/event-1.jpg" },
  { id: "4", name: "New Year Party", date: "Dec 31, 2025", time: "10:00 PM", venue: "Labadi Beach", image: "/assets/images/event-2.jpg" },
];

export default function SearchEventsSection() {
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
    <Box minH="100vh" bg={"#333333"} bgSize="cover" position="relative" display="flex" alignItems="center" py={16}>
      <Container maxW="7xl" position="relative" zIndex={2}>
        <VStack gap={14}>
          <Heading as="h2" color="white" fontWeight={700} textAlign="center" w="full">Discover Events & Priceless Experiences</Heading>
          <Box w="full" maxW="5xl" position="relative">
            <Input bg="white" placeholder="Search..." borderRadius="16px" fontSize="18px" py={6} pl={12} border="none" color="black" />
            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)"><Search size={20} color="#9CA3AF" /></Box>
          </Box>
          <HStack gap={4} wrap="wrap" justify="center">
            {["Location", "Date", "Category"].map((tab) => <Button key={tab} bg="transparent" color="white" border="2px solid white" borderRadius="full" px={8} py={2}>{tab}</Button>)}
          </HStack>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
            {discoverEvents.map((event) => {
              const isFavorite = favorites.includes(event.id);
              return (
                <GridItem key={event.id}>
                  <Box bg="#1A1A1A" borderRadius="16px" overflow="hidden" shadow="xl" h="480px" position="relative">
                    <Box h="60%" bgImage={`url('${event.image}')`} bgSize="cover" />
                    <Box h="40%" bg="#1A1A1A" p={6}>
                      <VStack align="start" gap={4} h="full" justify="space-between">
                        <Box>
                          <Heading size="md" color="white" mb={2} fontWeight={600}>{event.name}</Heading>
                          <Text color="#9CA3AF" fontSize="14px">{event.date} • {event.time}</Text>
                          <Text color="#9CA3AF" fontSize="14px">{event.venue}</Text>
                        </Box>
                        <Button w="full" bg="#FDCB35" color="#1A1A1A" borderRadius="full">Add To Card</Button>
                      </VStack>
                    </Box>
                    {/* ✅ FIX: Pass Icon as Child */}
                    <IconButton
                      aria-label="Add to favorites"
                      position="absolute"
                      top="12px"
                      right="12px"
                      variant="solid"
                      bg="blackAlpha.600"
                      color="white"
                      borderRadius="full"
                      size="sm"
                      _hover={{ bg: "blackAlpha.800", transform: "scale(1.1)" }}
                      onClick={(e) => toggleFavorite(e, event.id)}
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