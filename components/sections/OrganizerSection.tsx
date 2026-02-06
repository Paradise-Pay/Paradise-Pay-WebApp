"use client";

/**
 * OrganizerSection component for event organizers
 * Features organizer benefits and call-to-action for event creation
 */

import React from "react";
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  return (
    <Box bg="#2196F3" py={{ base: 16, md: 20, lg: 24 }}>
      <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
        <Grid 
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
          gap={{ base: 12, md: 16 }} 
          alignItems="center"
        >
          <GridItem>
            <VStack 
              align="start" 
              gap={{ base: 6, md: 8 }} 
              pl={{ base: 0, lg: 8 }}
              pr={{ base: 0, lg: 4 }}
            >
              <Heading
                as="h2"
                color="white"
                fontWeight={700}
                fontSize={{ base: "32px", md: "40px", lg: "48px" }}
                lineHeight="1.1"
                textAlign="left"
              >
                For Organizers,
                <br />
                by Organizers.
              </Heading>
              <Text 
                color="white" 
                fontSize={{ base: "16px", md: "17px", lg: "18px" }}
                fontWeight={400}
                lineHeight="1.6"
                textAlign="left"
                maxW={{ base: "100%", lg: "500px" }}
              >
                List, sell, and manage your events in one place. Paradise Pay helps you reach more audiences, sell more tickets, and scan guests seamlessly at the gate.
              </Text>
              
              {/* Organizer feature list */}
              <VStack align="start" gap={{ base: 3, md: 4 }} w="100%">
                {[
                  "Create events in minutes.",
                  "Real-time ticket sales dashboard.",
                  "Data & insights on your attendees.",
                  "No setup fees — pay only per sale.",
                ].map((item, i) => (
                  <Flex key={i} alignItems="center" color="white" w="100%">
                    <Box
                      w={{ base: "18px", md: "20px" }}
                      h={{ base: "18px", md: "20px" }}
                      borderRadius="50%"
                      bg="#FFC03A"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={{ base: 2, md: 3 }}
                      flexShrink={0}
                    >
                      <Check size={12} color="white" strokeWidth={3} />
                    </Box>
                    <Text 
                      fontSize={{ base: "14px", md: "15px", lg: "16px" }} 
                      fontWeight={400}
                      lineHeight="1.4"
                    >
                      {item}
                    </Text>
                  </Flex>
                ))}
              </VStack>
              
              <Button
                bg="#FFC03A"
                color="#1A1A1A"
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 12 }}
                py={{ base: 3, md: 4 }}
                borderRadius="12px"
                fontSize={{ base: "16px", md: "18px" }}
                fontWeight={700}
                _hover={{ bg: "#E6B834" }}
                shadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                transition="all 0.3s ease"
                w={{ base: "100%", sm: "auto" }}
                onClick={() => router.push('/auth/organizer-apply')}
              >
                Start Selling Today
              </Button>
            </VStack>
          </GridItem>
          
          <GridItem order={{ base: -1, lg: 0 }} display={{ base: "none", md: "block" }}>
            <Flex justify="center" align="center" mt={{ base: 8, lg: 0 }}>
              <Image 
                src="/assets/images/for-organizers.png" 
                alt="Event organizers at work" 
                w="100%"
                h={{ base: "auto", md: "400px", lg: "500px" }}
                maxW={{ base: "400px", md: "500px", lg: "600px" }}
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
