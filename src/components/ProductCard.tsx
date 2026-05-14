"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  index: number;
  price?: number | null;
  price_unit?: string | null;
  price_prefix?: string | null;
  show_price?: boolean | null;
}

export default function ProductCard({ 
  title, 
  description, 
  image, 
  slug, 
  index,
  price,
  price_unit,
  price_prefix,
  show_price
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105 p-6"
        />
        <div className="absolute inset-0 bg-[#0B3D91]/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
      </div>
      
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-[#0B3D91] mb-3 group-hover:text-[#D4AF37] transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2 text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        <div className="mt-auto">
          {show_price && price && (
            <div className="mb-6 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold text-[#0B3D91]">
                  {price_prefix} {new Intl.NumberFormat('en-IN').format(price)}
                </span>
                <span className="text-[10px] font-medium text-gray-500 uppercase">/ {price_unit}</span>
              </div>
            </div>
          )}

          <Link 
            href={`/products/${slug}`}
            className="inline-flex items-center gap-2 font-bold text-[#0B3D91] group-hover:gap-3 transition-all text-sm sm:text-base"
          >
            View Details <ArrowRight size={18} className="text-[#D4AF37]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
