"use client";

/**
 * BenefitsSection component showcasing Paradise Pay features
 * Displays key benefits in a grid layout with call-to-action button
 */

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
  Button,
} from "@chakra-ui/react";
import { CreditCard, Trophy, Ticket, Layers, Users } from "lucide-react";

// Benefits data for the Paradise Pay features
const benefits = [
  {
    icon: <CreditCard size={40} color="#2176FF" />,
    title: "One Card For\n All Events",
    desc: "Carry your tickets digitally, forever.",
  },
  {
    icon: <Trophy size={40} color="#FFC107" />,
    title: "Get Rewarded",
    desc: "Earn Paradise Miles for future events.",
  },
  {
    icon: <Ticket size={40} color="#FFC107" />,
    title: "Ticket Bundles\n & Discounts",
    desc: "Unlock savings when you buy more.",
  },
  {
    icon: <Layers size={40} color="#2176FF" />,
    title: "Curated Bundles",
    desc: "Concert packs, sports passes, weekend vibes.",
  },
  {
    icon: <Users size={40} color="#2176FF" />,
    title: "Skip The Line",
    desc: "Fast-lane scanning at participating venues.",
  },
];

export default function BenefitsSection() {
  return (
    <Box bg="#2176FF" py={{ base: 12, md: 14, lg: 16 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8, lg: 16 }}>
        <VStack gap={{ base: 8, md: 12, lg: 16 }}>
          <Heading 
            as="h2" 
            color="white" 
            fontWeight={900}
            fontSize={{ base: "2.5rem", sm: "3rem", md: "3.5rem", lg: "48px" }}
            lineHeight="1.1"
            textAlign="center"
          >
            Everything You Need.
            <br />
            One Digital Card.
          </Heading>
          
          <Grid 
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
            gap={{ base: 4, md: 6, lg: 8 }} 
            w="full"
          >
            {benefits.map((benefit, i) => (
              <GridItem key={i}>
                <Box
                  bg="white"
                  color="#333333"
                  p={{ base: 6, md: 7, lg: 8 }}
                  borderRadius="12px"
                  shadow="lg"
                  minH={{ base: "auto", md: "100px", lg: "110px" }}
                  display="flex"
                  alignItems="center"
                  w="full"
                >
                  <HStack gap={{ base: 4, md: 5, lg: 6 }} h="full" align="start" w="full">
                    <Box color={benefit.icon.props.color} mt={1} flexShrink={0}>
                      {benefit.icon}
                    </Box>
                    <VStack align="start" gap={{ base: 1, md: 2 }} flex="1">
                      <Heading 
                        size="lg" 
                        color="#333333" 
                        fontWeight={700}
                        fontSize={{ base: "18px", md: "20px", lg: "24px" }}
                        lineHeight="1.2"
                        whiteSpace="pre-line"
                      >
                        {benefit.title}
                      </Heading>
                      <Text 
                        color="#666666" 
                        fontSize={{ base: "13px", md: "14px" }}
                        lineHeight="1.5"
                        fontWeight={400}
                      >
                        {benefit.desc}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </GridItem>
            ))}
            
            <GridItem colSpan={{ base: 1, sm: 2, lg: 1 }}>
              <Box
                minH={{ base: "120px", md: "150px", lg: "180px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                py={{ base: 4, md: 6 }}
              >
                <Button
                  bg="#FFC107"
                  color="black"
                  size={{ base: "lg", md: "xl" }}
                  px={{ base: 12, md: 16, lg: 24 }}
                  py={{ base: 4, md: 6, lg: 8 }}
                  borderRadius="full"
                  fontSize={{ base: "18px", md: "20px", lg: "24px" }}
                  fontWeight={700}
                  border="none"
                  _hover={{ bg: "#FFB300" }}
                  _active={{ bg: "#FFB300" }}
                  w={{ base: "100%", sm: "auto" }}
                  maxW={{ base: "300px", sm: "none" }}
                >
                  Get Started
                </Button>
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}