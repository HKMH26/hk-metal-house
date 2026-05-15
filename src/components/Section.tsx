"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

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
  viewAllHref?: string;
}

export default function Section({ children, title, subtitle, className, bg = "white", id, viewAllHref }: SectionProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const bgColors = {
    white: "bg-white",
    gray: "bg-gray-50",
    dark: "bg-[#0B3D91] text-white",
  };

  const titleColors = {
    white: "text-[#0B3D91]",
    gray: "text-[#0B3D91]",
    dark: "text-white",
  };

  const subtitleColors = {
    white: isHomePage ? "text-[#D4AF37]" : "text-[#B45309]", // Gold on Home Page, Amber-700 on internal
    gray: isHomePage ? "text-[#D4AF37]" : "text-[#B45309]",
    dark: "text-[#FACC15]", // Vibrant yellow on dark background
  };

  return (
    <section id={id} className={cn("py-12 md:py-24 overflow-hidden", bgColors[bg], className)}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {(title || subtitle) && (
          <div className={cn(
            "mb-10 md:mb-20",
            viewAllHref ? "flex items-end justify-between border-b border-gray-100 pb-4 md:block md:text-center md:border-0 md:pb-0" : "text-center"
          )}>
            <div className="flex-1 text-left md:text-center">
              {subtitle && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "font-extrabold tracking-[0.2em] uppercase text-[10px] md:text-sm mb-2 md:mb-5 block",
                    subtitleColors[bg]
                  )}
                >
                  {subtitle}
                </motion.span>
              )}
              {title && (
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-[1.2] tracking-tight",
                    titleColors[bg]
                  )}
                >
                  {title}
                </motion.h2>
              )}
              {!viewAllHref && (
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 60 }}
                  viewport={{ once: true }}
                  className="h-1 bg-[#D4AF37] mx-auto mt-4 md:mt-6 hidden md:block"
                />
              )}
            </div>
            {viewAllHref && (
              <div className="md:hidden">
                <a 
                  href={viewAllHref} 
                  className="text-[#006837] font-bold text-xs underline whitespace-nowrap"
                >
                  View All
                </a>
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
