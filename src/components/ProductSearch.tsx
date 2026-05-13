"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  primary_image: string;
  price?: number;
  price_prefix?: string;
  price_unit?: string;
  show_price?: boolean;
}

interface ProductSearchProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function ProductSearch({ className, placeholder = "Search products...", isMobile, onClose }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      setShowDropdown(true);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, category, primary_image, price, price_prefix, price_unit, show_price")
        .eq("active", true)
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,short_description.ilike.%${query}%,full_description.ilike.%${query}%,slug.ilike.%${query}%`)
        .limit(8);

      if (!error && data) {
        setResults(data as Product[]);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, supabase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        router.push(`/products/${results[activeIndex].slug}`);
        setShowDropdown(false);
        if (onClose) onClose();
      } else if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
        setShowDropdown(false);
        if (onClose) onClose();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full outline-none focus:bg-white focus:border-primary/20 transition-all",
            isMobile && "py-3 text-lg"
          )}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" size={18} />
        )}
        {!isLoading && query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200",
          isMobile && "fixed inset-x-4 top-24"
        )}>
          {results.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                Matching Products
              </p>
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => { setShowDropdown(false); if (onClose) onClose(); }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-colors group",
                    activeIndex === index && "bg-primary/5"
                  )}
                >
                  <div className="relative w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-white shrink-0">
                    <Image
                      src={product.primary_image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=100"}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium truncate uppercase tracking-wider">
                      {product.category}
                    </p>
                  </div>
                  {product.show_price && product.price && (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {product.price_prefix}{new Intl.NumberFormat('en-IN').format(product.price)}
                      </p>
                    </div>
                  )}
                  <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" size={16} />
                </Link>
              ))}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => { router.push(`/products?search=${encodeURIComponent(query)}`); setShowDropdown(false); if (onClose) onClose(); }}
                  className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1.5 transition-colors"
                >
                  View all results for "{query}" <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : !isLoading && query.length >= 2 ? (
            <div className="p-8 text-center">
              <Search className="mx-auto text-gray-200 mb-4" size={40} />
              <p className="text-gray-500 font-medium">No products found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords or browse categories</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
