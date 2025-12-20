"use client";

import { Box } from "@chakra-ui/react";
import FeaturedBundleSection from "@/components/sections/bundles/FeaturedBundleSection";
import BundlesSwitcher from "@/components/sections/bundles/BundlesSwitcher";

export default function BundlesPage() {
    return (
        <Box w="full" bg="white">
            <FeaturedBundleSection />
            <BundlesSwitcher />
        </Box>
    );
}