"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-12 sm:pb-16 md:pb-20 bg-[#0B3D91] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-15"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91] via-[#0B3D91]/80 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {subtitle && (
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block">
              {subtitle}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1.5 bg-[#D4AF37] rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
