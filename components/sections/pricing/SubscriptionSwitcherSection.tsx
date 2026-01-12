'use client';

import { Box, Flex, Text, Button, VStack, Badge, Heading } from '@chakra-ui/react';
import { PricingPlan, PlanVariant } from '@/public/data/PricingPlaceholders';

// --- 1. The Animated Toggle Component ---
interface ToggleProps {
  isAnnual: boolean;
  onToggle: () => void;
}

export const AnimatedToggle = ({ isAnnual, onToggle }: ToggleProps) => {
  return (
    <Flex
      align="center"
      justify="center"
      bg="#2B78FA"
      border="3px solid"
      borderColor="#FFC23C"
      rounded="full"
      p="4px"
      position="relative"
      cursor="pointer"
      onClick={onToggle}
      w={{ base: '300px', md: '350px' }}
      h="60px"
    >
      {/* The Sliding White Background Indicator */}
      <Box
        position="absolute"
        top="4px"
        bottom="4px"
        left={isAnnual ? '4px' : '50%'}
        w="calc(50% - 8px)" 
        bg="white"
        rounded="full"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
        zIndex={1}
      />

      {/* Annual Button Label */}
      <Flex
        zIndex={2}
        w="50%"
        align="center"
        justify="center"
        direction="column"
        color={isAnnual ? '#2B78FA' : 'white'}
        transition="color 0.3s"
      >
        <Text fontWeight="bold" fontSize="lg">Annual</Text>
        <Text fontSize="xs">Save 15%</Text>
      </Flex>

       {/* Monthly Button Label */}
       <Flex
        zIndex={2}
        w="50%"
        align="center"
        justify="center"
        color={!isAnnual ? '#2B78FA' : 'white'}
        transition="color 0.3s"
      >
         <Text fontWeight="bold" fontSize="lg">Monthly</Text>
      </Flex>
    </Flex>
  );
};


// --- 2. The Individual Pricing Card Component ---
interface CardProps {
  plan: PricingPlan;
  isAnnual: boolean;
}

export const PricingCard = ({ plan, isAnnual }: CardProps) => {
  const { title, subtitle, badge, annualPrice, monthlyPrice, buttonText, variant } = plan;
  
  // Determine current price and period suffix based on toggle state
  const price = isAnnual ? annualPrice : monthlyPrice;
  const period = isAnnual ? '/ Year' : '/ Month';

  // Define styles based on the variant prop
  const variantStyles: Record<PlanVariant, any> = {
    'outline-purple': {
      bg: 'transparent',
      border: '3px solid',
      borderColor: 'white',
      textColor: 'white',
      badgeColor: 'transparent',
      buttonBg: 'white',
      buttonTextColor: '#2B78FA',
      buttonHoverBg: 'gray.400'
    },
    'solid-yellow': {
      bg: '#FFC23C',
      border: 'none',
      textColor: 'black',
      badgeColor: 'blackAlpha.200',
      buttonBg: 'black',
      buttonTextColor: '#FFC23C',
      buttonHoverBg: 'gray.800'
    },
    'solid-black': {
      bg: 'black',
      border: 'none',
      textColor: '#A57C00',
      badgeColor: '#A57C00',
      buttonBg: '#A57C00',
      buttonTextColor: 'black',
      buttonHoverBg: 'yellow.500'
    },
  };

  const styles = variantStyles[variant];

  return (
    <Flex
      direction="column"
      p={8}
      rounded="3xl"
      bg={styles.bg}
      border={styles.border}
      borderColor={styles.borderColor}
      color={styles.textColor}
      position="relative"
      h="100%" // Ensure cards are same height in grid
      align="start"
    >
       {/* Header Section */}
      <VStack align="start" spaceX={1} mb={6} w="100%">
        <Flex align="center" width="100%" justify="space-between">
          <Heading size="lg" fontWeight="extrabold">{title}</Heading>
          {badge && (
            <Badge 
              bg={styles.badgeColor} 
              color={styles.textColor} 
              px={3} py={1} rounded="full" fontSize="xs" textTransform="none"
            >
              {badge}
            </Badge>
          )}
        </Flex>
        <Text fontSize="md" opacity={0.8} fontWeight="medium">{subtitle}</Text>
      </VStack>

      {/* Price Section */}
      <Flex align="baseline" mb={8}>
        <Text fontSize="2xl" fontWeight="900" mr={2}>
          {price}
        </Text>
        <Text fontSize="xl" fontWeight="bold">
          {period}
        </Text>
      </Flex>

      {/* Button Section - Pushed to bottom */}
      <Button
        mt="auto"
        w="100%"
        bg={styles.buttonBg}
        color={styles.buttonTextColor}
        rounded="full"
        size="lg"
        fontWeight="extrabold"
        _hover={{ bg: styles.buttonHoverBg }}
      >
        {buttonText}
      </Button>
    </Flex>
  );
};