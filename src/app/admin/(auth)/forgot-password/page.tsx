"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success("Reset link sent!");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      toast.error("Failed to connect to authentication server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Mail size={80} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
        <p className="text-blue-100/80 mt-1 text-sm font-medium uppercase tracking-widest">Reset your account security</p>
      </div>

      {sent ? (
        <div className="p-10 text-center space-y-6">
          <div className="bg-blue-50 text-blue-700 p-6 rounded-2xl border border-blue-100 text-sm font-medium leading-relaxed">
            A password reset link has been sent to your email. Please check your inbox and click the link to continue.
          </div>
          <Link 
            href="/admin/login" 
            className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"
          >
            <ArrowLeft size={18} /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-gray-800 bg-white shadow-sm"
                placeholder="admin@hkmetalhouse.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "Send Reset Link"}
          </button>

          <div className="text-center pt-2">
            <Link 
              href="/admin/login" 
              className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-blue-900 transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Return to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
