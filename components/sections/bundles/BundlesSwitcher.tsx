'use client';

import { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Image, 
  List as ChakraList, 
  ListItem, 
  Heading,
  Container,
  VStack
} from '@chakra-ui/react';
import { categories, bundles, Category, BundleItem } from '@/public/data/BundlesPlaceholders'; 

// --- Helper: Bullet Point ---
const DotIcon = () => (
  <Box as="span" w="8px" h="8px" borderRadius="full" bg="white" display="inline-block" mr={4} mb="2px" />
);

// --- Component 1: The Card UI (Foreground) ---
const BundleCard = ({ bundle }: { bundle: BundleItem }) => (
  <Flex
    direction={{ base: 'column', md: 'row' }}
    bg="#2296F3"
    border="5px solid"
    borderColor="#FFC23C"
    borderRadius="3xl"
    overflow="hidden"
    w="100%"
    maxW="5xl"
    mx="auto"
    h={{ base: 'auto', md: '500px' }}
    boxShadow="0px 0px 30px rgba(255, 215, 0, 0.2)"
    transition="transform 0.3s"
    _hover={{ transform: 'scale(1.02)' }} 
  >
    {/* Left Side: Image */}
    <Box 
      w={{ base: '100%', md: '50%' }} 
      h={{ base: '300px', md: '100%' }}
      position="relative"
    >
      <Image 
        src={bundle.image} 
        alt={bundle.title}
        objectFit="cover"
        w="100%"
        h="100%"
      />
    </Box>

    {/* Right Side: Content */}
    <Box 
      w={{ base: '100%', md: '50%' }} 
      p={{ base: 6, md: 10 }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <VStack align="center" h="100%" spaceX={6}>
        <Heading 
          size="3xl" 
          textAlign={"center"}
          color="white" 
          fontWeight="extrabold"
          lineHeight="1.1"
        >
          {bundle.title}
        </Heading>

        {/* Using standard List component for proper spacing */}
        <ChakraList.Root w="100%">
          {bundle.features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center" fontSize="xl" fontWeight="bold">
              <DotIcon />
              {feature}
            </ListItem>
          ))}
        </ChakraList.Root>

        {/* Price and Button Row */}
        <Flex 
          mt="auto" 
          w="100%" 
          align="center" 
          justify="space-between"
          pt={4}
        >
          <Text fontSize="4xl" fontWeight="900" letterSpacing="tight">
            ¢{bundle.price}
          </Text>

          <Button
            variant="outline"
            borderColor="yellow.400"
            color="white"
            rounded="full"
            px={8}
            py={7}
            borderWidth="3px"
            fontSize="lg"
            fontWeight="bold"
            bg="transparent"
            _hover={{
              bg: 'yellow.400',
              color: 'black'
            }}
          >
            Add to Card
          </Button>
        </Flex>
      </VStack>
    </Box>
  </Flex>
);

// --- Component 2: The Section Wrapper (Background) ---
// This handles the unique background for each bundle
const BundleSection = ({ bundle }: { bundle: BundleItem }) => {
  // Fallback if no bgImage is provided in data
  const bgImage = bundle.bgImage || '/assets/images/default_bg.jpg'; 

  return (
    <Box 
      position="relative"
      w="100%"
      py={{ base: 12, md: 24 }} // Vertical padding for the section
      backgroundImage={`url('${bgImage}')`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {/* The Dark Overlay specific to this section */}
      <Box 
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="black"
        opacity="0.75" // Adjust darkness here
        zIndex="0"
      />

      {/* Container for the Card */}
      <Container maxW="7xl" position="relative" zIndex="1" px={4}>
        <BundleCard bundle={bundle} />
      </Container>
    </Box>
  );
};

// --- Main Component ---
export default function BundleSwitcher() {
  const [activeTab, setActiveTab] = useState<Category>('Arts, Theater & Comedy');
  
  const currentBundles = bundles[activeTab];

  return (
    <Box minH="100vh" bg="black" color="white">
      
      {/* 1. Sticky Navigation Header */}
      <Box 
        py={8} 
        bg="black" 
        top="0" 
        zIndex="100" 
        borderBottom="1px solid rgba(255,255,255,0.1)"
      >
        <Container maxW="7xl">
           <Flex 
            justify="center" 
            wrap="wrap" 
            gap={4}
          >
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <Button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  rounded="full"
                  px={8}
                  py={6}
                  bg={isActive ? 'yellow.400' : 'transparent'}
                  color={isActive ? 'black' : 'white'}
                  border="2px solid"
                  borderColor="yellow.400"
                  _hover={{
                    bg: 'yellow.400',
                    color: 'black',
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {cat}
                </Button>
              );
            })}
          </Flex>
        </Container>
      </Box>

      {/* 2. List of Bundle Sections */}
      {/* We map through the bundles and render a full-width Section for each */}
      <Flex direction="column" w="100%">
        {currentBundles.map((bundle) => (
          <BundleSection key={bundle.id} bundle={bundle} />
        ))}

        {/* Fallback */}
        {currentBundles.length === 0 && (
          <Box py={32} textAlign="center" bg="gray.900">
             <Heading color="whiteAlpha.600" size="md">Coming Soon</Heading>
             <Text color="gray.500">No bundles available for this category yet.</Text>
          </Box>
        )}
      </Flex>

    </Box>
  );
}