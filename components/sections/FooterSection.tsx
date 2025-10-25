"use client";

import React from "react";
import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";

export default function FooterSection() {
  return (
    <Box bg="white" py={4}>
      <Container maxW="7xl">
        <VStack gap={4}>
          {/* Top Section - Logo and Quick Links */}
          <Flex justify="space-between" align="center" w="full" wrap="wrap" gap={8}>
            {/* Logo */}
            <Flex align="center">
              <Image
                src="/logos/Paradise Pay_Logo_Blue.png"
                alt="Paradise Pay"
                height="40px"
                width="auto"
                objectFit="contain"
              />
            </Flex>
            
            {/* Quick Links */}
            <HStack gap={6} display={{ base: "none", md: "flex" }}>
              <Text fontSize="16px" fontWeight="bold" color="#333333">
                Quick links:
              </Text>
              <HStack gap={6}>
                <Text cursor="pointer" fontSize="16px" color="#333333" _hover={{ textDecoration: "underline" }}>
                  Discover Events
                </Text>
                <Text cursor="pointer" fontSize="16px" color="#333333" _hover={{ textDecoration: "underline" }}>
                  Bundles
                </Text>
                <Text cursor="pointer" fontSize="16px" color="#333333" _hover={{ textDecoration: "underline" }}>
                  Pricing
                </Text>
                <Text cursor="pointer" fontSize="16px" color="#333333" _hover={{ textDecoration: "underline" }}>
                  Organizers
                </Text>
                <Text cursor="pointer" fontSize="16px" color="#333333" _hover={{ textDecoration: "underline" }}>
                  Contact
                </Text>
              </HStack>
            </HStack>
          </Flex>
          
          {/* Bottom Section - Copyright */}
          <Text fontSize="16px" color="#333333" textAlign="center">
            All Rights Reseved, 2025 | Wildcard Technologies LLC
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
