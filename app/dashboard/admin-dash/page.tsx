'use client';

import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text, 
  Stat, 
  Flex, 
  Icon, 
  Button, 
  HStack,
  Card
} from '@chakra-ui/react';
import { 
  BsPlusCircle, 
  BsArrowCounterclockwise, 
  BsFileEarmarkBarGraph, 
  BsShieldCheck,
  BsArrowUpShort,
  BsArrowDownShort
} from 'react-icons/bs';
import { dashboardStats } from '@/public/data/AdminDashData';

// --- 1. Reusable Stat Card Component ---
const StatCard = ({ stat }: { stat: typeof dashboardStats[0] }) => {
  return (
    <Card.Root variant="elevated" size="sm" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
      <Card.Body>
        <Stat.Root>
          <Flex justify="space-between" align="start">
            <Box>
              <Stat.Label color="gray.500" fontSize="sm">{stat.label}</Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold" my={1} px={2}>
                {stat.value}
              </Stat.ValueText>
            </Box>
            
            {/* Icon Circle */}
            <Box 
              p={2} 
              borderRadius="md" 
              bg={`${stat.color}.100`} 
              color={`${stat.color}.600`}
            >
              <Icon as={stat.icon} boxSize={5} />
            </Box>
          </Flex>

          {/* Footer: Trend & Context */}
          <HStack gap={1} mt={2}>
            {stat.trend !== 'neutral' && (
              <Icon 
                as={stat.trend === 'up' ? BsArrowUpShort : BsArrowDownShort} 
                color={stat.trend === 'up' ? 'green.500' : 'red.500'} 
                boxSize={5}
              />
            )}
            <Stat.HelpText 
              fontSize="xs" 
              color={stat.trend === 'up' ? 'green.600' : stat.trend === 'down' ? 'red.600' : 'gray.500'}
              fontWeight="medium"
            >
              {stat.helpText}
            </Stat.HelpText>
          </HStack>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default function AdminDashboard() {
  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      <Box mb={8}>
        <Heading size="2xl" mb={2}>Admin Dashboard</Heading>
        <Text color="gray.600">Overview of platform performance and live activities.</Text>
      </Box>

      {/* --- 2. Stats Grid (Horizontally Stacked & Overflowing) --- */}
      {/* columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} 
         This handles the "overflow to next line" automatically.
         On huge screens (xl), it fits 4. On laptops (lg), it fits 3, pushing the rest down.
      */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} mb={10}>
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </SimpleGrid>

      {/* --- 3. Quick Actions Section --- */}
      <Box>
        <Heading size="md" mb={4} color="gray.700">Quick Actions</Heading>
        <Flex gap={4} wrap="wrap">
          <Button size="lg" colorPalette="blue" variant="solid">
            <Icon as={BsPlusCircle} mr={2} /> Create New Event
          </Button>

          <Button size="lg" colorPalette="gray" variant="surface">
            <Icon as={BsArrowCounterclockwise} mr={2} /> Issue Refund
          </Button>

          <Button size="lg" colorPalette="purple" variant="surface">
            <Icon as={BsFileEarmarkBarGraph} mr={2} /> Generate Report
          </Button>

          <Button size="lg" colorPalette="green" variant="surface">
             <Icon as={BsShieldCheck} mr={2} /> Approve Organizer
          </Button>
        </Flex>
      </Box>

    </Box>
  );
}