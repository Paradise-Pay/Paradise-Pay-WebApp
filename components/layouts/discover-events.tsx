import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Icon,
} from "@chakra-ui/react";
import { Search } from "lucide-react";

export default function DiscoverSection() {
  const [activeTab, setActiveTab] = useState("Category");
  const tabs = [
    "Category",
    "Music",
    "Sports",
    "Festivals",
    "Conferences",
    "Parties",
  ];

  const events = [
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

  return (
    <Box
      minH="100vh"
        bgImage="url('/assets/images/index-image.jpg')"
        bgSize="cover"
      position="relative"
      display="flex"
      alignItems="center"
      py={32}
    >
      {/* Dark Overlay */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.7} />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack gap={16}>
          <Heading as="h2" size="4xl" color="white" fontWeight="bold" textAlign="left" w="full">
            Discover What's Next.
          </Heading>
          
          {/* Search Bar */}
          <Box w="full" maxW="5xl" position="relative">
            <Input
              bg="white"
              placeholder="Search for events, venues, and artists..."
              borderRadius="xl"
              fontSize="lg"
              py={6}
              pl={12}
            />
            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
              <Search size={20} color="gray.500" />
            </Box>
          </Box>
          
          {/* Filter Buttons */}
          <HStack gap={4} wrap="wrap" justify="center">
            {tabs.map((tab) => (
              <Button
                key={tab}
                bg={tab === activeTab ? "gray.800" : "transparent"}
                color="white"
                border="2px solid white"
                borderRadius="full"
                px={12}
                py={2}
                fontSize="md"
                fontWeight="500"
                _hover={{ bg: tab === activeTab ? "gray.700" : "white", color: tab === activeTab ? "white" : "black" }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </HStack>
          
          {/* Event Cards */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
            {events.map((event) => (
              <GridItem key={event.id}>
                <Box
                  bg="gray.800"
                  borderRadius="xl"
                  overflow="hidden"
                  shadow="xl"
                  h="500px"
                  position="relative"
                >
                    <Box h="60%" bgImage={`url('${event.image}')`} bgSize="cover" />
                  <Box h="40%" bg="gray.800" p={6}>
                    <VStack align="start" gap={4} h="full" justify="space-between">
                      <Box>
                        <Heading size="md" color="white" mb={2}>{event.name}</Heading>
                        <Text color="gray.300" fontSize="sm">{event.date} • {event.time}</Text>
                        <Text color="gray.300" fontSize="sm">{event.venue}</Text>
                      </Box>
                      <Button
                        w="full"
                        bg="#fdcb35"
                        color="gray.800"
                        borderRadius="full"
                        fontWeight="600"
                        _hover={{ bg: "#fcca3d" }}
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