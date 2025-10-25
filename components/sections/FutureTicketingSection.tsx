"use client";

/**
 * FutureTicketingSection component
 * Showcases the future of event ticketing with mobile app preview
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
  Button,
  Flex,
  Image,
} from "@chakra-ui/react";

export default function FutureTicketingSection() {
  return (
    <Box bg="#FFC138" py={{ base: 12, md: 16, lg: 24 }} position="relative">
      {/* Top Blue Border */}
      <Box position="absolute" top="0" left="0" right="0" h="8px" bg="#42A5F5" />
      
      {/* Bottom Blue Border */}
      <Box position="absolute" bottom="0" left="0" right="0" h="8px" bg="#42A5F5" />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 8, md: 10, lg: 12 }} alignItems="center">
          <GridItem order={{ base: 2, lg: 1 }}>
            <VStack 
              align={{ base: "center", md: "start" }} 
              gap={{ base: 6, md: 8, lg: 12 }} 
              pl={{ base: 0, md: 8, lg: 32 }} 
              py={{ base: 8, md: 12, lg: 16 }}
              textAlign={{ base: "center", md: "left" }}
            >
              <Heading
                as="h2"
                color="#333333"
                fontWeight={900}
                fontSize={{ base: "2.5rem", sm: "3rem", md: "3.5rem", lg: "48px" }}
                lineHeight="1.1"
              >
                The Future
                <br />
                Of Event
                <br />
                Ticketing.
              </Heading>
              <Text 
                color="#333333" 
                maxW={{ base: "100%", md: "500px", lg: "540px" }}
                fontSize={{ base: "16px", md: "17px", lg: "18px" }}
                fontWeight={400}
                lineHeight="1.6"
                whiteSpace="pre-line"
              >
                Paradise Pay is more than a ticketing app —{'\n'}it's your event passport. From concerts to{'\n'}sports to festivals, your Paradise Pay keeps all{'\n'}your tickets in one place. No lost emails, no{'\n'}printouts, no stress. Just scan and enter.
              </Text>
              <Button
                bg="#42A5F5"
                color="white"
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 10, lg: 12 }}
                py={{ base: 3, md: 4 }}
                borderRadius="12px"
                fontSize={{ base: "16px", md: "17px", lg: "18px" }}
                fontWeight={600}
                _hover={{ bg: "#1976D2" }}
                transition="all 0.3s ease"
                w={{ base: "auto", sm: "200px" }}
              >
                Get Your Card
              </Button>
            </VStack>
          </GridItem>
          
          <GridItem order={{ base: 1, lg: 2 }}>
            <Flex justify="center" position="relative">
              <Box position="relative">
                <Image
                  src="/assets/images/hand-with-phone.png"
                  alt="Hand holding phone"
                  w="auto"
                  h={{ base: "300px", sm: "350px", md: "400px", lg: "500px" }}
                  maxW={{ base: "250px", sm: "280px", md: "300px" }}
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