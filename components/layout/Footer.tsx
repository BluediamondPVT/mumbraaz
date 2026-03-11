import Link from "next/link";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  ChevronRight,
  Send
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1128] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* 1. Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 inline-block">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                Mumbra<span className="text-blue-500">BiZ</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 pr-4">
              Your one-stop destination to find the best local businesses, services, and professionals in town. Connect, review, and grow together.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <Link href="testing" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="testing" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="testing" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="testing" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {['About Us', 'Contact Support', 'Add Your Business', 'Pricing Plans', 'Blog & News'].map((link) => (
                <li key={link}>
                  <Link 
                    href="testing" 
                    className="group flex items-center text-sm font-medium hover:text-blue-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Popular Categories
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {['Real Estate Agents', 'Banquet Halls', 'Restaurants & Cafes', 'Hospitals & Clinics', 'Home Repairs'].map((link) => (
                <li key={link}>
                  <Link 
                    href="testing" 
                    className="group flex items-center text-sm font-medium hover:text-blue-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter & Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to our newsletter to get the latest updates and offers.
            </p>
            <form className="flex items-center mb-6">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition-colors"
              />
              <button 
  type="button"
  aria-label="Send message"
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg transition-colors flex items-center justify-center border border-blue-600"
>
  <Send className="w-5 h-5" />
</button>
            </form>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p>Mumbra, Thane, Maharashtra 400612</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <p>+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <p>support@mumbraziz.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {currentYear} MumbraBiZ. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <Link href="testing" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="testing" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link href="testing" className="hover:text-blue-400 transition-colors">FAQ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}