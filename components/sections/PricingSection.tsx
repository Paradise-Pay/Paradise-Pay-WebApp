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
} from "@chakra-ui/react";

const pricingPlans = [
  {
    title: "Free",
    subtitle: "Basic Passport",
    price: "GH₵0.00 / Year",
    features: [
      "Store & scan tickets.",
      "Access standard bundles.",
      "Join the community.",
    ],
    bgColor: "#FFC107",
    textColor: "#1A1A1A",
    btnText: "Start Free",
    btnBg: "#1A1A1A",
    btnColor: "white",
    borderColor: "#1A1A1A",
  },
  {
    title: "Paradise +",
    subtitle: "For The Fans",
    price: "GH₵100 / Year",
    features: [
      "Early ticket access.",
      "Skip-the-line entry.",
      "Priority seating offers.",
      "Double Paradise Miles.",
    ],
    bgColor: "#1A1A1A",
    textColor: "white",
    btnText: "Get Started",
    btnBg: "#FFC107",
    btnColor: "#1A1A1A",
    highlighted: true,
  },
  {
    title: "Paradise X",
    subtitle: "For The VIPs",
    price: "GH₵300 / Year",
    features: [
      "VIP-only events & lounges.",
      "Meet-and-greet access.",
      "Banking perks & cashback.",
      "All-access bundles.",
    ],
    bgColor: "#FFC107",
    textColor: "#1A1A1A",
    btnText: "Go Premium",
    btnBg: "#1A1A1A",
    btnColor: "white",
    borderColor: "#1A1A1A",
  },
];

export default function PricingSection() {
  return (
    <Box bg="#FFC107" py={24} px={16}>
      <Container maxW="7xl">
        <VStack gap={16}>
          <Heading as="h2" color="#1A1A1A" fontWeight={700} fontSize="48px" textAlign="center">
            Choose Your Passport.
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} w="full">
            {pricingPlans.map((plan, idx) => (
              <GridItem key={idx}>
                <Box
                  bg={plan.bgColor}
                  color={plan.textColor}
                  p={8}
                  borderRadius="16px"
                  border={plan.borderColor ? "3px solid" : "none"}
                  borderColor={plan.borderColor}
                  minH="500px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  position="relative"
                  shadow="lg"
                >
                  <VStack gap={6} align="start">
                    <VStack align="start" gap={2}>
                      <Heading size="2xl" fontWeight={700} fontSize="32px">{plan.title}</Heading>
                      <Text fontSize="16px" fontWeight={400} fontStyle={idx === 1 ? "italic" : "normal"}>
                        {plan.subtitle}
                      </Text>
                    </VStack>
                    
                    <Box flex="1" mt={4}>
                      {plan.features.map((feature, i) => (
                        <Box key={i} display="flex" alignItems="flex-start" mb={3}>
                          <Box
                            w="6px"
                            h="6px"
                            borderRadius="50%"
                            bg={plan.textColor}
                            mt={2}
                            mr={3}
                            flexShrink={0}
                          />
                          <Text fontSize="16px" lineHeight="1.5">{feature}</Text>
                        </Box>
                      ))}
                    </Box>
                    
                    <Text fontSize="24px" fontWeight={700} mt={4}>{plan.price}</Text>
                  </VStack>
                  
                  <Button
                    w="full"
                    bg={plan.btnBg}
                    color={plan.btnColor}
                    size="lg"
                    py={4}
                    borderRadius="12px"
                    fontSize="18px"
                    fontWeight={700}
                    _hover={{ opacity: 0.9 }}
                  >
                    {plan.btnText}
                  </Button>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
