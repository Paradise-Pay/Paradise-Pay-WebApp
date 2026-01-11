'use client';

import { useState } from 'react';
import { Box, Container, VStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { pricingPlans } from '@/public/data/PricingPlaceholders';
import { AnimatedToggle, PricingCard } from '@/components/sections/pricing/SubscriptionSwitcherSection';
import FeatureTableSection from '@/components/sections/pricing/FeatureTableSection';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <Box w="full" bg="white">
      {/* Blue Hero Section with Pricing Cards */}
      <Box 
        bg="#2B78FA"
        minH="90vh" 
        py={{ base: 12, md: 20 }}
        px={4}
      >
        <Container maxW="6xl">
          <VStack gap={10}>
            
            {/* Header */}
            <VStack textAlign="center" color="white" gap={3}>
              <Heading as="h2" size="3xl" fontWeight="black" letterSpacing="tight">
                Choose A Plan That Fits Your Vibe.
              </Heading>
              <Text fontSize="lg" fontWeight="medium" opacity={0.9}>
                Switch or cancel at any time
              </Text>
            </VStack>

            {/* The Sliding Toggle */}
            <Box py={2}>
               <AnimatedToggle isAnnual={isAnnual} onToggle={handleToggle} />
            </Box>

            {/* Cards Grid */}
            <SimpleGrid 
              columns={{ base: 1, md: 3 }}
              gap={8} 
              w="100%" 
              alignItems="stretch" 
            >
              {pricingPlans.map((plan) => (
                <PricingCard 
                  key={plan.id} 
                  plan={plan} 
                  isAnnual={isAnnual}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Feature Table Section */}
      <FeatureTableSection />
    </Box>
  );
}