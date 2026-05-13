"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface ContactFormProps {
  productName?: string;
}

export default function ContactForm({ productName }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    message: ""
  });
  const [inquiryEmail, setInquiryEmail] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    const fetchInquiryEmail = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "business_info")
        .single();
      
      if (data?.value?.inquiryEmail) {
        setInquiryEmail(data.value.inquiryEmail);
      }
    };
    fetchInquiryEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    const { error } = await supabase
      .from("inquiries")
      .insert({
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company,
        quantity: formData.quantity,
        product_name: productName || "General Inquiry",
        message: formData.message,
        status: "New",
        // We could store the target email if needed, or use it for an edge function trigger
        metadata: { target_email: inquiryEmail }
      });

    if (error) {
      toast.error(error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === "success") {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center py-20 animate-in fade-in zoom-in">
        <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
        <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
        <p className="text-gray-600 mb-8">Thank you for contacting us. Our team will get back to you shortly.</p>
        <button 
          onClick={() => {
            setStatus("idle");
            setFormData({ name: "", email: "", phone: "", company: "", quantity: "", message: "" });
          }}
          className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-secondary transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
          <input 
            type="text" 
            name="name"
            required 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
          <input 
            type="email" 
            name="email"
            required 
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="+91 00000 00000"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
          <input 
            type="text" 
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="Your Company Ltd"
          />
        </div>
      </div>

      {productName && (
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Quantity Needed</label>
          <input 
            type="text" 
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="e.g. 500 units"
          />
        </div>
      )}
      
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">Your Message *</label>
        <textarea 
          name="message"
          required 
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
          placeholder={productName ? `I'm interested in ${productName}. Please provide more details.` : "How can we help you?"}
        ></textarea>
      </div>
      
      <button 
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all disabled:opacity-70 shadow-lg shadow-primary/20"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Sending...
          </>
        ) : (
          <>
            Send Quote Request <Send size={20} />
          </>
        )}
      </button>
    </form>
  );
}
