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
} from "@chakra-ui/react";
import { MapPin, Calendar, Ticket } from "lucide-react";

// Sample featured events data
const featuredEvents = [
  {
    id: 1,
    name: "BROCK'S DOUGLASS B",
    eventType: "Event Name",
    date: "17 & 18 AUGUST",
    venue: "Venue: Accra, Ghana",
    eventDate: "Date: Dec 25, 2023",
    tickets: "Tickets: 37 Available",
    image: "/assets/images/event-1.jpg",
    soldOut: false,
    label: "Deluxe",
  },
  {
    id: 2,
    name: "Event Name",
    eventType: "Event Name",
    date: "Dec 25, 2023",
    venue: "Venue: Accra, Ghana",
    eventDate: "Date: Dec 25, 2023",
    tickets: "Tickets: 37 Available",
    image: "/assets/images/event-2.jpg",
    soldOut: false,
    label: "Deluxe",
  },
  {
    id: 3,
    name: "Event Name",
    eventType: "Event Name",
    date: "Dec 25, 2023",
    venue: "Venue: Accra, Ghana",
    eventDate: "Date: Dec 25, 2023",
    tickets: "Tickets: 37 Available",
    image: "/assets/images/event-1.jpg",
    soldOut: false,
    label: "Deluxe",
  },
  {
    id: 4,
    name: "Event Name",
    eventType: "Event Name",
    date: "Dec 25, 2023",
    venue: "Venue: Accra, Ghana",
    eventDate: "Date: Dec 25, 2023",
    tickets: "Tickets: 37 Available",
    image: "/assets/images/event-2.jpg",
    soldOut: false,
    label: "Deluxe",
  },
];

export default function NewMoviesSection() {
  return (
    <Box
      bg={"#FFC138"}
      bgSize="cover"
      py={16}
      px={16}
    >
      <Container maxW="7xl">
        <VStack gap={16} align="start">
          <Heading
            as="h2"
            color="black"
            fontWeight={700}
            fontSize="4xl"
            textAlign="center"
            w="full"
            pl="5%"
            lineHeight="1.1"
          >
            New Movie Releases
          </Heading>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={8}
            w="full"
          >
            {featuredEvents.map((event) => (
              <GridItem key={event.id}>
                <Box
                  bg="#222222"
                  borderRadius="16px"
                  overflow="hidden"
                  shadow="md"
                  h="360px"
                  position="relative"
                  w="full"
                >
                  {/* Main Image Area */}
                  <Box
                    h="50%"
                    bgImage={`url('${event.image}')`}
                    bgSize="cover"
                    backgroundPosition="center"
                    position="relative"
                  >
                    {/* Dark overlay for better text contrast if needed */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.1)"
                    />
                  </Box>

                  {/* Content Area */}
                  <Box bg="#222222" p="20px">
                    <VStack
                      align="start"
                      gap="12px"
                      h="full"
                      justify="space-between"
                    >
                      <Box w="full">
                        <Heading
                          size="md"
                          color="white"
                          fontWeight={700}
                          fontSize="18px"
                          mb="8px"
                          textAlign="left"
                        >
                          {event.name}
                        </Heading>

                        <VStack align="start" gap="6px" w="full">
                          <HStack gap="8px" align="center">
                            <MapPin size={14} color="#CCCCCC" />
                            <Text
                              color="#CCCCCC"
                              fontSize="14px"
                              fontWeight={400}
                            >
                              {event.venue}
                            </Text>
                          </HStack>

                          <HStack gap="8px" align="center">
                            <Calendar size={14} color="#CCCCCC" />
                            <Text
                              color="#CCCCCC"
                              fontSize="14px"
                              fontWeight={400}
                            >
                              {event.eventDate}
                            </Text>
                          </HStack>

                          <HStack gap="8px" align="center">
                            <Ticket size={14} color="#CCCCCC" />
                            <Text
                              color="#CCCCCC"
                              fontSize="14px"
                              fontWeight={400}
                            >
                              {event.tickets}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
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