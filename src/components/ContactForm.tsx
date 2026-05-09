"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center py-20">
        <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
        <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
        <p className="text-gray-600 mb-8">Thank you for contacting us. Our team will get back to you shortly.</p>
        <button 
          onClick={() => setStatus("idle")}
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
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
          <input 
            type="email" 
            required 
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="+91 00000 00000"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="Inquiry about Brass Components"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">Your Message *</label>
        <textarea 
          required 
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
          placeholder="How can we help you?"
        ></textarea>
      </div>
      
      <button 
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all disabled:opacity-70"
      >
        {status === "loading" ? "Sending..." : (
          <>
            Send Message <Send size={20} />
          </>
        )}
      </button>
    </form>
  );
}
