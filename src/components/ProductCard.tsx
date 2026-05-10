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
}

export default function ProductCard({ title, description, image, slug, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <div className="relative h-64 overflow-hidden bg-white p-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-110 p-4"
        />
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500 pointer-events-none" />
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2">
          {description}
        </p>
        <Link 
          href={`/products/${slug}`}
          className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all"
        >
          View Details <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
}
