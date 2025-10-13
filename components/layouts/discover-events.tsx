import { Search } from "lucide-react";
import { useState } from "react";
import Button from "@mui/material/Button";

export default function DiscoverSection() {
  const [activeTab, setActiveTab] = useState("Category");
  const tabs = [
    "Category",
    "Music",
    "Sports",
    "Festivals",
    "Conferences",
    "Parties",
  ];

  const events = [
    {
      id: 1,
      name: "Summer Music Fest",
      date: "Oct 20, 2025",
      time: "6:00 PM",
      venue: "Accra Stadium",
      image: "/assets/images/event1.jpg",
    },
    {
      id: 2,
      name: "Tech Conference",
      date: "Nov 5, 2025",
      time: "9:00 AM",
      venue: "Kempinski Hotel",
      image: "/assets/images/event2.jpg",
    },
    {
      id: 3,
      name: "Food & Drink Festival",
      date: "Dec 12, 2025",
      time: "12:00 PM",
      venue: "Osu Oxford Street",
      image: "/assets/images/event3.jpg",
    },
    {
      id: 4,
      name: "New Year Party",
      date: "Dec 31, 2025",
      time: "10:00 PM",
      venue: "Labadi Beach",
      image: "/assets/images/event4.jpg",
    },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-white px-6 py-32"
      style={{
        backgroundImage: "url('/assets/images/index-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/100 to-black/50"></div>

      {/* Content */}
      <div className="mx-auto w-full gap-16 relative z-10 max-w-7xl w-full text-center space-y-10 flex-1">
        <h2 className="text-4xl md:text-8xl font-bold mb-6">
          Discover What&apos;s Next?
        </h2>

        {/* Search Input */}
        <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg max-w-5xl mx-auto">
          <Search className="text-gray-500 ml-4 w-6 h-6" />
          <input
            type="text"
            placeholder="Search concerts, sports, festivals, and more ..."
            className="flex-1 px-4 py-3 text-black outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-2 rounded-full text-sm md:text-base font-medium transition ${
                activeTab === tab
                  ? "bg-yellow-400 text-black"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative min-h-[400px]">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/90 to-transparent p-4 flex flex-col justify-end text-black">
                  <h3 className="text-xl font-bold">{event.name}</h3>
                  <p className="text-sm">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm">{event.venue}</p>
                </div>
              </div>

              <div className="p-4">
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 2,
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    borderRadius: "9999px",
                    backgroundColor: "#fdcb35",
                    color: "#3a3a3aff",
                    "&:hover": {
                      backgroundColor: "#fcca3d",
                    },
                  }}
                >
                  Add To Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
