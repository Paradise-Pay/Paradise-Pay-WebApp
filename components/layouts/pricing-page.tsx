'use client';

import { useState } from 'react';
import { Box, Container, VStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { pricingPlans } from '@/public/data/PricingPlaceholders';
import { AnimatedToggle, PricingCard } from '../sections/pricing/SubscriptionSwitcherSection';
import FeatureTableSection from '../sections/pricing/FeatureTableSection';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <Box w="full" bg="white">
        <Box 
      bg="#2B78FA"
      minH="100vh" 
      py={{ base: 12, md: 20 }}
      px={4}
    >
      <Container maxW="6xl">
        <VStack >
          
          {/* Header */}
          <VStack  textAlign="center" color="white">
            <Heading as="h2" size="3xl" fontWeight="black">
              Choose A Plan That Fits Your Vibe.
            </Heading>
            <Text fontSize="lg" fontWeight="medium">
              Switch or cancel at any time
            </Text>
          </VStack>

          {/* The Sliding Toggle */}
          <Box py={6}>
             <AnimatedToggle isAnnual={isAnnual} onToggle={handleToggle} />
          </Box>

          {/* Cards Grid */}
          <SimpleGrid 
            columns={{ base: 1, md: 3 }}
            spaceX={6} 
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
    <FeatureTableSection />
    </Box>
  );
}