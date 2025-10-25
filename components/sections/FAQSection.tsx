"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

const faqItems = [
  {
    question: "What happens if I lose my phone?",
    answer: "Just log in from another device, your card stays safe.",
  },
  {
    question: "Can I share tickets with friends?",
    answer: "Yes! Easily transfer tickets through the app.",
  },
  {
    question: "Is my card free?",
    answer: "Yes, everyone starts with a free Paradise Passport.",
  },
];

export default function FAQSection() {
  return (
    <Box bg="#FFC138" py={24}>
      <Container maxW="7xl">
        <VStack gap={16}>
          <Heading as="h2" fontSize="48px" color="#333333" fontWeight="bold" textAlign="center">
            FAQs
          </Heading>
          
          <VStack gap={6} w="full" maxW="4xl">
            {faqItems.map((item, i) => (
              <VStack key={i} gap={0} w="full">
                {/* Question Box */}
                <Box 
                  bg="#FFC138" 
                  border="2px solid #333333"
                  borderRadius="8px" 
                  p="15px 25px"
                  w="full"
                >
                  <Text fontWeight="normal" fontSize="16px" color="#333333">
                    {item.question}
                  </Text>
                </Box>
                
                {/* Answer Box */}
                <Box 
                  bg="#333333" 
                  borderRadius="8px" 
                  p="15px 25px"
                  w="full"
                >
                  <Text fontWeight="normal" fontSize="16px" color="#FFFFFF">
                    {item.answer}
                  </Text>
                </Box>
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
