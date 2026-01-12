"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Flex,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

export default function FeaturedBundleSection() {
  const [hovering, setHovering] = useState(false);

  return (
    <Box
      position="relative"
      // Reduced height to match the new Event Banner style
      minH={{ base: "220px", md: "160px" }}
      display="flex"
      alignItems="center"
      bgImage="url('/assets/images/featured_bundles_bg.png')"
      bgSize="cover"
      backgroundPosition="center"
      cursor="pointer"
      transition="transform 0.4s ease"
      transform={hovering ? "scale(1.005)" : "scale(1)"}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      overflow="hidden"
    >
      {/* Dark overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="black"
        opacity={0.65}
      />

      <Container maxW="7xl" position="relative" zIndex={2} h="full">
        <Flex 
          w="full" 
          px={{ base: 4, md: 12 }} 
          py={{ base: 6, md: 4 }} 
          align="center" 
          justify="space-between"
          // Responsive layout: Column on mobile, Row on desktop
          direction={{ base: "column", md: "row" }} 
          gap={{ base: 4, md: 0 }}
        >
          
          {/* Left Side: Sponsored Event logo */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box
              border="3px solid #fdcb35"
              borderRadius="full"
              overflow="hidden"
              transition="transform 0.4s ease"
              transform={hovering ? "scale(1.05)" : "scale(1)"}
              // Scaled down image container
              boxSize={{ base: "70px", md: "110px" }} 
              flexShrink={0}
            >
              <Image
                src="/assets/images/rapperholic.jpeg"
                alt="Featured Bundle Logo"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
          </Box>

          {/* Center: Event title and call to action */}
          <Stack flex="1" align="center" spaceX={1} px={4} textAlign="center">
            <Heading
              as="h1"
              className="heading-hero"
              color="white"
              // Adjusted font sizes for responsiveness
              fontSize={{ base: "1.25rem", sm: "1.75rem", md: "2.5rem" }}
              lineHeight="1.2"
            >
              Ghana Rap Celebration 2025
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
              <Text>Get Bundle</Text>
              <ArrowRight size={18} />
            </Flex>
          </Stack>

          {/* Right Side: Featured Bundle banner - Hidden on mobile */}
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
                textAlign={"center"}
                color="black"
                fontSize="lg"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                Featured Bundle
              </Heading>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}