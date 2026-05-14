"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  bg?: "white" | "gray" | "dark";
  id?: string;
}

export default function Section({ children, title, subtitle, className, bg = "white", id }: SectionProps) {
  const bgColors = {
    white: "bg-white",
    gray: "bg-gray-50",
    dark: "bg-[#0B3D91] text-white",
  };

  return (
    <section id={id} className={cn("py-12 md:py-20 overflow-hidden", bgColors[bg], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-16">
            {subtitle && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#0B3D91] font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 md:mb-4 block"
              >
                {subtitle}
              </motion.span>
            )}
            {title && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
              >
                {title}
              </motion.h2>
            )}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              className="h-1 bg-[#D4AF37] mx-auto mt-4 md:mt-6"
            />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
