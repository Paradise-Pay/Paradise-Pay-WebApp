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
  Button,
  Flex,
  Image,
} from "@chakra-ui/react";
import { Check } from "lucide-react";

export default function OrganizerSection() {
  return (
    <Box bg="#2196F3" py={24}>
      <Container maxW="7xl">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
          <GridItem>
            <VStack align="start" gap={8} pl={32}>
              <Heading
                as="h2"
                color="white"
                fontWeight={700}
                fontSize="48px"
                lineHeight="1.1"
                textAlign="left"
              >
                For Organizers,
                <br />
                by Organizers.
              </Heading>
              <Text 
                color="white" 
                fontSize="18px"
                fontWeight={400}
                lineHeight="1.6"
                textAlign="left"
                maxW="500px"
              >
                List, sell, and manage your events in one place. Paradise Pay helps you reach more audiences, sell more tickets, and scan guests seamlessly at the gate.
              </Text>
              
              <VStack align="start" gap={4}>
                {[
                  "Create events in minutes.",
                  "Real-time ticket sales dashboard.",
                  "Data & insights on your attendees.",
                  "No setup fees — pay only per sale.",
                ].map((item, i) => (
                  <Flex key={i} alignItems="center" color="white">
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="50%"
                      bg="#FFC03A"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={3}
                      flexShrink={0}
                    >
                      <Check size={12} color="white" strokeWidth={3} />
                    </Box>
                    <Text fontSize="16px" fontWeight={400}>{item}</Text>
                  </Flex>
                ))}
              </VStack>
              
              <Button
                bg="#FFC03A"
                color="#1A1A1A"
                size="lg"
                px={12}
                py={4}
                borderRadius="12px"
                fontSize="18px"
                fontWeight={700}
                _hover={{ bg: "#E6B834" }}
                shadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                transition="all 0.3s ease"
              >
                Start Selling Today
              </Button>
            </VStack>
          </GridItem>
          
          <GridItem>
            <Flex justify="center" align="center">
              <Image 
                src="/assets/images/for-organizers.png" 
                alt="Event organizers at work" 
                w="auto"
                h="500px"
                maxW="600px"
                borderRadius="16px"
                shadow="0 8px 32px rgba(0, 0, 0, 0.15)"
                objectFit="contain"
              />
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
