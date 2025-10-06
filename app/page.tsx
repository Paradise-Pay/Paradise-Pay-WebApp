"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  FastForward,
  Percent,
  ScanLine,
  Ticket,
  Check,
} from "lucide-react";

import Header from "@/components/layouts/header";
import HeroSection from "@/components/layouts/hero";
import DiscoverSection from "@/components/layouts/discover-events";

export default function Home() {
  const steps = [
    {
      title: "Sign Up",
      desc: "Get your Paradise Pay digital card instantly.",
      bgColor: "#ffffff",
      textColor: "#333",
    },
    {
      title: "Add Tickets",
      desc: "Show your card, get scanned, and walk in.",
      bgColor: "#6fb2fa",
      textColor: "#333",
    },
    {
      title: "Scan & Enter",
      desc: "Show your card, get scanned, and walk in.",
      bgColor: "#dfaf20",
      textColor: "#333",
    },
  ];

  const pricingPlans = [
    {
      title: "Free",
      subtitle: "Basic Passport",
      price: "GH₵0.00 / Year",
      features: [
        "Store & scan tickets",
        "Access standard bundles",
        "Join the community",
      ],
      bgColor: "#fff",
      textColor: "#333",
      btnText: "Start Free",
      btnBg: "#3a3a3aff",
      btnColor: "#ffffff",
    },
    {
      title: "Paradise +",
      subtitle: "For the Fans",
      price: "GH₵100 / Year",
      features: [
        "Early ticket access",
        "Skip-the-line entry",
        "Priority seating offers",
        "Double Paradise Miles",
      ],
      bgColor: "#333",
      textColor: "#fff",
      btnText: "Get Started",
      btnBg: "#fdcb35",
      btnColor: "#3a3a3aff",
    },
    {
      title: "Paradise X",
      subtitle: "For the VIPs",
      price: "GH₵300 / Year",
      features: [
        "VIP-only events & lounges",
        "Meet-and-greet access",
        "Banking perks & cashback",
        "All-access bundles",
      ],
      bgColor: "#fff",
      textColor: "#333",
      btnText: "Go Premium",
      btnBg: "#3a3a3aff",
      btnColor: "#fdcb35",
    },
  ];

  const benefits = [
    {
      icon: <CreditCard size={42} className="text-blue-500" />,
      title: "One Card For All Events",
      desc: "Carry your card digitally forever.",
    },
    {
      icon: <Ticket size={42} className="text-blue-500" />,
      title: "Get Rewards",
      desc: "Earn Paradise Miles for future events.",
    },
    {
      icon: <Ticket size={42} className="text-blue-500" />,
      title: "Ticket Bundles & Discounts",
      desc: "Unlock saving when you buy more",
    },
    {
      icon: <Percent size={42} className="text-blue-500" />,
      title: "Curated Bundles",
      desc: "Concert packs, sports passes, weekend vibes.",
    },
    {
      icon: <FastForward size={42} className="text-blue-500" />,
      title: "Skip The Line",
      desc: "Fast-line scanning at participating venues.",
    },
  ];

  const faqItems = [
    "What happens if I lose my phone?",
    "Just log in from another device, your card stays safe.",
    "Yes! Easily transfer tickets through the app.",
    "Can I share tickets with friends?",
    "Is my card free?",
    "Yes, everyone starts with a Free Paradise Passport.",
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* 3 Steps Section */}
      <section
        className="py-32"
        style={{ backgroundColor: "#fdcb35" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 w-full gap-16">
          <div className="flex-1 space-y-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="px-12 py-8 rounded-xl shadow-md"
                style={{ backgroundColor: step.bgColor, color: step.textColor }}
              >
                <h3 className="font-bold text-3xl mb-2">{step.title}</h3>
                <p className="text-xl">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h1 className="font-bold leading-tight text-5xl md:text-6xl lg:text-7xl">
              You Are <br />
              3-Steps <br />
              Away.
            </h1>
            <p className="mt-6 text-2xl text-gray-800 w-full">
              Enjoy immersive and innovative digital ticketing experience.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section
        className="py-32 text-white"
        style={{ backgroundColor: "#278bf7" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-[300px] h-[400px] overflow-hidden rounded-xl">
                <Image
                  src={`/assets/images/event-${i}.jpg`}
                  alt={`Event ${i}`}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-bold text-4xl">Event Name</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-yellow-400" />
                  <span>
                    <strong>Venue: </strong> Accra
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-yellow-400" />
                  <span>
                    <strong>Date: </strong> 25th Sept 2025
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-yellow-400" />
                  <span>
                    <strong>Time: </strong> 7:00 PM
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Future of Ticketing */}
      <section
        className="py-32"
        style={{ backgroundColor: "#fdcb35", color: "#333" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 w-full gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-8xl font-bold">
              The Future <br /> Of Event <br /> Ticketing.
            </h2>
            <p className="mt-6 text-2xl">
              Paradise Pay is more than just a ticketing app — It’s your event
              passport. From concerts to sports to festivals, your Paradise Pay
              keeps it all your tickets in one place. No lost email, no
              printouts, no stress. Just scan and enter.
            </p>
            <Button
              variant="contained"
              sx={{
                mt: 6,
                px: 10,
                py: 3,
                fontSize: "1.25rem",
                fontWeight: 700,
                borderRadius: "40px",
                backgroundColor: "#278bf7",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#1f72d0" },
              }}
            >
              Get Your Card
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Image src="/phone.png" alt="Mobile App" width={350} height={600} />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className="py-32 text-white text-center"
        style={{ backgroundColor: "#278bf7" }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white text-black p-8 rounded-xl shadow flex items-center gap-6"
            >
              <span>{b.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-600">{b.title}</h3>
                <p className="text-gray-600 mt-2">{b.desc}</p>
              </div>
            </div>
          ))}
          <div className="text-black p-8 flex items-center justify-center">
            <Button
              variant="contained"
              sx={{
                px: 18,
                py: 4,
                fontSize: "1.2rem",
                fontWeight: 700,
                borderRadius: "80px",
                backgroundColor: "#fdcb35",
                color: "#333",
                "&:hover": { backgroundColor: "#e6b834" },
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-32 text-center"
        style={{ backgroundColor: "#fdcb35" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-8xl font-bold text-center mb-16">
            Choose Your Passport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className="flex flex-col p-8 rounded-xl text-center min-h-[600px] border-4"
                style={{
                  backgroundColor: plan.bgColor,
                  color: plan.textColor,
                  borderColor: "#3a3a3aff",
                }}
              >
                <h1
                  className={`font-bold text-5xl ${
                    plan.textColor === "#fff" ? "text-white" : "text-gray-700"
                  }`}
                >
                  {plan.title}
                </h1>
                <p className="my-4 text-3xl">{plan.subtitle}</p>
                <ul className="text-left space-y-3 mt-10 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center text-2xl">
                      <span
                        className={`w-3 h-3 rounded-full mr-3 ${
                          plan.textColor === "#fff"
                            ? "bg-yellow-400"
                            : "bg-gray-600"
                        }`}
                      ></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    py: 2,
                    borderRadius: "80px",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    backgroundColor: plan.btnBg,
                    color: plan.btnColor,
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  {plan.btnText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <DiscoverSection />

      {/* Organizer Section */}
      <section
        className="py-32 text-white"
        style={{ backgroundColor: "#278bf7" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-7xl font-bold">
              For Organizers, by Organizers.
            </h2>
            <p className="text-2xl">
              List, sell, and manage your events in one place. Paradise Pay
              helps you reach audiences, sell more tickets, and scan guests
              seamlessly at the gate.
            </p>
            <ul className="space-y-4">
              {[
                "Lower service rates",
                "Real-time sales dashboard",
                "Easy integration with your website",
                "No setup fees",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-xl text-gray-200"
                >
                  <Check size={28} className="text-yellow-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="contained"
              sx={{
                px: 8,
                py: 3,
                borderRadius: "80px",
                fontSize: "1.25rem",
                fontWeight: 700,
                backgroundColor: "#fdcb35",
                color: "#3a3a3aff",
                "&:hover": { backgroundColor: "#e6b834" },
              }}
            >
              Start Selling Today
            </Button>
          </div>
          <div className="flex-1">
            <Image
              src="/stage.jpg"
              alt="Event Stage"
              width={600}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-32"
        style={{ backgroundColor: "#fdcb35", color: "#333" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-bold mb-12 text-center">FAQs</h2>
            <div className="space-y-6">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-lg shadow ${
                    i % 2 === 0 ? "border-3" : ""
                  }`}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#fdcb35" : "#333",
                    color: i % 2 === 0 ? "#333" : "#fff",
                    borderColor: "#333",
                  }}
                >
                  <h3 className="font-bold text-lg">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 text-center">
        <p>© 2025 Paradise Pay. All rights reserved.</p>
      </footer>
    </div>
  );
}
