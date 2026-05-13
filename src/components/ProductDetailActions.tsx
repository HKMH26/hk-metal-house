"use client";

import { useState } from "react";
import GetBestQuoteModal from "@/components/GetBestQuoteModal";
import { ArrowRight, Tag } from "lucide-react";

interface ProductDetailActionsProps {
  product: any;
  companyName: string;
}

export default function ProductDetailActions({ product, companyName }: ProductDetailActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 text-center gap-2 group"
      >
        Get Best Quote <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <a 
        href="#quote-form" 
        className="inline-flex items-center justify-center w-full sm:w-auto bg-gray-100 text-gray-700 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all text-center gap-2"
      >
        <Tag size={20} /> Request Details
      </a>

      <GetBestQuoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        companyName={companyName}
      />
    </div>
  );
}
