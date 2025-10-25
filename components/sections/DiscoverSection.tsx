"use client";

import React from "react";
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

const discoverEvents = [
  {
    id: 1,
    name: "Summer Music Fest",
    date: "Oct 20, 2025",
    time: "6:00 PM",
    venue: "Accra Stadium",
    image: "/assets/images/event-1.jpg",
  },
  {
    id: 2,
    name: "Tech Conference",
    date: "Nov 5, 2025",
    time: "9:00 AM",
    venue: "Kempinski Hotel",
    image: "/assets/images/event-2.jpg",
  },
  {
    id: 3,
    name: "Food & Drink Festival",
    date: "Dec 12, 2025",
    time: "12:00 PM",
    venue: "Osu Oxford Street",
    image: "/assets/images/event-1.jpg",
  },
  {
    id: 4,
    name: "New Year Party",
    date: "Dec 31, 2025",
    time: "10:00 PM",
    venue: "Labadi Beach",
    image: "/assets/images/event-2.jpg",
  },
];

export default function DiscoverSection() {
  return (
    <Box
      minH="100vh"
      bgImage="url('/assets/images/index-image.jpg')"
      bgSize="cover"
      position="relative"
      display="flex"
      alignItems="center"
      py={24}
    >
      {/* Dark Overlay */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.8} />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack gap={16}>
          <Heading as="h2" className="heading-section" color="white" fontWeight={700} textAlign="center" w="full">
            Discover What's Next.
          </Heading>
          
          {/* Search Bar */}
          <Box w="full" maxW="5xl" position="relative">
            <Input
              bg="white"
              placeholder="Search for events, artists, venues, and more..."
              borderRadius="16px"
              fontSize="18px"
              py={6}
              pl={12}
              border="none"
              _focus={{ boxShadow: "0 0 0 3px rgba(253, 203, 53, 0.3)" }}
            />
            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
              <Search size={20} color="#9CA3AF" />
            </Box>
          </Box>
          
          {/* Filter Buttons */}
          <HStack gap={4} wrap="wrap" justify="center">
            {["Concerts", "Music", "Sports", "Festivals", "Conferences", "Arts"].map((tab) => (
              <Button
                key={tab}
                bg="transparent"
                color="white"
                border="2px solid white"
                borderRadius="full"
                px={8}
                py={2}
                fontSize="16px"
                fontWeight={500}
                _hover={{ bg: "white", color: "#1A1A1A" }}
              >
                {tab}
              </Button>
            ))}
          </HStack>
          
          {/* Event Cards */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
            {discoverEvents.map((event) => (
              <GridItem key={event.id}>
                <Box
                  bg="#1A1A1A"
                  borderRadius="16px"
                  overflow="hidden"
                  shadow="xl"
                  h="480px"
                  position="relative"
                >
                  <Box h="60%" bgImage={`url('${event.image}')`} bgSize="cover" />
                  <Box h="40%" bg="#1A1A1A" p={6}>
                    <VStack align="start" gap={4} h="full" justify="space-between">
                      <Box>
                        <Heading size="md" color="white" mb={2} fontWeight={600}>{event.name}</Heading>
                        <Text color="#9CA3AF" fontSize="14px">{event.date} • {event.time}</Text>
                        <Text color="#9CA3AF" fontSize="14px">{event.venue}</Text>
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
                        Add To Card
                      </Button>
                    </VStack>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
