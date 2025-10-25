"use client";

/**
 * StepsSection component
 * Shows the 3-step process to get started with Paradise Pay
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
  Flex,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

// Steps configuration for getting started
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
    <Box bg="#FFC138" py={{ base: 12, md: 16, lg: 24 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8, lg: 16 }}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 8, lg: 0 }}>
          <GridItem order={{ base: 2, lg: 1 }}>
            <VStack gap={{ base: 4, md: 6 }} align="center" w="full">
              {steps.map((step, idx) => (
                <Box
                  key={idx}
                  bg={step.bgColor}
                  color={step.textColor}
                  p={{ base: 6, md: 12, lg: 16 }}
                  borderRadius="24px"
                  shadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                  w={{ base: "100%", md: "80%", lg: "70%" }}
                  h={{ base: "auto", md: "100px", lg: "120px" }}
                  minH={{ base: "100px", md: "100px", lg: "120px" }}
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
                  <Flex justify="space-between" align="center" h="full" direction={{ base: "column", md: "row" }} gap={{ base: 3, md: 0 }}>
                    <Box flex="1" textAlign={{ base: "center", md: "left" }}>
                      <Heading 
                        size="lg" 
                        mb={{ base: 2, md: 4 }} 
                        fontWeight={700} 
                        fontSize={{ base: "20px", md: "24px", lg: "28px" }} 
                        textAlign={{ base: "center", md: "left" }}
                      >
                        {step.title}
                      </Heading>
                      <Text 
                        fontSize={{ base: "14px", md: "15px", lg: "16px" }} 
                        lineHeight="1.4" 
                        fontWeight={400} 
                        textAlign={{ base: "center", md: "left" }}
                        whiteSpace="pre-line"
                      >
                        {step.desc}
                      </Text>
                    </Box>
                    <Box display={{ base: "none", md: "block" }}>
                      <ArrowRight color="#1A1A1A" strokeWidth={2.5} />
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </GridItem>
          
          <GridItem order={{ base: 1, lg: 2 }}>
            <VStack align={{ base: "center", lg: "start" }} gap={{ base: 4, md: 6 }} h="full" justify="center" textAlign={{ base: "center", lg: "left" }}>
              <Heading
                as="h2"
                className="heading-section"
                color="#1A1A1A"
                fontWeight={700}
                fontSize={{ base: "32px", md: "42px", lg: "56px" }}
                lineHeight="1.1"
                textAlign={{ base: "center", lg: "left" }}
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
                fontSize={{ base: "16px", md: "18px", lg: "20px" }}
                fontWeight={400}
                lineHeight="1.4"
                textAlign={{ base: "center", lg: "left" }}
                whiteSpace="pre-line"
                maxW={{ base: "100%", lg: "auto" }}
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