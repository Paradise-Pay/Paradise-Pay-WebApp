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
  HStack,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

export default function FeaturedBundleSection() {
  const [hovering, setHovering] = useState(false);

  return (
    <Box
      position="relative"
      minH="280px"
      display="flex"
      alignItems="center"
      bgImage="url('/assets/images/featured_bundles_bg.png')"
      bgSize="cover"
      cursor="pointer"
      transition="transform 0.4s ease"
      transform={hovering ? "scale(1.01)" : "scale(1)"}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
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

      <Container w={"full"} position="relative" zIndex={2}>
        <HStack w="full" px={12} py={12} align="center">
          {/* Sponsored Event logo */}
          <Box w="300px" display="flex" justifyContent="flex-start">
            <Box
              border="4px solid #fdcb35"
              borderRadius="full"
              overflow="hidden"
              transition="transform 0.4s ease"
              transform={hovering ? "scale(1.1)" : "scale(1)"}
            >
              <Image
                src="/assets/images/rapperholic.jpeg"
                alt="Featured Bundle Logo"
                boxSize="185px"
                objectFit="cover"
              />
            </Box>
          </Box>

          {/* Event title and call to action */}
          <Stack flex="1" align="center">
            <Heading
              as="h1"
              className="heading-hero"
              color="white"
              fontSize={{ base: "2rem", sm: "2.5rem", md: "3rem" }}
              lineHeight={{ base: "1.2", md: "1.1" }}
              textAlign={"center"}
            >
              Ghana Rap Celebration 2025
            </Heading>

            <Flex
              align="center"
              gap={2}
              fontSize="3xl"
              fontWeight="medium"
              color="white"
              transition="color 0.3s ease"
              _hover={{ color: "#fdcb35" }}
            >
              <Text>Get Bundle</Text>
              <ArrowRight size={22} />
            </Flex>
          </Stack>

          {/* Featured Bundle banner */}
          <Box w="300px" display="flex" justifyContent="flex-end">
            <Box
              width="300px"
              height="100px"
              transform="rotate(90deg)"
              bg="#fdcb35"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Heading
                as="h2"
                className="heading-hero"
                textAlign={"center"}
                color="#6797FA"
                fontSize="3xl"
                fontWeight="bold"
              >
                Featured Bundle
              </Heading>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}