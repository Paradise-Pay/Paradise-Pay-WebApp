"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Flex,
  Heading,
  Text,
  Image,
  HStack,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getFeaturedEvents } from "@/lib/api";

interface FeaturedEvent {
  id: string;
  title: string;
  coverImage: string;
}

export default function FeaturedEventBanner() {
  const [hovering, setHovering] = useState(false);
  const [event, setEvent] = useState<FeaturedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res: any = await getFeaturedEvents();
        
        // Handle Response Format (Array vs Object wrapper)
        let rawEvents: any[] = [];
        if (Array.isArray(res)) {
          rawEvents = res;
        } else if (res?.data && Array.isArray(res.data)) {
          rawEvents = res.data;
        }

        if (rawEvents.length > 0) {
          // Get the LAST added event (last item in the array)
          const lastEvent = rawEvents[rawEvents.length - 1];

          setEvent({
            id: lastEvent.event_id || lastEvent.id,
            title: lastEvent.title,
            coverImage: lastEvent.event_image_url || lastEvent.event_banner_url || "/assets/images/featured_events_bg.png",
          });
        }
      } catch (error) {
        console.error("Failed to load featured banner", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleClick = () => {
    if (event?.id) {
      router.push(`/events/${event.id}`);
    }
  };

  if (loading) {
    return (
      <Box position="relative" minH="160px" w="full" bg="gray.100">
        <Container w="full" h="full" py={6}>
          <HStack w="full" h="full" align="center" justify="space-between">
             <Skeleton height="100px" width="100px" borderRadius="full" />
             <Skeleton height="40px" width="40%" />
             <Skeleton height="100px" width="50px" />
          </HStack>
        </Container>
      </Box>
    );
  }

  if (!event) return null; // Don't show banner if no events exist

  return (
    <Box
      position="relative"
      // Reduced height by approx 50% (was 280px)
      minH={{ base: "140px", md: "160px" }}
      display="flex"
      alignItems="center"
      // Use the event image as background, or a fallback pattern
      bgImage={`linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${event.coverImage}')`}
      bgSize="cover"
      backgroundPosition="center"
      cursor="pointer"
      transition="transform 0.4s ease"
      transform={hovering ? "scale(1.005)" : "scale(1)"}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
      overflow="hidden"
    >
      <Container maxW="7xl" position="relative" zIndex={2} h="full">
        <HStack w="full" px={{ base: 4, md: 12 }} py={4} align="center" justify="space-between">
          
          {/* Left Side: Event Logo/Image */}
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box
              border="3px solid #fdcb35"
              borderRadius="full"
              overflow="hidden"
              transition="transform 0.4s ease"
              transform={hovering ? "scale(1.05)" : "scale(1)"}
              // Scaled down image container
              boxSize={{ base: "80px", md: "110px" }} 
              flexShrink={0}
            >
              <Image
                src={event.coverImage}
                alt={event.title}
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
          </Box>

          {/* Center: Event Title & CTA */}
          <Stack flex="1" align="center" spaceX={1} px={4}>
            <Heading
              as="h1"
              className="heading-hero"
              color="white"
              // Scaled down font sizes
              fontSize={{ base: "1.5rem", sm: "2rem", md: "2.5rem" }}
              lineHeight="1.1"
              textAlign="center"
            >
              {event.title}
            </Heading>

            <Flex
              align="center"
              gap={2}
              fontSize={{ base: "md", md: "xl" }}
              fontWeight="medium"
              color="white"
              transition="color 0.3s ease"
              _hover={{ color: "#fdcb35" }}
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <Text>Get Tickets</Text>
              <ArrowRight size={18} />
            </Flex>
          </Stack>

          {/* Right Side: Yellow Label */}
          <Box display={{ base: "none", md: "flex" }} justifyContent="flex-end">
            <Box
              width="180px" // Scaled down
              height="60px" // Scaled down
              transform="rotate(90deg)"
              bg="#fdcb35"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr="-60px" // Pull it to the edge
            >
              <Heading
                as="h2"
                className="heading-hero"
                textAlign="center"
                color="black"
                fontSize="lg" // Scaled down font
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                Featured
              </Heading>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}