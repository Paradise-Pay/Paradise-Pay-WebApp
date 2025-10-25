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

export default function FutureTicketingSection() {
  return (
    <Box bg="#FFC138" py={24} position="relative">
      {/* Top Blue Border */}
      <Box position="absolute" top="0" left="0" right="0" h="8px" bg="#42A5F5" />
      
      {/* Bottom Blue Border */}
      <Box position="absolute" bottom="0" left="0" right="0" h="8px" bg="#42A5F5" />
      
      <Container maxW="7xl" position="relative" zIndex={1} >
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12} alignItems="center">
          <GridItem>
            <VStack align="start" gap={12} pl={32} py={16}>
              <Heading
                as="h2"
                color="#333333"
                fontWeight={900}
                fontSize="48px"
                lineHeight="1.1"
                textAlign="left"
              >
                The Future
                <br />
                Of Event
                <br />
                Ticketing.
              </Heading>
              <Text 
                color="#333333" 
                maxW="540px"
                fontSize="18px"
                fontWeight={400}
                lineHeight="1.6"
                textAlign="left"
              >
                Paradise Pay is more than a ticketing app — <br /> it's your event passport. From concerts to <br /> sports to festivals, your Paradise Pay keeps all <br /> your tickets in one place. No lost emails, no <br /> printouts, no stress. Just scan and enter.
              </Text>
              <Button
                bg="#42A5F5"
                color="white"
                size="lg"
                px={12}
                py={4}
                borderRadius="12px"
                fontSize="18px"
                fontWeight={600}
                _hover={{ bg: "#1976D2" }}
                transition="all 0.3s ease"
              >
                Get Your Card
              </Button>
            </VStack>
          </GridItem>
          
          <GridItem>
            <Flex  position="relative">
              <Box position="relative">
                <Image
                  src="/assets/images/hand-with-phone.png"
                  alt="Hand holding phone"
                  w="auto"
                  h="500px"
                  maxW="300px"
                  objectFit="contain"
                  position="relative"
                  zIndex={1}
                />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
