"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "@/components/layouts/header";
import HeroSection from "@/components/layouts/hero";
import StepsSection from "@/components/sections/StepsSection";
import FeaturedEventsSection from "@/components/sections/FeaturedEventsSection";
import FutureTicketingSection from "@/components/sections/FutureTicketingSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import PricingSection from "@/components/sections/PricingSection";
import DiscoverSection from "@/components/sections/DiscoverSection";
import OrganizerSection from "@/components/sections/OrganizerSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterSection from "@/components/sections/FooterSection";

/**
 * Main landing page component
 * Composes all sections in order for the complete homepage experience
 */
export default function Home() {
  return (
    <Box w="full" bg="white">
      <Header />
      <HeroSection />
      <StepsSection />
      <FeaturedEventsSection />
      <FutureTicketingSection />
      <BenefitsSection />
      <PricingSection />
      <DiscoverSection />
      <OrganizerSection />
      <FAQSection />
      <FooterSection />
    </Box>
  );
}