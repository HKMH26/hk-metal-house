"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B3D91] pt-20">
      {/* Background with Dark Blue Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"
          aria-hidden="true"
        />
        {/* Dark Blue Overlay (75% opacity) */}
        <div className="absolute inset-0 bg-[#0B3D91]/75 mix-blend-multiply" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            Trusted Industrial <span className="text-[#D4AF37]">Metal Supplier</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-xl text-gray-200 mb-8 sm:mb-10 max-w-[600px] mx-auto leading-relaxed"
          >
            Delivering high-quality metal components and industrial products with assured quality and timely delivery across the globe.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              href="/products" 
              className="group w-full sm:w-auto bg-[#0B3D91] text-white border border-[#0B3D91] hover:bg-white hover:text-[#0B3D91] px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
            >
              Explore Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0B3D91] px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
            >
              Contact Us
              <Phone className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile for cleaner look */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
