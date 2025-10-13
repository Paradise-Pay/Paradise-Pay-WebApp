"use client";

import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/index-image.jpg')" }}
        ></div>

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-80"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-28 w-full text-white">
          <div className="flex-1 space-y-8">
            <h1 className="font-bold leading-tight text-5xl md:text-7xl lg:text-8xl">
              All Your <br />
              Events. One <br />
              Digital Card
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
              Your Event Passport — scan, enter, <br />
              and enjoy unforgettable experiences.
            </p>

            <div className="flex flex-col mt-24">
              <Button
                variant="outlined"
                sx={{
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  fontWeight: 700,
                  px: 8,
                  py: 3,
                  borderColor: "#fdcb35",
                  color: "#ffffff",
                  borderRadius: "40px",
                  "&:hover": {
                    backgroundColor: "#fdcb35",
                    color: "#000000",
                    borderColor: "#fdcb35",
                  },
                  width: "fit-content",
                }}
              >
                Get Your Card
              </Button>
            </div>
          </div>

          <div className="flex-1 flex justify-center mt-12 md:mt-0">
            <Image
              src="/card.png"
              alt="Event Card"
              width={450}
              height={350}
              className="drop-shadow-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
