"use client"; // 🔥 Error fix karne ke liye yeh zaroori hai

import Link from "next/link";
import Image from "next/image";

// 🔥 Sab jagah /banner3.jpg laga diya hai test karne ke liye
const popularServices = [
  {
    title: "Wedding Requisites",
    items: [
      { name: "Banquet Halls", img: "/services/banquethalls_rectangle_2024.webp", link: "/banquet-halls" },
      { name: "Bridal Requisite", img: "/services/bridalrequisite_rectangle_2024.webp", link: "/bridal-requisite" },
      { name: "Caterers", img: "/services/caterers_rectangle_2024.webp", link: "/caterers" },
    ],
  },
  {
    title: "Beauty & Spa",
    items: [
      { name: "Beauty Parlours", img: "/services/beautyparlours_rectangle_2024.webp", link: "/beauty-parlours" },
      { name: "Spa & Massages", img: "/services/spamassages_rectangle_2024.webp", link: "/spa-massages" },
      { name: "Salons", img: "/services/salons_rectangle_2024.webp", link: "/salons" },
    ],
  },
  {
    title: "Repairs & Services",
    items: [
      { name: "AC Service", img: "/services/hkim_acrepair.webp", link: "/ac-service" },
      { name: "Car Service", img: "/services/carservice_rectangle_2024.webp", link: "/car-service" },
      { name: "Bike Service", img: "/services/bikeservice_rectangle_2024.webp", link: "/bike-service" },
    ],
  },
  {
    title: "Daily Needs",
    items: [
      { name: "Movies", img: "/services/hkim_movies.webp", link: "/movies" },
      { name: "Grocery", img: "/services/grocery_rectangle_2024.webp", link: "/grocery" },
      { name: "Electricians", img: "/services/electricians_rectangle_2024.webp", link: "/electricians" },
    ],
  },
];

export default function PopularServices() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Other Business Services
        </h2>
      </div>
      {/* Grid for the 4 main boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {popularServices.map((section, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Box Title */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
              {section.title}
            </h3>

            {/* Inner Grid for 3 images */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {section.items.map((item, idx) => (
                <Link 
                  href={item.link} 
                  key={idx} 
                  className="group flex flex-col items-center cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-100 bg-gray-100 relative flex items-center justify-center">
                    
                    <span className="text-gray-400 text-xs absolute z-0 text-center px-2">
                      {item.name}
                    </span>

                    <Image 
                      src={item.img} 
                      alt={item.name} 
                      fill
                      sizes="(max-width: 768px) 33vw, 150px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110 relative z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Text Label */}
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}