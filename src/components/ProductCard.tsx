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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full active:scale-[0.98]"
    >
      <Link href={`/products/${slug}`} className="relative h-40 sm:h-64 overflow-hidden bg-white flex items-center justify-center p-2 sm:p-6">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105 p-2 sm:p-6"
        />
      </Link>
      
      <div className="p-3 sm:p-6 flex flex-col flex-grow border-t border-gray-100">
        <Link href={`/products/${slug}`}>
          <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-[#0B3D91] transition-colors leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-0">
            {title}
          </h3>
        </Link>

        {show_price && price && (
          <div className="mb-2 sm:mb-4 flex items-baseline gap-1 flex-wrap">
            <span className="text-xs sm:text-lg font-bold text-green-700">
              {price_prefix} {new Intl.NumberFormat('en-IN').format(price)}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">/ {price_unit}</span>
          </div>
        )}

        <div className="space-y-1 mb-3 sm:mb-6">
          <p className="text-[10px] sm:text-sm text-gray-600 line-clamp-2 leading-tight">
            {description}
          </p>
        </div>

        <div className="mt-auto">
          <Link 
            href={`/products/${slug}`}
            className="w-full bg-[#006837] text-white py-2 sm:py-3 rounded-md font-bold text-[10px] sm:text-sm text-center block hover:bg-[#004d29] transition-all"
          >
            Get Best Price
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
