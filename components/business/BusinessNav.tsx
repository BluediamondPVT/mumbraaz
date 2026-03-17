"use client";

import { useState, useEffect } from "react";

export default function BusinessNav() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "gallery", name: "Gallery" },
    { id: "reviews", name: "Reviews" },
    { id: "location", name: "Location" },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      // 100px ka offset rakha hai taaki sticky header ke peeche content na chhupe
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-20 z-40 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8 rounded-2xl overflow-hidden">
      <ul className="flex overflow-x-auto hide-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex-shrink-0">
            <button
              onClick={() => scrollToSection(tab.id)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}