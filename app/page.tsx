"use client";

import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Input,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Search, ArrowRight, Check, MapPin, Calendar, Clock, CreditCard, FastForward, Percent, ScanLine, Ticket } from "lucide-react";
import Header from "@/components/layouts/header";
import HeroSection from "@/components/layouts/hero";
export default function Home() {

  const steps = [
    {
      title: "Sign Up",
      desc: "Get a Paradise Pay Account with your email.",
      bgColor: "#ffffff",
      textColor: "#1A1A1A",
      icon: <ArrowRight size={20} />,
    },
    {
      title: "Add Tickets",
      desc: "Pay securely for your tickets and add them to your wallet.",
      bgColor: "#278BF7",
      textColor: "#ffffff",
      icon: <ArrowRight size={20} />,
    },
    {
      title: "Scan & Enter",
      desc: "Show your card, get scanned, and enter.",
      bgColor: "#ffffff",
      textColor: "#1A1A1A",
      icon: <ArrowRight size={20} />,
    },
  ];

  const pricingPlans = [
    {
      title: "Free Basic Passport",
      price: "GH₵0.00 / Year",
      features: [
        "Access to all events",
        "Standard entry",
        "Join the community",
        "Basic support",
      ],
      bgColor: "#fff",
      textColor: "#1A1A1A",
      btnText: "Start Free",
      btnBg: "#FDCB35",
      btnColor: "#1A1A1A",
    },
    {
      title: "Paradise + For The Fans",
      price: "GH₵100 / Year",
      features: [
        "Early ticket access",
        "Skip-the-line entry",
        "Priority seating offers",
        "Double Paradise Miles",
      ],
      bgColor: "#1A1A1A",
      textColor: "#fff",
      btnText: "Get Started",
      btnBg: "#FDCB35",
      btnColor: "#1A1A1A",
      highlighted: true,
    },
    {
      title: "Paradise X For The VIPs",
      price: "GH₵300 / Year",
      features: [
        "VIP early access & lounges",
        "Meet and greet passes",
        "Exclusive events",
        "Premium support",
      ],
      bgColor: "#fff",
      textColor: "#1A1A1A",
      btnText: "Go Premium",
      btnBg: "#FDCB35",
      btnColor: "#1A1A1A",
    },
  ];

  const benefits = [
    {
      icon: <CreditCard size={40} />,
      title: "One Card For All Events",
      desc: "Carry your card digitally forever.",
    },
    {
      icon: <Ticket size={40} />,
      title: "Get Rewarded",
      desc: "Earn Paradise Miles for future events.",
    },
    {
      icon: <Ticket size={40} />,
      title: "Ticket Bundles & Discounts",
      desc: "Unlock saving when you buy more",
    },
    {
      icon: <Percent size={40} />,
      title: "Curated Bundles",
      desc: "Concert packs, sports passes, weekend vibes.",
    },
    {
      icon: <FastForward size={40} />,
      title: "Skip The Line",
      desc: "Fast-line scanning at participating venues.",
    },
  ];

  const featuredEvents = [
    {
      id: 1,
      name: "AFRO NATION",
      date: "17th & 18th AUGUST",
      venue: "Virtual Accra, Ghana",
      time: "20:00 GMT",
      image: "/assets/images/event-1.jpg",
      soldOut: true,
    },
    {
      id: 2,
      name: "Event Name",
      date: "Dec 25, 2023",
      venue: "Accra Stadium",
      time: "7:00 PM",
      image: "/assets/images/event-2.jpg",
      soldOut: false,
    },
    {
      id: 3,
      name: "Event Name",
      date: "Dec 25, 2023",
      venue: "Accra Stadium",
      time: "7:00 PM",
      image: "/assets/images/event-1.jpg",
      soldOut: false,
    },
    {
      id: 4,
      name: "Event Name",
      date: "Dec 25, 2023",
      venue: "Accra Stadium",
      time: "7:00 PM",
      image: "/assets/images/event-2.jpg",
      soldOut: false,
    },
  ];

  const discoverEvents = [
    {
      id: 1,
      name: "Summer Music Fest",
      date: "Oct 20, 2025",
      time: "6:00 PM",
      venue: "Accra Stadium",
      image: "/assets/images/event-1.jpg",
    },
    {
      id: 2,
      name: "Tech Conference",
      date: "Nov 5, 2025",
      time: "9:00 AM",
      venue: "Kempinski Hotel",
      image: "/assets/images/event-2.jpg",
    },
    {
      id: 3,
      name: "Food & Drink Festival",
      date: "Dec 12, 2025",
      time: "12:00 PM",
      venue: "Osu Oxford Street",
      image: "/assets/images/event-1.jpg",
    },
    {
      id: 4,
      name: "New Year Party",
      date: "Dec 31, 2025",
      time: "10:00 PM",
      venue: "Labadi Beach",
      image: "/assets/images/event-2.jpg",
    },
  ];

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

  return (
    <Box w="full" bg="white">
      <Header />

      <HeroSection />

      {/* 3 Steps Section */}
      <Box bg="#FDCB35" py={24}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <VStack gap={4} align="start">
                {steps.map((step, idx) => (
                  <Box
                    key={idx}
                    bg={step.bgColor}
                    color={step.textColor}
                    p={6}
                    borderRadius="16px"
                    shadow="md"
                    w="full"
                  >
                    <HStack gap={4}>
                      <Box>
                        <Heading size="lg" mb={2} fontWeight={600}>{step.title}</Heading>
                        <Text fontSize="16px">{step.desc}</Text>
                      </Box>
                      <ArrowRight size={24} />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <VStack align="start" gap={8}>
                <Heading
                  as="h2"
                  className="heading-section"
                  color="#1A1A1A"
                  fontWeight={700}
                >
                  You Are
                  <br />
                  3-Steps
                  <br />
                  Away.
                </Heading>
                <Text className="text-body" color="#1A1A1A" maxW="md">
                  Enjoy immersive and innovative digital ticketing experience.
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Featured Events Section */}
      <Box bg="#278BF7" py={24}>
        <Container maxW="7xl">
          <VStack gap={16}>
            <Heading as="h2" className="heading-section" color="white" fontWeight={700} textAlign="left" w="full">
              Featured Events.
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
              {featuredEvents.map((event) => (
                <GridItem key={event.id}>
                  <Box
                    bg="#1A1A1A"
                    borderRadius="16px"
                    overflow="hidden"
                    shadow="xl"
                    h="480px"
                    position="relative"
                  >
                    <Box h="60%" bgImage={`url('${event.image}')`} bgSize="cover" position="relative">
                      {event.soldOut && (
                        <Badge
                          position="absolute"
                          top={4}
                          right={4}
                          bg="#FDCB35"
                          color="#1A1A1A"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="12px"
                          fontWeight={600}
                        >
                          SOLD OUT
                        </Badge>
                      )}
                    </Box>
                    <Box h="40%" bg="#1A1A1A" p={6}>
                      <VStack align="start" gap={4} h="full" justify="space-between">
                        <Box>
                          <Text color="#FDCB35" fontSize="14px" fontWeight={600} mb={2}>{event.date}</Text>
                          <Heading size="md" color="white" mb={2} fontWeight={600}>{event.name}</Heading>
                          <HStack gap={2} mb={1}>
                            <MapPin size={14} color="#9CA3AF" />
                            <Text color="#9CA3AF" fontSize="14px">{event.venue}</Text>
                          </HStack>
                          <HStack gap={2} mb={1}>
                            <Calendar size={14} color="#9CA3AF" />
                            <Text color="#9CA3AF" fontSize="14px">{event.date}</Text>
                          </HStack>
                          <HStack gap={2}>
                            <Clock size={14} color="#9CA3AF" />
                            <Text color="#9CA3AF" fontSize="14px">{event.time}</Text>
                          </HStack>
                        </Box>
                        <Button
                          w="full"
                          bg="#FDCB35"
                          color="#1A1A1A"
                          borderRadius="full"
                          fontWeight={600}
                          fontSize="16px"
                          py={3}
                          _hover={{ bg: "#E6B834" }}
                        >
                          Add To Card
                        </Button>
                      </VStack>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Future of Ticketing Section */}
      <Box bg="#FDCB35" py={24}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem>
              <VStack align="start" gap={8}>
                <Heading
                  as="h2"
                  className="heading-section"
                  color="#1A1A1A"
                  fontWeight={700}
                >
                  The Future
                  <br />
                  Of Event
                  <br />
                  Ticketing.
                </Heading>
                <Text className="text-body" color="#1A1A1A" maxW="540px">
                  Paradise Pay is more than a ticketing app — it's your event passport. From concerts to sports to festivals, Paradise Pay keeps all your tickets in one place. No lost tickets, no printouts, no stress. Just scan and enter.
                </Text>
                <Button
                  bg="#278BF7"
                  color="white"
                  size="lg"
                  px={10}
                  py={3}
                  borderRadius="full"
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{ bg: "#1F72D0" }}
                >
                  Get Your Card
                </Button>
              </VStack>
            </GridItem>
            
            <GridItem>
              <Flex justify="center">
                <Image src="/phone.png" alt="Mobile App" w="350px" h="600px" />
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box bg="#278BF7" py={24}>
        <Container maxW="7xl">
          <VStack gap={16}>
            <Heading as="h2" className="heading-section" color="white" fontWeight={700} textAlign="center">
              Everything You Need.
              <br />
              One Digital Card.
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8} w="full">
              {benefits.map((benefit, i) => (
                <GridItem key={i}>
                  <Box
                    bg="white"
                    color="#1A1A1A"
                    p={8}
                    borderRadius="16px"
                    shadow="lg"
                    h="180px"
                    display="flex"
                    alignItems="center"
                  >
                    <HStack gap={6} h="full">
                      <Box color="#278BF7">{benefit.icon}</Box>
                      <VStack align="start" gap={2}>
                        <Heading size="lg" color="#1A1A1A" fontWeight={600}>{benefit.title}</Heading>
                        <Text color="#1A1A1A" fontSize="16px">{benefit.desc}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                </GridItem>
              ))}
              
              <GridItem>
                <Box
                  bg="white"
                  color="#1A1A1A"
                  p={8}
                  borderRadius="16px"
                  shadow="lg"
                  h="180px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    bg="#FDCB35"
                    color="#1A1A1A"
                    size="lg"
                    px={12}
                    py={4}
                    borderRadius="full"
                    fontSize="18px"
                    fontWeight={600}
                    _hover={{ bg: "#E6B834" }}
                  >
                    Get Started
                  </Button>
                </Box>
              </GridItem>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box bg="#FDCB35" py={24}>
        <Container maxW="7xl">
          <VStack gap={16}>
            <Heading as="h2" className="heading-section" color="#1A1A1A" fontWeight={700} textAlign="center">
              Choose Your Passport.
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} w="full">
              {pricingPlans.map((plan, idx) => (
                <GridItem key={idx}>
                  <Box
                    bg={plan.bgColor}
                    color={plan.textColor}
                    p={8}
                    borderRadius="16px"
                    border="3px solid"
                    borderColor="#1A1A1A"
                    minH="600px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    position="relative"
                  >
                    {plan.highlighted && (
                      <Badge
                        position="absolute"
                        top={-3}
                        left="50%"
                        transform="translateX(-50%)"
                        bg="#1A1A1A"
                        color="#FDCB35"
                        px={4}
                        py={1}
                        borderRadius="full"
                        fontSize="12px"
                        fontWeight={600}
                      >
                        POPULAR
                      </Badge>
                    )}
                    
                    <VStack gap={6} align="start">
                      <Heading size="2xl" fontWeight={700}>{plan.title}</Heading>
                      
                      <Box flex="1">
                        {plan.features.map((feature, i) => (
                          <Box key={i} display="flex" alignItems="center" mb={3}>
                            <Check size={16} color={plan.textColor === "#fff" ? "#FDCB35" : "#1A1A1A"} />
                            <Text fontSize="16px" ml={2}>{feature}</Text>
                          </Box>
                        ))}
                      </Box>
                      
                      <Text fontSize="24px" fontWeight={700}>{plan.price}</Text>
                    </VStack>
                    
                    <Button
                      w="full"
                      bg={plan.btnBg}
                      color={plan.btnColor}
                      size="lg"
                      py={3}
                      borderRadius="full"
                      fontSize="18px"
                      fontWeight={600}
                      _hover={{ opacity: 0.9 }}
                    >
                      {plan.btnText}
                    </Button>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Discover Section */}
      <Box
        minH="100vh"
        bgImage="url('/assets/images/index-image.jpg')"
        bgSize="cover"
        position="relative"
        display="flex"
        alignItems="center"
        py={24}
      >
        {/* Dark Overlay */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="black" opacity={0.8} />
        
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack gap={16}>
            <Heading as="h2" className="heading-section" color="white" fontWeight={700} textAlign="left" w="full">
              Discover What's Next.
            </Heading>
            
            {/* Search Bar */}
            <Box w="full" maxW="5xl" position="relative">
              <Input
                bg="white"
                placeholder="Search for events, artists, venues, and more..."
                borderRadius="16px"
                fontSize="18px"
                py={6}
                pl={12}
                border="none"
                _focus={{ boxShadow: "0 0 0 3px rgba(253, 203, 53, 0.3)" }}
              />
              <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
                <Search size={20} color="#9CA3AF" />
              </Box>
            </Box>
            
            {/* Filter Buttons */}
            <HStack gap={4} wrap="wrap" justify="center">
              {["Concerts", "Music", "Sports", "Festivals", "Conferences", "Arts"].map((tab) => (
                <Button
                  key={tab}
                  bg="transparent"
                  color="white"
                  border="2px solid white"
                  borderRadius="full"
                  px={8}
                  py={2}
                  fontSize="16px"
                  fontWeight={500}
                  _hover={{ bg: "white", color: "#1A1A1A" }}
                >
                  {tab}
                </Button>
              ))}
            </HStack>
            
            {/* Event Cards */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} w="full">
              {discoverEvents.map((event) => (
                <GridItem key={event.id}>
                  <Box
                    bg="#1A1A1A"
                    borderRadius="16px"
                    overflow="hidden"
                    shadow="xl"
                    h="480px"
                    position="relative"
                  >
                    <Box h="60%" bgImage={`url('${event.image}')`} bgSize="cover" />
                    <Box h="40%" bg="#1A1A1A" p={6}>
                      <VStack align="start" gap={4} h="full" justify="space-between">
                        <Box>
                          <Heading size="md" color="white" mb={2} fontWeight={600}>{event.name}</Heading>
                          <Text color="#9CA3AF" fontSize="14px">{event.date} • {event.time}</Text>
                          <Text color="#9CA3AF" fontSize="14px">{event.venue}</Text>
                        </Box>
                        <Button
                          w="full"
                          bg="#FDCB35"
                          color="#1A1A1A"
                          borderRadius="full"
                          fontWeight={600}
                          fontSize="16px"
                          py={3}
                          _hover={{ bg: "#E6B834" }}
                        >
                          Add To Card
                        </Button>
                      </VStack>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Organizer Section */}
      <Box bg="#278BF7" py={24}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem>
              <VStack align="start" gap={8}>
                <Heading
                  as="h2"
                  className="heading-section"
                  color="white"
                  fontWeight={700}
                >
                  For Organizers,
                  <br />
                  by Organizers.
                </Heading>
                <Text className="text-body" color="white" maxW="md">
                  List, sell, and manage your events in one place. Paradise Pay helps you reach audiences, sell more tickets, and scan guests seamlessly at the gate.
                </Text>
                
                <Box>
                  {[
                    "Create events in minutes",
                    "Real-time ticket sales dashboard",
                    "Data & insights on your attendees",
                    "No setup fees — pay only per sale",
                  ].map((item, i) => (
                    <Box key={i} display="flex" alignItems="center" mb={4} color="white" fontSize="18px">
                      <Check size={20} color="#FDCB35" />
                      <Text ml={3}>{item}</Text>
                    </Box>
                  ))}
                </Box>
                
                <Button
                  bg="#FDCB35"
                  color="#1A1A1A"
                  size="lg"
                  px={8}
                  py={3}
                  borderRadius="full"
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{ bg: "#E6B834" }}
                >
                  Start Selling Today
                </Button>
              </VStack>
            </GridItem>
            
            <GridItem>
              <Flex justify="center">
                <Image src="/stage.jpg" alt="Event Stage" w="600px" h="400px" borderRadius="16px" />
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box bg="#FDCB35" py={24}>
        <Container maxW="7xl">
          <VStack gap={16}>
            <Heading as="h2" className="heading-section" color="#1A1A1A" fontWeight={700} textAlign="center">
              FAQs.
            </Heading>
            
            <Box w="full" maxW="4xl">
              {faqItems.map((item, i) => (
                <Box 
                  key={i} 
                  bg={i % 2 === 0 ? "#FDCB35" : "#1A1A1A"} 
                  borderRadius="16px" 
                  mb={4} 
                  p={6}
                >
                  <Text fontWeight={600} fontSize="18px" color={i % 2 === 0 ? "#1A1A1A" : "white"} mb={2}>
                    {item.question}
                  </Text>
                  <Text color={i % 2 === 0 ? "#1A1A1A" : "white"} fontSize="16px">
                    {item.answer}
                  </Text>
                </Box>
              ))}
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="#1A1A1A" color="#9CA3AF" py={12}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
            <Flex align="center">
              <Image
                src="/logos/Paradise Pay_White.png"
                alt="Paradise Pay"
                height="32px"
                width="120px"
                objectFit="contain"
              />
            </Flex>
            
            <HStack gap={8} display={{ base: "none", md: "flex" }}>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Home</Text>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Discover Events</Text>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Pricing</Text>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Help</Text>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Blog</Text>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Organizers</Text>
              <Text cursor="pointer" _hover={{ color: "white" }} fontSize="16px">Contact</Text>
            </HStack>
            
            <Text fontSize="14px" color="#6B7280">© All rights reserved 2023 | Made with love by AmaliTech.</Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}