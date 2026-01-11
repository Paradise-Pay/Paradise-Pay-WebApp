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
        let rawEvents: any[] = [];
        if (Array.isArray(res)) {
          rawEvents = res;
        } else if (res?.data && Array.isArray(res.data)) {
          rawEvents = res.data;
        }

        if (rawEvents.length > 0) {
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
      // Adjusted Skeleton height for mobile vs desktop
      <Box position="relative" minH={{ base: "200px", md: "160px" }} w="full" bg="gray.100">
        <Container w="full" h="full" py={6}>
          <Flex 
            w="full" 
            h="full" 
            align="center" 
            justify="space-between" 
            direction={{ base: "column", md: "row" }} // Column on mobile
            gap={4}
          >
             <Skeleton height={{ base: "80px", md: "100px" }} width={{ base: "80px", md: "100px" }} borderRadius="full" />
             <Skeleton height="40px" width={{ base: "80%", md: "40%" }} />
             <Skeleton height="100px" width="50px" display={{ base: "none", md: "block" }} />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (!event) return null;

  return (
    <Box
      position="relative"
      // Mobile needs more height for stacked content
      minH={{ base: "220px", md: "160px" }}
      display="flex"
      alignItems="center"
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
        <Flex 
          w="full" 
          px={{ base: 4, md: 12 }} 
          py={{ base: 6, md: 4 }} 
          align="center" 
          justify="space-between"
          // ✅ FIX: Stack vertically on mobile, row on desktop
          direction={{ base: "column", md: "row" }} 
          gap={{ base: 4, md: 0 }}
        >
          
          {/* Left Side: Event Logo/Image */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box
              border="3px solid #fdcb35"
              borderRadius="full"
              overflow="hidden"
              transition="transform 0.4s ease"
              transform={hovering ? "scale(1.05)" : "scale(1)"}
              // Slightly smaller on mobile
              boxSize={{ base: "70px", md: "110px" }} 
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
          <Stack flex="1" align="center" spaceX={1} px={4} textAlign="center">
            <Heading
              as="h1"
              className="heading-hero"
              color="white"
              // Adjusted font sizes for mobile legibility
              fontSize={{ base: "1.25rem", sm: "1.75rem", md: "2.5rem" }}
              lineHeight="1.2"
            >
              {event.title}
            </Heading>

            <Flex
              align="center"
              gap={2}
              fontSize={{ base: "sm", md: "xl" }}
              fontWeight="medium"
              color="white"
              transition="color 0.3s ease"
              _hover={{ color: "#fdcb35" }}
            >
              <Text>Get Tickets</Text>
              <ArrowRight size={18} />
            </Flex>
          </Stack>

          {/* Right Side: Yellow Label - Hidden on mobile to save space */}
          <Box display={{ base: "none", md: "flex" }} justifyContent="flex-end">
            <Box
              width="180px"
              height="60px"
              transform="rotate(90deg)"
              bg="#fdcb35"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr="-60px"
            >
              <Heading
                as="h2"
                className="heading-hero"
                textAlign="center"
                color="black"
                fontSize="lg"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                Featured
              </Heading>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}