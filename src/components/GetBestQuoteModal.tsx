"use client";

import React, { useState, useEffect } from "react";
import { X, Phone, CheckCircle, Loader2, ArrowRight, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Image from "next/image";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Specification {
  key: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  primary_image?: string;
  specifications?: Specification[];
  [key: string]: any;
}

interface GetBestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  companyName: string;
}

export default function GetBestQuoteModal({ 
  isOpen, 
  onClose, 
  product, 
  companyName 
}: GetBestQuoteModalProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const supabase = createClient();

  // Fetch company WhatsApp number dynamically from settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "business_info")
        .single();
      
      if (data?.value?.whatsappNumber) {
        // Sanitize: remove all non-numeric characters
        setWhatsappNumber(data.value.whatsappNumber.replace(/\D/g, ''));
      }
    };
    if (isOpen) fetchSettings();
  }, [isOpen, supabase]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: 10 digits, must start with 6,7,8,9
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!whatsappNumber) {
      toast.error("WhatsApp number is not configured. Please contact us directly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhone = `+91${mobileNumber}`;
      
      // We remove product_id because it doesn't exist in the existing 'inquiries' table
      const { error } = await supabase
        .from("inquiries")
        .insert({
          product_name: product.name,
          customer_name: "Quick Quote Request (India)",
          email: `quote_${mobileNumber}@hkmetalhouse.com`,
          phone: fullPhone,
          company_name: companyName,
          message: `Get Best Quote Inquiry\nProduct: ${product.name}\nMobile: ${fullPhone}\nSource: Get Best Quote Modal`,
          status: "New"
        });

      if (error) {
        console.error("Supabase Error details:", error);
        throw error;
      }

      setIsSuccess(true);
      toast.success("Thank you! Redirecting to WhatsApp...");
      
      const messageText = `Hello ${companyName},

I am interested in:
Product: ${product.name}

Contact Number: ${fullPhone}

Please send me the best quotation and product details.`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Try to redirect immediately
      window.open(whatsappUrl, "_blank");
      
      // Keep success state for a few seconds then close
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setMobileNumber("");
      }, 3000);

    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto md:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
        >
          <X size={20} />
        </button>

        {/* Left Panel - Product Details */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col">
          <div className="mb-6">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">{companyName}</p>
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">{product.name}</h2>
          </div>

          {product.show_price && product.price && (
            <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Estimated Price</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-primary">
                  {product.price_prefix} {new Intl.NumberFormat('en-IN').format(product.price)}
                </span>
                <span className="text-xs font-medium text-gray-500">/ {product.price_unit}</span>
              </div>
            </div>
          )}

          <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-6 bg-white border border-gray-100 shadow-sm">
            <Image 
              src={product.primary_image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600"} 
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="space-y-3 mt-auto">
            <h3 className="font-bold text-gray-700 border-b pb-2 text-sm uppercase flex items-center gap-2">
               <Package size={16} className="text-primary" /> Key Specifications
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {product.specifications?.slice(0, 5).map((spec, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-500">{spec.key}:</span>
                  <span className="text-gray-800 font-medium">{spec.value}</span>
                </div>
              )) || (
                <p className="text-sm text-gray-400 italic">Precision engineered industrial component</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                  Get Best Quote and details from <span className="text-primary">'{companyName}'</span> on your mobile quickly
                </h3>
                <p className="text-gray-500 text-sm">Enter your 10-digit mobile number to receive a quotation on WhatsApp.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
                  <div className="flex shadow-sm">
                    {/* Fixed India Prefix */}
                    <div className="flex items-center gap-2 px-4 h-[54px] bg-gray-50 border border-gray-200 rounded-l-xl text-gray-800 font-bold min-w-[100px] justify-center">
                      <span className="text-2xl leading-none">🇮🇳</span>
                      <span className="text-base font-semibold">+91</span>
                    </div>
                    {/* Numeric Input Only */}
                    <input 
                      type="tel" 
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 px-5 py-3 border border-l-0 border-gray-200 rounded-r-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium tracking-wider placeholder:text-gray-300 placeholder:font-normal"
                      placeholder="Enter 10 digit mobile number"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 italic flex items-center gap-1 mt-1">
                    <Phone size={10} /> We will contact you on this number via WhatsApp
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Submit Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  By clicking "Submit Now", you agree to be redirected to WhatsApp to complete your inquiry. Your data is secure.
                </p>
              </form>
            </>
          ) : (            <div className="text-center py-8 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h3>
              <p className="text-gray-600 text-sm mb-6">Thank you! Redirecting to WhatsApp for your quotation...</p>
              
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <button 
                  onClick={() => {
                    const messageText = `Hello ${companyName},
I am interested in: ${product.name}. Please send me a quotation.`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`, "_blank");
                  }}
                  className="text-primary font-bold text-sm underline hover:text-secondary"
                >
                  Click here if not redirected automatically
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
