"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Header() {
  const [activeLink, setActiveLink] = useState("Home");
  const links = ["Home", "Discover Event", "Bundles", "Pricing", "Contact"];

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-26">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold" style={{ color: "#278bf7ff" }}>
              ParadisePay
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setActiveLink(link)}
                style={{
                  color: activeLink === link ? "#278bf7ff" : "#5e5e5eff",
                  fontWeight: activeLink === link ? 600 : 400,
                  fontSize: "1.125rem",
                }}
                className="hover:text-[#00BFFF]"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Right Side: Search + Buttons */}
          <div className="flex items-center space-x-4">
            <Search size={24} strokeWidth={2} />

            <Link href="/auth/login" passHref>
              <Button
                variant="contained"
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  borderRadius: "9999px",
                  backgroundColor: "#fdcb35",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#fcca3d",
                  },
                }}
              >
                Sign Up/Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
