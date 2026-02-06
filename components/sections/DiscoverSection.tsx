"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Container, Grid, GridItem, Heading, Text, VStack, HStack, Input, Button, Skeleton, IconButton
} from "@chakra-ui/react";
import { Search, Heart } from "lucide-react";
import { searchEvents, getUserFavorites, addEventToFavorites, removeEventFromFavorites } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ... [Interfaces FrontendEvent, BackendEvent, FILTER_TABS, EventCardSkeleton remain same] ...
// Re-adding just for context if copy-pasting, but assume they exist as before
interface FrontendEvent { id: string; title: string; coverImage: string; startDate: string; location: string; timezone?: string; category?: string; tags?: string[]; }
const FILTER_TABS = ["Concerts", "Music", "Sports", "Festivals", "Conferences", "Arts"];
const EventCardSkeleton = () => (<Box bg="#222222" borderRadius="16px" overflow="hidden" shadow="xl" h="480px"><Skeleton height="60%" /><Box p={6} h="40%" bg="#222222"><VStack align="start" gap={4} h="full" justify="space-between"><Box w="full"><Skeleton height="24px" width="80%" mb={2} /><Skeleton height="16px" width="40%" mb={1} /><Skeleton height="16px" width="60%" /></Box><Skeleton height="44px" width="100%" borderRadius="full" /></VStack></Box></Box>);

export default function DiscoverSection() {
  const [allEvents, setAllEvents] = useState<FrontendEvent[]>([]); 
  const [filteredEvents, setFilteredEvents] = useState<FrontendEvent[]>([]); 
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserFavorites().then((res: { data?: any[]; success?: boolean }) => {
          const favoritesArr = Array.isArray(res?.data) ? res.data : [];
          setFavorites(favoritesArr.map((f: any) => f.event_id || f.id));
      }).catch(console.error);
    }
  }, [user]);

  // ... [fetchEvents, filterLocalEvents, useEffects, handleSearch, handleTabClick remain same] ...
  const fetchEvents = async (query?: string) => { /* logic from previous answer */ setLoading(true); try { const res: any = await searchEvents({ search_query: query || "" }); let rawEvents = []; if (res.events) rawEvents = res.events; else if (Array.isArray(res)) rawEvents = res; else if (res.success) rawEvents = res.data; const mapped = rawEvents.map((e:any) => ({ id: e.event_id, title: e.title, coverImage: e.event_image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800", startDate: e.event_date, location: e.venue_name, category: e.category_name, tags: e.tags })); setAllEvents(mapped); filterLocalEvents(mapped, query||"", activeTab); } catch(e){ setError("Failed to load"); } finally { setLoading(false); }};
  const filterLocalEvents = (events: FrontendEvent[], q: string, t: string | null) => { let r = events; if(q) r = r.filter(e => e.title.toLowerCase().includes(q.toLowerCase())); if(t) r = r.filter(e => e.category?.includes(t) || e.tags?.includes(t)); setFilteredEvents(r); };
  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => { filterLocalEvents(allEvents, search, activeTab); }, [search, activeTab, allEvents]);
  const handleSearch = () => { filterLocalEvents(allEvents, search, null); setActiveTab(null); };
  const handleTabClick = (t: string) => { setActiveTab(activeTab === t ? null : t); setSearch(""); };

  const toggleFavorite = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!user) return router.push('/auth/login');
    const isFav = favorites.includes(eventId);
    setFavorites(prev => isFav ? prev.filter(id => id !== eventId) : [...prev, eventId]);
    try { isFav ? await removeEventFromFavorites(eventId) : await addEventToFavorites(eventId); } catch { setFavorites(prev => isFav ? [...prev, eventId] : prev.filter(id => id !== eventId)); }
  };

  return (
    <Box minH="100vh" bgImage="url('/assets/images/index-image.jpg')" bgSize="cover" backgroundPosition="center" position="relative" display="flex" alignItems="center" py={24}>
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.85} />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack gap={16}>
          <Heading as="h2" color="white" fontWeight={700} textAlign="center" w="full" fontSize={{ base: "3xl", md: "5xl" }}>Discover What's Next.</Heading>
          
          <Box w="full" maxW="5xl" position="relative">
            <Input bg="white" placeholder="Search..." borderRadius="16px" fontSize="18px" h="60px" pl={12} border="none" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} color="black" />
            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)"><Search size={24} color="#9CA3AF" /></Box>
            <Button position="absolute" right={2} top="50%" transform="translateY(-50%)" bg="#FDCB35" color="black" borderRadius="12px" onClick={handleSearch} h="44px">Search</Button>
          </Box>

          <HStack gap={4} wrap="wrap" justify="center">
            {FILTER_TABS.map((tab) => (
              <Button key={tab} bg={activeTab === tab ? "white" : "transparent"} color={activeTab === tab ? "#1A1A1A" : "white"} border="2px solid white" borderRadius="full" px={8} py={2} onClick={() => handleTabClick(tab)}>{tab}</Button>
            ))}
          </HStack>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
            {loading ? Array.from({ length: 4 }).map((_, i) => <GridItem key={i}><EventCardSkeleton /></GridItem>) : 
             error ? <GridItem colSpan={4}><Text color="red.300">Error loading events</Text></GridItem> :
             filteredEvents.map((event) => {
                const isFavorite = favorites.includes(event.id);
                return (
                  <GridItem key={event.id}>
                    <Box bg="#222222" cursor={"pointer"} borderRadius="16px" overflow="hidden" shadow="xl" h="480px" position="relative" transition="all 0.3s" _hover={{ transform: "translateY(-8px)", shadow: "2xl" }} onClick={() => router.push(`/events/${event.id}`)}>
                      <Box h="60%" bgImage={`url('${event.coverImage}')`} bgSize="cover" backgroundPosition="center" />
                      <Box h="40%" bg="#222222" p={6}>
                        <VStack align="start" gap={4} h="full" justify="space-between">
                          <Box w="full">
                            <Heading size="md" color="white" mb={2} lineClamp={2}>{event.title}</Heading>
                            <Text color="#9CA3AF" fontSize="14px">{new Date(event.startDate).toLocaleDateString()}</Text>
                            <Text color="#9CA3AF" fontSize="14px" lineClamp={1}>{event.location}</Text>
                          </Box>
                          <Button w="full" bg="#FDCB35" color="#1A1A1A" borderRadius="full">View Event</Button>
                        </VStack>
                      </Box>
                      
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
              })
            }
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}