import Link from "next/link";
import Image from "next/image";

// Static data tere screenshot ke hisaab se
const travelServices = [
  { 
    name: "Flight", 
    subtitle: "Powered By Easemytrip.com", 
    img: "/bt_flight.svg", 
    link: "/flight-booking" 
  },
  { 
    name: "Bus", 
    subtitle: "Affordable Rides", 
    img: "/bt_bus.svg", 
    link: "/bus-booking" 
  },
  { 
    name: "Train", 
    subtitle: "", 
    img: "/bt_train.svg", 
    link: "/train-booking" 
  },
  { 
    name: "Hotel", 
    subtitle: "Budget-friendly Stay", 
    img: "/bt_hotels.svg", 
    link: "/hotel-booking" 
  },
  { 
    name: "Car Rentals", 
    subtitle: "Drive Easy Anywhere", 
    img: "/bt_carhire.svg", 
    link: "/car-rentals" 
  },
];

export default function TravelBookings() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Main Container - Rounded box with border */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 shadow-sm">
        
        {/* Left Side: Text Content */}
        <div className="flex-shrink-0 w-full lg:w-1/4 text-center lg:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            GO Mumbra
          </h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Book Your Ride Lowest Cost
          </p>
          {/* <Link 
            href="/travel" 
            className="text-blue-600 font-semibold text-sm hover:text-blue-800 hover:underline transition-colors"
          >
            Explore More
          </Link> */}
        </div>

        {/* Right Side: Scrollable Images/Icons */}
        <div className="flex-1 w-full">
          {/* 🔥 FIX: <style jsx> hata diya aur Tailwind ki custom classes laga di scrollbar hide karne ke liye 🔥 */}
          <div className="flex items-start gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {travelServices.map((service, index) => (
              <Link 
                key={index}
                href={service.link}
                className="group flex flex-col items-center text-center cursor-pointer min-w-[6rem] sm:min-w-[7rem]"
              >
                {/* Image Box (Rounded Square) */}
                <div className="w-20 h-20 sm:w-30 sm:h-30 border border-gray-200 rounded-2xl flex items-center justify-center p-3 shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all bg-white mb-3 relative overflow-hidden">
                  <Image 
                    src={service.img} 
                    alt={service.name} 
                    fill
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                    sizes="80px"
                  />
                </div>
                
                {/* Main Title */}
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                
                {/* Subtitle (Green Text) */}
                {service.subtitle && (
                  <p className="text-[10px] sm:text-xs text-green-600 font-medium mt-1 leading-tight">
                    {service.subtitle}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}