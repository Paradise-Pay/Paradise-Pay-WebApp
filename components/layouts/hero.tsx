"use client";

/**
 * HeroSection component - Main landing page hero
 * Features hero text and digital card showcase
 */

import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Flex,
  Image,
} from "@chakra-ui/react";

export default function HeroSection() {
  return (
    <Box
      minH={{ base: "80vh", md: "100vh" }}
      bgImage="url('/assets/images/index-image.jpg')"
      bgSize="cover"
      backgroundPosition="center"
      position="relative"
      display="flex"
      alignItems="center"
      p={{ base: 4, md: 16 }}
    >
      {/* Dark Overlay */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.75} />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 8, md: 16 }} alignItems="center">
          <GridItem>
            <VStack align={{ base: "center", md: "start" }} gap={{ base: 6, md: 8 }} pl={{ base: 0, md: 24 }} textAlign={{ base: "center", md: "left" }}>
              <Heading
                as="h1"
                className="heading-hero"
                color="white"
                maxW={{ base: "100%", md: "600px" }}
                fontSize={{ base: "2.5rem", sm: "3rem", md: "3.5rem" }}
                lineHeight={{ base: "1.2", md: "1.1" }}
              >
                All Your
                <br />
                Events. One
                <br />
                Digital Card.
              </Heading>
              <Text
                className="text-body"
                color="white"
                maxW={{ base: "100%", md: "500px" }}
                fontSize={{ base: "16px", md: "18px" }}
                fontWeight={500}
                lineHeight="1.4"
                opacity={0.9}
              >
                "Your Event Passport — scan, enter,
                <br />
                and enjoy unforgettable experiences."
              </Text>
              <Button
                bg="transparent"
                color="white"
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 12 }}
                py={{ base: 3, md: 4 }}
                mt={{ base: 4, md: 8 }}
                borderRadius="full"
                fontSize={{ base: "16px", md: "18px" }}
                fontWeight={700}
                textTransform="capitalize"
                border="2px solid #FDCB35"
                _hover={{
                  bg: "#1A1A1A",
                  borderColor: "#E6B834",
                }}
                transition="all 0.2s ease"
                w={{ base: "auto", sm: "200px" }}
              >
                Get Your Card
              </Button>
            </VStack>
          </GridItem>

          <GridItem display={{ base: "none", lg: "block" }}>
            <Flex justify="center" position="relative">
              {/* Digital Cards Showcase */}
              <Box position="relative">
                {/* Top Card */}
                <Box
                  w="320px"
                  h="200px"
                  borderRadius="16px"
                  transform="rotate(8deg)"
                  boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
                  overflow="hidden"
                >
                  <Image
                    src="/cards/paradise-card-yellow.png"
                    alt="Paradise Pay Yellow Card"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>

                {/* Bottom Card */}
                <Box
                  position="absolute"
                  top={-16}
                  left={-20}
                  w="320px"
                  h="200px"
                  borderRadius="16px"
                  transform="rotate(-8deg)"
                  boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
                  overflow="hidden"
                >
                  <Image
                    src="/cards/paradise-card-blue.png"
                    alt="Paradise Pay Blue Card"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}