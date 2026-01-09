"use client";

import { useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";

// --- 1. Configuration ---
const CARD_VARIANTS = {
  base: {
    id: "base",
    label: "Base Free",
    cardTypeLabel: "BASIC", // Text shown on top right of card
    bgColor: "#2296F3", // Blue
    stripeColor: "#FFC23C", // Yellow
    buttonColorScheme: "blue",
    textColor: "white",
    logoPath: "/logos/Paradise Pay_White.png"
  },
  plus: {
    id: "plus",
    label: "Paradise+",
    cardTypeLabel: "PARADISE+",
    bgColor: "#FFC23C", // Yellow
    stripeColor: "#000000", // Black
    buttonColorScheme: "yellow",
    textColor: "black",
    logoPath: "/logos/Paradise Pay_Logo_Blue.png" 
  },
  x: {
    id: "x",
    label: "Paradise X",
    cardTypeLabel: "PARADISE X",
    bgColor: "#000000", // Black
    stripeColor: "#FFC23C", // Yellow
    buttonColorScheme: "gray",
    textColor: "white",
    logoPath: "/logos/Paradise Pay_White.png"
  },
};

type VariantKey = keyof typeof CARD_VARIANTS;

// --- 2. The Card Visual Component ---
interface ParadiseCardProps {
  bgColor: string;
  stripeColor: string;
  cardTypeLabel: string;
  cardHolderName?: string;
  expiryDate?: string;
  qrData?: string;
  textColor?: string;
  logoPath?: string;
}

interface ParadisePaySwitcherProps {
  cardHolderName?: string;
  expiryDate?: string;
  qrData?: string;
}

const ParadiseCard = ({ 
  bgColor, 
  stripeColor, 
  cardTypeLabel, 
  cardHolderName = "EUGENE KWASI OSSEI", // Default placeholder
  expiryDate = "07/29", 
  qrData = "https://paradisepay.com/u/eugene", // Default QR data
  textColor = "white",
  logoPath = "/logos/Paradise Pay_White.png"
}: ParadiseCardProps) => {
  return (
    <AspectRatio ratio={1.586 / 1} width="100%" maxWidth="400px">
      <Box
        bg={bgColor}
        borderRadius="2xl"
        position="relative"
        overflow="hidden"
        boxShadow="xl"
        color={textColor}
        p={6}
      >
        {/* --- LAYER 1: The Graphics (Stripe) --- */}
    
        <Box
          position="absolute"
          bottom="0"
          right="0"
          width="70%"
          height="60%"
          zIndex={0}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M 30 150 C 40 50, 80 40, 200 40"
              stroke={stripeColor}
              strokeWidth="35"
              fill="none"
              strokeLinecap="butt"
            />
          </svg>
        </Box>

        {/* --- LAYER 2: Content --- */}

        {/* Top Left: Logo */}
        <HStack position="absolute" top={6} left={6} zIndex={1}>
          <Image
            src={logoPath}
            alt="Paradise Pay"
            height={{ base: "30px", md: "40px" }}
            width="auto"
            objectFit="contain"
          />
        </HStack>

        {/* Top Right: Card Type Label */}
        <Box position="absolute" top={6} right={6} zIndex={1}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="wider"
            opacity={0.9}
            textTransform="uppercase"
          >
            {cardTypeLabel}
          </Text>
        </Box>

        {/* Middle Left: QR Code (Replacing EMV Chip) */}
        <Box
          position="absolute"
          top="50%" // Vertically centered
          left={6}
          transform="translateY(-50%)"
          bg="white"
          p="4px" // White padding around QR code
          borderRadius="md"
          zIndex={1}
          boxShadow="sm"
        >
          <Box
            width={{ base: "50px", md: "65px" }}
            height={{ base: "50px", md: "65px" }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrData}
              viewBox={`0 0 256 256`}
            />
          </Box>
        </Box>

        {/* Bottom Left: Cardholder Name */}
        <Box position="absolute" bottom={6} left={6} zIndex={1}>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="bold"
            letterSpacing="0.05em"
            textTransform="uppercase"
            textShadow="0px 1px 2px rgba(0,0,0,0.1)"
          >
            {cardHolderName}
          </Text>
        </Box>

        {/* Bottom Right: Expiry Date */}
        <Box position="absolute" bottom={6} right={6} zIndex={1}>
          <HStack spaceX={1}>
            <Text fontSize="8px" fontWeight="normal" lineHeight={1}>
              VALID
              <br />
              THRU
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              fontFamily="monospace"
              textShadow="0px 1px 2px rgba(0,0,0,0.1)"
            >
              {expiryDate}
            </Text>
          </HStack>
        </Box>
      </Box>
    </AspectRatio>
  );
};

// --- 3. The Main Switcher Container ---
export default function ParadisePaySwitcher({
  cardHolderName,
  expiryDate,
  qrData
}: ParadisePaySwitcherProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantKey>("base");
  
  const currentData = CARD_VARIANTS[selectedVariant];
  const bg = "#f7fafc"; 

  return (
    <Flex minH="60vh" align="center" justify="center" bg={bg} p={4}>
      <VStack spaceX={8} width="100%" maxW="md">
        
        <ParadiseCard
          bgColor={currentData.bgColor}
          stripeColor={currentData.stripeColor}
          cardTypeLabel={currentData.cardTypeLabel}
          textColor={currentData.textColor}
          cardHolderName={cardHolderName || "USER"} 
          expiryDate={expiryDate || "07/29"}
          qrData={qrData || "https://paradisepay.com/u/username"}
          logoPath={currentData.logoPath}
        />

        {/* Controls */}
        <VStack spaceX={3}>
            <Text fontWeight="bold" fontSize="lg">Select Account Type</Text>
            <HStack spaceX={4} wrap="wrap" justify="center">
            {(Object.keys(CARD_VARIANTS) as VariantKey[]).map((key) => {
                const variant = CARD_VARIANTS[key];
                const isActive = selectedVariant === key;

                return (
                <Button
                    key={key}
                    onClick={() => setSelectedVariant(key)}
                    colorScheme={variant.buttonColorScheme}
                    variant={isActive ? "solid" : "outline"}
                    size="md"
                    borderRadius="full"
                    px={6}
                    boxShadow={isActive ? "md" : "none"}
                    _hover={{ transform: 'translateY(-2px)' }}
                >
                    {variant.label}
                </Button>
                );
            })}
            </HStack>
        </VStack>
      </VStack>
    </Flex>
  );
}