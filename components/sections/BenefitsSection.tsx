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
  HStack,
  Button,
} from "@chakra-ui/react";
import { CreditCard, Trophy, Ticket, Layers, Users } from "lucide-react";

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
    <Box bg="#2176FF" py={16}>
      <Container maxW="7xl">
        <VStack gap={16}>
          <Heading 
            as="h2" 
            color="white" 
            fontWeight={900}
            fontSize="48px"
            lineHeight="1.1"
            textAlign="center"
          >
            Everything You Need.
            <br />
            One Digital Card.
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8} px={16}>
            {benefits.map((benefit, i) => (
              <GridItem key={i}>
                <Box
                  bg="white"
                  color="#333333"
                  p={8}
                  borderRadius="12px"
                  shadow="lg"
                  h="110px"
                  display="flex"
                  alignItems="center"
                >
                  <HStack gap={6} h="full" align="start">
                    <Box color={benefit.icon.props.color} mt={1}>
                      {benefit.icon}
                    </Box>
                    <VStack align="start" gap={2} flex="1">
                      <Heading 
                        size="lg" 
                        color="#333333" 
                        fontWeight={700}
                        fontSize="24px"
                        lineHeight="1.2"
                      >
                        {benefit.title}
                      </Heading>
                      <Text 
                        color="#666666" 
                        fontSize="14px"
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
            
            <GridItem>
              <Box
                h="180px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  bg="#FFC107"
                  color="black"
                  size="xl"
                  px={24}
                  py={8}
                  mb={16}
                  borderRadius="full"
                  fontSize="24px"
                  fontWeight={700}
                  border="none"
                  _hover={{ bg: "#FFB300" }}
                  _active={{ bg: "#FFB300" }}
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
