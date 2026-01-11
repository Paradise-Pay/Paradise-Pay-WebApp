"use client";

import FeaturedEventBanner from "@/components/sections/discover-events/FeaturedEventBanner";
import DiscoverSection from "@/components/sections/DiscoverSection";
import DisountedTicketsSection from "@/components/sections/discover-events/DiscountedTicketsSection";
import PopularEventsSection from "@/components/sections/discover-events/PopularEventsSection";
import ConcertsSection from "@/components/sections/discover-events/ConcertsSection";
import NewMoviesSection from "@/components/sections/discover-events/NewMoviesSection";
import ArtsTheaterSection from "../sections/discover-events/ArtsTheaterSection";
import SportsSection from "@/components/sections/discover-events/SportsSection";
import { Box } from "@chakra-ui/react";

export default function DiscoverEventsPage() {
  return (
      <Box w="full" bg="white">
        <FeaturedEventBanner />
        <DiscoverSection />
        <DisountedTicketsSection />
        <PopularEventsSection />
        <ConcertsSection />
        <NewMoviesSection />
        <ArtsTheaterSection />
        <SportsSection />
      </Box>
  );
}