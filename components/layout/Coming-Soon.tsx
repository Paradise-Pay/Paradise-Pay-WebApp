"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  chakra,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Link,
  Icon,
  Flex,
  Image,
  Stack
} from "@chakra-ui/react";
import { toast } from 'react-toastify';

// --- Configuration ---
const LAUNCH_DATE = new Date("March 1, 2026 00:00:00").getTime();

const API_BASE_URL = "https://paradise-pay-backend-production-e0db.up.railway.app/api/v1";
const API_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;

const BACKGROUND_IMAGES = [
  "assets/bg-images-coming-soon/bg-1.png",
  "assets/bg-images-coming-soon/bg-2.png",
  "assets/bg-images-coming-soon/bg-3.jpg",
  "assets/bg-images-coming-soon/bg-4.jpg",
  "assets/bg-images-coming-soon/bg-5.jpeg",
];

export default function ComingSoonPage() {
  // --- State ---
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. Background Rotator ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. Countdown Timer ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- 3. Subscription Handler ---
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/coming-soon/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok || data.success) {
        toast.success("Successfully subscribed! Check your email for a confirmation.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); 
        
        setEmail("");
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error: any) {
      toast.error("Network error. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });   
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      as="main"
      minH="100vh"
      w="full"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontFamily="'League Spartan', sans-serif"
      color="white"
      bg="slate.900" // Fallback if image fails
    >
      {/* --- Background Images --- */}
      <Box position="fixed" inset={0} w="full" h="full" zIndex={0}>
        {BACKGROUND_IMAGES.map((src, index) => (
          <Box
            key={src}
            position="absolute"
            inset={0}
            bgImage={`url('${src}')`}
            bgSize="cover"
            backgroundPosition="center bottom"
            transition="opacity 1000ms ease-in-out"
            opacity={index === currentBgIndex ? 1 : 0}
          />
        ))}
        {/* Dark Overlay */}
        <Box position="absolute" inset={0} bg="black/60" />
      </Box>

      {/* --- Logo --- */}
      <Box position="absolute" top={6} left={6} zIndex={50}>
        <Link href="#">
          <Image
            src="/logos/Paradise Pay_White.png"
            alt="Paradise Pay Logo"
            h={{ base: "40px", md: "48px" }}
            w="auto"
          />
        </Link>
      </Box>

      {/* --- Main Content --- */}
      <Container
        maxW="7xl"
        px={6}
        position="relative"
        zIndex={10}
        pt={{ base: 20, md: 28 }}
        pb={12}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <VStack gap={10} w="full" maxW="4xl" textAlign="center">
          {/* Header Section */}
          <Stack gap={4} align="center">
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              textTransform="capitalize"
              lineHeight="1.1"
            >
              Paradise Pay Is <br /> Launching Soon
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              color="gray.200"
              maxW="2xl"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              The biggest event management platform is launching soon. Enter
              your email to be notified when it's ready.
            </Text>
          </Stack>

          {/* Timer Section */}
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={4}
            w="full"
            maxW="3xl"
          >
            <TimerCard label="Days" value={timeLeft.days} color="yellow" />
            <TimerCard label="Hours" value={timeLeft.hours} color="blue" />
            <TimerCard label="Minutes" value={timeLeft.minutes} color="blue" />
            <TimerCard
              label="Seconds"
              value={timeLeft.seconds}
              color="yellow"
            />
          </Grid>

          {/* Subscription Section */}
          <VStack gap={6} w="full" align="center">
            <Heading
              as="h3"
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              Subscribe to get notified!
            </Heading>

            {/* Form Container */}
            <Box
              w="full"
              maxW="xl"
              bg="rgba(17, 24, 39, 0.6)" // semi-transparent dark bg
              backdropFilter="blur(16px)"
              borderRadius="lg"
              p={2}
              shadow="xl"
              border="1px solid rgba(255,255,255,0.1)"
            >
              <form onSubmit={handleSubscribe}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={2}
                  align="center"
                >
                  <Input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    bg="transparent"
                    border="none"
                    _focus={{ boxShadow: "none" }}
                    _placeholder={{ color: "gray.400" }}
                    color="white"
                    fontSize="16px"
                    textAlign={{ base: "center", sm: "left" }}
                    h="auto"
                    p={4}
                    w="full"
                  />
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Sending..."
                    bg="#FFC23C"
                    color="black"
                    px={8}
                    py={6}
                    w={{ base: "full", sm: "auto" }}
                    borderRadius="md"
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{ transform: "scale(1.05)" }}
                    _active={{ transform: "scale(0.95)" }}
                    transition="all 0.2s"
                    shadow="lg"
                  >
                    Submit
                  </Button>
                </Flex>
              </form>
            </Box>
          </VStack>

          {/* Social Icons */}
          <VStack gap={4} mt={4}>
            <Heading as="h6" fontSize="xl" fontWeight="bold" color="gray.200">
              Follow Us:
            </Heading>
            <HStack gap={{ base: 6, md: 8 }} justify="center" flexWrap="wrap">
              <SocialLink
                href="https://www.facebook.com/getparadisepay"
                label="Facebook"
                hoverColor="blue.600"
                path="M15.4024 21V14.0344H17.7347L18.0838 11.3265H15.4024V9.59765C15.4024 8.81364 15.62 8.27934 16.7443 8.27934L18.1783 8.27867V5.85676C17.9302 5.82382 17.0791 5.75006 16.0888 5.75006C14.0213 5.75006 12.606 7.01198 12.606 9.32952V11.3265H10.2677V14.0344H12.606V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15.4024Z"
              />
              <SocialLink
                href="https://www.instagram.com/getparadisepay/"
                label="Instagram"
                hoverColor="#E1306C"
                path="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"
              />
              <SocialLink
                href="https://www.x.com/getparadisepay/"
                label="X"
                hoverColor="#9CA3AF"
                path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
              <SocialLink
                href="https://www.tiktok.com/getparadisepay/"
                label="TikTok"
                hoverColor="#FE2C55"
                path="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
              />
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

// --- Helper Components ---

function TimerCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "yellow" | "blue";
}) {
  const bg = color === "yellow" ? "#FFC23C" : "#2296F3";
  const text = color === "yellow" ? "black" : "white";

  return (
    <VStack
      bg={bg}
      color={text}
      h={{ base: "112px", sm: "144px" }}
      justify="center"
      borderRadius="xl"
      boxShadow="lg"
      gap={1}
      w="full"
    >
      <Text fontSize={{ base: "3xl", sm: "5xl" }} fontWeight="bold" lineHeight="1">
        {value}
      </Text>
      <Text fontSize={{ base: "sm", sm: "base" }} fontWeight="medium">
        {label}
      </Text>
    </VStack>
  );
}

function SocialLink({
  href,
  label,
  hoverColor,
  path,
}: {
  href: string;
  label: string;
  hoverColor: string;
  path: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      color="white"
      _hover={{
        color: hoverColor,
        transform: "scale(1.1)",
      }}
      transition="all 0.2s ease"
    >
      <HStack gap={2}>
        <chakra.svg
          viewBox="0 0 24 24"
          boxSize="24px"
          fill="currentColor"
        >
          <path d={path} />
        </chakra.svg>

        <Text>{label}</Text>
      </HStack>
    </Link>
  );
}