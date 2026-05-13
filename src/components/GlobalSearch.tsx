"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, ArrowRight, FileText, Settings, Info, Phone, Package, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchResult {
  id: string;
  type: "product" | "service" | "page";
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  slug: string;
  price?: number;
  price_prefix?: string;
  price_unit?: string;
  show_price?: boolean;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const STATIC_PAGES = [
  { title: "About Us", slug: "/about", description: "Learn more about HK Metal House history and mission.", type: "page" as const },
  { title: "Quality Assurance", slug: "/quality", description: "Our commitment to high-quality industrial standards.", type: "page" as const },
  { title: "Certifications", slug: "/certifications", description: "View our ISO and other industrial certifications.", type: "page" as const },
  { title: "Contact Us", slug: "/contact", description: "Get in touch with our team for inquiries.", type: "page" as const },
];

const POPULAR_SEARCHES = [
  "SS TC Butterfly Valve",
  "SS Electro Polish Dairy Fitting",
  "SS Weldable Union",
  "SS TC Ball Valve",
  "SS TC Set"
];

export default function GlobalSearch({ className, placeholder = "Search products, services, or pages...", isMobile, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

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
    const searchAll = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setShowDropdown(true);

      try {
        // 1. Search Products
        const { data: products } = await supabase
          .from("products")
          .select("id, name, slug, category, short_description, primary_image, price, price_prefix, price_unit, show_price")
          .eq("active", true)
          .or(`name.ilike.%${query}%,category.ilike.%${query}%,short_description.ilike.%${query}%`)
          .limit(6);

        // 2. Search Static Pages
        const matchedPages = STATIC_PAGES.filter(page => 
          page.title.toLowerCase().includes(query.toLowerCase()) || 
          page.description.toLowerCase().includes(query.toLowerCase())
        );

        // Transform results
        const transformedProducts: SearchResult[] = (products || []).map(p => ({
          id: p.id,
          type: "product",
          title: p.name,
          subtitle: p.category,
          description: p.short_description,
          image: p.primary_image,
          slug: `/products/${p.slug}`,
          price: p.price,
          price_prefix: p.price_prefix,
          price_unit: p.price_unit,
          show_price: p.show_price
        }));

        const transformedPages: SearchResult[] = matchedPages.map(p => ({
          id: p.slug,
          type: "page",
          title: p.title,
          description: p.description,
          slug: p.slug
        }));

        setResults([...transformedProducts, ...transformedPages].slice(0, 10));
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAll, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, supabase]);

  const handleSelect = (slug: string, queryText: string) => {
    // Save to recent searches
    const updatedRecent = [queryText, ...recentSearches.filter(s => s !== queryText)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem("recent_searches", JSON.stringify(updatedRecent));

    router.push(slug);
    setShowDropdown(false);
    if (onClose) onClose();
  };

  const handleSearchSubmit = (q: string) => {
    if (!q.trim()) return;
    handleSelect(`/search?q=${encodeURIComponent(q)}`, q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSelect(results[activeIndex].slug, results[activeIndex].title);
      } else {
        handleSearchSubmit(query);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-primary/10 text-primary font-bold px-0.5 rounded">{part}</mark>
          ) : part
        )}
      </span>
    );
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
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm",
            isMobile && "py-4 text-lg rounded-xl"
          )}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="text-primary animate-spin" size={18} />}
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-primary transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300",
          isMobile && "fixed inset-x-4 top-24"
        )}>
          {/* Empty State / Popular Searches */}
          {query.length < 2 && (
            <div className="py-4">
              {recentSearches.length > 0 && (
                <div className="px-4 mb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Recent Searches</p>
                  <div className="space-y-1">
                    {recentSearches.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <HistoryIcon className="text-gray-300 group-hover:text-primary" size={16} />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2 px-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearchSubmit(tag)}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-primary/5 hover:text-primary border border-gray-100 transition-all flex items-center gap-2"
                    >
                      <Star size={12} className="fill-gray-300" /> {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.length >= 2 && (
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                <div className="py-2">
                  <p className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/50">
                    Search Results for "{query}"
                  </p>
                  <div className="divide-y divide-gray-50">
                    {results.map((res, index) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelect(res.slug, res.title)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "flex items-center gap-4 px-6 py-4 w-full text-left transition-all group",
                          activeIndex === index ? "bg-primary/5" : "hover:bg-gray-50"
                        )}
                      >
                        <div className="relative w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-white shrink-0 flex items-center justify-center shadow-sm">
                          {res.type === "product" ? (
                            <Image
                              src={res.image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=100"}
                              alt={res.title}
                              fill
                              className="object-contain p-2"
                            />
                          ) : res.type === "page" ? (
                            <FileText className="text-primary" size={24} />
                          ) : (
                            <Settings className="text-primary" size={24} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
                              {highlightText(res.title, query)}
                            </h4>
                            <span className={cn(
                              "text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-md",
                              res.type === "product" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                            )}>
                              {res.type}
                            </span>
                          </div>
                          {res.subtitle && (
                            <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-widest mt-0.5">
                              {res.subtitle}
                            </p>
                          )}
                          {res.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {res.description}
                            </p>
                          )}
                        </div>
                        {res.show_price && res.price && (
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-primary">
                              {res.price_prefix}{new Intl.NumberFormat('en-IN').format(res.price)}
                            </p>
                          </div>
                        )}
                        <ArrowRight className={cn(
                          "text-gray-300 transition-all transform",
                          activeIndex === index ? "translate-x-1 text-primary" : "group-hover:translate-x-1"
                        )} size={18} />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSearchSubmit(query)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold text-sm hover:bg-secondary transition-all"
                  >
                    View All Results for "{query}" <ArrowRight size={18} />
                  </button>
                </div>
              ) : !isLoading ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-300" size={40} />
                  </div>
                  <p className="text-gray-800 font-bold text-lg">No results found for "{query}"</p>
                  <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                    Try checking your spelling or use more general keywords to find what you're looking for.
                  </p>
                  <button 
                    onClick={() => setQuery("")}
                    className="mt-6 text-primary font-bold hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  );
}
