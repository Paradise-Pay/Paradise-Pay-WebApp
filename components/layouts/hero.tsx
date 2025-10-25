"use client";

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
      minH="100vh"
      bgImage="url('/assets/images/index-image.jpg')"
      bgSize="cover"
      backgroundPosition="center"
      position="relative"
      display="flex"
      alignItems="center"
      p={16}
    >
      {/* Dark Overlay */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.75} />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
          <GridItem>
            <VStack align="start" gap={8} pl={24}>
              <Heading
                as="h1"
                className="heading-hero"
                color="white"
                maxW="600px"
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
                maxW="500px"
                fontSize="18px"
                fontWeight={500}
                lineHeight="1.4"
              >
                "Your Event Passport — scan, enter,
                <br />
                and enjoy unforgettable experiences."
              </Text>
              <Button
                bg="transparent"
                color="white"
                size="lg"
                px={12}
                mt={8}
                borderRadius="full"
                fontSize="18px"
                fontWeight={700}
                textTransform="capitalize"
                border="2px solid #FDCB35"
                _hover={{
                  bg: "#1A1A1A",
                  borderColor: "#E6B834",
                }}
                transition="all 0.2s ease"
              >
                Get Your Card
              </Button>
            </VStack>
          </GridItem>

          <GridItem display={{ base: "none", lg: "block" }}>
            <Flex justify="center" position="relative">
              {/* Digital Cards */}
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