"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:h-[70vh] lg:h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B3D91] pt-20">
      {/* Background with Professional Dark Gradient Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"
          aria-hidden="true"
        />
        {/* Multi-layer Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D91]/80 via-transparent to-[#0B3D91]/80" />
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
          >
            Trusted Industrial <span className="text-[#D4AF37] block sm:inline mt-2 sm:mt-0">Metal Supplier</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-sm md:text-xl text-blue-50/90 mb-6 max-w-[650px] mx-auto leading-relaxed font-medium"
          >
            Delivering high-quality metal components and industrial products with assured quality and timely delivery across the globe.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch justify-center"
          >
            <Link 
              href="/products" 
              className="group w-full sm:w-auto bg-[#0F4C9A] text-white border border-[#0F4C9A] hover:bg-white hover:text-[#0F4C9A] px-5 py-2 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-95"
            >
              Explore Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0B3D91] px-5 py-2 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-95"
            >
              Contact Us
              <Phone className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on very small screens */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hidden sm:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
