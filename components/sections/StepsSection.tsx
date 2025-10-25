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
  Flex,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Sign Up",
    desc: "Get your Paradise Pay digital\n card instantly.",
    bgColor: "#ffffff",
    textColor: "#1A1A1A",
    icon: <ArrowRight/>,
  },
  {
    title: "Add Tickets",
    desc: "Store concerts, sports, parties,\nand festivals in one place.",
    bgColor: "#ADD8E6",
    textColor: "#1A1A1A",
    icon: <ArrowRight/>,
  },
  {
    title: "Scan & Enter",
    desc: "Show your card, get scanned,\nand walk in.",
    bgColor: "#FFC03A",
    textColor: "#1A1A1A",
    icon: <ArrowRight/>,
  },
];

export default function StepsSection() {
  return (
    <Box bg="#FFC138" py={24}>
      <Container maxW="7xl" px={16}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} >
          <GridItem order={{ base: 2, lg: 1 }}>
            <VStack gap={6} align="center" w="full">
              {steps.map((step, idx) => (
                <Box
                  key={idx}
                  bg={step.bgColor}
                  color={step.textColor}
                  p={16}
                  borderRadius="24px"
                  shadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                  w={{ base: "100%", md: "80%", lg: "70%" }}
                  h="120px"
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                    pointerEvents: "none",
                  }}
                >
                  <Flex justify="space-between" align="center" h="full">
                    <Box flex="1">
                      <Heading size="lg" mb={4} fontWeight={700} fontSize="28px" textAlign="left">
                        {step.title}
                      </Heading>
                      <Text 
                        fontSize="16px" 
                        lineHeight="1.4" 
                        fontWeight={400} 
                        textAlign="left"
                        whiteSpace="pre-line"
                      >
                        {step.desc}
                      </Text>
                    </Box>
                    <Box>
                      <ArrowRight size={28} color="#1A1A1A" strokeWidth={2.5} />
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </GridItem>
          
          <GridItem order={{ base: 1, lg: 2 }}>
            <VStack align="start" gap={6} h="full" justify="center">
              <Heading
                as="h2"
                className="heading-section"
                color="#1A1A1A"
                fontWeight={700}
                fontSize="56px"
                lineHeight="1.1"
                textAlign="left"
              >
                You Are
                <br />
                3-Steps
                <br />
                Away.
              </Heading>
              <Text 
                className="text-body" 
                color="#1A1A1A" 
                fontSize="20px"
                fontWeight={400}
                lineHeight="1.4"
                textAlign="left"
                whiteSpace="pre-line"
              >
                Enjoy immersive and innovative{'\n'}digital ticketing experience.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
