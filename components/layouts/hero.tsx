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
} from "@chakra-ui/react";

export default function HeroSection() {
  return (
    <Box
      minH="100vh"
      bgImage="url('/assets/images/index-image.jpg')"
      bgSize="cover"
      bgPosition="center"
      position="relative"
      display="flex"
      alignItems="center"
      pb={16}
    >
      {/* Dark Overlay */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.75} />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
          <GridItem>
            <VStack align="start" gap={8}>
              <Heading
                as="h1"
                className="heading-hero"
                color="white"
                maxW="600px"
              >
                All Your Events.
                <br />
                One Digital Card.
              </Heading>
              <Text 
                className="text-body"
                color="rgba(255, 255, 255, 0.8)" 
                maxW="500px"
              >
                Your Event Passport — scan, enter, and enjoy unforgettable experiences.
              </Text>
              <Button
                bg="#FDCB35"
                color="#1A1A1A"
                size="lg"
                px={8}
                py={3}
                borderRadius="12px"
                fontSize="18px"
                fontWeight={600}
                _hover={{
                  bg: "#E6B834",
                }}
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
                  position="absolute"
                  top={-20}
                  left={-20}
                  w="320px"
                  h="200px"
                  bg="#278BF7"
                  borderRadius="16px"
                  p={6}
                  transform="rotate(-8deg)"
                  boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
                >
                  <VStack align="start" gap={4} h="full" justify="space-between">
                    <Box>
                      <Heading size="sm" color="white" mb={2} fontWeight={600}>Paradise Pay</Heading>
                      <Text color="white" fontSize="14px" fontWeight={500}>ROXANNE D.</Text>
                      <Text color="white" fontSize="14px" fontWeight={500}>0000 9999 9999</Text>
                    </Box>
                    <Box w="full" h="20" bg="white" borderRadius="8px" />
                  </VStack>
                </Box>
                
                {/* Bottom Card */}
                <Box
                  w="320px"
                  h="200px"
                  bg="#FDCB35"
                  borderRadius="16px"
                  p={6}
                  transform="rotate(8deg)"
                  boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
                  mt={20}
                >
                  <VStack align="start" gap={4} h="full" justify="space-between">
                    <Box>
                      <Heading size="sm" color="#1A1A1A" mb={2} fontWeight={600}>Paradise Pay</Heading>
                      <Text color="#1A1A1A" fontSize="14px" fontWeight={500}>VALID THRU</Text>
                      <Text color="#1A1A1A" fontSize="14px" fontWeight={500}>00/00</Text>
                    </Box>
                    <Box w="full" h="20" bg="#1A1A1A" borderRadius="8px" />
                  </VStack>
                </Box>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}